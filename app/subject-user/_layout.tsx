// app/(subject)/_layout.tsx
import { Stack } from 'expo-router';

export default function SubjectLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="dashboard" />
      {/* We'll add more subject screens later */}
    </Stack>
  );
}