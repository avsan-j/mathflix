// app/subject/child/quiz/[id].tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Modal,
  Animated,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../../context/AuthContext';
import { useQuizzes } from '../../../context/QuizContext';
import { Question, QuizAttempt } from '../../../types/quiz';

export default function QuizScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { quizzes, submitQuizAttempt } = useQuizzes();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizAttempt, setQuizAttempt] = useState<QuizAttempt | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const progressAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Find the quiz
  const quiz = quizzes.find(q => q.id === id);

  useEffect(() => {
    if (!quiz || !user) {
      router.back();
      return;
    }

    // Initialize quiz attempt
    const attempt = {
      id: Date.now().toString(),
      quizId: quiz.id,
      childId: user.id,
      score: 0,
      totalQuestions: quiz.questions.length,
      correctAnswers: 0,
      timeTaken: 0,
      completedAt: '',
      answers: [],
    };
    
    setQuizAttempt(attempt);
    setTimeRemaining(quiz.duration * 60); // Convert minutes to seconds
    setSelectedAnswers(new Array(quiz.questions.length).fill(-1));

    // Start timer
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [quiz, user]);

  useEffect(() => {
    // Update progress bar
    if (quiz) {
      const progress = (currentQuestionIndex + 1) / quiz.questions.length;
      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [currentQuestionIndex]);

  const currentQuestion = quiz?.questions[currentQuestionIndex];

  const handleSelectAnswer = (optionIndex: number) => {
    if (!quiz) return;

    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);

    // Calculate time spent on this question
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);

    // Update quiz attempt with this answer
    if (quizAttempt && currentQuestion) {
      const updatedAttempt = {
        ...quizAttempt,
        answers: [
          ...quizAttempt.answers,
          {
            questionId: currentQuestion.id,
            selectedOption: optionIndex,
            isCorrect: optionIndex === currentQuestion.correctAnswer,
            timeSpent,
          },
        ],
      };
      setQuizAttempt(updatedAttempt);
    }

    // Move to next question after a delay, or if last question, submit
    setTimeout(() => {
      if (currentQuestionIndex < quiz.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setQuestionStartTime(Date.now());
      } else {
        handleSubmitQuiz();
      }
    }, 800);
  };

  const handleSubmitQuiz = async () => {
    if (!quiz || !quizAttempt || isSubmitting) return;

    setIsSubmitting(true);
    
    // Calculate final score
    let correctAnswers = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === quiz.questions[index].correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / quiz.questions.length) * 100);
    const totalTime = quiz.duration * 60 - timeRemaining;

    const finalAttempt: QuizAttempt = {
      ...quizAttempt,
      score,
      correctAnswers,
      timeTaken: totalTime,
      completedAt: new Date().toISOString(),
    };

    try {
      await submitQuizAttempt(finalAttempt);
      setShowResults(true);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!quiz || !quizAttempt) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        
        <View style={styles.headerInfo}>
          <Text style={styles.quizTitle} numberOfLines={1}>
            {quiz.title}
          </Text>
          <Text style={styles.questionCounter}>
            Question {currentQuestionIndex + 1} of {quiz.questions.length}
          </Text>
        </View>

        <View style={styles.timerContainer}>
          <Ionicons name="time-outline" size={20} color="#FF3B30" />
          <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>

      {/* Question */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>
            {currentQuestion?.question}
          </Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {currentQuestion?.options?.map((option, index) => {
            const isSelected = selectedAnswers[currentQuestionIndex] === index;
            const isCorrect = index === currentQuestion.correctAnswer;
            
            let optionStyle = styles.option;
            let textStyle = styles.optionText;
            
            if (isSelected) {
              optionStyle = {
                ...styles.option,
                backgroundColor: isCorrect ? '#E8F5E9' : '#FFEBEE',
                borderColor: isCorrect ? '#34C759' : '#FF3B30',
              }, 
              textStyle = styles.selectedOptionText;
            }

            return (
              <TouchableOpacity
                key={index}
                style={optionStyle}
                onPress={() => handleSelectAnswer(index)}
                disabled={selectedAnswers[currentQuestionIndex] !== -1}
              >
                <View style={styles.optionIndicator}>
                  <Text style={styles.optionLetter}>
                    {String.fromCharCode(65 + index)} {/* A, B, C, D */}
                  </Text>
                </View>
                <Text style={textStyle} numberOfLines={2}>
                  {option}
                </Text>
                
                {isSelected && (
                  <Ionicons
                    name={isCorrect ? 'checkmark-circle' : 'close-circle'}
                    size={24}
                    color={isCorrect ? '#34C759' : '#FF3B30'}
                    style={styles.optionIcon}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={[styles.navButton, currentQuestionIndex === 0 && styles.disabledButton]}
            onPress={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
          >
            <Ionicons name="arrow-back" size={20} color="#007AFF" />
            <Text style={styles.navButtonText}>Previous</Text>
          </TouchableOpacity>

          {currentQuestionIndex < quiz.questions.length - 1 ? (
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => {
                setCurrentQuestionIndex(prev => prev + 1);
                setQuestionStartTime(Date.now());
              }}
              disabled={selectedAnswers[currentQuestionIndex] === -1}
            >
              <Text style={styles.navButtonText}>Next</Text>
              <Ionicons name="arrow-forward" size={20} color="#007AFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.navButton, styles.submitButton]}
              onPress={handleSubmitQuiz}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <Text style={styles.submitButtonText}>Submit Quiz</Text>
                  <Ionicons name="checkmark-circle" size={20} color="white" />
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* Results Modal */}
      <Modal
        visible={showResults}
        transparent
        animationType="fade"
        onRequestClose={() => setShowResults(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.resultsContainer}>
            <View style={styles.resultsHeader}>
              <Ionicons 
                name={quizAttempt.score >= 70 ? 'trophy' : 'ribbon'} 
                size={48} 
                color={quizAttempt.score >= 70 ? '#FFD700' : '#007AFF'} 
              />
              <Text style={styles.resultsTitle}>Quiz Completed!</Text>
            </View>

            <View style={styles.resultsStats}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{quizAttempt.score}%</Text>
                <Text style={styles.statLabel}>Score</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {quizAttempt.correctAnswers}/{quiz.questions.length}
                </Text>
                <Text style={styles.statLabel}>Correct</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {Math.floor(quizAttempt.timeTaken / 60)}:
                  {(quizAttempt.timeTaken % 60).toString().padStart(2, '0')}
                </Text>
                <Text style={styles.statLabel}>Time</Text>
              </View>
            </View>

            <Text style={styles.resultsMessage}>
              {quizAttempt.score >= 90 ? 'Excellent work! 🎉' :
               quizAttempt.score >= 70 ? 'Great job! Keep it up! 👏' :
               quizAttempt.score >= 50 ? 'Good effort! Keep practicing! 💪' :
               'Nice try! You\'ll do better next time! 👍'}
            </Text>

            <TouchableOpacity
              style={styles.doneButton}
              onPress={() => {
                setShowResults(false);
                router.replace('/subject-user/child-dashboard');
              }}
            >
              <Text style={styles.doneButtonText}>Back to Dashboard</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  quizTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  questionCounter: {
    fontSize: 14,
    color: '#8E8E93',
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  timerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF3B30',
    marginLeft: 4,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#E0E0E0',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007AFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  questionContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  questionText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    lineHeight: 28,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#F0F0F0',
  },
  correctOption: {
    backgroundColor: '#E8F5E9',
    borderColor: '#34C759',
  },
  incorrectOption: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FF3B30',
  },
  optionIndicator: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionLetter: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  optionIcon: {
    marginLeft: 12,
  },
  navigationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#007AFF',
    minWidth: 120,
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginHorizontal: 8,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginRight: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  resultsContainer: {
    backgroundColor: 'white',
    borderRadius: 24,
    padding: 30,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  resultsHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
  },
  resultsStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  resultsMessage: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 26,
  },
  doneButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});