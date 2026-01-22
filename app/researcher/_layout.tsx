// app/(researcher)/_layout.tsx
import { Stack } from 'expo-router';

export default function ResearcherLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
      {/* We'll add more researcher screens later */}
    </Stack>
  );
}