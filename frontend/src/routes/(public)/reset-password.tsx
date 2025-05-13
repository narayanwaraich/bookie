import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useEffect, useState } from 'react';

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
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, Eye, EyeOff } from 'lucide-react';

// Schema for validating search parameters
const resetPasswordSearchSchema = z.object({
  token: z.string().optional(),
});

// Schema for the form
const resetPasswordFormSchema = z.object({
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"], // Point error to the confirmPassword field
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordFormSchema>;

export const Route = createFileRoute('/(public)/reset-password')({
  validateSearch: (search) => resetPasswordSearchSchema.parse(search),
  component: ResetPasswordComponent,
});

function ResetPasswordComponent() {
  const navigate = useNavigate();
  const { token } = Route.useSearch();
  const [isSuccess, setIsSuccess] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const resetPasswordMutation = useMutation(trpc.auth.resetPassword.mutationOptions({
    onSuccess: (data) => {
      toast.success('Password Reset Successful', {
        description: data.message || 'Your password has been reset. You can now log in with your new password.',
      });
      setIsSuccess(true);
      // Optional: Automatically navigate to login after a delay
      // setTimeout(() => navigate({ to: '/login' }), 3000);
    },
    onError: (error: any) => {
      let description = 'The reset link may be invalid or expired, or an unexpected error occurred. Please try again or request a new link.';
      if (error.data?.httpStatus === 429 || error.code === 'TOO_MANY_REQUESTS') {
        description = 'Too many password reset attempts. Please try again in a few minutes.';
      } else if (error.message) {
        // Backend AuthError messages are often specific enough
        description = error.message;
      }
      toast.error('Password Reset Failed', {
        description: description,
      });
    },
  }));

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  function onSubmit(values: ResetPasswordFormValues) {
    if (!token) {
      toast.error('Missing Token', { description: 'No password reset token found in the URL.' });
      return;
    }
    resetPasswordMutation.mutate({ token, newPassword: values.newPassword });
  }

  useEffect(() => {
    if (!token) {
      // Handle case where token is missing from URL immediately
      // This could be a redirect or just showing the error message
    }
  }, [token, navigate]);

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Invalid Link</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                The password reset link is invalid or missing a token. Please request a new one if needed.
              </AlertDescription>
            </Alert>
            <Button onClick={() => navigate({ to: '/forgot-password' })} className="mt-4 w-full">
              Request New Link
            </Button>
            <Button variant="outline" onClick={() => navigate({ to: '/login' })} className="mt-2 w-full">
              Back to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Password Changed!</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="default">
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                Your password has been successfully updated.
              </AlertDescription>
            </Alert>
            <Button onClick={() => navigate({ to: '/login' })} className="mt-4 w-full">
              Proceed to Login
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
          <CardTitle className="text-2xl">Reset Your Password</CardTitle>
          <CardDescription>
            Enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input type={showNewPassword ? 'text' : 'password'} placeholder="********" {...field} />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                        aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                      >
                        {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input type={showConfirmPassword ? 'text' : 'password'} placeholder="********" {...field} />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                        aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {/* </FormControl>  <- Removed extra FormControl closing tag */}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={resetPasswordMutation.isPending}>
                {resetPasswordMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting Password...
                  </>
                ) : (
                  'Reset Password'
                )}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Remembered your password?{' '}
            <Link to="/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
