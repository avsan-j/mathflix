// context/AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, AuthCredentials, RegisterData } from '../types/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: AuthCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Key for AsyncStorage
const USER_STORAGE_KEY = '@Mathflix:user';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start as true to load persisted user

  // Load persisted user on app start
  useEffect(() => {
    const loadPersistedUser = async () => {
      try {
        console.log('📱 Loading persisted user from AsyncStorage...');
        const userString = await AsyncStorage.getItem(USER_STORAGE_KEY);
        
        if (userString) {
          const parsedUser = JSON.parse(userString);
          console.log('✅ Loaded user:', parsedUser.username);
          setUser(parsedUser);
        } else {
          console.log('ℹ️ No persisted user found');
        }
      } catch (error) {
        console.error('❌ Error loading persisted user:', error);
      } finally {
        setIsLoading(false);
        console.log('✅ Auth loading complete');
      }
    };

    loadPersistedUser();
  }, []);

  // Save user to AsyncStorage whenever it changes
  useEffect(() => {
    const saveUser = async () => {
      if (user) {
        try {
          await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
          console.log('💾 User saved to AsyncStorage:', user.username);
        } catch (error) {
          console.error('❌ Error saving user to AsyncStorage:', error);
        }
      }
    };

    saveUser();
  }, [user]);

  // ✅ DATABASE INTEGRATION POINT: Replace with real API calls
  const login = async (credentials: AuthCredentials) => {
    setIsLoading(true);
    
    try {
      // ⭐ TEMPORARY: Dummy authentication logic
      const dummyUsers: User[] = [
        {
          id: '1',
          username: 'researcher',
          password: 'password123', // In real app, this would be hashed
          email: 'researcher@mathflix.com',
          name: 'Dr. Jane Smith',
          role: 'researcher',
        },
        {
          id: '2',
          username: 'parent',
          password: 'parent123',
          email: 'parent@mathflix.com',
          name: 'John Doe',
          role: 'parent',
          parentId: 'PAR-001',
        },
        {
          id: '3',
          username: 'child',
          password: 'child123',
          email: 'child@mathflix.com',
          name: 'Child User',
          role: 'child',
          childId: 'CHI-001'
        },
      ];

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const foundUser = dummyUsers.find(
        u => u.username === credentials.username && u.password === credentials.password
      );

      if (!foundUser) {
        return { 
          success: false, 
          error: 'Invalid username or password' 
        };
      }

      // Remove password before storing user
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword as User);
      
      // ✅ DATABASE INTEGRATION: Store token/session
      // localStorage.setItem('auth_token', 'your-jwt-token-here');
      
      return { success: true };
      
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: 'Network error. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ DATABASE INTEGRATION POINT: Replace with real registration API
  const register = async (data: RegisterData) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if username already exists (dummy check)
      if (data.username === 'existinguser') {
        return { 
          success: false, 
          error: 'Username already taken' 
        };
      }

      // Create new user object
      const newUser: User = {
        id: Date.now().toString(), // Temporary ID
        username: data.username,
        email: data.email,
        name: data.name,
        role: data.role,
        ...(data.role === 'researcher' && { researchInstitution: '' }),
        ...(data.role === 'parent' && { parentId: `PAR-${Date.now().toString().slice(-4)}`}),
        ...(data.role === 'child' && { childId: `CHI-${Date.now().toString().slice(-4)}`}),
      };

      setUser(newUser);
      
      // ✅ DATABASE INTEGRATION: Call registration endpoint
      // const response = await fetch('/api/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      
      return { success: true };
      
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: 'Registration failed. Please try again.' 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    
    try {
      // Clear user from state
      setUser(null);
      
      // Clear from AsyncStorage
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      console.log('✅ User logged out and cleared from storage');
      
      // ✅ DATABASE INTEGRATION: Clear token/session
      // localStorage.removeItem('auth_token');
      // await fetch('/api/logout', { method: 'POST' });
      
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};