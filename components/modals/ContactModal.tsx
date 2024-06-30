import React, { useRef, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Animated, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import Icons from '@/components/lists/Icons';
import Colors from '@/components/lists/Colors';

export default function ContactModal({ visible, onClose }) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView style={styles.modalContainer} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Icons.Ionicons name="arrow-back" size={24} color={Colors.textlight} />
        </TouchableOpacity>
        <View style={styles.modalContent}>
          <Animated.View style={styles.titleContainer}>
            <Icons.Ionicons name="mail-outline" size={28} color={Colors.accent} style={styles.titleIcon} />
            <Text style={styles.titleText}>Contact Us</Text>
          </Animated.View>
          <Animated.View style={styles.formContainer}>
            <TextInput style={styles.input} placeholder="Name" placeholderTextColor={Colors.inputPlaceholder} />
            <TextInput style={styles.input} placeholder="Email" placeholderTextColor={Colors.inputPlaceholder} keyboardType="email-address" />
            <TextInput style={styles.textArea} placeholder="Message" placeholderTextColor={Colors.inputPlaceholder} multiline={true} numberOfLines={4} />
            <TouchableOpacity style={styles.button} onPress={() => alert('Message Sent')}>
              <Text style={styles.buttonText}>Send</Text>
            </TouchableOpacity>
          </Animated.View>
          <View style={styles.contactInfoContainer}>
            <View style={styles.contactInfo}>
              <Icons.Ionicons name="call-outline" size={24} color="#ffffff" style={styles.contactIcon} />
              <Text style={styles.contactText}>+1 234 567 890</Text>
            </View>
            <View style={styles.contactInfo}>
              <Icons.Ionicons name="mail-outline" size={24} color="#ffffff" style={styles.contactIcon} />
              <Text style={styles.contactText}>contact@example.com</Text>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.back,
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
    width: '90%',
    backgroundColor: Colors.back,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  titleContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleIcon: {
    marginRight: 10,
  },
  titleText: {
    fontSize: 28,
    color: Colors.textlight,
    fontWeight: 'bold',
  },
  formContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: Colors.translight05,
    color: Colors.textlight,
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    fontSize: 16,
  },
  textArea: {
    backgroundColor: Colors.translight05,
    color: Colors.textlight,
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    fontSize: 16,
    height: 100,
    verticalAlign: 'top',
  },
  button: {
    backgroundColor: Colors.accent,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 12,
    textTransform: 'uppercase',
    color: Colors.textlight,
    fontWeight: 'bold',
  },
  contactInfoContainer: {
    marginTop: 30,
    width: '100%',
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  contactIcon: {
    marginRight: 10,
    color: Colors.accent
  },
  contactText: {
    fontSize: 16,
    color: Colors.textlight,
  },
});
