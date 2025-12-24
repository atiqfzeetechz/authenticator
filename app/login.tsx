import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GoogleLogin from '@/src/googlelogin/GoogleLogin';

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="shield-checkmark" size={80} color="#1a73e8" />
        <Text style={styles.title}>Authenticator</Text>
        <Text style={styles.subtitle}>Secure your accounts with 2FA</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Sign in to sync your accounts across devices
        </Text>
        
        <GoogleLogin />
        
        <TouchableOpacity style={styles.skipButton}>
          <Text style={styles.skipText}>Continue without login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 20,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  description: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 24,
  },
  skipButton: {
    marginTop: 20,
    padding: 16,
    alignItems: 'center',
  },
  skipText: {
    color: '#888',
    fontSize: 16,
  },
});