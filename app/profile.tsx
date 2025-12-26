import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/src/context/AuthContext';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialIcons, Feather, FontAwesome } from '@expo/vector-icons';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  const InfoRow = ({ icon, label, value, color = '#fff' }) => (
    <View style={styles.infoRow}>
      <View style={styles.infoLeft}>
        <View style={[styles.iconContainer, { backgroundColor: '#2a2a2a' }]}>
          {icon}
        </View>
        <Text style={styles.infoLabel}>{label}</Text>
      </View>
      <Text style={[styles.infoValue, { color }]}>{value}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      
      <LinearGradient
        colors={['#0a0a0a', '#1a1a1a']}
        style={styles.background}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.editButton}>
            <Feather name="edit-2" size={20} color="#1a73e8" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <LinearGradient
              colors={['#1a73e8', '#4285f4']}
              style={styles.profileGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.profileHeader}>
                <View style={styles.avatarContainer}>
                  <Image 
                    source={{ uri: user?.photoURL || 'https://via.placeholder.com/120' }}
                    style={styles.avatar}
                  />
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  </View>
                </View>
                <Text style={styles.userName}>{user?.displayName || 'Guest User'}</Text>
                <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
                
                <View style={styles.statsContainer}>
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>01</Text>
                    <Text style={styles.statLabel}>Days</Text>
                  </View>
                  <View style={styles.statDivider} />
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>1</Text>
                    <Text style={styles.statLabel}>Active</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Account Information */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Account Information</Text>
            
            <View style={styles.infoCard}>
              <InfoRow
                icon={<MaterialIcons name="person-outline" size={20} color="#1a73e8" />}
                label="Display Name"
                value={user?.displayName || 'Not set'}
              />
              
              <InfoRow
                icon={<MaterialIcons name="email" size={20} color="#1a73e8" />}
                label="Email Address"
                value={user?.email || 'N/A'}
              />
              
              <InfoRow
                icon={<Ionicons name="shield-checkmark" size={20} color="#1a73e8" />}
                label="Email Verified"
                value={user?.emailVerified ? 'Verified' : 'Not Verified'}
                color={user?.emailVerified ? '#10B981' : '#EF4444'}
              />
              
              <InfoRow
                icon={<Feather name="phone" size={20} color="#1a73e8" />}
                label="Phone Number"
                value={user?.phoneNumber || 'Not added'}
              />
              
              <InfoRow
                icon={<FontAwesome name="google" size={20} color="#1a73e8" />}
                label="Provider"
                value={user?.providerData?.[0]?.providerId === 'google.com' ? 'Google' : 'Other'}
              />
              
              <InfoRow
                icon={<MaterialIcons name="date-range" size={20} color="#1a73e8" />}
                label="Member Since"
                value={user?.metadata?.creationTime ? 
                  new Date(user.metadata.creationTime).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}
              />
              
              <InfoRow
                icon={<Ionicons name="time-outline" size={20} color="#1a73e8" />}
                label="Last Active"
                value={user?.metadata?.lastSignInTime ? 
                  new Date(user.metadata.lastSignInTime).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'N/A'}
              />
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            
            <View style={styles.actionsGrid}>
              <TouchableOpacity style={styles.actionButton}>
                <View style={[styles.actionIcon, { backgroundColor: 'rgba(26, 115, 232, 0.1)' }]}>
                  <Ionicons name="settings-outline" size={24} color="#1a73e8" />
                </View>
                <Text style={styles.actionText}>Settings</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <View style={[styles.actionIcon, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                  <Ionicons name="shield-checkmark-outline" size={24} color="#10B981" />
                </View>
                <Text style={styles.actionText}>Privacy</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <View style={[styles.actionIcon, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}>
                  <Ionicons name="help-circle-outline" size={24} color="#8B5CF6" />
                </View>
                <Text style={styles.actionText}>Help</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <View style={[styles.actionIcon, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
                  <Ionicons name="star-outline" size={24} color="#F59E0B" />
                </View>
                <Text style={styles.actionText}>Rate Us</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#EF4444', '#DC2626']}
              style={styles.logoutGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="log-out-outline" size={22} color="#fff" />
              <Text style={styles.logoutText}>Logout</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Version Info */}
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>v1.0.0 • © 2024 YourApp</Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    paddingTop:StatusBar.currentHeight
  },
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.5,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  profileCard: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#1a73e8',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  profileGradient: {
    borderRadius: 24,
    padding: 24,
  },
  profileHeader: {
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 2,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 10,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  statDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
  },
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  infoCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#888',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 10,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  actionButton: {
    width: '48%',
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#fff',
    textAlign: 'center',
  },
  logoutButton: {
    marginHorizontal: 20,
    marginTop: 32,
    borderRadius: 16,
    overflow: 'hidden',
  },
  logoutGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  versionText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});