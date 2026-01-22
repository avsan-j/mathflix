// components/shared/Header.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import Dropdown from '../shared/dropdownMenu';

const Header: React.FC = () => {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const [localLoading, setLocalLoading] = useState(true);

  // Delay showing header until auth state is stable
  useEffect(() => {
    const timer = setTimeout(() => {
      setLocalLoading(false);
    }, 100); // Small delay to prevent flash
    
    return () => clearTimeout(timer);
  }, []);

  // Get dropdown items based on user role
  const getDropdownItems = () => {
    if (!user) {
      return [];
    }

    const commonItems = [
      { 
        label: 'Profile', 
        onPress: () => { router.push(`/${user.role}/profile` as any); } 
      },
      { 
        label: 'Logout', 
        onPress: () => { logout(); },
        isDestructive: true 
      },
    ];

    if (user.role === 'researcher') {
      return [
        { 
          label: 'Dashboard', 
          onPress: () => { router.push('/researcher/admin-dashboard' as any); } 
        },
        {
          label: 'Users',
          onPress: () => { router.push('/researcher/users' as any); }
        },
        ...commonItems
      ];
    }

    if (user.role === 'parent') {
      return [
      { 
        label: 'Dashboard', 
        onPress: () => { router.push('/subject-user/parent-dashboard' as any); } 
      },
      ...commonItems
      ];
    }

    if (user.role === 'child') {
      return [
      { 
        label: 'Dashboard', 
        onPress: () => { router.push('/subject-user/child-dashboard' as any); } 
      },
      ...commonItems
      ];
    }

    return [];
  };

  const dropdownItems = getDropdownItems();
  
  // Show loading indicator while auth state is loading
  if (isLoading || localLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <ActivityIndicator size="small" color="#333" />
        </View>
      </View>
    );
  }

  // Only show dropdown if user exists
  const showDropdown = !!user;

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1}>
          {'MathFlix'}
        </Text>
      </View>
      
      <View style={styles.rightSection}>
        {showDropdown ? (
          <Dropdown items={dropdownItems} />
        ) : (
          <View style={styles.placeholder} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    height: 60,
    width: '100%',
  },
  loadingContainer: {
    height: 60,
    width: '100%',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  loadingContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
  },
  titleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingHorizontal: 50,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  rightSection: {
    zIndex: 1000,
    marginRight: 'auto',
  },
  placeholder: {
    width: 44,
    height: 44,
  },
});

export default Header;