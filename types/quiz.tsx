export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option (0-3)
  explanation?: string;
  points: number;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  subject: string; // e.g., "Math", "Science"
  difficulty: 'easy' | 'medium' | 'hard';
  questions: Question[];
  createdBy: string; // Parent user ID
  assignedTo: string[]; // Child user IDs
  isPublished: boolean;
  createdAt: string;
  attempts: QuizAttempt[]; // Track child attempts
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  childId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number; // in seconds
  completedAt: string;
  answers: UserAnswer[];
}

export interface UserAnswer {
  questionId: string;
  selectedOption: number;
  isCorrect: boolean;
  timeSpent: number; // in seconds
}