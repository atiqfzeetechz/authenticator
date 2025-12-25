import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateTOTP } from '@/src/utils/totp';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [accounts, setAccounts] = useState<any[]>([]);
  const [codes, setCodes] = useState<Record<string, string>>({});
  const [remaining, setRemaining] = useState(30);

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
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      await auth().signInWithCredential(googleCredential);
      // Navigation will happen automatically via auth state change
    } catch (error) {
      console.log('Login Error:', error);
    }
  };

  const logout = async () => {
    try {
      await GoogleSignin.signOut();
      await auth().signOut();
    } catch (error) {
      console.log('Logout Error:', error);
    }
  };

  // Load accounts from AsyncStorage on mount
  useEffect(() => {
    if (isLoggedIn) {
      AsyncStorage.getItem('accounts').then(res => {
        if (res) setAccounts(JSON.parse(res));
      });
    }
  }, [isLoggedIn]);

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
    // Check for duplicates by secret
    let name = acc.name;
    const sameSecrets = accounts.filter(a => a.secret === acc.secret);

    if (sameSecrets.length > 0) {
      // Add numbering if duplicate
      const count = sameSecrets.length + 1;
      name = `${acc.name} (${count})`;
    }

    const newAcc = { ...acc, name };
    const updated = [...accounts, newAcc];
    setAccounts(updated);
    await AsyncStorage.setItem('accounts', JSON.stringify(updated));
  };

  // 🔁 Clear all accounts
  const clearAccounts = async () => {
    setAccounts([]);
    setCodes({});
    await AsyncStorage.removeItem('accounts');
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
      clearAccounts 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
