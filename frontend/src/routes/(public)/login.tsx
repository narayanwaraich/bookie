import React from 'react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(public)/login')({
  component: LoginComponent,
});

function LoginComponent() {
  // Placeholder for the actual Login component/form
  return (
    <div>
      <h1>Login Page</h1>
      {/* Add Login Form Component Here */}
    </div>
  );
}
