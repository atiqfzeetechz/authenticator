import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateTOTP } from '@/src/utils/totp';
import { signOut } from '@react-native-firebase/auth';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import { loginwithGoogleApi, getAllCodes } from '../api/apiCall';
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
  const isOnline = useNetwork();

  // Auth state listener
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '680795358184-ouc9homjarr9qh9kjvji01thvieluuve.apps.googleusercontent.com',
      offlineAccess: true,
    });

    const unsubscribe = auth().onAuthStateChanged((user) => {
      setUser(user);
      setIsLoggedIn(!!user);
    });
    return unsubscribe;
  }, []);



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

  const loadAllUserAccounts = async () => {
    try {
      const stored = await AsyncStorage.getItem('allUserAccounts');
      const syncStatus = await AsyncStorage.getItem('syncStatus');

      if (stored) {
        const allAccounts = JSON.parse(stored);
        setAllUserAccounts(allAccounts);
        if (user?.email && allAccounts[user.email]) {
          setAccounts(allAccounts[user.email]);
        }
      }

      setIsSynced(syncStatus === 'true');
    } catch (error) {
      console.log('Error loading accounts:', error);
    }
  };

  const syncWithServer = async () => {
    try {
      const res = await getAllCodes();
      if (res?.success && res?.data?.authenticators) {
        const serverAccounts = res.data.authenticators.map((auth: any) => ({
          id: auth.id || Date.now().toString(),
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

    const newAcc = { ...acc, name };
    const updatedUserAccounts = [...currentUserAccounts, newAcc];

    // Update allUserAccounts structure
    const updatedAllAccounts = {
      ...allUserAccounts,
      [userEmail]: updatedUserAccounts
    };

    setAllUserAccounts(updatedAllAccounts);
    setAccounts(updatedUserAccounts);
    await AsyncStorage.setItem('allUserAccounts', JSON.stringify(updatedAllAccounts));
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
    const updatedUserAccounts = currentUserAccounts.filter((acc: any) => acc.id !== accountId);
    
    const updatedAllAccounts = {
      ...allUserAccounts,
      [userEmail]: updatedUserAccounts
    };
    
    setAllUserAccounts(updatedAllAccounts);
    setAccounts(updatedUserAccounts);
    await AsyncStorage.setItem('allUserAccounts', JSON.stringify(updatedAllAccounts));
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
