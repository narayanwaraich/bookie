import { createFileRoute } from "@tanstack/react-router";
import { RegisterComponent } from "@/components/features/auth/RegisterForm";

export const Route = createFileRoute("/(public)/register")({
  component: RegisterComponent,
});
