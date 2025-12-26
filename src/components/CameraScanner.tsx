import {
  CameraView,
  CameraType,
  useCameraPermissions,
  BarcodeScanningResult,
} from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { parseOtpAuth } from '@/src/utils/parseOtpAuth';
import { useAuth } from '@/src/context/AuthContext';
import uuid from 'react-native-uuid';
import { addCodesApi } from '../api/apiCall';

export default function CameraScanner({ onClose }: any) {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  // ✅ CONTEXT YAHAN AAYEGA
  const { addAccount } = useAuth();

  if (!permission) return <View />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need camera permission to scan QR code
        </Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }

  // ✅ YAHIN PAR TUMHARA PEHLE WALA CODE AAYEGA
  const handleBarCodeScanned = async (result: BarcodeScanningResult) => {
    if (scanned) return;
    setScanned(true);

    try {
      const { name, secret } = parseOtpAuth(result.data);
      const addAcooutApiRes = await addCodesApi(name, secret)
      if (!addAcooutApiRes?.success) {
        return
      }

      addAccount({
        id: addAcooutApiRes.data?.id,
        name,
        secret,
      });

      onClose?.(); // modal close
    } catch (err) {
      alert('Invalid QR Code');
      setScanned(false);
    }
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}

      />

      {/* 🔳 Focus Box */}
      <View style={styles.overlay}>
        <View style={styles.scanBox} />
      </View>

      {/* Flip Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Flip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: '#fff',
  },
  camera: {
    flex: 1,
  },

  /* Overlay */
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanBox: {
    width: 260,
    height: 260,
    borderWidth: 2,
    borderColor: '#1a73e8',
    borderRadius: 16,
    backgroundColor: 'transparent',
  },

  /* Buttons */
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#1a73e8',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
});
