
import React, { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { router } from 'expo-router';
import { signOut } from 'firebase/auth';

import { auth } from '../config/firebase';
import { COLORS } from '../constants/nestora-theme';
import BottomNavigation from '../components/bottom-navigation';

export default function ProfileScreen() {
  const [loggingOut, setLoggingOut] = useState(false);

  const user = auth.currentUser;

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await signOut(auth);

      router.replace('/');
    } catch (error) {
      Alert.alert(
        'Error',
        'Unable to logout. Please try again.'
      );
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <Text style={styles.logo}>NESTORA.</Text>

        <Text style={styles.heading}>My Profile</Text>

        <Text style={styles.subtitle}>
          Manage your account information.
        </Text>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>

          <Text style={styles.userName}>
            {user?.displayName || 'Traveler'}
          </Text>

          <Text style={styles.userEmail}>
            {user?.email || 'No email available'}
          </Text>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Account</Text>
            <Text style={styles.infoValue}>
              Registered
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email verification</Text>
            <Text style={styles.infoValue}>
              {user?.emailVerified ? 'Verified' : 'Not verified'}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          disabled={loggingOut}
          activeOpacity={0.8}
        >
          {loggingOut ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.logoutText}>
              Logout
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <BottomNavigation activeTab="profile" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'space-between',
  },

  content: {
    padding: 22,
    paddingTop: 60,
  },

  logo: {
    fontSize: 25,
    fontWeight: '900',
    letterSpacing: 3,
    color: COLORS.primary,
  },

  heading: {
    fontSize: 27,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 35,
  },

  subtitle: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 7,
  },

  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 22,
    alignItems: 'center',
    marginTop: 30,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
  },

  avatar: {
    width: 85,
    height: 85,
    borderRadius: 45,
    backgroundColor: '#E9EDE7',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    fontSize: 38,
  },

  userName: {
    fontSize: 21,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 15,
  },

  userEmail: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 6,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    width: '100%',
    marginVertical: 22,
  },

  infoRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },

  infoLabel: {
    fontSize: 13,
    color: COLORS.muted,
  },

  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },

  logoutButton: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 13,
    alignItems: 'center',
    marginTop: 25,
  },

  logoutText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
