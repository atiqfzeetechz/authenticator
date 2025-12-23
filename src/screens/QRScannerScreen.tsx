import React from 'react';
import {View, Text, StyleSheet, Alert, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Storage} from '../utils/Storage';
import {Account} from '../types/Account';

export default function QRScannerScreen() {
  const navigation = useNavigation();

  // Add test account for demo
  const addTestAccount = async () => {
    const testAccount: Account = {
      id: Date.now().toString(),
      name: 'Google',
      email: 'user@gmail.com',
      secret: 'JBSWY3DPEHPK3PXP', // Test secret that generates valid TOTP
      issuer: 'Google',
    };

    await Storage.saveAccount(testAccount);
    Alert.alert(
      'Success',
      'Test account added successfully!',
      [{text: 'OK', onPress: () => navigation.goBack()}]
    );
  };

  const addGitHubAccount = async () => {
    const githubAccount: Account = {
      id: (Date.now() + 1).toString(),
      name: 'GitHub',
      email: 'user@github.com',
      secret: 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ', // Another test secret
      issuer: 'GitHub',
    };

    await Storage.saveAccount(githubAccount);
    Alert.alert(
      'Success',
      'GitHub account added successfully!',
      [{text: 'OK', onPress: () => navigation.goBack()}]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Account</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.centerText}>
          QR Scanner will be added later.{"\n"}
          For now, you can add test accounts:
        </Text>

        <TouchableOpacity style={styles.buttonTouchable} onPress={addTestAccount}>
          <Text style={styles.buttonText}>Add Google Test Account</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonTouchable} onPress={addGitHubAccount}>
          <Text style={styles.buttonText}>Add GitHub Test Account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.buttonTouchable, styles.cancelButton]}
          onPress={() => navigation.goBack()}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1565C0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 10,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  centerText: {
    fontSize: 18,
    padding: 32,
    color: '#212121',
    textAlign: 'center',
    marginBottom: 40,
  },
  buttonTouchable: {
    padding: 16,
    backgroundColor: '#1565C0',
    borderRadius: 8,
    margin: 10,
    minWidth: 250,
  },
  cancelButton: {
    backgroundColor: '#424242',
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});