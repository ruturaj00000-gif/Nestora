
import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import nestoraTheme from '../constants/nestora-theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={nestoraTheme}>
        <StatusBar barStyle="dark-content" />

        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: {
              backgroundColor: '#F8F6F0',
            },
          }}
        />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
