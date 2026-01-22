import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    // Main header container - provides positioning context
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#ffffff',
    // CRITICAL: This creates positioning context for dropdown
    position: 'relative',
    minHeight: 60,
    // Ensure no clipping
    overflow: 'visible',
  },
  
  // Wrapper for dropdown positioning
  dropdownWrapper: {
    // Position dropdown absolutely within headerContainer
    position: 'absolute',
    left: 16,
    top: 12,
    zIndex: 1000, // Higher than everything in header
  },
  
  // Title in center
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    flex: 1, // Takes available space, centers between left/right
    fontFamily: 'Poppins-Bold',
    zIndex: 1, // Lower than dropdown
  },
  
  // Right spacer for balance
  rightSpacer: {
    width: 45,
    zIndex: 1, // Lower than dropdown
  },
});

export default styles;