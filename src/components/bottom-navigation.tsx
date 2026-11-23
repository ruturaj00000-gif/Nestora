
import React from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { router } from 'expo-router';
import { COLORS } from '../constants/nestora-theme';

type TabName = 'home' | 'bookings' | 'profile';

interface Props {
  activeTab: TabName;
}

export default function BottomNavigation({
  activeTab,
}: Props) {
  const tabs: {
    name: TabName;
    label: string;
    icon: string;
    route: '/home' | '/my-bookings' | '/profile';
  }[] = [
    {
      name: 'home',
      label: 'Home',
      icon: '⌂',
      route: '/home',
    },
    {
      name: 'bookings',
      label: 'Bookings',
      icon: '▣',
      route: '/my-bookings',
    },
    {
      name: 'profile',
      label: 'Profile',
      icon: '●',
      route: '/profile',
    },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const selected = activeTab === tab.name;

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tab}
            activeOpacity={0.7}
            onPress={() => {
              if (selected) return;

              router.replace(tab.route);
            }}
          >
            <Text
              style={[
                styles.icon,
                selected && styles.activeIcon,
              ]}
            >
              {tab.icon}
            </Text>

            <Text
              style={[
                styles.label,
                selected && styles.activeLabel,
              ]}
            >
              {tab.label}
            </Text>

            {selected && <View style={styles.indicator} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
    paddingBottom: 12,
    paddingHorizontal: 15,
    justifyContent: 'space-around',
  },

  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },

  icon: {
    fontSize: 22,
    color: COLORS.muted,
  },

  activeIcon: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },

  label: {
    fontSize: 11,
    color: COLORS.muted,
    fontWeight: '500',
  },

  activeLabel: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },

  indicator: {
    width: 18,
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: 5,
    marginTop: 2,
  },
});
