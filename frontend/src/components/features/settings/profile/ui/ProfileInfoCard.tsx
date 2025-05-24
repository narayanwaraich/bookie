import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  profileFormSchema,
  type ProfileFormValues,
  type UserProfile,
} from "../schemas";
import { useProfileMutations } from "../hooks";

interface ProfileInfoCardProps {
  userProfile: UserProfile;
}

export function ProfileInfoCard({ userProfile }: ProfileInfoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { updateProfile, isUpdatingProfile } = useProfileMutations();

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: userProfile.name || "",
      username: userProfile.username || "",
      profileImage: userProfile.profileImage || "",
    },
  });

  useEffect(() => {
    if (userProfile) {
      profileForm.reset({
        name: userProfile.name || "",
        username: userProfile.username || "",
        profileImage: userProfile.profileImage || "",
      });
    }
  }, [userProfile, profileForm]);

  const onProfileSubmit = (values: ProfileFormValues) => {
    const changedPayload: Partial<ProfileFormValues> = {};
    if (values.name !== (userProfile?.name || ""))
      changedPayload.name = values.name;
    if (values.username && values.username !== (userProfile?.username || ""))
      changedPayload.username = values.username;
    if (values.profileImage !== (userProfile?.profileImage || ""))
      changedPayload.profileImage = values.profileImage;

    if (Object.keys(changedPayload).length > 0) {
      updateProfile(changedPayload);
      setIsEditing(false);
    } else {
      toast.info("No Changes", {
        description: "No changes were made to your profile.",
      });
      setIsEditing(false);
    }
  };

  const displayValue = (
    value: string | null | undefined,
    placeholder = "N/A",
  ) => value || placeholder;

  return (
    <Card>
      <Form {...profileForm}>
        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
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
                    profileForm.watch("profileImage") ||
                    userProfile.profileImage ||
                    undefined
                  }
                  alt={
                    profileForm.watch("name") ||
                    userProfile.name ||
                    userProfile.username
                  }
                />
                <AvatarFallback>
                  {(
                    profileForm.watch("name") ||
                    userProfile.name ||
                    userProfile.username ||
                    "U"
                  )
                    .substring(0, 2)
                    .toUpperCase()}
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
                      {displayValue(userProfile.name, userProfile.username)}
                    </p>
                  </div>
                )}
                {isEditing ? (
                  <FormField
                    control={profileForm.control}
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
                control={profileForm.control}
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
            <div>
              <FormLabel>Email</FormLabel>
              <p>
                {userProfile.email}{" "}
                <span className="text-xs text-muted-foreground">
                  (cannot be changed)
                </span>
              </p>
            </div>
            {userProfile.createdAt && (
              <div>
                <FormLabel>Joined</FormLabel>
                <p>{format(new Date(userProfile.createdAt), "MMMM d, yyyy")}</p>
              </div>
            )}
          </CardContent>
          {isEditing && (
            <CardFooter className="flex justify-end space-x-2">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsEditing(false);
                  profileForm.reset({
                    name: userProfile.name || "",
                    username: userProfile.username || "",
                    profileImage: userProfile.profileImage || "",
                  });
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdatingProfile}>
                {isUpdatingProfile ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Save Changes
              </Button>
            </CardFooter>
          )}
        </form>
      </Form>
    </Card>
  );
}
