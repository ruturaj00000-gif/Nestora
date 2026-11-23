
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { router, useLocalSearchParams } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

import { auth, db } from '../config/firebase';
import { COLORS } from '../constants/nestora-theme';

export default function PropertyDetailsScreen() {
  const params = useLocalSearchParams();

  const id = String(params.id || '');
  const name = String(params.name || 'Property');
  const location = String(params.location || '');
  const price = Number(params.price || 0);
  const rating = String(params.rating || '0');
  const image = String(params.image || '');

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('1');
  const [booking, setBooking] = useState(false);

  const validateDate = (value: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return null;
    }

    const [year, month, day] = value.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month - 1 ||
      date.getDate() !== day
    ) {
      return null;
    }

    date.setHours(0, 0, 0, 0);
    return date;
  };

  const handleBooking = async () => {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      Alert.alert(
        'Login Required',
        'Please login before making a booking.'
      );
      router.replace('/login');
      return;
    }

    if (!checkIn || !checkOut) {
      Alert.alert(
        'Missing Dates',
        'Please enter both check-in and check-out dates.'
      );
      return;
    }

    const startDate = validateDate(checkIn);
    const endDate = validateDate(checkOut);

    if (!startDate || !endDate) {
      Alert.alert(
        'Invalid Date',
        'Enter dates in YYYY-MM-DD format, for example 2026-12-20.'
      );
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      Alert.alert(
        'Invalid Check-in',
        'Check-in date cannot be in the past.'
      );
      return;
    }

    if (endDate <= startDate) {
      Alert.alert(
        'Invalid Check-out',
        'Check-out must be after check-in.'
      );
      return;
    }

    const guestCount = Number(guests);

    if (
      !Number.isInteger(guestCount) ||
      guestCount < 1 ||
      guestCount > 20
    ) {
      Alert.alert(
        'Invalid Guests',
        'Please enter between 1 and 20 guests.'
      );
      return;
    }

    try {
      setBooking(true);

      const difference =
        endDate.getTime() - startDate.getTime();

      const nights = Math.round(
        difference / (1000 * 60 * 60 * 24)
      );

      const totalPrice = price * nights;

      await addDoc(collection(db, 'bookings'), {
        userId: currentUser.uid,
        userEmail: currentUser.email || '',
        propertyId: id,
        propertyName: name,
        propertyLocation: location,
        propertyImage: image,
        pricePerNight: price,
        checkIn,
        checkOut,
        guests: guestCount,
        nights,
        totalPrice,
        status: 'Pending',
        createdAt: serverTimestamp(),
      });

      Alert.alert(
        'Booking Successful!',
        `Your booking request for ${name} has been saved.\n\nCheck-in: ${checkIn}\nCheck-out: ${checkOut}\nGuests: ${guestCount}\nTotal: ₹${totalPrice.toLocaleString('en-IN')}\n\nStatus: Pending`,
        [
          {
            text: 'OK',
            onPress: () => router.replace('/home'),
          },
        ]
      );
    } catch (error) {
      console.error('Booking error:', error);

      Alert.alert(
        'Booking Failed',
        'Unable to save your booking. Please check your internet connection and try again.'
      );
    } finally {
      setBooking(false);
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* BACK BUTTON */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        {/* PROPERTY IMAGE */}
        {image ? (
          <Image
            source={{ uri: image }}
            style={styles.propertyImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text>🏡</Text>
          </View>
        )}

        {/* PROPERTY INFORMATION */}
        <View style={styles.detailsContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.propertyName}>{name}</Text>
            <Text style={styles.rating}>★ {rating}</Text>
          </View>

          <Text style={styles.location}>📍 {location}</Text>

          <Text style={styles.price}>
            ₹{price.toLocaleString('en-IN')}
            <Text style={styles.perNight}> / night</Text>
          </Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>
            About this stay
          </Text>

          <Text style={styles.description}>
            Enjoy a comfortable and memorable stay at {name}.
            Discover the beauty of {location} and experience
            a relaxing getaway with Nestora.
          </Text>

          <Text style={styles.sectionTitle}>
            Amenities
          </Text>

          <View style={styles.amenities}>
            <Text style={styles.amenity}>🛏 Comfortable rooms</Text>
            <Text style={styles.amenity}>📶 Free Wi-Fi</Text>
            <Text style={styles.amenity}>❄ Air conditioning</Text>
            <Text style={styles.amenity}>🚗 Parking available</Text>
          </View>

          <View style={styles.divider} />

          {/* BOOKING FORM */}
          <Text style={styles.sectionTitle}>
            Make your booking
          </Text>

          <Text style={styles.inputLabel}>
            Check-in date
          </Text>

          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD (e.g. 2026-12-20)"
            placeholderTextColor="#929A94"
            value={checkIn}
            onChangeText={setCheckIn}
            keyboardType="numbers-and-punctuation"
            autoCapitalize="none"
          />

          <Text style={styles.inputLabel}>
            Check-out date
          </Text>

          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD (e.g. 2026-12-23)"
            placeholderTextColor="#929A94"
            value={checkOut}
            onChangeText={setCheckOut}
            keyboardType="numbers-and-punctuation"
            autoCapitalize="none"
          />

          <Text style={styles.inputLabel}>
            Number of guests
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter number of guests"
            placeholderTextColor="#929A94"
            value={guests}
            onChangeText={setGuests}
            keyboardType="number-pad"
          />

          <View style={styles.noteBox}>
            <Text style={styles.noteText}>
              Your booking will be saved with Pending status.
              The total amount is calculated using the nightly
              price and number of nights.
            </Text>
          </View>

          {/* BOOK NOW BUTTON */}
          <TouchableOpacity
            style={[
              styles.bookButton,
              booking && styles.disabledButton,
            ]}
            onPress={handleBooking}
            disabled={booking}
            activeOpacity={0.8}
          >
            {booking ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.bookButtonText}>
                Book Now
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    paddingBottom: 35,
  },

  backButton: {
    marginTop: 50,
    marginHorizontal: 20,
    marginBottom: 15,
    alignSelf: 'flex-start',
  },

  backText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  propertyImage: {
    width: '100%',
    height: 260,
    backgroundColor: '#E8E6DF',
  },

  imagePlaceholder: {
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E8E6DF',
  },

  detailsContainer: {
    padding: 20,
  },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  propertyName: {
    flex: 1,
    fontSize: 23,
    fontWeight: 'bold',
    color: COLORS.text,
  },

  rating: {
    fontSize: 15,
    fontWeight: 'bold',
    color: COLORS.text,
  },

  location: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 10,
  },

  price: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 18,
  },

  perNight: {
    fontSize: 13,
    fontWeight: 'normal',
    color: COLORS.muted,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 24,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 14,
  },

  description: {
    fontSize: 14,
    lineHeight: 23,
    color: COLORS.muted,
    marginBottom: 25,
  },

  amenities: {
    gap: 13,
  },

  amenity: {
    fontSize: 14,
    color: COLORS.text,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 15,
    marginBottom: 8,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 15,
    fontSize: 14,
    color: COLORS.text,
  },

  noteBox: {
    backgroundColor: '#E9EDE7',
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
  },

  noteText: {
    fontSize: 12,
    lineHeight: 19,
    color: COLORS.primary,
  },

  bookButton: {
    height: 55,
    backgroundColor: COLORS.primary,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },

  disabledButton: {
    opacity: 0.6,
  },

  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
