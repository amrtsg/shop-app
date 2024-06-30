import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { Video } from 'expo-av';
import Colors from '@/components/lists/Colors';
import LoginModal from '@/components/modals/LoginModal';
import RegisterModal from '@/components/modals/RegisterModal';
import { getAuth, signOut } from "firebase/auth";
import { router } from "expo-router";

const { width: screenWidth } = Dimensions.get('window');

export default function notFound({}) {
  const returnHome = () => {
    router.navigate('/');
  };

  return (
      <View style={styles.container}>
          <View style={styles.headerContainer}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.titleContainer}>
          <Text style={styles.title}>Oops! We may or may not have gotten lost here...</Text>
          <Text style={styles.text}>This page doesn't exist</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={returnHome}>
              <Text style={styles.buttonText}>Click here to go back</Text>
            </TouchableOpacity>
          </View>
      </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.back,
  },
  headerContainer: {
    position: 'absolute',
    top: 40, // Adjust this value as needed
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10, // Ensure header is above overlay
  },
  titleContainer: {
    position: 'absolute',
    top: '30%', // Adjust this value as needed
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10, // Ensure header is above overlay
  },
  buttonContainer: {
    flex: 1,
    width: '100%',
    top: '40%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.back,
  },
  logo: {
    width: 150,
    height: 50,
  },
  title: {
    fontSize: 26,
    marginBottom: 100,
    color: Colors.textlight,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    color: Colors.textlight,
    fontWeight: 'bold',
  },
  button: {
    width: screenWidth * 0.8, // Fixed width for buttons
    backgroundColor: Colors.transdark5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    textTransform: 'uppercase',
    color: Colors.textlight,
    fontWeight: 'bold',
  },
});
