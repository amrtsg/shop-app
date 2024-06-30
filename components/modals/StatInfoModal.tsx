import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Modal } from 'react-native';
import Colors from '@/components/lists/Colors';
import Icons from '@/components/lists/Icons';

export default function StatInfoModal({ visible, onClose }) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Icons.Ionicons name="arrow-back" size={24} color={Colors.accent} />
        </TouchableOpacity>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>IN PROGRESS</Text>
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
    backgroundColor: Colors.back,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
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
    backgroundColor: Colors.transdark,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  loginButton: {
    width: '100%',
    backgroundColor: Colors.accent,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 18,
    color: '#ffffff',
  },
  closeButtonText: {
    fontSize: 18,
    color: '#ffffff',
  },
});
