import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView } from 'react-native';
import Colors from '@/components/lists/Colors';
import Icons from '@/components/lists/Icons';

import { getAuth } from "firebase/auth";

export default function DeleteModal({ visible, onClose }) {

  let user = getAuth().currentUser;

  const handleDelete = () => {
    user?.delete();
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
          <Text style={styles.modalTitle}>Are you sure?</Text>
          <Text style={styles.modalText}>This action is irreversible! Once your account is deleted, you WILL NOT get it back.</Text>
          <TouchableOpacity style={styles.button} onPress={() => handleDelete()}>
            <Text style={styles.buttonText}>I want to delete my account</Text>
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
    backgroundColor: Colors.back,
    position: 'relative', // Added for positioning the close button
    padding: 20,
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
    width: '100%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.textlight
  },
  modalText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#972000',
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: Colors.transdark,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: Colors.textlight,
  },
  button: {
    width: '100%',
    backgroundColor: "#972000",
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
