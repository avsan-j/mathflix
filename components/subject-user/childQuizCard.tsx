// components/subject/child/ChildQuizCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Quiz } from '../../types/quiz';
import { useAuth } from '../../context/AuthContext'

interface ChildQuizCardProps {
  quiz: Quiz;
  isCompleted?: boolean;
}

const ChildQuizCard: React.FC<ChildQuizCardProps> = ({ quiz, isCompleted = false }) => {
  const router = useRouter();
  const { user } = useAuth();

  const getDifficultyColor = () => {
    switch (quiz.difficulty) {
      case 'easy': return '#34C759';
      case 'medium': return '#FF9500';
      case 'hard': return '#FF3B30';
      default: return '#8E8E93';
    }
  };

  const getSubjectIcon = () => {
    switch (quiz.subject.toLowerCase()) {
      case 'math': return 'calculator';
      case 'science': return 'flask';
      case 'english': return 'book';
      case 'history': return 'globe';
      default: return 'school';
    }
  };

  const handleStartQuiz = () => {
    if (!isCompleted && user) {
      router.push(`/subject/child/quiz/${quiz.id}` as any);
    }
  };

  const getBestScore = () => {
    if (!isCompleted || !quiz.attempts.length || !user) return null;
    
    const attempts = quiz.attempts.filter(a => a.childId === user.id);
    if (!attempts.length) return null;
    
    const bestAttempt = attempts.reduce((best, current) => 
      current.score > best.score ? current : best
    );
    
    return bestAttempt.score;
  };

  return (
    <TouchableOpacity
      style={[styles.card, isCompleted && styles.completedCard]}
      onPress={handleStartQuiz}
      disabled={isCompleted}
      activeOpacity={isCompleted ? 1 : 0.7}
    >
      <View style={styles.header}>
        <View style={styles.subjectBadge}>
          <Ionicons 
            name={getSubjectIcon() as any} 
            size={20} 
            color={getDifficultyColor()} 
          />
          <Text style={styles.subjectText}>{quiz.subject}</Text>
        </View>
        
        <View style={[styles.difficultyBadge, { backgroundColor: `${getDifficultyColor()}20` }]}>
          <Text style={[styles.difficultyText, { color: getDifficultyColor() }]}>
            {quiz.difficulty.toUpperCase()}
          </Text>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {quiz.title}
      </Text>
      
      {quiz.description && (
        <Text style={styles.description} numberOfLines={2}>
          {quiz.description}
        </Text>
      )}

      <View style={styles.footer}>
        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={16} color="#8E8E93" />
            <Text style={styles.detailText}>{quiz.duration} min</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="document-text-outline" size={16} color="#8E8E93" />
            <Text style={styles.detailText}>{quiz.questions.length} questions</Text>
          </View>
        </View>

        {isCompleted ? (
          <View style={styles.scoreContainer}>
            <Ionicons name="trophy" size={20} color="#FFD700" />
            <Text style={styles.scoreText}>
              Best: {getBestScore() || 0}%
            </Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.startButton} onPress={handleStartQuiz}>
            <Text style={styles.startButtonText}>Start</Text>
            <Ionicons name="arrow-forward" size={18} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  completedCard: {
    opacity: 0.9,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  subjectText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 6,
  },
  difficultyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '700',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 16,
  },
  details: {
    flexDirection: 'row',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  detailText: {
    fontSize: 14,
    color: '#8E8E93',
    marginLeft: 6,
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
    minWidth: 100,
    justifyContent: 'center',
  },
  startButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 6,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9C4',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 6,
  },
});

export default ChildQuizCard;