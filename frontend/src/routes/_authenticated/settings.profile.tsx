import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { trpc } from '@/lib/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, ShieldAlert } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useAuth } from '@/lib/auth'; // For logout on delete

// Schema for the update profile form
const profileFormSchema = z.object({
  name: z.string().optional(),
  username: z.string().min(3, 'Username must be at least 3 characters').max(30, 'Username must be 30 characters or less').optional(),
  profileImage: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});
type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Schema for the change password form
const changePasswordFormSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required" }),
  newPassword: z.string().min(8, { message: "New password must be at least 8 characters" }),
  confirmNewPassword: z.string(),
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: "New passwords don't match",
  path: ["confirmNewPassword"],
});
type ChangePasswordFormValues = z.infer<typeof changePasswordFormSchema>;

// Schema for the delete account confirmation form
const deleteAccountFormSchema = z.object({
  password: z.string().min(1, { message: "Password is required to confirm deletion" }),
});
type DeleteAccountFormValues = z.infer<typeof deleteAccountFormSchema>;


export const Route = createFileRoute('/_authenticated/settings/profile')({
  component: UserProfilePage,
});

function UserProfilePage() {
  const navigate = useNavigate();
  const auth = useAuth(); // For logout
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [showDeleteConfirmPassword, setShowDeleteConfirmPassword] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);


  const { data: userProfile, isLoading, error, isError, refetch } = useQuery(
    trpc.user.getProfile.queryOptions()
  );

  const updateProfileMutation = useMutation(trpc.user.updateProfile.mutationOptions({
    onSuccess: async () => {
      toast.success('Profile Updated', { description: 'Your profile has been successfully updated.' });
      await queryClient.invalidateQueries({ queryKey: trpc.user.getProfile.queryKey() });
      setIsEditing(false);
    },
    onError: (err: any) => {
      let description = 'An unexpected error occurred. Please try again.';
      if (err.data?.httpStatus === 429 || err.code === 'TOO_MANY_REQUESTS') {
        description = 'Too many attempts. Please try again in a few minutes.';
      } else if (err.message) {
        description = err.message;
      }
      toast.error('Update Failed', { description });
    },
  }));

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { name: '', username: '', profileImage: '' },
  });

  const changePasswordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmNewPassword: '' },
  });

  useEffect(() => {
    if (userProfile) {
      profileForm.reset({
        name: userProfile.name || '',
        username: userProfile.username || '',
        profileImage: userProfile.profileImage || '',
      });
    }
  }, [userProfile, profileForm]);

  const onProfileSubmit = (values: ProfileFormValues) => {
    const changedPayload: Partial<ProfileFormValues> = {};
    if (values.name !== (userProfile?.name || '')) changedPayload.name = values.name;
    // Username cannot be empty string if provided due to schema, so only send if it's a valid non-empty string and different
    if (values.username && values.username !== (userProfile?.username || '')) changedPayload.username = values.username;
    else if (!values.username && userProfile?.username) { // If user cleared username, and it was previously set
        // This case is tricky. updateUserSchema has username as optional string min 3.
        // Sending empty string might be rejected by backend if it means "delete username" which might not be allowed.
        // For now, if user clears it, we don't send it, relying on form validation to prevent empty string if it's required.
        // If it's truly optional and can be unset, backend should handle `username: null` or `undefined`.
        // Let's assume for now `updateUserSchema` handles `username: undefined` as "no change".
        // If user wants to clear username, they should delete it, making it undefined in the form if not required.
        // The current Zod schema for form makes username optional, but if provided, min 3.
    }

    if (values.profileImage !== (userProfile?.profileImage || '')) changedPayload.profileImage = values.profileImage;

    if (Object.keys(changedPayload).length > 0) {
      updateProfileMutation.mutate(changedPayload);
    } else {
      toast.info("No Changes", { description: "No changes were made to your profile." });
      setIsEditing(false);
    }
  };

  const changePasswordMutation = useMutation(trpc.user.changePassword.mutationOptions({
    onSuccess: () => {
      toast.success('Password Changed', { description: 'Your password has been successfully updated.' });
      changePasswordForm.reset();
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmNewPassword(false);
    },
    onError: (err: any) => {
      let description = 'An unexpected error occurred. Please try again.';
      if (err.data?.httpStatus === 429 || err.code === 'TOO_MANY_REQUESTS') {
        description = 'Too many attempts. Please try again in a few minutes.';
      } else if (err.message) {
        description = err.message;
      }
      toast.error('Change Password Failed', { description });
    },
  }));

  const onChangePasswordSubmit = (values: ChangePasswordFormValues) => {
    changePasswordMutation.mutate({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });
  };

  const deleteAccountForm = useForm<DeleteAccountFormValues>({
    resolver: zodResolver(deleteAccountFormSchema),
    defaultValues: { password: '' },
  });

  const deleteAccountMutation = useMutation(trpc.user.deleteAccount.mutationOptions({
    onSuccess: async () => {
      toast.success('Account Deleted', { description: 'Your account has been permanently deleted.' });
      setIsDeleteDialogOpen(false);
      await auth.logout(); // Perform client-side logout
      navigate({ to: '/', replace: true }); // Redirect to homepage or login
    },
    onError: (err: any) => {
      let description = 'An unexpected error occurred. Please try again.';
      if (err.data?.httpStatus === 429 || err.code === 'TOO_MANY_REQUESTS') {
        description = 'Too many attempts. Please try again in a few minutes.';
      } else if (err.message) {
        description = err.message;
      }
      toast.error('Account Deletion Failed', { description });
      // Potentially reset form or keep dialog open depending on UX preference
      deleteAccountForm.setError("password", { type: "manual", message: description });
    },
  }));

  const onDeleteAccountSubmit = (values: DeleteAccountFormValues) => {
    deleteAccountMutation.mutate({ password: values.password });
  };


  if (isLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <h1 className="text-2xl font-semibold">My Profile</h1>
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Skeleton className="h-20 w-20 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <h1 className="text-2xl font-semibold">My Profile</h1>
        <Alert variant="destructive">
          <AlertTitle>Error Fetching Profile</AlertTitle>
          <AlertDescription>
            {error?.message || 'Could not load your profile information. Please try again later.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!userProfile) { // This check remains for initial load before form is populated
    return (
      <div className="space-y-6 p-4 md:p-6">
        <h1 className="text-2xl font-semibold">My Profile</h1>
        <Alert>
          <AlertTitle>No Profile Data</AlertTitle>
          <AlertDescription>No profile information found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const displayValue = (value: string | null | undefined, placeholder = 'N/A') => value || placeholder;

  return (
    <div className="space-y-8 p-4 md:p-6">
      {/* Profile Update Section */}
      <Card>
        <Form {...profileForm}>
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
            <CardHeader>
              <div className="flex items-center justify-between">
                 <CardTitle className="text-xl">Profile Information</CardTitle>
                {!isEditing && (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                )}
              </div>
               <CardDescription>Update your personal details.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-center space-x-4">
                 <Avatar className="h-24 w-24">
                   <AvatarImage src={profileForm.watch('profileImage') || userProfile.profileImage || undefined} alt={profileForm.watch('name') || userProfile.name || userProfile.username} />
                   <AvatarFallback>
                    {(profileForm.watch('name') || userProfile.name || userProfile.username || 'U').substring(0, 2).toUpperCase()}
                   </AvatarFallback>
                 </Avatar>
                 <div className="w-full space-y-2">
                    {isEditing ? (
                      <FormField
                        control={profileForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Display Name</FormLabel>
                            <FormControl><Input placeholder="Your display name" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                      <div>
                        <FormLabel>Display Name</FormLabel>
                        <p className="text-lg font-semibold">{displayValue(userProfile.name, userProfile.username)}</p>
                      </div>
                    )}
                    {isEditing ? (
                      <FormField
                        control={profileForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl><Input placeholder="yourusername" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ) : (
                       <div>
                        <FormLabel>Username</FormLabel>
                        <p>@{userProfile.username}</p>
                      </div>
                    )}
                 </div>
               </div>
                {isEditing && (
                  <FormField
                    control={profileForm.control}
                    name="profileImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profile Image URL</FormLabel>
                        <FormControl><Input placeholder="https://example.com/image.png" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              <div>
                <FormLabel>Email</FormLabel>
                <p>{userProfile.email} <span className="text-xs text-muted-foreground">(cannot be changed)</span></p>
              </div>
              {userProfile.createdAt && (
                <div>
                  <FormLabel>Joined</FormLabel>
                  <p>{format(new Date(userProfile.createdAt), 'MMMM d, yyyy')}</p>
                </div>
              )}
            </CardContent>
            {isEditing && (
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="ghost" onClick={() => {
                  setIsEditing(false);
                  profileForm.reset({
                    name: userProfile.name || '',
                    username: userProfile.username || '',
                    profileImage: userProfile.profileImage || '',
                  });
                }}>Cancel</Button>
                <Button type="submit" disabled={updateProfileMutation.isPending}>
                  {updateProfileMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Save Changes
                </Button>
              </CardFooter>
            )}
          </form>
        </Form>
      </Card>

      {/* Change Password Section */}
      <Card>
        <Form {...changePasswordForm}>
          <form onSubmit={changePasswordForm.handleSubmit(onChangePasswordSubmit)}>
            <CardHeader>
              <CardTitle className="text-xl">Change Password</CardTitle>
              <CardDescription>Update your account password.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={changePasswordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <div className="relative">
                    <FormControl><Input type={showCurrentPassword ? "text" : "password"} placeholder="Enter current password" {...field} /></FormControl>
                    <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground">
                        {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={changePasswordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                     <div className="relative">
                    <FormControl><Input type={showNewPassword ? "text" : "password"} placeholder="Enter new password" {...field} /></FormControl>
                     <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground">
                        {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={changePasswordForm.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <div className="relative">
                    <FormControl><Input type={showConfirmNewPassword ? "text" : "password"} placeholder="Confirm new password" {...field} /></FormControl>
                    <button type="button" onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground">
                        {showConfirmNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={changePasswordMutation.isPending}>
                 {changePasswordMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Change Password
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {/* Delete Account Section */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-xl text-destructive">Delete Account</CardTitle>
          <CardDescription>
            Permanently delete your account and all associated data. This action cannot be undone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full sm:w-auto">
                <ShieldAlert className="mr-2 h-4 w-4" /> Delete My Account
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                  To confirm, please type your current password.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <Form {...deleteAccountForm}>
                <form onSubmit={deleteAccountForm.handleSubmit(onDeleteAccountSubmit)} id="deleteAccountConfirmForm">
                  <FormField
                    control={deleteAccountForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <div className="relative">
                        <FormControl>
                          <Input 
                            type={showDeleteConfirmPassword ? "text" : "password"} 
                            placeholder="Enter your password to confirm" 
                            {...field} 
                          />
                        </FormControl>
                        <button type="button" onClick={() => setShowDeleteConfirmPassword(!showDeleteConfirmPassword)} className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground">
                            {showDeleteConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => deleteAccountForm.reset()}>Cancel</AlertDialogCancel>
                <Button
                  variant="destructive"
                  type="submit"
                  form="deleteAccountConfirmForm" // Link to the form
                  disabled={deleteAccountMutation.isPending}
                >
                  {deleteAccountMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Yes, Delete My Account
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
