// app/(researcher)/dashboard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';
import Header from '../../components/shared/header'

export default function ResearcherDashboard() {
  const { user, logout } = useAuth();
  const router = useRouter();


  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.header}>
        <Text style={styles.title}>Researcher Dashboard</Text>
        <Text style={styles.welcome}>Welcome, {user?.name}!</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.push('/users' as any)}
          >
            <Text style={styles.buttonText}>Manage Users</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Create Quiz</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => router.push('/researcher/admin-dashboard')}>
            <Text style={styles.buttonText}>View Analytics</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 2,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 24,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212529',
  },
  welcome: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 4,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    width: '40%',
    height: '80%',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  logoutButton: {
    marginTop: 24,
    padding: 16,
    alignItems: 'center',
  },
  logoutText: {
    color: '#dc3545',
    fontSize: 16,
    fontWeight: '500',
  },
});