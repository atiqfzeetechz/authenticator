import AsyncStorage from '@react-native-async-storage/async-storage';
import { Account } from '../types/Account';

const ACCOUNTS_KEY = 'authenticator_accounts';

export const Storage = {
  async getAccounts(): Promise<Account[]> {
    try {
      const data = await AsyncStorage.getItem(ACCOUNTS_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting accounts:', error);
      return [];
    }
  },

  async saveAccount(account: Account): Promise<void> {
    try {
      const accounts = await this.getAccounts();
      const existingIndex = accounts.findIndex(acc => acc.id === account.id);
      
      if (existingIndex >= 0) {
        accounts[existingIndex] = account;
      } else {
        accounts.push(account);
      }
      
      await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    } catch (error) {
      console.error('Error saving account:', error);
    }
  },

  async deleteAccount(accountId: string): Promise<void> {
    try {
      const accounts = await this.getAccounts();
      const filteredAccounts = accounts.filter(acc => acc.id !== accountId);
      await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(filteredAccounts));
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  }
};