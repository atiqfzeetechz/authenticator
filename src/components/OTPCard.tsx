import { View, Text, StyleSheet } from 'react-native';

interface OTPCardProps {
  issuer: string;
  account: string;
  code: string;
  timeRemaining: number;
}

export default function OTPCard({ issuer, account, code, timeRemaining }: OTPCardProps) {
  const progress = 1 - (timeRemaining / 30);
  
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.issuer}>{issuer}</Text>
          {account ? <Text style={styles.account}>{account}</Text> : null}
        </View>
        <View style={styles.codeContainer}>
          <Text style={styles.code}>{code}</Text>
          <Text style={styles.codeSubtext}>OTP</Text>
        </View>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
      </View>
      
      <Text style={styles.timeText}>
        Expires in {timeRemaining}s
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  issuer: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  account: {
    color: '#888',
    fontSize: 14,
    marginTop: 2,
  },
  codeContainer: {
    alignItems: 'flex-end',
  },
  code: {
    color: '#1a73e8',
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: 4,
  },
  codeSubtext: {
    color: '#666',
    fontSize: 12,
    marginTop: 2,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#1a73e8',
    borderRadius: 2,
  },
  timeText: {
    color: '#888',
    fontSize: 12,
    textAlign: 'right',
  },
});