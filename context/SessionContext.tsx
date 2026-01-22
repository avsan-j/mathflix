// context/SessionContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Session, SessionInput } from '../types/session';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SessionContextType {
  sessions: Session[];
  addSession: (session: SessionInput) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  toggleSessionCompletion: (sessionId: string) => Promise<void>;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const useSessions = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSessions must be used within a SessionProvider');
  }
  return context;
};

interface SessionProviderProps {
  children: ReactNode;
}

const SESSIONS_STORAGE_KEY = '@Mathflix:sessions';

export const SessionProvider: React.FC<SessionProviderProps> = ({ children }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load sessions from AsyncStorage on mount
  React.useEffect(() => {
    const loadSessions = async () => {
      try {
        const sessionsString = await AsyncStorage.getItem(SESSIONS_STORAGE_KEY);
        if (sessionsString) {
          const loadedSessions = JSON.parse(sessionsString);
          setSessions(loadedSessions);
        }
      } catch (error) {
        console.error('Error loading sessions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSessions();
  }, []);

  // Save sessions to AsyncStorage whenever they change
  React.useEffect(() => {
    const saveSessions = async () => {
      try {
        await AsyncStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
      } catch (error) {
        console.error('Error saving sessions:', error);
      }
    };

    if (!isLoading) {
      saveSessions();
    }
  }, [sessions, isLoading]);

  const addSession = async (sessionInput: SessionInput) => {
    const newSession: Session = {
      ...sessionInput,
      id: Date.now().toString(),
      date: new Date().toISOString(),
      isCompleted: false,
    };

    setSessions(prev => [newSession, ...prev]);
  };

  const deleteSession = async (sessionId: string) => {
    setSessions(prev => prev.filter(session => session.id !== sessionId));
  };

  const toggleSessionCompletion = async (sessionId: string) => {
    setSessions(prev =>
      prev.map(session =>
        session.id === sessionId
          ? { ...session, isCompleted: !session.isCompleted }
          : session
      )
    );
  };

  return (
    <SessionContext.Provider
      value={{
        sessions,
        addSession,
        deleteSession,
        toggleSessionCompletion,
        isLoading,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};