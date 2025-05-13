import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { trpc } from '@/lib/api';
import { useState } from 'react';

export const Route = createFileRoute('/(public)/forgot-password')({
  component: ForgotPasswordComponent,
});

const forgotPasswordFormSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordFormSchema>;

function ForgotPasswordComponent() {
  const navigate = useNavigate();
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const requestResetMutation = useMutation(trpc.auth.requestPasswordReset.mutationOptions({
    onSuccess: (data, variables) => {
      setSubmittedEmail(variables.email);
      toast.success('Request Sent', {
        description: data.message || `If an account with ${variables.email} exists, a password reset link has been sent.`,
      });
    },
    onError: (error: any) => {
      let description = 'A server error occurred while processing your request. Please try again later.';
      if (error.data?.httpStatus === 429 || error.code === 'TOO_MANY_REQUESTS') {
        description = 'Too many password reset requests. Please try again in a few minutes.';
      } else if (error.message) {
        // For other errors, use the error message if available
        description = error.message;
      }
      // This typically catches server errors, as AuthErrors are handled by backend to prevent email enumeration
      toast.error('Request Failed', {
        description: description,
      });
    },
  }));

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: '',
    },
  });

  function onSubmit(values: ForgotPasswordFormValues) {
    requestResetMutation.mutate(values);
  }

  if (submittedEmail) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="mx-auto w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <CardDescription>
              A password reset link has been sent to <strong>{submittedEmail}</strong> if an account with that email exists. Please check your inbox (and spam folder).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate({ to: '/login' })} className="w-full">
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Enter your email address below and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
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
              <Button type="submit" className="w-full" disabled={requestResetMutation.isPending}>
                {requestResetMutation.isPending ? 'Sending link...' : 'Send Reset Link'}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Remember your password?{' '}
            <Link to="/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
