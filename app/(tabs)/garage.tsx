import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import Colors from '@/components/lists/Colors';
import Icons from '@/components/lists/Icons';
import AddCarModal from '@/components/modals/AddCarModal';
import RemoveCarModal from '@/components/modals/RemoveCarModal';
import CarStatsModal  from '@/components/modals/CarStatsModal';
import {ProgressBar} from '@/components/ProgressBar'; // Import AnimatedProgressBar component

import { FIRESTORE_DB } from "@/js/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import vehicleMakesImages from '@/components/lists/Logos';
import { fetchUserVehicles, fetchPrimaryID, setPrimaryVehicle } from '@/js/dbutils';

export default function Garage() {
  const user = getAuth().currentUser;
  const [modalVisible, setModalVisible] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [primaryStatus, setPrimaryStatus] = useState({});
  const [selectedVehicle, setSelectedVehicle] = useState(null); //vehicle passed to carstatsmodal

  // Fetch vehicles when component mounts or user changes
  useEffect(() => {
    if (user) {
      console.log("Fetching data for user:", user.uid);
      fetchUserVehicles(setVehicles);
    }
  }, [user]);

  // Fetch primary status for all vehicles when vehicles change
  useEffect(() => {
    const fetchPrimaryStatusForAll = async () => {
      const statusMap = {};
      for (const vehicle of vehicles) {
        const isPrimaryVehicle = await isPrimary(vehicle);
        statusMap[vehicle.id] = isPrimaryVehicle;
      }
      setPrimaryStatus(statusMap);
    };

    if (vehicles.length > 0) {
      fetchPrimaryStatusForAll();
    }
  }, [vehicles]);

  const openModal = (modalType, vehicle) => {
    setActiveModal(modalType);
    setSelectedVehicle(vehicle)
    setModalVisible(true);
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedVehicle(null)
    setModalVisible(false);
  };

  const renderModal = () => {
    switch (activeModal) {
      case 'addcar':
        return (
          <AddCarModal
            visible={modalVisible}
            onClose={closeModal}
            onVehicleAdded={handleAddNewVehicle}
          />
        );
      case 'removecar':
        return (
          <RemoveCarModal
            visible={modalVisible}
            onClose={closeModal}
            vehicles={vehicles}
            onRemoveCars={handleRemoveCars}
          />
        );
      case 'carstats':
        return (
          <CarStatsModal
            visible={modalVisible}
            onClose={closeModal}
            vehicle={selectedVehicle}
          />
        );
      default:
        return null;
    }
  };

  // --- handles to automatically update page on an action ---------------------------------------
  const handleRemoveCars = async (selectedCars) => {
    try {
      const deletePromises = selectedCars.map(carId =>
        deleteDoc(doc(FIRESTORE_DB, 'users', user.uid, 'vehicles', carId))
      );
      await Promise.all(deletePromises);
      console.log("Vehicles removed successfully");
      setVehicles(prevVehicles => prevVehicles.filter(vehicle => !selectedCars.includes(vehicle.id)));
      closeModal();
    } catch (error) {
      console.error("Error removing vehicles: ", error);
      Alert.alert("Error", "Failed to remove vehicles. Please try again.");
    }
  };

  const handleAddNewVehicle = (newVehicle) => {
    setVehicles(prevVehicles => [...prevVehicles, newVehicle]);
    closeModal();
  };

  const handleSetPrimary = async (vehicleId) => {
    try {
      await setPrimaryVehicle(vehicleId);
      const updatedStatusMap = { ...primaryStatus };
      for (const id in updatedStatusMap) {
        updatedStatusMap[id] = id === vehicleId;
      }
      setPrimaryStatus(updatedStatusMap);
    } catch (error) {
      console.error("Error setting primary vehicle:", error);
      Alert.alert("Error", "Failed to set primary vehicle. Please try again.");
    }
  };
  //----------------------------------------------------------------------------------------------

  const isPrimary = async (vehicle) => {
    const primaryID = await fetchPrimaryID();
    return vehicle.id === primaryID;
  }; 

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.bodyContainer}>
        <ScrollView>
          <View style={styles.verticalGridContainer}>
            {vehicles.map((vehicle, index) => (
              <View key={index} style={styles.gridItem}>
                <TouchableOpacity
                  style={styles.rowContainer}
                  onPress={() => openModal('carstats', vehicle)}
                >
                  <View style={styles.textContainer}>
                    <Text style={styles.carName}>{vehicle.Year} {vehicle.Make} {vehicle.Model}</Text>
                    <Text style={styles.carText}>{vehicle.Owner}'s Vehicle</Text>
                    <TouchableOpacity
                      style={styles.setPrimaryButton}
                      onPress={() => handleSetPrimary(vehicle.id)}
                    >
                      {primaryStatus[vehicle.id] ? 
                       <Text style={styles.buttonText}>
                        <Icons.FontAwesome name='star' color={primaryStatus[vehicle.id] ? Colors.orange : Colors.textlight} size={20} />  Primary vehicle</Text> 
                       :
                       <Text style={styles.buttonText}>
                        <Icons.FontAwesome name='star' color={primaryStatus[vehicle.id] ? Colors.orange : Colors.textlight} size={20} />  Set Primary</Text>
                       }
                    </TouchableOpacity>
                  </View>
                  <Image style={styles.carImage} source={{ uri: vehicleMakesImages[vehicle.Make] }} />
                </TouchableOpacity>

                <View style={styles.progressBarContainer}>
                  <Text style={styles.progressBarText}>Overall Car Health: {50}</Text>
                  <ProgressBar progress={50} />
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => openModal('addcar')}>
          <Icons.FontAwesome style={styles.buttonText} name='plus' color={Colors.accent} size={20} />
          <Text style={styles.buttonText}>Add Vehicle</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => openModal('removecar')}>
          <Icons.FontAwesome style={styles.buttonText} name='minus' color={Colors.textlight} size={20} />
          <Text style={styles.buttonText}>Remove Vehicle</Text>
        </TouchableOpacity>
      </View>

      {renderModal()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.back,
  },
  bodyContainer: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 16,
  },
  verticalGridContainer: {
    justifyContent: 'center',
    paddingBottom: 16,
  },
  gridItem: {
    width: '100%',
    height: 180,
    marginVertical: 8,
    borderRadius: 5,
    backgroundColor: Colors.translight05,
    padding: 20,
    position: 'relative',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
  },
  carName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.textlight,
  },
  carText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.accent,
  },
  carImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  progressBarContainer: {
    marginTop: 10,
    width: '100%',
  },
  progressBarText: {
    fontSize: 14,
    marginBottom: 5, 
    color: 'gray',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 60,
    borderTopWidth: 1,
    paddingTop: 10,
    borderColor: Colors.translight1,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: Colors.trans,
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
  setPrimaryButton: {
    width: 150,
    backgroundColor: Colors.trans,
    borderRadius: 5,
    justifyContent: 'flex-start',
  },
});
