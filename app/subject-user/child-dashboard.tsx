// app/child/dashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useQuizzes } from '../../context/QuizContext';
import Header from '../../components/shared/header';
import ChildQuizCard from '../../components/subject-user/childQuizCard';

export default function ChildDashboard() {
  const { user } = useAuth();
  const { getQuizzesForChild, isLoading } = useQuizzes();
  const [activeTab, setActiveTab] = useState<'available' | 'completed'>('available');

  useEffect(() => {
    console.log('🔍 CHILD DASHBOARD DEBUG:');
    console.log('1. User:', user);
    console.log('2. User role:', user?.role);
    console.log('3. isLoading:', isLoading);
    
    const quizzes = getQuizzesForChild();
    console.log('4. getQuizzesForChild() returns:', quizzes);
    console.log('5. Type of return:', typeof quizzes);
    console.log('6. Is array?', Array.isArray(quizzes));
    
    if (quizzes) {
      console.log('7. Quizzes length:', quizzes.length);
      console.log('8. First quiz:', quizzes[0]);
    }
  }, [user, isLoading]);

  const childQuizzes = getQuizzesForChild() || [];
  const availableQuizzes = childQuizzes.filter(q => 
    !q.attempts.some(a => a.childId === user?.id) ||[]
  );
  const completedQuizzes = childQuizzes.filter(q => 
    q.attempts.some(a => a.childId === user?.id) || []
  );

  const displayQuizzes = activeTab === 'available' ? availableQuizzes : completedQuizzes;

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.loadingContainer}>
          <Text>Please log in</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      
      <ScrollView style={styles.content}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Hello,</Text>
          <Text style={styles.userName}>{user?.name}!</Text>
          <Text style={styles.welcomeSubtext}>
            Ready to learn something new today?
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="trophy" size={24} color="#FFD700" />
            <Text style={styles.statValue}>
              {completedQuizzes.reduce((acc, q) => {
                const attempt = q.attempts.find(a => a.childId === user?.id);
                return acc + (attempt?.score || 0);
              }, 0)}
            </Text>
            <Text style={styles.statLabel}>Total Points</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle" size={24} color="#34C759" />
            <Text style={styles.statValue}>{completedQuizzes?.length || 0}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="time" size={24} color="#FF9500" />
            <Text style={styles.statValue}>{availableQuizzes?.length || 0}</Text>
            <Text style={styles.statLabel}>New Quizzes</Text>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'available' && styles.activeTab]}
            onPress={() => setActiveTab('available')}
          >
            <Text style={[styles.tabText, activeTab === 'available' && styles.activeTabText]}>
              Available ({availableQuizzes?.length || 0})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
            onPress={() => setActiveTab('completed')}
          >
            <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
              Completed ({completedQuizzes?.length || 0})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quizzes List */}
        <View style={styles.quizzesSection}>
          {displayQuizzes?.length || 0 > 0 ? (
            displayQuizzes.map(quiz => (
              <ChildQuizCard 
                key={quiz.id} 
                quiz={quiz} 
                isCompleted={activeTab === 'completed'}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons 
                name={activeTab === 'available' ? 'book-outline' : 'trophy-outline'} 
                size={64} 
                color="#DDD" 
              />
              <Text style={styles.emptyStateTitle}>
                {activeTab === 'available' 
                  ? 'No quizzes available' 
                  : 'No quizzes completed yet'}
              </Text>
              <Text style={styles.emptyStateText}>
                {activeTab === 'available'
                  ? 'Your parent will assign quizzes for you soon!'
                  : 'Complete your first quiz to see it here'}
              </Text>
            </View>
          )}
        </View>

        {/* Motivation Section */}
        {completedQuizzes?.length || 0 > 0 && (
          <View style={styles.motivationCard}>
            <Ionicons name="sparkles" size={32} color="#FF9500" />
            <View style={styles.motivationText}>
              <Text style={styles.motivationTitle}>Great job!</Text>
              <Text style={styles.motivationSubtitle}>
                You've completed {completedQuizzes?.length || 0} quizzes. Keep going!
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  welcomeSubtext: {
    fontSize: 14,
    color: '#8E8E93',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  activeTabText: {
    color: 'white',
  },
  quizzesSection: {
    marginBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  motivationCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  motivationText: {
    flex: 1,
    marginLeft: 12,
  },
  motivationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  motivationSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
});