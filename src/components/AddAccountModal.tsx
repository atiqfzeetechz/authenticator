import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CameraScanner from './CameraScanner';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function AddAccountModal({ visible, onClose }: Props) {
  return (
    <Modal visible={visible} animationType="slide" statusBarTranslucent>
      <View style={styles.container}>
        {/* 🔝 Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={26} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.title}>Scan Code</Text>

          {/* Flash handled inside CameraScanner */}
          <View style={{ width: 26 }} />
        </View>

        {/* 📷 Camera */}
        <CameraScanner onClose={onClose}  />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },

  topBar: {
    height: 90,
    paddingTop: 48,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 10,
  },

  title: {
    color: '#fff',
    fontSize: 18,
    // fontWeight: '600',
    fontFamily:"RobotoCondensed-SemiBold"
  },
});
