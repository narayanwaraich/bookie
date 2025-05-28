// src/routes/_authenticated/settings.profile.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from "date-fns"; // Keep format import
import UserProfileForm from "@/components/features/settings/profile/UserProfileForm";
import ChangePasswordForm from "@/components/features/settings/profile/ChangePasswordForm";
import DeleteAccountForm from "@/components/features/settings/profile/DeleteAccountForm";
import { PageHeader } from "@/components/layout/PageHeader"; // Import PageHeader
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/settings/profile")({
  component: UserProfilePage,
});

function UserProfilePage() {
  const {
    data: userProfile,
    isLoading,
    error: queryError, // Renamed to avoid conflict with Error component
    isError,
  } = useQuery(trpc.user.getProfile.queryOptions());

  if (isLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="My Profile" />
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
        <Skeleton className="h-48 w-full" />{" "}
        {/* Placeholder for password form */}
        <Skeleton className="h-24 w-full" /> {/* Placeholder for delete form */}
      </div>
    );
  }

  if (isError || !userProfile) {
    return (
      <div className="space-y-6">
        <PageHeader title="My Profile" />
        <Alert variant="destructive">
          <AlertTitle>Error Fetching Profile</AlertTitle>
          <AlertDescription>
            {queryError?.message ||
              "Could not load your profile information. Please try again later."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const displayValue = (
    value: string | null | undefined,
    placeholder = "N/A",
  ) => value || placeholder;

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Profile"
        description="View and manage your profile details."
      />

      <div className="grid gap-2">
        {" "}
        {/* Added for label/value pairs */}
        <h3 className="text-lg font-medium">Account Information</h3>
        <div className="text-sm">
          <span className="text-muted-foreground">Email: </span>
          {userProfile.email}{" "}
          <span className="text-xs text-muted-foreground">
            (cannot be changed)
          </span>
        </div>
        {userProfile.createdAt && (
          <div className="text-sm">
            <span className="text-muted-foreground">Joined: </span>
            {format(new Date(userProfile.createdAt), "MMMM d, yyyy")}
          </div>
        )}
      </div>

      <UserProfileForm userProfile={userProfile} />
      <ChangePasswordForm />
      <DeleteAccountForm />
    </div>
  );
}
