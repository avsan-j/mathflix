export interface User {
  id: number;
  name: string;
  manager: string;
  screenTime: string; // e.g., "2h 30m"
  averageScore: number;
  level: number;
  testTime: string; // e.g., "10:30 AM"
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin' | 'moderator';
  supervisor: string;
  createdAt: string;
  lastActive: string;
}

export interface UserAction {
  id: string;
  type: 'edit' | 'delete';
  label: string;
  onPress: () => void;
}