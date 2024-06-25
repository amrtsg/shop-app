import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, FlatList, KeyboardAvoidingView, Platform, Dimensions, Image } from 'react-native';
import Colors from '@/components/Colors';
import Icons from '@/components/Icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import vehicleMakesImages from '@/components/LogoDB';
import { FIRESTORE_DB } from "@/js/firebase"
import { doc, updateDoc} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { fetchPrimaryID } from '@/js/dbutils';

const { height: windowHeight } = Dimensions.get('window');

export default function RemoveCarModal({ visible, onClose, vehicles, onRemoveCars }) {

  const user = getAuth().currentUser;
  const [selectedCars, setSelectedCars] = useState([]);

  useEffect(() => {
    if (!visible) {
      setSelectedCars([]);
    }
  }, [visible]);

  const toggleSelectCar = (carId) => {
    setSelectedCars((prevSelectedCars) =>
      prevSelectedCars.includes(carId)
        ? prevSelectedCars.filter((id) => id !== carId)
        : [...prevSelectedCars, carId]
    );
  };

  const handleRemoveCars = async () => {
    const primaryVehicleID = await fetchPrimaryID();
    // Loop through selected cars and check if their ID matches primaryVehicleID
    selectedCars.forEach(async (carId) => {
      if (carId === primaryVehicleID) {
        try {
          const userDocRef = doc(FIRESTORE_DB, 'users', user.uid);
          await updateDoc(userDocRef, {
            primary_vehicle: null
          });
          console.log(`Primary vehicle ID ${carId} has been set to null.`);
        } catch (error) {
          console.error('Error setting primary vehicle to null:', error);
        }
      }
    });
  
    // Clear local selection
    setSelectedCars([]);
    onRemoveCars(selectedCars); // Notify parent component about removed cars
  };
  

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
            <View style={styles.titleContainer}>
              <Icons.FontAwesome name="car" size={28} color={Colors.accent} style={styles.titleIcon} />
              <Text style={styles.titleText}>Remove Vehicles</Text>
            </View>
            <View style={styles.scrollViewContainer}>
                {vehicles.length === 0 ? (
                  <Text style={styles.noVehiclesText}>You have no vehicles to remove</Text>
                ) : (
                  <FlatList
                    data={vehicles}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.input,
                          selectedCars.includes(item.id) && styles.selectedVehicleItem,
                        ]}
                        onPress={() => toggleSelectCar(item.id)}
                      >
                        <View style={styles.itemContainer}>
                          <Image style={styles.carImage} source={{ uri: vehicleMakesImages[item.Make] }} />
                          <View style={styles.textContainer}>
                            <Text style={styles.buttonText}>{item.Make} {item.Model} - {item.Owner}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    )}
                  />
                )}
            </View>
            <TouchableOpacity style={styles.button} onPress={handleRemoveCars}>
              <Text style={styles.buttonText}>Remove Selected Vehicles</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
    </Modal>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.back,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 999,
    padding: 10,
    borderRadius: 5,
  },
  modalContent: {
    width: '90%',
    maxHeight: windowHeight * 0.8, // Ensuring the modal content does not exceed 80% of the screen height
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
  scrollViewContainer: {
    width: '100%',
    height: windowHeight * 0.4, // Ensuring the ScrollView container occupies 40% of the screen height
    marginBottom: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  input: {
    backgroundColor: Colors.translight05,
    color: Colors.textlight,
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    fontSize: 16,
  },
  button: {
    backgroundColor: Colors.accent,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    fontSize: 12,
    textTransform: 'uppercase',
    color: Colors.textlight,
    fontWeight: 'bold',
  },
  selectedVehicleItem: {
    backgroundColor: Colors.accent,
  },
  noVehiclesText: {
    fontSize: 18,
    color: Colors.textlight,
    textAlign: 'center',
    marginVertical: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // Start from left to right
  },
  carImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
});