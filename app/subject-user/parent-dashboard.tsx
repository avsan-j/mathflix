// app/subject/dashboard.tsx
import React, { useState } from 'react';
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
import { useSessions } from '../../context/SessionContext';
import SessionCard from '../../components/subject-user/sessionCard';
import AddSessionModal from '../../components/subject-user/addSessionModal';
import Header from '../../components/shared/header';

export default function SubjectDashboard() {
  const { user, logout } = useAuth();
  const { sessions, deleteSession, toggleSessionCompletion, addSession, isLoading } = useSessions();
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);

  const completedSessions = sessions.filter(s => s.isCompleted);
  const pendingSessions = sessions.filter(s => !s.isCompleted);
  const totalStudyTime = sessions.reduce((total, session) => total + session.duration, 0);

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

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{user?.name || user?.username}!</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="calendar-outline" size={24} color="#333" />
            <Text style={styles.statValue}>{sessions.length}</Text>
            <Text style={styles.statLabel}>Total Sessions</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="time-outline" size={24} color="#333" />
            <Text style={styles.statValue}>{totalStudyTime}</Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle-outline" size={24} color="#333" />
            <Text style={styles.statValue}>{completedSessions.length}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        {/* Add Session Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setIsAddModalVisible(true)}
        >
          <Ionicons name="add-circle" size={24} color="white" />
          <Text style={styles.addButtonText}>Add New Session</Text>
        </TouchableOpacity>

        {/* Sessions Section */}
        <View style={styles.sessionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Study Sessions</Text>
            <Text style={styles.sessionCount}>({sessions.length})</Text>
          </View>

          {sessions.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="book-outline" size={64} color="#DDD" />
              <Text style={styles.emptyStateTitle}>No sessions yet</Text>
              <Text style={styles.emptyStateText}>
                Start by adding your first study session!
              </Text>
            </View>
          ) : (
            <>
              {/* Pending Sessions */}
              {pendingSessions.length > 0 && (
                <>
                  <Text style={styles.subsectionTitle}>Upcoming ({pendingSessions.length})</Text>
                  {pendingSessions.map(session => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      onDelete={() => deleteSession(session.id)}
                      onToggleComplete={() => toggleSessionCompletion(session.id)}
                    />
                  ))}
                </>
              )}

              {/* Completed Sessions */}
              {completedSessions.length > 0 && (
                <>
                  <Text style={[styles.subsectionTitle, styles.completedTitle]}>
                    Completed ({completedSessions.length})
                  </Text>
                  {completedSessions.map(session => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      onDelete={() => deleteSession(session.id)}
                      onToggleComplete={() => toggleSessionCompletion(session.id)}
                    />
                  ))}
                </>
              )}
            </>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="stats-chart" size={24} color="#1976D2" />
              </View>
              <Text style={styles.actionText}>Progress</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#E8F5E9' }]}>
                <Ionicons name="timer-outline" size={24} color="#2E7D32" />
              </View>
              <Text style={styles.actionText}>Focus Timer</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#FFF3E0' }]}>
                <Ionicons name="trophy-outline" size={24} color="#EF6C00" />
              </View>
              <Text style={styles.actionText}>Achievements</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionCard}>
              <View style={[styles.actionIcon, { backgroundColor: '#F3E5F5' }]}>
                <Ionicons name="settings-outline" size={24} color="#7B1FA2" />
              </View>
              <Text style={styles.actionText}>Settings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Add Session Modal */}
      <AddSessionModal
        visible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onAddSession={addSession}
      />
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
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#333',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  sessionsSection: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 8,
  },
  sessionCount: {
    fontSize: 16,
    color: '#8E8E93',
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 12,
  },
  completedTitle: {
    color: '#34C759',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 16,
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
  actionsSection: {
    marginBottom: 32,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
});