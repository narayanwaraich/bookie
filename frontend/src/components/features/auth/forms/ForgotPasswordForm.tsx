import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const forgotPasswordFormSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>;

interface ForgotPasswordFormComponentProps {
  onSubmitSuccess: (email: string) => void; // Callback to handle UI change
  requestResetMutation: ReturnType<
    typeof useMutation<any, any, ForgotPasswordFormValues>
  >; // Pass mutation
}

export default function ForgotPasswordFormComponent({
  onSubmitSuccess,
  requestResetMutation,
}: ForgotPasswordFormComponentProps) {
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: ForgotPasswordFormValues) {
    requestResetMutation.mutate(values, {
      onSuccess: (data, variables) => {
        onSubmitSuccess(variables.email); // Call parent's success handler
        toast.success("Request Sent", {
          description:
            data.message ||
            `If an account with ${variables.email} exists, a password reset link has been sent.`,
        });
      },
      onError: (error: any) => {
        let description =
          "A server error occurred while processing your request. Please try again later.";
        if (
          error.data?.httpStatus === 429 ||
          error.code === "TOO_MANY_REQUESTS"
        ) {
          description =
            "Too many password reset requests. Please try again in a few minutes.";
        } else if (error.message) {
          description = error.message;
        }
        toast.error("Request Failed", {
          description: description,
        });
      },
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="m@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full"
          disabled={requestResetMutation.isPending}
        >
          {requestResetMutation.isPending
            ? "Sending link..."
            : "Send Reset Link"}
        </Button>
      </form>
    </Form>
  );
}
