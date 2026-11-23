
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

import {
  Text,
  TextInput,
  Button,
} from 'react-native-paper';

import { Link, router } from 'expo-router';
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';

import { auth, db } from '../config/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { COLORS } from '../constants/nestora-theme';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('Missing Details', 'Please fill in all fields.');
      return;
    }

    if (!email.includes('@')) {
      Alert.alert('Invalid Email', 'Please enter a valid email.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must contain at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }

    try {
      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      await updateProfile(userCredential.user, {
        displayName: name.trim(),
      });

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        createdAt: serverTimestamp(),
      });

      Alert.alert('Success', 'Your Nestora account has been created!');

      router.replace('/home');
    } catch (error: any) {
      Alert.alert(
        'Registration Failed',
        error.message || 'Something went wrong.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.logo}>NESTORA</Text>

      <Text style={styles.heading}>Create Account</Text>

      <Text style={styles.subtitle}>
        Join Nestora and discover your perfect stay.
      </Text>

      <TextInput
        label="Full Name"
        value={name}
        onChangeText={setName}
        mode="outlined"
        left={<TextInput.Icon icon="account-outline" />}
        style={styles.input}
      />

      <TextInput
        label="Email Address"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
        left={<TextInput.Icon icon="email-outline" />}
        style={styles.input}
      />

      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry={!showPassword}
        left={<TextInput.Icon icon="lock-outline" />}
        right={
          <TextInput.Icon
            icon={showPassword ? 'eye-off' : 'eye'}
            onPress={() => setShowPassword(!showPassword)}
          />
        }
        style={styles.input}
      />

      <TextInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        mode="outlined"
        secureTextEntry={!showPassword}
        left={<TextInput.Icon icon="lock-check-outline" />}
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={handleRegister}
        loading={loading}
        disabled={loading}
        style={styles.button}
        contentStyle={styles.buttonContent}
      >
        Create Account
      </Button>

      <View style={styles.bottom}>
        <Text>Already have an account? </Text>
        <Link href="/login" style={styles.link}>
          Login
        </Link>
      </View>

      <Link href="/" style={styles.back}>
        Back to Welcome
      </Link>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 25,
  },
  logo: {
    color: COLORS.primary,
    fontSize: 22,
    fontWeight: 'bold',
    letterSpacing: 5,
    marginBottom: 35,
  },
  heading: {
    color: COLORS.text,
    fontSize: 30,
    fontWeight: 'bold',
  },
  subtitle: {
    color: COLORS.muted,
    marginTop: 8,
    marginBottom: 28,
  },
  input: {
    marginBottom: 15,
    backgroundColor: COLORS.surface,
  },
  button: {
    borderRadius: 12,
    marginTop: 8,
  },
  buttonContent: {
    height: 52,
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  link: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  back: {
    color: COLORS.primary,
    textAlign: 'center',
    marginTop: 25,
  },
});
