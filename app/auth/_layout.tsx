// app/(auth)/_layout.tsx
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';

export default function AuthLayout() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      if (!isLoading && user) {
    if (user.role === 'researcher') {
      router.replace('/researcher/dashboard');
    } else if (user.role === 'parent') {
      router.replace('/subject-user/parent-dashboard');
    } else if (user.role === 'child') {
      router.replace('/subject-user/child-dashboard');
    }
  }
    }
  }, [user, isLoading]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // If user exists, show loading while redirect happens
  if (user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Only show auth screens to non-logged-in users
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
    </Stack>
  );
}