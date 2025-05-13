import { useState, useEffect } from 'react';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
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
import { useAuth } from '@/lib/auth'; // Assuming useAuth hook for setting user session

// Define expected search params for the login route
const loginSearchSchema = z.object({
  redirect: z.string().optional().catch(''), // Where to redirect after login
  sessionExpired: z.string().optional().catch(''), // To show session expired message
});

export const Route = createFileRoute('/(public)/login')({
  validateSearch: (search) => loginSearchSchema.parse(search),
  component: LoginComponent,
});

const loginFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

function LoginComponent() {
  const navigate = useNavigate();
  const auth = useAuth();
  const search = Route.useSearch(); // Get validated search params
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (search.sessionExpired === 'true') {
      toast.info('Session Expired', {
        description: 'Your session has expired. Please log in again.',
      });
      // Optional: Clear the sessionExpired param from URL to prevent re-showing on refresh
      // navigate({ search: (prev) => ({ ...prev, sessionExpired: undefined }), replace: true });
    }
  }, [search.sessionExpired, navigate]);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setIsSubmitting(true);
    try {
      await auth.login(values); // Call the login method from useAuth
      toast.success('Login Successful', {
        description: 'Welcome back!',
      });
      // Redirect to the original intended path or dashboard
      navigate({ to: search.redirect || '/dashboard' });
    } catch (error: any) {
      let description = 'An unexpected error occurred. Please try again later.';
      if (error?.data?.httpStatus === 429 || error?.code === 'TOO_MANY_REQUESTS') {
        description = 'Too many login attempts. Please try again in a few minutes.';
      } else if (error?.message) {
        // Backend AuthError messages are often specific enough (e.g., "Invalid credentials")
        description = error.message;
      } else if (error?.code === 'UNAUTHORIZED' || error?.response?.status === 401) { // Check for specific auth http status if no message
        description = 'Invalid email or password. Please check your credentials.';
      }
      toast.error('Login Failed', {
        description: description,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="mx-auto w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account.
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
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input type={showPassword ? 'text' : 'password'} placeholder="********" {...field} />
                      </FormControl>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting || auth.isLoggingIn}>
                {isSubmitting || auth.isLoggingIn ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-right text-sm">
            <Link
              to="/forgot-password"
              className="underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="mt-4 text-center text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
