
import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import { router } from 'expo-router';
import { COLORS } from '../constants/nestora-theme';
import BottomNavigation from '../components/bottom-navigation';

interface Destination {
  id: number;
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  population?: number;
}

export default function DestinationsScreen() {
  const [search, setSearch] = useState('');
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchDestinations = async () => {
    if (search.trim().length < 2) {
      setError('Enter at least 2 characters.');
      setDestinations([]);
      return;
    }

    try {
      setLoading(true);
      setError('');
      setDestinations([]);

      const url =
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(search.trim())}&count=10&language=en&format=json`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Unable to fetch destinations.');
      }

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        setDestinations(data.results);
      } else {
        setError('No destinations found. Try another city.');
      }
    } catch (err) {
      console.log('Destination API error:', err);
      setError('Unable to connect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.heading}>Explore Destinations</Text>

        <Text style={styles.subtitle}>
          Discover places around the world for your next stay.
        </Text>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Search a city (e.g. Goa, Mumbai)"
            placeholderTextColor={COLORS.muted}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={searchDestinations}
            returnKeyType="search"
          />

          <TouchableOpacity
            style={styles.searchButton}
            onPress={searchDestinations}
            disabled={loading}
          >
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.infoText}>Finding destinations...</Text>
          </View>
        )}

        {!!error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        {destinations.map((place) => (
          <View key={place.id} style={styles.destinationCard}>
            <View style={styles.cardIcon}>
              <Text style={styles.locationIcon}>⌖</Text>
            </View>

            <View style={styles.destinationInfo}>
              <Text style={styles.cityName}>{place.name}</Text>

              <Text style={styles.countryName}>
                {place.admin1
                  ? `${place.admin1}, ${place.country}`
                  : place.country}
              </Text>

              <Text style={styles.coordinates}>
                Latitude: {place.latitude.toFixed(2)} · Longitude:{' '}
                {place.longitude.toFixed(2)}
              </Text>
            </View>
          </View>
        ))}

        <Text style={styles.attribution}>
          Location data provided by Open-Meteo Geocoding API.
        </Text>
      </ScrollView>

      <BottomNavigation activeTab="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    padding: 20,
    paddingBottom: 30,
  },

  backButton: {
    marginTop: 15,
    marginBottom: 20,
  },

  backText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: 'bold',
  },

  heading: {
    fontSize: 27,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  subtitle: {
    color: COLORS.muted,
    fontSize: 14,
    marginTop: 8,
    marginBottom: 22,
    lineHeight: 21,
  },

  searchContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    padding: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  input: {
    padding: 12,
    fontSize: 14,
    color: COLORS.text,
  },

  searchButton: {
    backgroundColor: COLORS.primary,
    padding: 13,
    borderRadius: 9,
    alignItems: 'center',
    marginTop: 8,
  },

  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },

  loadingContainer: {
    alignItems: 'center',
    padding: 25,
  },

  infoText: {
    color: COLORS.muted,
    marginTop: 12,
  },

  errorText: {
    color: COLORS.danger,
    textAlign: 'center',
    marginVertical: 15,
  },

  destinationCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EAF1EC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  locationIcon: {
    fontSize: 27,
    color: COLORS.primary,
  },

  destinationInfo: {
    flex: 1,
  },

  cityName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.text,
  },

  countryName: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 4,
  },

  coordinates: {
    fontSize: 10,
    color: COLORS.muted,
    marginTop: 6,
  },

  attribution: {
    textAlign: 'center',
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 20,
  },
});
