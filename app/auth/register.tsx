import { Redirect } from 'expo-router';

export default function RegisterScreen() {
  // Redirect to login page since you handle registration there
  return <Redirect href="/auth/login" />;
}