// app/admin-dashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import Header from '../../../components/shared/header';
import AdminTable from '../../../components/researcher/adminTable';
import EditUserModal from '../../../components/researcher/editUserModal';
import { AdminUser } from '../../../types/users';

export default function AdminDashboardPage() {
  // State for users and UI
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  // ✅ DATABASE INTEGRATION POINT: Replace this with your API call
  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Example API call (replace with your actual endpoint):
      // const response = await fetch('https://your-api.com/admin/users');
      // const data = await response.json();
      // setUsers(data);

      // ✅ TEMPORARY PLACEHOLDER DATA
      const placeholderUsers: AdminUser[] = [
        {
          id: 'user_001',
          username: 'john_doe',
          email: 'john@example.com',
          role: 'admin',
          supervisor: 'Sarah',
          createdAt: '2024-01-15T10:30:00Z',
          lastActive: '2024-03-20T14:45:00Z',
        },
        {
          id: 'user_002',
          username: 'jane_smith',
          email: 'jane@example.com',
          role: 'user',
          supervisor: 'Mike',
          createdAt: '2024-02-01T09:15:00Z',
          lastActive: '2024-03-21T11:20:00Z',
        },
        {
          id: 'user_003',
          username: 'bob_wilson',
          email: 'bob@example.com',
          role: 'moderator',
          supervisor: 'Lisa',
          createdAt: '2024-01-20T14:20:00Z',
          lastActive: '2024-03-19T16:30:00Z',
        },
        {
          id: 'user_004',
          username: 'alice_brown',
          email: 'alice@example.com',
          role: 'user',
          supervisor: 'Tom',
          createdAt: '2024-03-01T08:45:00Z',
          lastActive: '2024-03-22T10:15:00Z',
        },
        {
          id: 'user_005',
          username: 'charlie_davis',
          email: 'charlie@example.com',
          role: 'admin',
          supervisor: 'Emma',
          createdAt: '2024-02-15T11:00:00Z',
          lastActive: '2024-03-21T09:30:00Z',
        },
      ];
      
      setUsers(placeholderUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Handle error appropriately
    } finally {
      setLoading(false);
    }
  };

  // ✅ DATABASE INTEGRATION POINT: Update user
  const handleUpdateUser = async (updatedUser: Partial<AdminUser>) => {
    try {
      // Example API call:
      // await fetch(`https://your-api.com/admin/users/${updatedUser.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updatedUser),
      // });

      // Update local state
      setUsers(users.map(user => 
        user.id === updatedUser.id ? { ...user, ...updatedUser } : user
      ));
      setEditModalVisible(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // ✅ DATABASE INTEGRATION POINT: Delete user
  const handleDeleteUser = async (userId: string) => {
    try {
      // Example API call:
      // await fetch(`https://your-api.com/admin/users/${userId}`, {
      //   method: 'DELETE',
      // });

      // Update local state
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  // Filter users based on search and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  // Statistics
  const stats = {
    totalUsers: users.length,
    admins: users.filter(u => u.role === 'admin').length,
    moderators: users.filter(u => u.role === 'moderator').length,
    regularUsers: users.filter(u => u.role === 'user').length,
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header />
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading admin dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      
      <ScrollView style={styles.content}>
        {/* Page Header */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>User Dashboard</Text>
        </View>

        {/* Statistics Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalUsers}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          <View style={[styles.statCard, styles.adminCard]}>
            <Text style={styles.statValue}>{stats.admins}</Text>
            <Text style={styles.statLabel}>Admins</Text>
          </View>
          <View style={[styles.statCard, styles.moderatorCard]}>
            <Text style={styles.statValue}>{stats.moderators}</Text>
            <Text style={styles.statLabel}>Moderators</Text>
          </View>
          <View style={[styles.statCard, styles.userCard]}>
            <Text style={styles.statValue}>{stats.regularUsers}</Text>
            <Text style={styles.statLabel}>Regular Users</Text>
          </View>
        </View>

        {/* Search and Filter Controls */}
        <View style={styles.controlsContainer}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
          
          <View style={styles.filterContainer}>
            <Text style={styles.filterLabel}>Filter by Role:</Text>
            <View style={styles.filterButtons}>
              {['all', 'admin', 'moderator', 'user'].map((role) => (
                <TouchableOpacity
                  key={role}
                  style={[
                    styles.filterButton,
                    filterRole === role && styles.filterButtonActive,
                  ]}
                  onPress={() => setFilterRole(role)}
                >
                  <Text
                    style={[
                      styles.filterButtonText,
                      filterRole === role && styles.filterButtonTextActive,
                    ]}
                  >
                    {role === 'all' ? 'All' : role.charAt(0).toUpperCase() + role.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Users Table */}
        <View style={styles.tableSection}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableTitle}>User Management</Text>
            <Text style={styles.tableSubtitle}>
              Showing {filteredUsers.length} of {users.length} users
            </Text>
          </View>
          
          <AdminTable
            users={filteredUsers}
            onEditUser={(user) => {
              setSelectedUser(user);
              setEditModalVisible(true);
            }}
            onDeleteUser={handleDeleteUser}
          />

          {/* Refresh Button */}
          <TouchableOpacity style={styles.refreshButton} onPress={fetchUsers}>
            <Text style={styles.refreshButtonText}>⟳ Refresh Users</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit User Modal */}
      <EditUserModal
        user={selectedUser}
        visible={editModalVisible}
        onSave={handleUpdateUser}
        onCancel={() => {
          setEditModalVisible(false);
          setSelectedUser(null);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6c757d',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  pageHeader: {
    marginBottom: 24,
  },
  pageTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#212529',
    fontFamily: 'Poppins-Bold',
  },
  pageSubtitle: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: 120,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  adminCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  moderatorCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#2563EB',
  },
  userCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#059669',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6c757d',
  },
  controlsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchContainer: {
    marginBottom: 16,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#212529',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#495057',
    marginRight: 12,
  },
  filterButtons: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    color: '#6c757d',
  },
  filterButtonTextActive: {
    color: 'white',
    fontWeight: '500',
  },
  tableSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
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
    color: '#212529',
  },
  tableSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 4,
  },
  refreshButton: {
    marginTop: 16,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  refreshButtonText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
});
