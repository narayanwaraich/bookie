1. __Display User Profile__:

   - Utilize the `getProfile` tRPC procedure to fetch the current user's data.
   - Display this information on the `/settings/profile` page.

2. __Update User Profile__:

   - Create a form on the `/settings/profile` page to allow users to modify their details (e.g., name, email if applicable, etc., based on your `updateUserSchema`).
   - Use the `updateProfile` tRPC procedure to save these changes.

After these foundational profile features are in place, you can then implement:

- __Change Password functionality__: Using the `changePassword` tRPC procedure.
- __Delete Account functionality__: Using the `deleteAccount` tRPC procedure, ensuring you handle UI aspects like confirmation dialogs.
