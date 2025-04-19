import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { redirect } from '@tanstack/react-router';

interface UserSettings {
  id: string;
  email: string;
  username: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

export const Route = createFileRoute('/_authenticated/settings')({
  loader: async () => {
    // Example validation - you can replace this with your actual validation logic
    const isAuthenticated = true // Replace with your auth check
    
    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: '/settings'
        }
      })
    }

    // Fetch user settings
    const settings = await fetchUserSettings()

    return {
      settings
    }
  },
  component: SettingsComponent,
});

// Example data fetching function - replace with your actual implementation
async function fetchUserSettings(): Promise<UserSettings> {
  // Implement your data fetching logic here
  return {
    id: '',
    email: '',
    username: '',
    preferences: {
      theme: 'light',
      notifications: true
    }
  };
}

function SettingsComponent() {
  const { settings } = Route.useLoaderData()
  
  return (
    <div>
      <h1>User Settings</h1>
      <div>
        <h2>Profile Information</h2>
        <p>Username: {settings.username}</p>
        <p>Email: {settings.email}</p>
        
        <h2>Preferences</h2>
        <p>Theme: {settings.preferences.theme}</p>
        <p>Notifications: {settings.preferences.notifications ? 'Enabled' : 'Disabled'}</p>
      </div>
    </div>
  );
}
