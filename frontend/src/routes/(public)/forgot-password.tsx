import React from 'react';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/(public)/forgot-password')({
  component: ForgotPasswordComponent,
});

function ForgotPasswordComponent() {
  // Placeholder for the Forgot Password form
  return (
    <div>
      <h1>Forgot Password</h1>
      {/* Add Forgot Password Form Component Here */}
    </div>
  );
}
