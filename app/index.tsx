import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import OTPCard from '@/src/components/OTPCard';
import AddAccountModal from '@/src/components/AddAccountModal';
import { useAuth } from '@/src/context/AuthContext';
import { generateTOTP, getTimeRemaining } from '@/src/utils/totp';
import { router } from 'expo-router';

export default function HomeScreen() {
  const [visible, setVisible] = useState(false);
  const [codes, setCodes] = useState<{ [id: string]: string }>({});
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining());
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const { accounts } = useAuth();

  // Check login status
  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const user = await AsyncStorage.getItem('user');
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        router.replace('/login');
        return;
      }
    } catch (error) {
      setIsLoggedIn(false);
      router.replace('/login');
      return;
    }
  };

  // Show loading while checking login
  if (isLoggedIn === null || isLoggedIn === false) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#fff', fontSize: 18 }}>Loading...</Text>
      </View>
    );
  }

  // 🔁 Update time remaining every second
  useEffect(() => {
    if (isLoggedIn !== true) return;
    
    const interval = setInterval(() => {
      const remaining = getTimeRemaining();
      setTimeRemaining(remaining);
      
      // Regenerate OTP when time resets (every 30 seconds)
      if (remaining === 30) {
        updateAllCodes();
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [accounts, isLoggedIn]);

  // 🔁 Update all OTP codes
  const updateAllCodes = useCallback(async () => {
    if (isLoggedIn !== true) return;
    
    const newCodes: { [id: string]: string } = {};
    
    for (const acc of accounts) {
      try {
        const code = generateTOTP(acc.secret);
        newCodes[acc.id] = code;
      } catch (error) {
        console.error(`Error generating OTP for ${acc.name}:`, error);
        newCodes[acc.id] = '------';
      }
    }
    
    setCodes(newCodes);
  }, [accounts, isLoggedIn]);

  // 🔁 Initial and account change update
  useEffect(() => {
    if (isLoggedIn === true) {
      updateAllCodes();
    }
  }, [updateAllCodes, isLoggedIn]);

  // Calculate progress for progress bar (0 to 1)
  const progress = 1 - (timeRemaining / 30);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Authenticator</Text>
        <Text style={styles.timer}>{timeRemaining}s</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
      </View>

      <FlatList
        data={accounts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <OTPCard 
            issuer={item.name}
            account={item.email || item.issuer || ''}
            code={codes[item.id] || '------'}
            timeRemaining={timeRemaining}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No accounts added</Text>
            <Text style={styles.emptySubtext}>
              Tap the + button to add your first account
            </Text>
          </View>
        }
      />

      <TouchableOpacity 
        style={styles.fab} 
        onPress={() => setVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.plus}>＋</Text>
      </TouchableOpacity>

      <AddAccountModal 
        visible={visible} 
        onClose={() => setVisible(false)} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#000',
    paddingTop: 50,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  timer: {
    fontSize: 18,
    color: '#1a73e8',
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 2,
    backgroundColor: '#333',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#1a73e8',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    color: '#666',
    fontSize: 18,
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#444',
    fontSize: 14,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    backgroundColor: '#1a73e8',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  plus: {
    color: '#fff',
    fontSize: 32,
    lineHeight: 36,
    marginTop: -2,
  },
});