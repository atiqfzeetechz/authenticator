import { View, FlatList, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import OTPCard from '@/src/components/OTPCard';
import AddAccountModal from '@/src/components/AddAccountModal';
import DeleteModal from '@/src/components/DeleteModal';
import { useAuth } from '@/src/context/AuthContext';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { deletCode, getAllCodes } from '@/src/api/apiCall';
import useNetwork from './../src/hooks/useNetwork'

export default function HomeScreen() {
  const [visible, setVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const { accounts, codes, remaining, isLoggedIn, user, removeAccount } = useAuth();
  const isOnline = useNetwork();

  const handleDelete = (item: any) => {
    setItemToDelete(item);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      if (isOnline) {
        const res = await deletCode(itemToDelete.secret)
        console.log(res)
        if (res.status) {
          removeAccount(itemToDelete.id);
          setDeleteModalVisible(false);
          setItemToDelete(null);

        }
      } else {
        removeAccount(itemToDelete.id);
        setDeleteModalVisible(false);
        setItemToDelete(null);
      }

      // console.log(itemToDelete)
    }
  };

  const renderRightActions = (item: any) => (
    <TouchableOpacity
      style={styles.deleteButton}
      onPress={() => handleDelete(item)}
    >
      <Ionicons name="trash" size={24} color="#fff" />
    </TouchableOpacity>
  );

  useEffect(() => {
    (async () => {
      const res = await getAllCodes()
      console.log(res)
    })()
  }, [])

  useFocusEffect(() => {
    if (isLoggedIn === false) {
      router.replace('/login');
    } else if (isLoggedIn === true) {
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
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cool Authenticator</Text>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => router.push('/profile')}
        >
          <Image
            source={{ uri: user?.photoURL || 'https://via.placeholder.com/40' }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
      </View>

      <FlatList
        data={accounts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Swipeable renderRightActions={() => renderRightActions(item)}>
            <OTPCard
              issuer={item.name}
              account={item.email || item.issuer || ''}
              code={codes[item.id] || '------'}
              timeRemaining={remaining}
            />
          </Swipeable>
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

      <DeleteModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={confirmDelete}
        accountName={itemToDelete?.name || ''}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 6,
  },
  headerTitle: {
    fontSize: 24,
    // fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'RobotoCondensed-SemiBold',
  },
  profileButton: {
    padding: 2,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#1a73e8',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 10,
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
    fontFamily: 'RobotoCondensed-Medium',
  },
  emptySubtext: {
    color: '#444',
    fontSize: 14,
    fontFamily: 'RobotoCondensed-Regular',
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
  deleteButton: {
    backgroundColor: '#dc3545',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginBottom: 16,
    borderRadius: 12,
  },
});