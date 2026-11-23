
import React, { useEffect, useState } from 'react';

import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';

import { Text, Button } from 'react-native-paper';
import { Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/nestora-theme';

export default function WelcomeScreen() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // FULL SCREEN SPLASH SCREEN
  if (showSplash) {
    return (
      <View style={styles.splashContainer}>
        <Image
          source={require('../../assets/images/nestora-splash.png')}
          style={styles.splashImage}
          resizeMode="cover"
        />

        <ActivityIndicator
          size="small"
          color={COLORS.primary}
          style={styles.loader}
        />
      </View>
    );
  }

  // WELCOME SCREEN
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoLetter}>N</Text>
          </View>

          <Text style={styles.brand}>NESTORA</Text>

          <Text style={styles.tagline}>
            FIND YOUR STAY. FEEL AT HOME.
          </Text>
        </View>

        {/* Hero Section */}
        <View style={styles.hero}>
          <View style={styles.heroImage}>
            <Text style={styles.houseIcon}>⌂</Text>

            <Text style={styles.imageCaption}>
              YOUR NEXT ESCAPE
            </Text>
          </View>
        </View>

        {/* Welcome Content */}
        <View style={styles.content}>
          <Text style={styles.heading}>
            Discover places{'\n'}you'll love to stay.
          </Text>

          <Text style={styles.description}>
            Explore beautiful homes, comfortable apartments
            and unique stays for your next journey.
          </Text>

          {/* Register Button */}
          <Link href="/register" asChild>
            <Button
              mode="contained"
              style={styles.button}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
            >
              Get Started
            </Button>
          </Link>

          {/* Login Button */}
          <Link href="/login" asChild>
            <Button
              mode="outlined"
              style={styles.loginButton}
              contentStyle={styles.buttonContent}
              textColor={COLORS.primary}
            >
              I already have an account
            </Button>
          </Link>

          <Text style={styles.footer}>
            YOUR JOURNEY BEGINS WITH NESTORA
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  // SPLASH SCREEN STYLES

  splashContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },

  splashImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },

  loader: {
    position: 'absolute',
    bottom: 45,
  },

  // WELCOME SCREEN STYLES

  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingBottom: 25,
  },

  logoContainer: {
    alignItems: 'center',
    marginBottom: 28,
  },

  logo: {
    width: 58,
    height: 58,
    backgroundColor: COLORS.primary,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoLetter: {
    fontSize: 34,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  brand: {
    fontSize: 23,
    fontWeight: 'bold',
    letterSpacing: 5,
    color: COLORS.primary,
    marginTop: 12,
  },

  tagline: {
    fontSize: 9,
    letterSpacing: 2,
    color: COLORS.muted,
    marginTop: 5,
  },

  hero: {
    height: 270,
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 28,
  },

  heroImage: {
    flex: 1,
    backgroundColor: '#D9E2D6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  houseIcon: {
    fontSize: 120,
    color: COLORS.primary,
  },

  imageCaption: {
    color: COLORS.primary,
    fontWeight: 'bold',
    letterSpacing: 3,
    fontSize: 11,
  },

  content: {
    alignItems: 'center',
  },

  heading: {
    fontSize: 32,
    lineHeight: 40,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },

  description: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 23,
    textAlign: 'center',
    marginTop: 13,
    marginBottom: 25,
  },

  button: {
    width: '100%',
    borderRadius: 14,
  },

  buttonContent: {
    height: 53,
  },

  buttonLabel: {
    fontSize: 15,
    fontWeight: 'bold',
  },

  loginButton: {
    width: '100%',
    marginTop: 12,
    borderRadius: 14,
    borderColor: COLORS.primary,
  },

  footer: {
    color: COLORS.muted,
    fontSize: 9,
    letterSpacing: 2,
    marginTop: 27,
  },

});
