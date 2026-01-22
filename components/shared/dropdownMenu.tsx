// components/shared/Dropdown.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DropdownItem {
  label: string;
  onPress: () => void;
  isDestructive?: boolean;
}

interface DropdownProps {
  items: DropdownItem[];
  position?: 'left' | 'right';
}

const Dropdown: React.FC<DropdownProps> = ({ items = [], position = 'right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  console.log('✅ Dropdown component IS rendering');

  return (
    <View style={styles.dropdownContainer}>
      {/* Hamburger Button */}
      <TouchableOpacity
        style={styles.iconButton}
        onPress={() => setIsOpen(true)}
      >
        <Ionicons name="menu" size={27} color="#333" />
      </TouchableOpacity>

      {/* Modal Dropdown */}
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={[
            styles.dropdownMenu,
            position === 'left' ? { left: 15 } : { right: 15 }
          ]}>
            {items.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  index < items.length - 1 && styles.menuItemBorder
                ]}
                onPress={() => {
                  setIsOpen(false);
                  item.onPress();
                }}
              >
                <Text style={[
                  styles.menuItemText,
                  item.isDestructive && styles.destructiveText
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </ View>
  );
};

const styles = StyleSheet.create({
  dropdownContainer: {
    zIndex: 1001,
  },

  iconButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 1002,
  },
  dropdownMenu: {
    position: 'absolute',
    top: 70,
    left: 15,
    backgroundColor: 'white',
    borderRadius: 12,
    maxWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 50,
    zIndex: 1003,
  },
  menuItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
  destructiveText: {
    color: '#dc3545',
    fontWeight: '500',
  },
});

export default Dropdown;