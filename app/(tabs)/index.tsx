import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Colors from '@/components/lists/Colors';
import { getAuth } from "firebase/auth";

import { fetchPrimaryVehicle } from "@/js/dbutils";

export default function Home() {
  const [searchText, setSearchText] = useState('');
  const [recentActivity, setRecentActivity] = useState([
    'Added 2022 Tesla Model S to your garage.',
    'AI Assistant: Your next car maintenance is due in 5 days.'
  ]);
  const [primaryVehicle, setPrimaryVehicle] = useState<any>(null);

  useEffect(() => {
    fetchPrimaryVehicle(setPrimaryVehicle);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header section */}
      <View style={styles.headerContainer}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Body section */}
      <ScrollView style={styles.bodyContainer} contentContainerStyle={styles.gridContainer}>

        {/* Welcome Message */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>Hello {getAuth().currentUser?.displayName || 'User'}!</Text>
          <Text style={styles.subText}>Your one-stop solution for managing and tracking your vehicles efficiently.</Text>
        </View>

        {/* Quick Access Buttons */}
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Garage</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Assistant</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Settings</Text>
          </TouchableOpacity>
        </View>

        {/* Primary Vehicle Info */}
        <View style={styles.primaryVehicleContainer}>
          <Text style={styles.sectionTitle}>Primary Vehicle</Text>
          {primaryVehicle ? (
            <Text style={styles.subText}>{primaryVehicle.Make} {primaryVehicle.Model}</Text>
          ) : (
            <Text style={styles.subText}>No primary vehicle</Text>
          )}
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.sectionTitle}>Book an Appointment</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search cars..."
            placeholderTextColor={Colors.inputPlaceholder}
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>book now!</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {recentActivity.map((activity, index) => (
            <View key={index}>
              <Text style={styles.subText}>{activity}</Text>
              {index < recentActivity.length - 1 && (
                <View style={styles.separator} />
              )}
            </View>
          ))}
        </View>

        {/* Garage Overview */}
        <View style={styles.infoContainer}>
          <Text style={styles.sectionTitle}>Garage Overview</Text>
          <Text style={styles.subText}>Total Cars: 5</Text>
          <Text style={styles.subText}>Next Maintenance: {primaryVehicle ? `2022 Tesla Model S in 5 days` : 'N/A'}</Text>
          {/* Adjust the maintenance text based on actual data */}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.back,
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  logo: {
    width: 150,
    height: 50,
  },
  bodyContainer: {
    flex: 1,
    paddingBottom: 40,
  },
  gridContainer: {
    padding: 16,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  welcomeContainer: {
    flexBasis: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.textlight,
    marginBottom: 10,
  },
  subText: {
    paddingBottom: 5,
    color: Colors.textlight,
  },
  buttonsContainer: {
    flexBasis: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  primaryVehicleContainer: {
    flexBasis: '100%',
    backgroundColor: Colors.translight05,
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  infoContainer: {
    flexBasis: '48%',
    backgroundColor: Colors.translight05,
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  activityText: {
    color: Colors.textlight,
  },
  searchContainer: {
    flexBasis: '100%',
    marginBottom: 20,
  },
  searchInput: {
    borderColor: Colors.translight1,
    borderWidth: 1,
    padding: 8,
    color: Colors.textlight,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textlight,
    marginBottom: 10,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: Colors.accent,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 12,
    textTransform: 'uppercase',
    color: Colors.textlight,
    fontWeight: 'bold',
  },
  separator: {
    height: 1,
    backgroundColor: Colors.translight1,
    marginVertical: 2,
  },
});
