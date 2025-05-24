import { Route } from "@/routes/(public)/reset-password.$token";

export const ResetPasswordComponent = () => {
  const { token } = Route.useParams();
  // Placeholder for the Reset Password form
  return (
    <div>
      <h1>Reset Password</h1>
      <p>Token: {token}</p>
      {/* Add Reset Password Form Component Here, using the token */}
    </div>
  );
};
