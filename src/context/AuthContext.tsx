import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateTOTP } from '@/src/utils/totp';
import { signOut } from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import { loginwithGoogleApi, getAllCodes, addCodesApi, deletCode } from '../api/apiCall';
import useNetwork from '@/src/hooks/useNetwork';

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [allUserAccounts, setAllUserAccounts] = useState<any>({});
  const [accounts, setAccounts] = useState<any[]>([]);
  const [codes, setCodes] = useState<Record<string, string>>({});
  const [remaining, setRemaining] = useState(30);
  const [isSynced, setIsSynced] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<any[]>([]);
  const {isOnline} = useNetwork();

  // Auth state listener
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '902277332692-n3knqqcjhi2nbvp8i8bqpcov1k9vfr6h.apps.googleusercontent.com',
      offlineAccess: true,
    });

    const unsubscribe = auth().onAuthStateChanged((user) => {
      setUser(user);
      setIsLoggedIn(!!user);
    });
    return unsubscribe;
  }, []);


  // console.log(accounts)
  console.log(pendingChanges)

  const login = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const data = await GoogleSignin.signIn();
      const idToken = data?.data?.idToken;
      const isValid = await loginwithGoogleApi(idToken)

      if (isValid?.success) {
        const token = AsyncStorage.setItem('jwt_token', isValid?.token)
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        await auth().signInWithCredential(googleCredential);

      }

      // Navigation will happen automatically via auth state change
    } catch (error) {
      console.log('Login Error:', error);
    }
  };

  const logout = async () => {
    try {
      await GoogleSignin.signOut();
      await signOut(auth());
      router.replace('/login');
    } catch (error) {
      console.log('Logout Error:', error);
      // Force logout even if there's an error
      setUser(null);
      setIsLoggedIn(false);
      router.replace('/login');
    }
  };

  // Load accounts and sync with server
  useEffect(() => {
    if (isLoggedIn && user?.email) {
      console.log(user.email)
      loadAllUserAccounts();
      if (isOnline) {
        syncWithServer();
      }
    }
  }, [isLoggedIn, user?.email, isOnline]);

  // Sync pending changes when coming online
  useEffect(() => {
    if (isOnline && pendingChanges.length > 0) {
      syncPendingChanges();
    }
  }, [isOnline, pendingChanges]);

  const loadAllUserAccounts = async () => {
    try {
      const stored = await AsyncStorage.getItem('allUserAccounts');
      const syncStatus = await AsyncStorage.getItem('syncStatus');
      const pending = await AsyncStorage.getItem('pendingChanges');

      if (stored) {
        const allAccounts = JSON.parse(stored);
        setAllUserAccounts(allAccounts);
        if (user?.email && allAccounts[user.email]) {
          setAccounts(allAccounts[user.email]);
        }
      }

      if (pending) {
        setPendingChanges(JSON.parse(pending));
      }

      setIsSynced(syncStatus === 'true');
    } catch (error) {
      console.log('Error loading accounts:', error);
    }
  };

  const syncWithServer = async () => {
    try {
      // First sync pending changes to server
      if (pendingChanges.length > 0) {
        await syncPendingChanges();
      }

      // Then pull latest from server
      const res = await getAllCodes();
      if (res?.success && res?.data?.authenticators) {
        const serverAccounts = res.data.authenticators.map((auth: any, index: number) => ({
          id: auth.id || `server_${Date.now()}_${index}`,
          name: auth.appName || auth.name,
          secret: auth.secretKey || auth.secret,
          email: res.data.email
        }));

        const userEmail = user?.email || res.data.email;
        const updatedAllAccounts = {
          ...allUserAccounts,
          [userEmail]: serverAccounts
        };

        setAllUserAccounts(updatedAllAccounts);
        setAccounts(serverAccounts);

        await AsyncStorage.setItem('allUserAccounts', JSON.stringify(updatedAllAccounts));
        await AsyncStorage.setItem('syncStatus', 'true');
        setIsSynced(true);
      }
    } catch (error) {
      console.log('Sync failed:', error);
      setIsSynced(false);
    }
  };

  const syncPendingChanges = async () => {
    if (pendingChanges.length === 0) return;
    
    // Optimize: Cancel out ADD/DELETE pairs for same secret
    const optimizedChanges = pendingChanges.reduce((acc: any[], change) => {
      const oppositeType = change.type === 'ADD' ? 'DELETE' : 'ADD';
      const existingOpposite = acc.findIndex(c => 
        c.type === oppositeType && c.data.secret === change.data.secret
      );
      
      if (existingOpposite !== -1) {
        acc.splice(existingOpposite, 1); // Remove opposite
      } else {
        acc.push(change); // Add current
      }
      return acc;
    }, []);
    
    const successfulChanges: any[] = [];
    
    try {
      for (const change of optimizedChanges) {
        try {
          if (change.type === 'ADD') {
            await addCodesApi(change.data.name, change.data.secret);
          } else if (change.type === 'DELETE') {
            await deletCode(change.data.secret);
          }
          successfulChanges.push(change);
        } catch (error: any) {
          console.log(`Failed to sync ${change.type}:`, error);
          
          // Treat 404 as success for DELETE (already deleted)
          if (change.type === 'DELETE' && error?.response?.status === 404) {
            console.log('DELETE: Item already deleted on server');
            successfulChanges.push(change);
          }
          // Treat 409/400 as success for ADD (already exists)
          else if (change.type === 'ADD' && (error?.response?.status === 409 || error?.response?.status === 400)) {
            console.log('ADD: Item already exists on server');
            successfulChanges.push(change);
          }
        }
      }
      
      // Update pending with remaining changes
      const remainingChanges = optimizedChanges.filter(change => 
        !successfulChanges.some(success => 
          success.type === change.type && 
          success.data.secret === change.data.secret
        )
      );
      
      setPendingChanges(remainingChanges);
      
      if (remainingChanges.length === 0) {
        await AsyncStorage.removeItem('pendingChanges');
      } else {
        await AsyncStorage.setItem('pendingChanges', JSON.stringify(remainingChanges));
      }
    } catch (error) {
      console.log('Sync pending changes failed:', error);
    }
  };

  const addToPendingChanges = async (change: any) => {
    const updated = [...pendingChanges, change];
    setPendingChanges(updated);
    await AsyncStorage.setItem('pendingChanges', JSON.stringify(updated));
  };

  // 🔁 OTP regeneration every second
  useEffect(() => {
    const interval = setInterval(async () => {
      const epoch = Math.floor(Date.now() / 1000);
      setRemaining(30 - (epoch % 30));

      const newCodes: any = {};
      for (const acc of accounts) {
        try {
          newCodes[acc.id] = await generateTOTP(acc.secret);
        } catch {
          newCodes[acc.id] = '------';
        }
      }
      setCodes(newCodes);
    }, 1000);

    return () => clearInterval(interval);
  }, [accounts]);

  // 🔁 Add new account
  const addAccount = async (acc: any) => {
    if (!user?.email) return;

    const userEmail = user.email;
    let name = acc.name;
    const currentUserAccounts = allUserAccounts[userEmail] || [];
    const sameSecrets = currentUserAccounts.filter((a: any) => a.secret === acc.secret);

    if (sameSecrets.length > 0) {
      const count = sameSecrets.length + 1;
      name = `${acc.name} (${count})`;
    }

    const newAcc = { ...acc, name, id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}` };
    const updatedUserAccounts = [...currentUserAccounts, newAcc];

    // Update allUserAccounts structure
    const updatedAllAccounts = {
      ...allUserAccounts,
      [userEmail]: updatedUserAccounts
    };

    setAllUserAccounts(updatedAllAccounts);
    setAccounts(updatedUserAccounts);
    await AsyncStorage.setItem('allUserAccounts', JSON.stringify(updatedAllAccounts));

    console.log('Adding account, isOnline:', isOnline);
    
    // Always add to pending first
    await addToPendingChanges({ type: 'ADD', data: newAcc });
    
    // Try server only if online
    if (isOnline) {
      try {
        console.log('Trying server ADD...');
        await addCodesApi(newAcc.name, newAcc.secret);
        console.log('Server ADD successful, removing from pending');
        
        // Get fresh pending changes and remove this one
        const currentPending = await AsyncStorage.getItem('pendingChanges');
        const parsedPending = currentPending ? JSON.parse(currentPending) : [];
        const updated = parsedPending.filter((change: any) => 
          !(change.type === 'ADD' && change.data.secret === newAcc.secret)
        );
        
        setPendingChanges(updated);
        if (updated.length === 0) {
          await AsyncStorage.removeItem('pendingChanges');
        } else {
          await AsyncStorage.setItem('pendingChanges', JSON.stringify(updated));
        }
      } catch (error) {
        console.log('Add failed, will sync later');
      }
    } else {
      console.log('Offline - added to pending only');
    }
  };

  // 🔁 Clear all accounts
  const clearAccounts = async () => {
    if (!user?.email) return;

    const userEmail = user.email;
    const updatedAllAccounts = {
      ...allUserAccounts,
      [userEmail]: []
    };

    setAllUserAccounts(updatedAllAccounts);
    setAccounts([]);
    setCodes({});
    await AsyncStorage.setItem('allUserAccounts', JSON.stringify(updatedAllAccounts));
  };

  // Switch user accounts
  const switchToUser = async (email: string) => {
    if (allUserAccounts[email]) {
      setAccounts(allUserAccounts[email]);
    } else {
      setAccounts([]);
    }
  };

  const removeAccount = async (accountId: string) => {
    if (!user?.email) return;
    
    const userEmail = user.email;
    const currentUserAccounts = allUserAccounts[userEmail] || [];
    const accountToRemove = currentUserAccounts.find((acc: any) => acc.id === accountId);
    const updatedUserAccounts = currentUserAccounts.filter((acc: any) => acc.id !== accountId);
    
    const updatedAllAccounts = {
      ...allUserAccounts,
      [userEmail]: updatedUserAccounts
    };
    
    setAllUserAccounts(updatedAllAccounts);
    setAccounts(updatedUserAccounts);
    await AsyncStorage.setItem('allUserAccounts', JSON.stringify(updatedAllAccounts));

    console.log('Removing account, isOnline:', isOnline);

    if (accountToRemove) {
      // Get fresh pending changes
      const currentPending = await AsyncStorage.getItem('pendingChanges');
      const parsedPending = currentPending ? JSON.parse(currentPending) : [];
      
      // Check if this was added offline
      const wasAddedOffline = parsedPending.some((change: any) => 
        change.type === 'ADD' && change.data.secret === accountToRemove.secret
      );

      if (wasAddedOffline) {
        console.log('Removing offline-added account from pending');
        // Just remove from pending ADD
        const filteredPending = parsedPending.filter((change: any) => 
          !(change.type === 'ADD' && change.data.secret === accountToRemove.secret)
        );
        setPendingChanges(filteredPending);
        if (filteredPending.length === 0) {
          await AsyncStorage.removeItem('pendingChanges');
        } else {
          await AsyncStorage.setItem('pendingChanges', JSON.stringify(filteredPending));
        }
      } else {
        // Add to pending DELETE first
        await addToPendingChanges({ type: 'DELETE', data: accountToRemove });
        
        // Try server only if online
        if (isOnline) {
          try {
            console.log('Trying server DELETE...');
            await deletCode(accountToRemove.secret);
            console.log('Server DELETE successful, removing from pending');
            
            // Get fresh pending and remove this DELETE
            const freshPending = await AsyncStorage.getItem('pendingChanges');
            const freshParsed = freshPending ? JSON.parse(freshPending) : [];
            const updated = freshParsed.filter((change: any) => 
              !(change.type === 'DELETE' && change.data.secret === accountToRemove.secret)
            );
            
            setPendingChanges(updated);
            if (updated.length === 0) {
              await AsyncStorage.removeItem('pendingChanges');
            } else {
              await AsyncStorage.setItem('pendingChanges', JSON.stringify(updated));
            }
          } catch (error) {
            console.log('Delete failed, will sync later');
          }
        } else {
          console.log('Offline - added to pending only');
        }
      }
    }
  };



  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn,
      login,
      logout,
      accounts,
      codes,
      remaining,
      addAccount,
      clearAccounts,
      removeAccount,
      allUserAccounts,
      switchToUser,
      isSynced,
      isOnline
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
