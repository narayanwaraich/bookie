import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { inferOutput } from "@trpc/tanstack-react-query";

type UserProfileData = inferOutput<typeof trpc.user.getProfile>;

const profileFormSchema = z.object({
  name: z.string().optional(),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be 30 characters or less")
    .optional(),
  profileImage: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
});
type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface UserProfileFormProps {
  userProfile: UserProfileData;
}

export default function UserProfileForm({ userProfile }: UserProfileFormProps) {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const updateProfileMutation = useMutation(
    trpc.user.updateProfile.mutationOptions({
      onSuccess: async () => {
        toast.success("Profile Updated", {
          description: "Your profile has been successfully updated.",
        });
        await queryClient.invalidateQueries({
          queryKey: trpc.user.getProfile.queryKey(),
        });
        setIsEditing(false);
      },
      onError: (err: any) => {
        let description = "An unexpected error occurred. Please try again.";
        if (err.data?.httpStatus === 429 || err.code === "TOO_MANY_REQUESTS") {
          description = "Too many attempts. Please try again in a few minutes.";
        } else if (err.message) {
          description = err.message;
        }
        toast.error("Update Failed", { description });
      },
    }),
  );

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: userProfile?.name || "",
      username: userProfile?.username || "",
      profileImage: userProfile?.profileImage || "",
    },
  });

  useEffect(() => {
    if (userProfile) {
      form.reset({
        name: userProfile.name || "",
        username: userProfile.username || "",
        profileImage: userProfile.profileImage || "",
      });
    }
  }, [userProfile, form]);

  const onProfileSubmit = (values: ProfileFormValues) => {
    const changedPayload: Partial<ProfileFormValues> = {};
    if (values.name !== (userProfile?.name || ""))
      changedPayload.name = values.name;
    if (values.username && values.username !== (userProfile?.username || ""))
      changedPayload.username = values.username;
    if (values.profileImage !== (userProfile?.profileImage || ""))
      changedPayload.profileImage = values.profileImage;

    if (Object.keys(changedPayload).length > 0) {
      updateProfileMutation.mutate(changedPayload);
    } else {
      toast.info("No Changes", {
        description: "No changes were made to your profile.",
      });
      setIsEditing(false);
    }
  };

  const getInitials = (name?: string | null, username?: string | null) => {
    if (name) return name.substring(0, 2).toUpperCase();
    if (username) return username.substring(0, 2).toUpperCase();
    return "U";
  };

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onProfileSubmit)}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Profile Information</CardTitle>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
              )}
            </div>
            <CardDescription>Update your personal details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={
                    form.watch("profileImage") ||
                    userProfile.profileImage ||
                    undefined
                  }
                  alt={
                    form.watch("name") ||
                    userProfile.name ||
                    userProfile.username
                  }
                />
                <AvatarFallback>
                  {getInitials(form.watch("name"), userProfile.username)}
                </AvatarFallback>
              </Avatar>
              <div className="w-full space-y-2">
                {isEditing ? (
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Display Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your display name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <div>
                    <FormLabel>Display Name</FormLabel>
                    <p className="text-lg font-semibold">
                      {userProfile.name || userProfile.username}
                    </p>
                  </div>
                )}
                {isEditing ? (
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="yourusername" {...field} />
                        </FormControl>
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
                control={form.control}
                name="profileImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Image URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com/image.png"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
          {isEditing && (
            <CardFooter className="flex justify-end space-x-2">
              <Button
                variant="ghost"
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  form.reset({
                    name: userProfile.name || "",
                    username: userProfile.username || "",
                    profileImage: userProfile.profileImage || "",
                  });
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateProfileMutation.isPending}>
                {updateProfileMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </CardFooter>
          )}
        </form>
      </Form>
    </Card>
  );
}
