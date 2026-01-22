// app/(auth)/login.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Toggle between login/register
  const [registerData, setRegisterData] = useState({
    email: '',
    name: '',
    role: 'parent' as 'researcher' | 'parent' | 'child',
  });
  
  const router = useRouter();
  const { login, register, isLoading } = useAuth();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const result = await login({ username, password });
    
    if (result.success) {
      // Navigation will be handled by RootLayout based on user role
      // We'll implement this after login
      Alert.alert('Success', 'Login successful!');
    } else {
      Alert.alert('Login Failed', result.error || 'Invalid credentials');
    }
  };

  const handleRegister = async () => {
    const { email, name, role } = registerData;
    
    if (!username.trim() || !password.trim() || !email.trim() || !name.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    const result = await register({
      username,
      password,
      email,
      name,
      role,
    });

    if (result.success) {
      Alert.alert('Success', 'Account created successfully!');
      setIsLogin(true); // Switch back to login
      setUsername('');
      setPassword('');
      setRegisterData({ email: '', name: '', role: 'researcher' });
    } else {
      Alert.alert('Registration Failed', result.error || 'Could not create account');
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setUsername('');
    setPassword('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>Mathflix</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </Text>
            
            <Text style={styles.description}>
              {isLogin 
                ? 'Sign in to continue your research journey' 
                : 'Join our research platform as a researcher or participant'}
            </Text>

            {/* Username Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                value={username}
                onChangeText={setUsername}
                placeholder="Enter your username"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>

            {/* Password Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                editable={!isLoading}
              />
            </View>

            {/* Registration Additional Fields */}
            {!isLogin && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    style={styles.input}
                    value={registerData.email}
                    onChangeText={(text) => setRegisterData({ ...registerData, email: text })}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!isLoading}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Full Name</Text>
                  <TextInput
                    style={styles.input}
                    value={registerData.name}
                    onChangeText={(text) => setRegisterData({ ...registerData, name: text })}
                    placeholder="Enter your full name"
                    editable={!isLoading}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Account Type</Text>
                  <View style={styles.roleButtons}>
                    <TouchableOpacity
                      style={[
                        styles.roleButton,
                        registerData.role === 'parent' && styles.roleButtonActive,
                      ]}
                      onPress={() => setRegisterData({ ...registerData, role: 'parent' })}
                      disabled={isLoading}
                    >
                      <Text style={[
                        styles.roleButtonText,
                        registerData.role === 'parent' && styles.roleButtonTextActive,
                      ]}>
                        Parent
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.roleButton,
                        registerData.role === 'researcher' && styles.roleButtonActive,
                      ]}
                      onPress={() => setRegisterData({ ...registerData, role: 'researcher' })}
                      disabled={isLoading}
                    >
                      <Text style={[
                        styles.roleButtonText,
                        registerData.role === 'researcher' && styles.roleButtonTextActive,
                      ]}>
                        Researcher
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.roleButton,
                        registerData.role === 'child' && styles.roleButtonActive,
                      ]}
                      onPress={() => setRegisterData({ ...registerData, role: 'child' })}
                      disabled={isLoading}
                    >
                      <Text style={[
                        styles.roleButtonText,
                        registerData.role === 'child' && styles.roleButtonTextActive,
                      ]}>
                        Child
                      </Text>
                    </TouchableOpacity>
                    
                  </View>
                </View>
              </>
            )}

            {/* Login/Register Button */}
            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={isLogin ? handleLogin : handleRegister}
              disabled={isLoading}
            >
              <Text style={styles.submitButtonText}>
                {isLoading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            {/* Demo Credentials */}
            {isLogin && (
              <View style={styles.demoContainer}>
                <Text style={styles.demoTitle}>Demo Credentials:</Text>
                <Text style={styles.demoText}>Researcher: researcher / password123</Text>
                <Text style={styles.demoText}>Parent: parent / parent123</Text>
                <Text style={styles.demoText}>Child: child / child123</Text>
              </View>
            )}

            {/* Toggle Link */}
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={toggleMode}
              disabled={isLoading}
            >
              <Text style={styles.toggleText}>
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : 'Already have an account? Sign in'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Poppins-Bold',
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 4,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
    fontFamily: 'Poppins-Bold',
  },
  description: {
    fontSize: 16,
    color: '#6c757d',
    marginBottom: 24,
    lineHeight: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#495057',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#212529',
    backgroundColor: '#f8f9fa',
  },
  roleButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#dee2e6',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  roleButtonActive: {
    backgroundColor: '#333',
    borderColor: '#333',
  },
  roleButtonText: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '500',
  },
  roleButtonTextActive: {
    color: 'white',
  },
  submitButton: {
    backgroundColor: '#333',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  submitButtonDisabled: {
    backgroundColor: '#6c757d',
    opacity: 0.7,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  demoContainer: {
    backgroundColor: '#e7f5ff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0056b3',
    marginBottom: 8,
  },
  demoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  toggleButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  toggleText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
});