// context/QuizContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Quiz, Question, QuizAttempt } from '../types/quiz';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from './AuthContext';

interface QuizContextType {
  quizzes: Quiz[];
  createQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt' | 'attempts'>) => Promise<void>;
  updateQuiz: (quizId: string, updates: Partial<Quiz>) => Promise<void>;
  deleteQuiz: (quizId: string) => Promise<void>;
  publishQuiz: (quizId: string) => Promise<void>;
  assignQuizToChild: (quizId: string, childId: string) => Promise<void>;
  startQuizAttempt: (quizId: string) => QuizAttempt;
  submitQuizAttempt: (attempt: QuizAttempt) => Promise<void>;
  getQuizzesForParent: () => Quiz[];
  getQuizzesForChild: () => Quiz[];
  isLoading: boolean;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const useQuizzes = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuizzes must be used within a QuizProvider');
  }
  return context;
};

interface QuizProviderProps {
  children: ReactNode;
}

const QUIZZES_STORAGE_KEY = '@Mathflix:quizzes';

export const QuizProvider: React.FC<QuizProviderProps> = ({ children }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load quizzes from storage
  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        const quizzesString = await AsyncStorage.getItem(QUIZZES_STORAGE_KEY);
        if (quizzesString) {
          const loadedQuizzes = JSON.parse(quizzesString);
          setQuizzes(loadedQuizzes);
        }
      } catch (error) {
        console.error('Error loading quizzes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadQuizzes();
  }, []);

  // Save quizzes to storage
  useEffect(() => {
    const saveQuizzes = async () => {
      try {
        await AsyncStorage.setItem(QUIZZES_STORAGE_KEY, JSON.stringify(quizzes));
      } catch (error) {
        console.error('Error saving quizzes:', error);
      }
    };

    if (!isLoading) {
      saveQuizzes();
    }
  }, [quizzes, isLoading]);

  // Create new quiz
  const createQuiz = async (quizData: Omit<Quiz, 'id' | 'createdAt' | 'attempts'>) => {
    const newQuiz: Quiz = {
      ...quizData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      attempts: [],
    };
    setQuizzes(prev => [...prev, newQuiz]);
  };

  // Update existing quiz
  const updateQuiz = async (quizId: string, updates: Partial<Quiz>) => {
    setQuizzes(prev =>
      prev.map(quiz => (quiz.id === quizId ? { ...quiz, ...updates } : quiz))
    );
  };

  // Delete quiz
  const deleteQuiz = async (quizId: string) => {
    setQuizzes(prev => prev.filter(quiz => quiz.id !== quizId));
  };

  // Publish quiz (make it available to child)
  const publishQuiz = async (quizId: string) => {
    setQuizzes(prev =>
      prev.map(quiz =>
        quiz.id === quizId ? { ...quiz, isPublished: true } : quiz
      )
    );
  };

  // Assign quiz to specific child
  const assignQuizToChild = async (quizId: string, childId: string) => {
    setQuizzes(prev =>
      prev.map(quiz => {
        if (quiz.id === quizId) {
          const assignedTo = [...new Set([...quiz.assignedTo, childId])];
          return { ...quiz, assignedTo };
        }
        return quiz;
      })
    );
  };

  // Start a new quiz attempt
  const startQuizAttempt = (quizId: string): QuizAttempt => {
    const quiz = quizzes.find(q => q.id === quizId);
    if (!quiz) throw new Error('Quiz not found');

    return {
      id: Date.now().toString(),
      quizId,
      childId: user?.id || '',
      score: 0,
      totalQuestions: quiz.questions.length,
      correctAnswers: 0,
      timeTaken: 0,
      completedAt: '',
      answers: [],
    };
  };

  // Submit quiz attempt
  const submitQuizAttempt = async (attempt: QuizAttempt) => {
    setQuizzes(prev =>
      prev.map(quiz => {
        if (quiz.id === attempt.quizId) {
          return {
            ...quiz,
            attempts: [...quiz.attempts, attempt],
          };
        }
        return quiz;
      })
    );
  };

  // Get quizzes for parent (quizzes they created)
  const getQuizzesForParent = () => {
    if (!user || user.role !== 'parent') return [];
    return quizzes.filter(quiz => quiz.createdBy === user.id);
  };

  // Get quizzes for child (quizzes assigned to them)
  const getQuizzesForChild = () => {
    if (!user || user.role !== 'child') return [];
    return quizzes.filter(
      quiz => quiz.assignedTo.includes(user.id) && quiz.isPublished
    ) || [];
  };

  return (
    <QuizContext.Provider
      value={{
        quizzes,
        createQuiz,
        updateQuiz,
        deleteQuiz,
        publishQuiz,
        assignQuizToChild,
        startQuizAttempt,
        submitQuizAttempt,
        getQuizzesForParent,
        getQuizzesForChild,
        isLoading,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};