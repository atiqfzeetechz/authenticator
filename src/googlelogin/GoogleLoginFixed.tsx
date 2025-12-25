import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native'
import React from 'react'
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

export default function GoogleLoginFixed() {
  const { login, isLoggedIn } = useAuth();

  if (isLoggedIn) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successIconContainer}>
          <Text style={styles.successIcon}>✓</Text>
        </View>
        <Text style={styles.successTitle}>Login Successful!</Text>
        <Text style={styles.successSubtitle}>You are now logged in with Google</Text>
        <View style={styles.successBadge}>
          <Text style={styles.successBadgeText}>ACTIVE SESSION</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Custom Styled Button Alternative */}
      <TouchableOpacity 
        style={styles.customButton}
        onPress={login}
        activeOpacity={0.8}
      >
        <View style={styles.googleIconContainer}>
          <Text style={styles.googleIcon}>G</Text>
        </View>
        <Text style={styles.buttonText}>Continue with Google</Text>
      </TouchableOpacity>
      
      {/* OR use the default GoogleSigninButton with better styling */}
      {/* 
      <GoogleSigninButton
        style={styles.googleButton}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={login}
      />
      */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  
  // Custom Button Styles
  customButton: {
    width: width - 100,
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 10,
  },
  
  googleIconContainer: {
    width: 36,
    height: 36,
    backgroundColor: '#4285F4',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  
  googleIcon: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3C4043',
    letterSpacing: 0.3,
  },
  
  // GoogleSigninButton Custom Styles
  googleButton: {
    width: width - 40,
    height: 56,
    borderRadius: 12,
    alignSelf: 'center',
    marginVertical: 10,
  },
  
  // Success State Styles
  successContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#B8E1FF',
    marginHorizontal: 20,
  },
  
  successIconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#10B981',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#10B981',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  
  successIcon: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: 'bold',
  },
  
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'center',
  },
  
  successSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  
  successBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  
  successBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
    letterSpacing: 0.5,
  },
});