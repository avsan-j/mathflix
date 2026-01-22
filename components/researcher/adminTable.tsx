// components/AdminTable.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { AdminUser } from '../../types/users';

interface AdminTableProps {
  users: AdminUser[];
  onEditUser: (user: AdminUser) => void;
  onDeleteUser: (userId: string) => void;
}

const AdminTable: React.FC<AdminTableProps> = ({ users, onEditUser, onDeleteUser }) => {
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [actionModalVisible, setActionModalVisible] = useState(false);

  const handleAction = (user: AdminUser, action: 'edit' | 'delete') => {
    if (action === 'edit') {
      onEditUser(user);
    } else {
      setSelectedUser(user);
      setActionModalVisible(true);
    }
  };

  const confirmDelete = () => {
    if (selectedUser) {
      onDeleteUser(selectedUser.id);
      setActionModalVisible(false);
      setSelectedUser(null);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#DC2626';
      case 'moderator': return '#2563EB';
      case 'user': return '#059669';
      default: return '#6B7280';
    }
  };

  return (
    <>
      <ScrollView horizontal style={styles.tableContainer}>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, { width: 80 }]}>ID</Text>
            <Text style={[styles.headerCell, { width: 120 }]}>Username</Text>
            <Text style={[styles.headerCell, { width: 160 }]}>Email</Text>
            <Text style={[styles.headerCell, { width: 100 }]}>Role</Text>
            <Text style={[styles.headerCell, { width: 120 }]}>Supervisor</Text>
            <Text style={[styles.headerCell, { width: 120 }]}>Created</Text>
            <Text style={[styles.headerCell, { width: 120 }]}>Last Active</Text>
            <Text style={[styles.headerCell, { width: 150 }]}>Actions</Text>
          </View>

          {/* Table Rows */}
          {users.map((user) => (
            <View key={user.id} style={styles.tableRow}>
              <Text style={[styles.bodyCell, { width: 80 }]}>{user.id.substring(0, 6)}...</Text>
              <Text style={[styles.bodyCell, { width: 120 }]}>{user.username}</Text>
              <Text style={[styles.bodyCell, { width: 160 }]}>{user.email}</Text>
              <View style={[styles.roleCell, { width: 100 }]}>
                <Text style={[styles.roleText, { color: getRoleColor(user.role) }]}>
                  {user.role.toUpperCase()}
                </Text>
              </View>
              <Text style={[styles.bodyCell, { width: 120 }]}>{user.supervisor}</Text>
              <Text style={[styles.bodyCell, { width: 120 }]}>{formatDate(user.createdAt)}</Text>
              <Text style={[styles.bodyCell, { width: 120 }]}>{formatDate(user.lastActive)}</Text>
              <View style={[styles.actionCell, { width: 150 }]}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => handleAction(user, 'edit')}
                >
                  <Text style={styles.actionButtonText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleAction(user, 'delete')}
                >
                  <Text style={styles.actionButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={actionModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setActionModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Delete</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete user "{selectedUser?.username}"?
              This action cannot be undone.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setActionModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmDelete}
              >
                <Text style={styles.confirmButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

// Helper function
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const styles = StyleSheet.create({
  tableContainer: {
    flex: 1,
    marginTop: 16,
  },
  table: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 12,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingVertical: 12,
  },
  headerCell: {
    paddingHorizontal: 12,
    fontWeight: '600',
    color: '#374151',
    fontSize: 14,
  },
  bodyCell: {
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#4B5563',
  },
  roleCell: {
    paddingHorizontal: 5,
    justifyContent: 'center',
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: '#F3F4F6',
  },
  actionCell: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    minWidth: 60,
  },
  editButton: {
    backgroundColor: '#3B82F6',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    minWidth: 80,
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  confirmButton: {
    backgroundColor: '#EF4444',
  },
  cancelButtonText: {
    color: '#374151',
    fontWeight: '500',
    textAlign: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: '500',
    textAlign: 'center',
  },
});

export default AdminTable;