import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useState, useEffect } from 'react';
import OTPCard from '@/src/components/OTPCard';
import AddAccountModal from '@/src/components/AddAccountModal';
import { useAuth } from '@/src/context/AuthContext';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen() {
  const [visible, setVisible] = useState(false);
  const { accounts, codes, remaining, isLoggedIn, logout } = useAuth();

  useFocusEffect(() => {
    if (isLoggedIn === false) {
      router.replace('/login');
    } else if (isLoggedIn === true) {
      // Force re-render when logged in
      console.log('User is logged in, showing codes screen');
    }
  });

  if (isLoggedIn === false) {
    return null;
  }

  if (isLoggedIn === null) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: '#fff', fontSize: 18 }}>Loading...</Text>
      </View>
    );
  }

  const progress = 1 - (remaining / 30);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Authenticator</Text>
        <View style={styles.headerRight}>
          <Text style={styles.timer}>{remaining}s</Text>
          <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

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
            timeRemaining={remaining}
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoutBtn: {
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  logoutText: {
    color: '#fff',
    fontSize: 12,
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