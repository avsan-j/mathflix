// components/subject/SessionCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Session } from '../../types/session';

interface SessionCardProps {
  session: Session;
  onDelete: () => void;
  onToggleComplete: () => void;
}

const SessionCard: React.FC<SessionCardProps> = ({ 
  session, 
  onDelete, 
  onToggleComplete 
}) => {
  return (
    <View style={[
      styles.card,
      session.isCompleted && styles.completedCard
    ]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onToggleComplete} style={styles.checkbox}>
          <Ionicons
            name={session.isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
            size={24}
            color={session.isCompleted ? '#34C759' : '#8E8E93'}
          />
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={[
            styles.title,
            session.isCompleted && styles.completedTitle
          ]}>
            {session.title}
          </Text>
          {session.description && (
            <Text style={styles.description}>{session.description}</Text>
          )}
        </View>
        
        <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={22} color="#FF3B30" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.footer}>
        <View style={styles.durationBadge}>
          <Ionicons name="time-outline" size={14} color="#666" />
          <Text style={styles.durationText}>
            {session.duration} min
          </Text>
        </View>
        
        <Text style={styles.dateText}>
          {new Date(session.date).toLocaleDateString()}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completedCard: {
    backgroundColor: '#F8F9FA',
    opacity: 0.9,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  checkbox: {
    marginRight: 12,
    padding: 2,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#8E8E93',
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    padding: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 12,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  durationText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#8E8E93',
  },
});

export default SessionCard;