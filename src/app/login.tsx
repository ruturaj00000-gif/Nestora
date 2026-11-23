
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import {
  Text,
  TextInput,
  Button,
} from 'react-native-paper';

import { Link, router } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';

import { auth } from '../config/firebase';
import { COLORS } from '../constants/nestora-theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing Details', 'Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);

      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      Alert.alert('Success', 'Login successful!');
      router.replace('/home');

    } catch (error: any) {
      let message = 'Unable to login. Please try again.';

      if (error.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      } else if (
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/wrong-password' ||
        error.code === 'auth/user-not-found'
      ) {
        message = 'Incorrect email or password.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many attempts. Please try again later.';
      }

      Alert.alert('Login Failed', message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboard}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.logo}>NESTORA</Text>

          <Text variant="headlineMedium" style={styles.heading}>
            Welcome Back!
          </Text>

          <Text style={styles.subtitle}>
            Sign in to continue your journey.
          </Text>

          <TextInput
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            style={styles.input}
            outlineColor={COLORS.border}
            activeOutlineColor={COLORS.primary}
            left={<TextInput.Icon icon="email-outline" />}
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry={!showPassword}
            style={styles.input}
            outlineColor={COLORS.border}
            activeOutlineColor={COLORS.primary}
            left={<TextInput.Icon icon="lock-outline" />}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Login
          </Button>

          <View style={styles.signupRow}>
            <Text style={styles.normalText}>
              Don't have an account?{' '}
            </Text>

            <Link href="/register" style={styles.link}>
              Sign Up
            </Link>
          </View>

          <Link href="/" style={styles.backLink}>
            Back to Welcome
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  keyboard: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  container: {
    padding: 25,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  logo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    letterSpacing: 4,
    marginBottom: 45,
  },
  heading: {
    color: COLORS.text,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: COLORS.muted,
    marginBottom: 30,
  },
  input: {
    marginBottom: 18,
    backgroundColor: COLORS.surface,
  },
  button: {
    marginTop: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
  },
  buttonContent: {
    height: 50,
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
    flexWrap: 'wrap',
  },
  normalText: {
    color: COLORS.text,
  },
  link: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  backLink: {
    color: COLORS.muted,
    textAlign: 'center',
    marginTop: 25,
  },
});
