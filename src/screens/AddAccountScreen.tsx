import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Colors } from '../assets/colors';

const AddAccountScreen = ({ navigation }: any) => {
  const [issuer, setIssuer] = useState('');
  const [email, setEmail] = useState('');
  const [secret, setSecret] = useState('');

  const handleAddAccount = () => {
    if (!issuer.trim() || !email.trim() || !secret.trim()) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    // Validate secret key format
    const cleanSecret = secret.replace(/\s/g, '').toUpperCase();
    if (!/^[A-Z2-7]+=*$/.test(cleanSecret)) {
      Alert.alert('Error', 'Invalid secret key format');
      return;
    }

    Alert.alert('Success', 'Account added successfully', [
      { text: 'OK', onPress: () => navigation.goBack() }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Add Account</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <Text style={styles.label}>Service Name</Text>
          <TextInput
            style={styles.input}
            value={issuer}
            onChangeText={setIssuer}
            placeholder="e.g., appName"
            placeholderTextColor={Colors.textSecondary}
          />

          <Text style={styles.label}>Account Email</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="user@example.com"
            placeholderTextColor={Colors.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Secret Key</Text>
          <TextInput
            style={[styles.input, styles.secretInput]}
            value={secret}
            onChangeText={setSecret}
            placeholder="Enter your secret key"
            placeholderTextColor={Colors.textSecondary}
            multiline
            autoCapitalize="characters"
          />

          <TouchableOpacity style={styles.addButton} onPress={handleAddAccount}>
            <Text style={styles.addButtonText}>Add Account</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.instructions}>
          <Text style={styles.instructionTitle}>How to get your secret key:</Text>
          <Text style={styles.instructionText}>
            1. Go to your account's 2FA settings{'\n'}
            2. Choose "Set up authenticator app"{'\n'}
            3. Copy the secret key or scan QR code{'\n'}
            4. Paste the secret key above
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: Colors.primary,
  },
  backButton: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  placeholder: {
    width: 24,
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  secretInput: {
    height: 80,
    textAlignVertical: 'top',
    fontFamily: 'monospace',
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  instructions: {
    margin: 20,
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: 8,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});

export default AddAccountScreen;