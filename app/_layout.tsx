// This the root layout page for the entire app.

import React from "react";
import { Stack } from "expo-router";
import { useFonts } from 'expo-font';
import { Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ActivityIndicator, View, Text } from 'react-native';
import { SessionProvider } from '../context/SessionContext';
import { QuizProvider } from "@/context/QuizContext";

SplashScreen.preventAutoHideAsync();

function RootStack() {
  const { user, isLoading: authLoading } = useAuth();

  // Show loading screen while checking auth
  if (authLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* ALWAYS show auth screens first - they handle redirects internally */}
      <Stack.Screen name="(auth)" />
      
      {/* Protected routes - only accessible if logged in */}
      {user ? (
        user.role === 'researcher' ? (
          <Stack.Screen name="(researcher)" />
        ) : (
          <Stack.Screen name="(subject)" />
        )
      ) : null}
      
      {/* Redirect root to appropriate place */}
      <Stack.Screen 
        name="index" 
        listeners={{
          focus: () => {
            // This ensures / redirects properly
            if (!user) {
              // Will be caught by the redirect below
            }
          }
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {

  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Regular':Poppins_400Regular,
    'Poppins-Bold': Poppins_700Bold,
  })

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Don't render until fonts are loaded
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthProvider>
      <SessionProvider>
        <QuizProvider>
          <RootStack />
        </QuizProvider>
      </SessionProvider>
    </AuthProvider>
  );
}

