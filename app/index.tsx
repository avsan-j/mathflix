// This is the main index page for the entire app. 
// Main functionalities in this page include:
// 1. Checking if a user is authenticated.
// 2. Redirecting authenticated users to their respective dashboards based on their roles (researcher, parent, child).
// 3. Redirecting unauthenticated users to the login page.

import { Redirect, useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const { user, isLoading } = useAuth();
  //const router = useRouter();

  // Show loading while checking auth
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // If user exists, redirect to their dashboard
  if (user) {
  switch (user.role) {
    case 'researcher':
      return <Redirect href="/researcher/admin-dashboard" />;
    case 'parent':
      return <Redirect href="/subject-user/parent-dashboard" />; // Direct to parent
    case 'child':
      return <Redirect href="/subject-user/child-dashboard" />;  // Direct to child
    }
  }
  // If no user, redirect to login page
  return <Redirect href="/auth/login" />;
}