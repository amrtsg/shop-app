import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView } from 'react-native';
import Colors from '@/components/lists/Colors';
import Icons from '@/components/lists/Icons';
import { FIREBASE_AUTH } from '@/js/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { router } from "expo-router";

export default function RegisterModal({ visible, onClose }) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      const user = userCredential.user;
      
      // Update the user profile with the username
      await updateProfile(user, {
        displayName: username,
      });

      // Navigate or handle success as needed
      router.replace("/");

    } catch (error) {
      alert(error?.message);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Icons.Ionicons name="arrow-back" size={24} color={Colors.textlight} />
        </TouchableOpacity>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Register</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor={Colors.inputPlaceholder}
            onChangeText={text => setUsername(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={Colors.inputPlaceholder}
            onChangeText={text => setEmail(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={Colors.inputPlaceholder}
            onChangeText={text => setPassword(text)}
            secureTextEntry={true}
          />
          <TouchableOpacity style={styles.button} onPress={() => handleRegister()}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    position: 'relative', // Added for positioning the close button
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 999, // Ensuring it's above other elements
    padding: 10,
    borderRadius: 5,
  },
  modalContent: {
    backgroundColor: Colors.back,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.textlight
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: Colors.translight05,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: Colors.textlight,
  },
  button: {
    width: '100%',
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
  closeButtonText: {
    fontSize: 18,
  },
});
