import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, ShieldAlert } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

const deleteAccountFormSchema = z.object({
  password: z
    .string()
    .min(1, { message: "Password is required to confirm deletion" }),
});
type DeleteAccountFormValues = z.infer<typeof deleteAccountFormSchema>;

export default function DeleteAccountForm() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [showDeleteConfirmPassword, setShowDeleteConfirmPassword] =
    useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const form = useForm<DeleteAccountFormValues>({
    resolver: zodResolver(deleteAccountFormSchema),
    defaultValues: { password: "" },
  });

  const deleteAccountMutation = useMutation(
    trpc.user.deleteAccount.mutationOptions({
      onSuccess: async () => {
        toast.success("Account Deleted", {
          description: "Your account has been permanently deleted.",
        });
        setIsDeleteDialogOpen(false);
        await auth.logout();
        navigate({ to: "/", replace: true });
      },
      onError: (err: any) => {
        let description = "An unexpected error occurred. Please try again.";
        if (err.data?.httpStatus === 429 || err.code === "TOO_MANY_REQUESTS") {
          description = "Too many attempts. Please try again in a few minutes.";
        } else if (err.message) {
          description = err.message;
        }
        toast.error("Account Deletion Failed", { description });
        form.setError("password", { type: "manual", message: description });
      },
    }),
  );

  const onDeleteAccountSubmit = (values: DeleteAccountFormValues) => {
    deleteAccountMutation.mutate({ password: values.password });
  };

  return (
    <Card className="border-destructive">
      <CardHeader>
        <CardTitle className="text-xl text-destructive">
          Delete Account
        </CardTitle>
        <CardDescription>
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full sm:w-auto">
              <ShieldAlert className="mr-2 h-4 w-4" /> Delete My Account
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove all your data from our servers. To confirm,
                please type your current password.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onDeleteAccountSubmit)}
                id="deleteAccountConfirmForm"
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <div className="relative">
                        <FormControl>
                          <Input
                            type={
                              showDeleteConfirmPassword ? "text" : "password"
                            }
                            placeholder="Enter your password to confirm"
                            {...field}
                          />
                        </FormControl>
                        <button
                          type="button"
                          onClick={() =>
                            setShowDeleteConfirmPassword(
                              !showDeleteConfirmPassword,
                            )
                          }
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
                        >
                          {showDeleteConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => form.reset()}>
                Cancel
              </AlertDialogCancel>
              <Button
                variant="destructive"
                type="submit"
                form="deleteAccountConfirmForm"
                disabled={deleteAccountMutation.isPending}
              >
                {deleteAccountMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Yes, Delete My Account
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
