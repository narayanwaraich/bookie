import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { ProfileInfoCard } from "./ui/ProfileInfoCard";
import { ChangePasswordCard } from "./ui/ChangePasswordCard";
import { DeleteAccountCard } from "./ui/DeleteAccountCard";
import { ProfileSkeleton } from "./ui/ProfileSkeleton";
import { useProfileData } from "./hooks";

export function UserProfilePage() {
  const { userProfile, isLoading, error, isError } = useProfileData();

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <h1 className="text-2xl font-semibold">My Profile</h1>
        <Alert variant="destructive">
          <AlertTitle>Error Fetching Profile</AlertTitle>
          <AlertDescription>
            {error?.message ||
              "Could not load your profile information. Please try again later."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!userProfile) {
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

  return (
    <div className="space-y-8 p-4 md:p-6">
      <h1 className="text-2xl font-semibold">My Profile</h1>

      {/* Profile Information Section */}
      <ProfileInfoCard userProfile={userProfile} />

      {/* Change Password Section */}
      <ChangePasswordCard />

      {/* Delete Account Section */}
      <DeleteAccountCard />
    </div>
  );
}
