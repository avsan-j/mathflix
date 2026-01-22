// components/subject/AddSessionModal.tsx
import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SessionInput } from '../../types/session';

interface AddSessionModalProps {
  visible: boolean;
  onClose: () => void;
  onAddSession: (session: SessionInput) => void;
}

const AddSessionModal: React.FC<AddSessionModalProps> = ({
  visible,
  onClose,
  onAddSession,
}) => {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!title.trim() || !duration.trim()) {
      alert('Please fill in title and duration');
      return;
    }

    const durationNumber = parseInt(duration, 10);
    if (isNaN(durationNumber) || durationNumber <= 0) {
      alert('Please enter a valid duration (minutes)');
      return;
    }

    onAddSession({
      title: title.trim(),
      duration: durationNumber,
      description: description.trim() || undefined,
    });

    // Reset form
    setTitle('');
    setDuration('');
    setDescription('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        />
        
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Add New Study Session</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Session Title *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Math Chapter 5 Review"
                value={title}
                onChangeText={setTitle}
                maxLength={100}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Duration (minutes) *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., 45"
                value={duration}
                onChangeText={setDuration}
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description (optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="What will you study?"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.addButton]}
                onPress={handleSubmit}
              >
                <Ionicons name="add" size={20} color="white" />
                <Text style={styles.addButtonText}>Add Session</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  textArea: {
    minHeight: 80,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 0.48,
  },
  cancelButton: {
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  addButton: {
    backgroundColor: '#007AFF',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
    marginLeft: 8,
  },
});

export default AddSessionModal;