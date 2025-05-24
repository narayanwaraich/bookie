import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Loader2, ShieldAlert } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  deleteAccountFormSchema,
  type DeleteAccountFormValues,
} from "../schemas";
import { useProfileMutations } from "../hooks";
import { useAuth } from "@/lib/auth";

export function DeleteAccountCard() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [showDeleteConfirmPassword, setShowDeleteConfirmPassword] =
    useState(false);

  const { deleteAccount, isDeletingAccount } = useProfileMutations();

  const deleteAccountForm = useForm<DeleteAccountFormValues>({
    resolver: zodResolver(deleteAccountFormSchema),
    defaultValues: { password: "" },
  });

  const onDeleteAccountSubmit = async (values: DeleteAccountFormValues) => {
    deleteAccount(values);

    // If deletion is successful, we need to handle logout and redirect
    // Note: This logic should actually be in the onSuccess callback of the mutation
    // but we're keeping UI handling here for component encapsulation
    if (!isDeletingAccount) {
      setIsDeleteDialogOpen(false);
      await auth.logout();
      navigate({ to: "/", replace: true });
    }
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
            <Form {...deleteAccountForm}>
              <form
                onSubmit={deleteAccountForm.handleSubmit(onDeleteAccountSubmit)}
                id="deleteAccountConfirmForm"
              >
                <FormField
                  control={deleteAccountForm.control}
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
              <AlertDialogCancel onClick={() => deleteAccountForm.reset()}>
                Cancel
              </AlertDialogCancel>
              <Button
                variant="destructive"
                type="submit"
                form="deleteAccountConfirmForm"
                disabled={isDeletingAccount}
              >
                {isDeletingAccount ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Yes, Delete My Account
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
