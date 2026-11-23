
import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';

import { router } from 'expo-router';

import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  updateDoc,
} from 'firebase/firestore';

import { auth, db } from '../config/firebase';
import { COLORS } from '../constants/nestora-theme';
import BottomNavigation from '../components/bottom-navigation';

interface Booking {
  id: string;
  propertyName: string;
  propertyLocation: string;
  propertyImage?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  totalPrice: number;
  status: string;
  createdAt?: any;
}

export default function MyBookingsScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      router.replace('/login');
      setLoading(false);
      return;
    }

    const bookingsQuery = query(
      collection(db, 'bookings'),
      where('userId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(
      bookingsQuery,
      (snapshot) => {
        const bookingList: Booking[] = snapshot.docs.map((item) => ({
          id: item.id,
          ...(item.data() as Omit<Booking, 'id'>),
        }));

        bookingList.sort((a, b) => {
          const dateA = a.createdAt?.toMillis?.() || 0;
          const dateB = b.createdAt?.toMillis?.() || 0;
          return dateB - dateA;
        });

        setBookings(bookingList);
        setLoading(false);
      },
      (error) => {
        console.log('Bookings loading error:', error);
        setLoading(false);
        Alert.alert('Error', 'Unable to load your bookings.');
      }
    );

    return unsubscribe;
  }, []);

  const performCancellation = async (booking: Booking) => {
    try {
      setCancellingId(booking.id);

      const user = auth.currentUser;

      if (!user) {
        if (Platform.OS === 'web') {
          window.alert('Please login again.');
        } else {
          Alert.alert('Session expired', 'Please login again.');
        }

        router.replace('/login');
        return;
      }

      await updateDoc(doc(db, 'bookings', booking.id), {
        status: 'Cancelled',
      });

      console.log('Booking cancelled successfully:', booking.id);

      if (Platform.OS === 'web') {
        window.alert('Your booking has been cancelled successfully.');
      } else {
        Alert.alert(
          'Booking Cancelled',
          'Your booking has been cancelled successfully.'
        );
      }
    } catch (error) {
      console.log('Cancellation error:', error);

      if (Platform.OS === 'web') {
        window.alert('Unable to cancel your booking. Please try again.');
      } else {
        Alert.alert(
          'Error',
          'Unable to cancel your booking. Please try again.'
        );
      }
    } finally {
      setCancellingId(null);
    }
  };

  const cancelBooking = (booking: Booking) => {
    console.log('Cancel button pressed:', booking.id);

    const message = `Are you sure you want to cancel your booking for ${booking.propertyName}?`;

    // Browser confirmation for Expo Web
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(message);

      if (confirmed) {
        performCancellation(booking);
      }

      return;
    }

    // Native confirmation for Android and iOS
    Alert.alert(
      'Cancel Booking',
      message,
      [
        {
          text: 'Keep Booking',
          style: 'cancel',
        },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: () => performCancellation(booking),
        },
      ]
    );
  };

  const formatDate = (date: string) => {
    if (!date) return 'Not available';

    const parsedDate = new Date(date + 'T00:00:00');

    if (isNaN(parsedDate.getTime())) return date;

    return parsedDate.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading your bookings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>My Bookings</Text>
        <Text style={styles.subtitle}>
          Manage your accommodation bookings
        </Text>

        {bookings.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>⌂</Text>

            <Text style={styles.emptyTitle}>
              No Bookings Yet
            </Text>

            <Text style={styles.emptyText}>
              You haven't booked any properties yet.
              Start exploring and find your perfect stay!
            </Text>

            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => router.replace('/home')}
            >
              <Text style={styles.exploreButtonText}>
                Explore Properties
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          bookings.map((booking) => (
            <View key={booking.id} style={styles.bookingCard}>
              <View style={styles.cardHeader}>
                <View style={styles.propertyInfo}>
                  <Text style={styles.propertyName}>
                    {booking.propertyName}
                  </Text>

                  <Text style={styles.location}>
                    {booking.propertyLocation}
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    booking.status === 'Cancelled'
                      ? styles.cancelledBadge
                      : booking.status === 'Confirmed'
                      ? styles.confirmedBadge
                      : styles.pendingBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      booking.status === 'Cancelled'
                        ? styles.cancelledText
                        : booking.status === 'Confirmed'
                        ? styles.confirmedText
                        : styles.pendingText,
                    ]}
                  >
                    {booking.status || 'Pending'}
                  </Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Check-in</Text>
                <Text style={styles.detailValue}>
                  {formatDate(booking.checkIn)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Check-out</Text>
                <Text style={styles.detailValue}>
                  {formatDate(booking.checkOut)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Guests</Text>
                <Text style={styles.detailValue}>
                  {booking.guests}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Duration</Text>
                <Text style={styles.detailValue}>
                  {booking.nights} {booking.nights === 1 ? 'Night' : 'Nights'}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.priceRow}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalPrice}>
                  ₹{Number(booking.totalPrice || 0).toLocaleString('en-IN')}
                </Text>
              </View>

              {booking.status === 'Cancelled' ? (
                <View style={styles.cancelledMessage}>
                  <Text style={styles.cancelledMessageText}>
                    This booking has been cancelled.
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.cancelButton,
                    cancellingId === booking.id && styles.disabledButton,
                  ]}
                  activeOpacity={0.6}
                  disabled={cancellingId === booking.id}
                  onPress={() => cancelBooking(booking)}
                >
                  {cancellingId === booking.id ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.cancelButtonText}>
                      Cancel Booking
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
      </ScrollView>

      <BottomNavigation activeTab="bookings" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContent: {
    padding: 20,
    paddingBottom: 30,
  },

  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginTop: 20,
  },

  subtitle: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 5,
    marginBottom: 25,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },

  loadingText: {
    marginTop: 12,
    color: COLORS.muted,
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    marginTop: 60,
  },

  emptyIcon: {
    fontSize: 60,
    color: COLORS.primary,
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
  },

  emptyText: {
    textAlign: 'center',
    color: COLORS.muted,
    lineHeight: 22,
    marginBottom: 25,
  },

  exploreButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 12,
  },

  exploreButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  bookingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    elevation: 3,
    shadowColor: '#000000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },

  propertyInfo: {
    flex: 1,
  },

  propertyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },

  location: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 5,
  },

  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
  },

  pendingBadge: {
    backgroundColor: '#FFF1D6',
  },

  confirmedBadge: {
    backgroundColor: '#DFF4E5',
  },

  cancelledBadge: {
    backgroundColor: '#FCE5E5',
  },

  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },

  pendingText: {
    color: '#A66B00',
  },

  confirmedText: {
    color: '#287A45',
  },

  cancelledText: {
    color: '#C0392B',
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 15,
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  detailLabel: {
    fontSize: 13,
    color: COLORS.muted,
  },

  detailValue: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },

  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  totalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },

  totalPrice: {
    fontSize: 19,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  cancelButton: {
    backgroundColor: COLORS.danger,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 46,
  },

  disabledButton: {
    opacity: 0.6,
  },

  cancelButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },

  cancelledMessage: {
    backgroundColor: '#FCE5E5',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },

  cancelledMessageText: {
    color: '#C0392B',
    fontWeight: '600',
    fontSize: 13,
  },
});
