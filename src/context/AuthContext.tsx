import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateTOTP } from '@/src/utils/totp';

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: any) {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [codes, setCodes] = useState<Record<string, string>>({});
  const [remaining, setRemaining] = useState(30);

  // 🔁 Load accounts from AsyncStorage on mount
  useEffect(() => {
    AsyncStorage.getItem('accounts').then(res => {
      if (res) setAccounts(JSON.parse(res));
    });
  }, []);

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
    <AuthContext.Provider value={{ accounts, codes, remaining, addAccount, clearAccounts }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
