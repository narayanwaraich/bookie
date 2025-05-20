import { z } from "zod";
import { createFileRoute } from "@tanstack/react-router";
import { VerifyEmailComponent } from "@/components/features/auth/VerifyEmailStatus";

// Define the expected search parameters for this route
const verifyEmailSearchSchema = z.object({
  token: z.string().optional(),
});

export const Route = createFileRoute("/(public)/verify-email")({
  validateSearch: (search) => verifyEmailSearchSchema.parse(search), // Validate search params
  component: VerifyEmailComponent,
});
