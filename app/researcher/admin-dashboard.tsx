// app/index.tsx (or app/home.tsx)
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Header from '../../components/shared/header';
import UserTable from '../../components/researcher/userTable';
import { User } from '../../types/users';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  // Sample placeholder data
  const sampleUsers: User[] = [
    { id: 1, name: 'John Doe', manager: 'Sarah Smith', screenTime: '2h 45m', averageScore: 85, level: 3, testTime: '10:30 AM' },
    { id: 2, name: 'Jane Smith', manager: 'Mike Johnson', screenTime: '1h 30m', averageScore: 92, level: 4, testTime: '11:15 AM' },
    { id: 3, name: 'Bob Wilson', manager: 'Sarah Smith', screenTime: '3h 15m', averageScore: 78, level: 2, testTime: '09:45 AM' },
    { id: 4, name: 'Alice Brown', manager: 'Mike Johnson', screenTime: '2h 00m', averageScore: 95, level: 5, testTime: '02:30 PM' },
    { id: 5, name: 'Charlie Davis', manager: 'Lisa Wang', screenTime: '4h 20m', averageScore: 65, level: 1, testTime: '01:00 PM' },
    { id: 6, name: 'Eva Garcia', manager: 'Sarah Smith', screenTime: '1h 45m', averageScore: 88, level: 3, testTime: '10:00 AM' },
    { id: 7, name: 'David Lee', manager: 'Mike Johnson', screenTime: '3h 00m', averageScore: 72, level: 2, testTime: '11:30 AM' },
    { id: 8, name: 'Grace Kim', manager: 'Lisa Wang', screenTime: '2h 15m', averageScore: 91, level: 4, testTime: '03:15 PM' },
  ];

  // Calculate statistics
  const totalUsers = sampleUsers.length;
  const averageScore = Math.round(sampleUsers.reduce((sum, user) => sum + user.averageScore, 0) / totalUsers);

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      
      <View style={styles.content}>
        {/* Page Title */}
        <Text style={styles.pageTitle}>Quiz Dashboard</Text>
        
        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalUsers}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{averageScore}%</Text>
            <Text style={styles.statLabel}>Avg Score</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Active Quizzes</Text>
          </View>
        </View>

        {/* Table Section */}
        <View style={styles.tableSection}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableTitle}>User Performance</Text>
            <Text style={styles.tableSubtitle}>Sorted by average score</Text>
          </View>
          
          <UserTable users={sampleUsers} />
          
          {/* Optional: Add pagination or filters here */}
          <View style={styles.tableFooter}>
            <Text style={styles.footerText}>Showing {totalUsers} users</Text>
            {/* Add pagination buttons here if needed */}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    fontFamily: 'Poppins-Bold',
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
    marginHorizontal: 6,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  tableSection: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tableHeader: {
    marginBottom: 16,
  },
  tableTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  tableSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  tableFooter: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
});
