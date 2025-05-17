import { createFileRoute, redirect } from "@tanstack/react-router";
import * as z from "zod";
import LoginComponent from "@/components/features/auth/Login";

// Define expected search params for the login route
const loginSearchSchema = z.object({
  redirect: z.string().optional().catch(""), // Where to redirect after login
  sessionExpired: z.string().optional().catch(""), // To show session expired message
});

export const fallback = "/dashboard" as const;

export const Route = createFileRoute("/(public)/login")({
  validateSearch: (search) => loginSearchSchema.parse(search),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: search.redirect || fallback });
    }
  },
  component: LoginComponent,
});
