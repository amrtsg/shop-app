import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { Video } from 'expo-av';
import Colors from '@/components/lists/Colors';
import LoginModal from '@/components/modals/LoginModal';
import RegisterModal from '@/components/modals/RegisterModal';
import { getAuth, signOut } from "firebase/auth";
import { router } from "expo-router";

const { width: screenWidth } = Dimensions.get('window');

export default function Landing({ visible, onClose }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (modalType) => {
    setActiveModal(modalType);
    setModalVisible(true);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalVisible(false);
  };

  const handleSignOut = () => {
    signOut(getAuth())
      .then((user) => {
        router.replace("/landing");
      })
      .catch((err) => {
        alert(err?.message);
      });
  };

  // Render the modal based on activeModal state
  const renderModal = () => {
    switch (activeModal) {
      case 'login':
        return (
          <LoginModal
            visible={modalVisible}
            onClose={closeModal}
          />
        );
      case 'register':
        return (
          <RegisterModal
            visible={modalVisible}
            onClose={closeModal}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Video Background */}
      <View style={styles.videoContainer}>
        <Video
          source={require("@/assets/images/vid.mp4")}
          style={styles.video}
          shouldPlay={true}
          isLooping={true}
          resizeMode="cover"
          isMuted
          useNativeControls={false}
          onPlaybackStatusUpdate={status => {
            if (!status.isLoaded) {
              console.log('Playback status error:', status.error);
            }
          }}
        />
        <View style={styles.overlay} />
      </View>

      {/* Main Content */}
      <KeyboardAvoidingView 
        style={styles.contentContainer} 
        behavior={Platform.OS === "ios" ? "padding" : "height"} 
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.headerContainer}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.button} onPress={() => openModal('register')}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => openModal('login')}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Render the modal */}
        {renderModal()}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: Colors.back,
  },
  videoContainer: {
    ...StyleSheet.absoluteFillObject,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust opacity and color as needed
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    width: '100%',
  },
  headerContainer: {
    position: 'absolute',
    top: 40, // Adjust this value as needed
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10, // Ensure header is above overlay
  },
  logo: {
    width: 150,
    height: 50,
  },
  buttonsContainer: {
    marginTop: 50, // Adjust this value to position buttons appropriately
    alignItems: 'center',
    width: '100%',
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
