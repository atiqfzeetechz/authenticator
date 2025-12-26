import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import GoogleLogin from '@/src/googlelogin/GoogleLoginFixed';
import { useAuth } from '@/src/context/AuthContext';
import { useEffect } from 'react';

export default function LoginScreen() {
  const {isLoggedIn}=useAuth()
useEffect(()=>{
  if(isLoggedIn){
    router.replace('/')
  }
},[isLoggedIn])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="shield-checkmark" size={80} color="#1a73e8" />
        <Text style={styles.title}>Cool Authenticator</Text>
        <Text style={styles.subtitle}>Secure your accounts with 2FA</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.description}>
          Sign in to sync your accounts across devices
        </Text>
        
        <GoogleLogin />
      </View>
    </SafeAreaView>
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
    // fontWeight: 'bold',
    color: '#fff',
    marginTop: 20,
    fontFamily:"RobotoCondensed-SemiBold"
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginTop: 8,
    textAlign: 'center',
    // fontFamily:"RobotoCondensed-Light"
    fontFamily:"RobotoCondensed-Light"
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
    fontFamily:"RobotoMedium"
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