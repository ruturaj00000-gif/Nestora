
import React, { useMemo, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

import { router } from 'expo-router';
import { signOut } from 'firebase/auth';

import { auth } from '../config/firebase';
import { COLORS } from '../constants/nestora-theme';
import BottomNavigation from '../components/bottom-navigation';

const categories = [
  'All',
  'Beach',
  'Mountain',
  'City',
  'Luxury',
];

const properties = [
  {
    id: '1',
    name: 'Sea View Paradise',
    location: 'Candolim, Goa',
    price: 4500,
    rating: 4.9,
    category: 'Beach',
    image:
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900',
  },
  {
    id: '2',
    name: 'Mountain Escape',
    location: 'Manali, Himachal Pradesh',
    price: 3200,
    rating: 4.8,
    category: 'Mountain',
    image:
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=900',
  },
  {
    id: '3',
    name: 'Modern City Apartment',
    location: 'Mumbai, Maharashtra',
    price: 2800,
    rating: 4.7,
    category: 'City',
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900',
  },
  {
    id: '4',
    name: 'Luxury Pool Villa',
    location: 'Lonavala, Maharashtra',
    price: 6500,
    rating: 5.0,
    category: 'Luxury',
    image:
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=900',
  },
];

export default function HomeScreen() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredProperties = useMemo(() => {
    return properties.filter((property) => {
      const matchesSearch =
        property.name.toLowerCase().includes(search.toLowerCase()) ||
        property.location.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' ||
        property.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory]);

  const openProperty = (property: (typeof properties)[number]) => {
    router.push({
      pathname: '/property-details',
      params: {
        id: property.id,
        name: property.name,
        location: property.location,
        price: String(property.price),
        rating: String(property.rating),
        image: property.image,
      },
    });
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut(auth);
              router.replace('/');
            } catch {
              Alert.alert('Error', 'Unable to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  const userName = auth.currentUser?.displayName || 'Traveler';

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.logo}>NESTORA.</Text>
            <Text style={styles.tagline}>
              Find your perfect stay
            </Text>
          </View>

          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push('/profile')}
          >
            <Text style={styles.profileIcon}>👤</Text>
          </TouchableOpacity>
        </View>

        {/* My Bookings Shortcut */}
        <TouchableOpacity
          style={styles.bookingsButton}
          activeOpacity={0.8}
          onPress={() => router.push('/my-bookings')}
        >
          <View>
            <Text style={styles.bookingsTitle}>
              My Bookings
            </Text>
            <Text style={styles.bookingsSubtitle}>
              View your reservations
            </Text>
          </View>

          <Text style={styles.bookingsArrow}>→</Text>
        </TouchableOpacity>

        {/* Explore Destinations API Button */}
        <TouchableOpacity
          style={styles.destinationsButton}
          activeOpacity={0.8}
          onPress={() => router.push('/destinations')}
        >
          <View style={styles.destinationIconContainer}>
            <Text style={styles.destinationIcon}>🌍</Text>
          </View>

          <View style={styles.destinationButtonInfo}>
            <Text style={styles.destinationButtonTitle}>
              Explore Destinations
            </Text>

            <Text style={styles.destinationButtonSubtitle}>
              Discover cities around the world
            </Text>
          </View>

          <Text style={styles.destinationArrow}>→</Text>
        </TouchableOpacity>

        {/* Greeting */}
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>
            Hello, {userName}!
          </Text>

          <Text style={styles.greetingSubtitle}>
            Where would you like to stay?
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>⌕</Text>

          <TextInput
            style={styles.searchInput}
            placeholder="Search places or properties..."
            placeholderTextColor={COLORS.muted}
            value={search}
            onChangeText={setSearch}
          />

          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={styles.clearSearch}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Categories */}
        <Text style={styles.sectionTitle}>
          Explore Categories
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryContainer}
        >
          {categories.map((category) => {
            const selected = selectedCategory === category;

            return (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  selected && styles.selectedCategory,
                ]}
                onPress={() => setSelectedCategory(category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    selected && styles.selectedCategoryText,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Featured Properties */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Featured Stays
            </Text>

            <Text style={styles.sectionSubtitle}>
              Discover amazing places
            </Text>
          </View>
        </View>

        {filteredProperties.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔍</Text>

            <Text style={styles.emptyTitle}>
              No properties found
            </Text>

            <Text style={styles.emptySubtitle}>
              Try another search or category.
            </Text>
          </View>
        ) : (
          filteredProperties.map((property) => (
            <TouchableOpacity
              key={property.id}
              style={styles.propertyCard}
              activeOpacity={0.85}
              onPress={() => openProperty(property)}
            >
              <Image
                source={{ uri: property.image }}
                style={styles.propertyImage}
                resizeMode="cover"
              />

              <View style={styles.propertyInfo}>
                <View style={styles.propertyTitleRow}>
                  <Text style={styles.propertyName}>
                    {property.name}
                  </Text>

                  <Text style={styles.rating}>
                    ★ {property.rating}
                  </Text>
                </View>

                <Text style={styles.propertyLocation}>
                  📍 {property.location}
                </Text>

                <View style={styles.propertyBottom}>
                  <View>
                    <Text style={styles.price}>
                      ₹{property.price.toLocaleString('en-IN')}
                      <Text style={styles.perNight}>
                        {' '} / night
                      </Text>
                    </Text>
                  </View>

                  <View style={styles.viewButton}>
                    <Text style={styles.viewButtonText}>
                      View Details →
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerLogo}>NESTORA.</Text>

          <Text style={styles.footerText}>
            Your comfort, our priority.
          </Text>

          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logoutText}>
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <BottomNavigation activeTab="home" />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    padding: 20,
    paddingTop: 55,
    paddingBottom: 25,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  logo: {
    fontSize: 27,
    fontWeight: '900',
    letterSpacing: 3,
    color: COLORS.primary,
  },

  tagline: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 3,
  },

  profileButton: {
    height: 45,
    width: 45,
    borderRadius: 25,
    backgroundColor: '#E9EDE7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileIcon: {
    fontSize: 22,
  },

  bookingsButton: {
    backgroundColor: '#E6EFE8',
    padding: 17,
    borderRadius: 15,
    marginTop: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  bookingsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  bookingsSubtitle: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 4,
  },

  bookingsArrow: {
    fontSize: 25,
    color: COLORS.primary,
    fontWeight: 'bold',
  },

  destinationsButton: {
    backgroundColor: '#174C3C',
    padding: 16,
    borderRadius: 15,
    marginTop: 13,
    flexDirection: 'row',
    alignItems: 'center',
  },

  destinationIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  destinationIcon: {
    fontSize: 24,
  },

  destinationButtonInfo: {
    flex: 1,
    marginLeft: 13,
  },

  destinationButtonTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },

  destinationButtonSubtitle: {
    fontSize: 11,
    color: '#E0EAE3',
    marginTop: 5,
  },

  destinationArrow: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  greetingContainer: {
    marginTop: 30,
  },

  greeting: {
    fontSize: 25,
    fontWeight: 'bold',
    color: COLORS.text,
  },

  greetingSubtitle: {
    fontSize: 14,
    color: COLORS.muted,
    marginTop: 6,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 13,
    paddingHorizontal: 15,
    height: 52,
    marginTop: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  searchIcon: {
    fontSize: 25,
    color: COLORS.muted,
    marginRight: 10,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
  },

  clearSearch: {
    fontSize: 18,
    color: COLORS.muted,
    padding: 5,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 28,
  },

  categoryContainer: {
    paddingTop: 14,
    paddingBottom: 5,
    gap: 10,
  },

  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 19,
    borderRadius: 25,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  selectedCategory: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  categoryText: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '600',
  },

  selectedCategoryText: {
    color: '#FFFFFF',
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionSubtitle: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 5,
  },

  propertyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    overflow: 'hidden',
    marginTop: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
  },

  propertyImage: {
    width: '100%',
    height: 190,
    backgroundColor: '#E9EDE7',
  },

  propertyInfo: {
    padding: 15,
  },

  propertyTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },

  propertyName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.text,
    flex: 1,
  },

  rating: {
    fontSize: 13,
    color: '#C28B35',
    fontWeight: 'bold',
  },

  propertyLocation: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 8,
  },

  propertyBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 17,
  },

  price: {
    fontSize: 17,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  perNight: {
    fontSize: 11,
    fontWeight: 'normal',
    color: COLORS.muted,
  },

  viewButton: {
    backgroundColor: '#E9EDE7',
    paddingVertical: 9,
    paddingHorizontal: 12,
    borderRadius: 9,
  },

  viewButtonText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: COLORS.primary,
  },

  emptyContainer: {
    alignItems: 'center',
    padding: 35,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginTop: 20,
  },

  emptyIcon: {
    fontSize: 35,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 12,
  },

  emptySubtitle: {
    fontSize: 13,
    color: COLORS.muted,
    marginTop: 5,
  },

  footer: {
    alignItems: 'center',
    paddingVertical: 35,
  },

  footerLogo: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 3,
    color: COLORS.primary,
  },

  footerText: {
    fontSize: 12,
    color: COLORS.muted,
    marginTop: 7,
  },

  logoutText: {
    color: COLORS.danger,
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 17,
  },
});
