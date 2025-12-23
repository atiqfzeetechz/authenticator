import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import {Account} from '../types/Account';
import {generateTOTP} from '../utils/totp';

interface AccountCardProps {
  account: Account;
  onDelete: () => void;
}

const AccountCard: React.FC<AccountCardProps> = ({account, onDelete}) => {
  const [code, setCode] = useState('000000');
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    const updateCode = () => {
      try {
        const newCode = generateTOTP(account.secret);
        setCode(newCode);
      } catch (error) {
        console.error('Error generating code:', error);
        setCode('000000');
      }
    };

    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = 30 - (now % 30);
      setTimeLeft(remaining);
    };

    updateCode();
    updateTimer();

    const interval = setInterval(() => {
      updateCode();
      updateTimer();
    }, 1000);

    return () => clearInterval(interval);
  }, [account.secret]);

  const copyToClipboard = () => {
    Clipboard.setString(code);
    Alert.alert('Copied', 'Code copied to clipboard');
  };

  const formatCode = (code: string) => {
    return code.replace(/(.{3})/g, '$1 ').trim();
  };

  return (
    <TouchableOpacity style={styles.card} onPress={copyToClipboard}>
      <View style={styles.cardContent}>
        <View style={styles.accountInfo}>
          <Text style={styles.issuer}>{account.issuer}</Text>
          <Text style={styles.email}>{account.email}</Text>
        </View>

        <View style={styles.codeSection}>
          <Text style={styles.code}>{formatCode(code)}</Text>
          <View style={styles.timerContainer}>
            <View
              style={[styles.timerBar, {width: `${(timeLeft / 30) * 100}%`}]}
            />
            <Text style={styles.timer}>{timeLeft}s</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Text style={styles.deleteText}>×</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flex: 1,
  },
  accountInfo: {
    marginBottom: 12,
  },
  issuer: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
  },
  email: {
    fontSize: 14,
    color: '#757575',
    marginTop: 2,
  },
  codeSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  code: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1565C0',
    fontFamily: 'monospace',
  },
  timerContainer: {
    alignItems: 'center',
  },
  timerBar: {
    height: 4,
    backgroundColor: '#1565C0',
    borderRadius: 2,
    marginBottom: 4,
    minWidth: 40,
  },
  timer: {
    fontSize: 12,
    color: '#757575',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F44336',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  deleteText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default AccountCard;