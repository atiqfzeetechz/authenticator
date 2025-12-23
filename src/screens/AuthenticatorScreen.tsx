import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import AccountCard from '../components/AccountCard';
import {Account} from '../types/Account';
import {Storage} from '../utils/Storage';

const AuthenticatorScreen = ({navigation}: any) => {
  const [accounts, setAccounts] = useState<Account[]>([]);

  const loadAccounts = async () => {
    try {
      const savedAccounts = await Storage.getAccounts();
      setAccounts(savedAccounts);
    } catch (error) {
      console.error('Error loading accounts:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadAccounts();
    }, [])
  );

  const handleDeleteAccount = (id: string) => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete this account?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await Storage.deleteAccount(id);
            await loadAccounts();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Authenticator</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('QRScanner')}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {accounts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No accounts added yet</Text>
          <Text style={styles.emptySubText}>Tap + to add account</Text>
        </View>
      ) : (
        <FlatList
          data={accounts}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <AccountCard
              account={item}
              onDelete={() => handleDeleteAccount(item.id)}
            />
          )}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1565C0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#212121',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
  },
});

export default AuthenticatorScreen;