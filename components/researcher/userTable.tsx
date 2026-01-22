import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

interface User {
  id: number;
  name: string;
  manager: string;
  screenTime: string;
  averageScore: number;
  level: number;
  testTime: string;
}

interface UserTableProps {
  users: User[];
}

const UserTable: React.FC<UserTableProps> = ({ users }) => {
  return (
    <ScrollView horizontal style={styles.container}>
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell, styles.cell, { width: 80 }]}>Name</Text>
          <Text style={[styles.headerCell, styles.cell, { width: 100 }]}>Manager</Text>
          <Text style={[styles.headerCell, styles.cell, { width: 90 }]}>Screen Time</Text>
          <Text style={[styles.headerCell, styles.cell, { width: 100 }]}>Avg Score</Text>
          <Text style={[styles.headerCell, styles.cell, { width: 70 }]}>Level</Text>
          <Text style={[styles.headerCell, styles.cell, { width: 100 }]}>Test Time</Text>
        </View>

        {/* Table Rows */}
        {users.map((user) => (
          <View key={user.id} style={styles.tableRow}>
            <Text style={[styles.bodyCell, styles.cell, { width: 80 }]}>{user.name}</Text>
            <Text style={[styles.bodyCell, styles.cell, { width: 100 }]}>{user.manager}</Text>
            <Text style={[styles.bodyCell, styles.cell, { width: 90 }]}>{user.screenTime}</Text>
            <View style={[styles.scoreCell, styles.cell, { width: 100 }]}>
              <Text style={[
                styles.scoreText,
                { color: user.averageScore >= 80 ? '#4CAF50' : user.averageScore >= 60 ? '#FF9800' : '#F44336' }
              ]}>
                {user.averageScore}%
              </Text>
            </View>
            <View style={[styles.levelCell, styles.cell, { width: 70 }]}>
              <Text style={styles.levelText}>Lvl {user.level}</Text>
            </View>
            <Text style={[styles.bodyCell, styles.cell, { width: 100 }]}>{user.testTime}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    marginHorizontal: 16,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 12,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 12,
  },
  cell: {
    paddingHorizontal: 12,
    textAlign: 'left',
  },
  headerCell: {
    fontWeight: '600',
    color: '#333',
    fontSize: 14,
  },
  bodyCell: {
    fontSize: 14,
    color: '#666',
  },
  scoreCell: {
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '500',
  },
  levelCell: {
    backgroundColor: '#E3F2FD',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1976D2',
  },
});

export default UserTable;