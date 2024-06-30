import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Modal, Text, Switch } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Icons from '@/components/lists/Icons';
import Colors from '@/components/lists/Colors';
import { addDoc, collection } from "firebase/firestore";
import { FIRESTORE_DB } from "@/js/firebase";
import { getAuth } from "firebase/auth";
import { carMakes, carModels } from "@/components/lists/Makes";

export default function AddCarModal({ visible, onClose, onVehicleAdded }) {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [owner, setOwner] = useState('');
  const [year, setYear] = useState('');
  const [vin, setVin] = useState('');
  const [useVin, setUseVin] = useState(false);
  const [models, setModels] = useState([]);
  const [errors, setErrors] = useState({ make: '', model: '', owner: '', year: '', vin: '' });

  useEffect(() => {
    if (make) {
      setModels(carModels[make] || []);
    } else {
      setModels([]);
    }
  }, [make]);

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (useVin) {
      if (!vin) {
        newErrors.vin = 'Please enter a VIN number.';
        isValid = false;
      }
    } else {
      if (!make) {
        newErrors.make = 'Please select a make.';
        isValid = false;
      }

      if (!model) {
        newErrors.model = 'Please select a model.';
        isValid = false;
      }

      if (!owner) {
        newErrors.owner = 'Please enter the owner name.';
        isValid = false;
      }

      if (!year) {
        newErrors.year = 'Please enter the year.';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAddVehicle = async () => {
    if (!validateForm()) return;

    const user = getAuth().currentUser;
    const vehicleData = useVin
      ? { VIN: vin, Owner: owner }
      : { Make: make, Model: model, Owner: owner, Year: year };

    try {
      const docRef = await addDoc(collection(FIRESTORE_DB, 'users', user.uid, 'vehicles'), vehicleData);

      const newVehicle = {
        id: docRef.id,
        ...vehicleData
      };

      console.log("Vehicle added with ID: ", docRef.id);
      onVehicleAdded(newVehicle); // Pass the new vehicle data back to Home component
      onClose(); // Close the modal after adding vehicle
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

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
          <View style={styles.titleContainer}>
            <Icons.FontAwesome name="car" size={28} color={Colors.accent} style={styles.titleIcon} />
            <Text style={styles.titleText}>Add Vehicle</Text>
          </View>
          <View style={styles.formContainer}>
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Use VIN</Text>
              <Switch
                value={useVin}
                onValueChange={setUseVin}
              />
            </View>

            {useVin ? (
              <View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter VIN"
                  placeholderTextColor={Colors.inputPlaceholder}
                  value={vin}
                  onChangeText={text => setVin(text)}
                />
                {errors.vin ? <Text style={styles.errorText}>{errors.vin}</Text> : null}
              </View>
            ) : (
              <View>
                <Dropdown
                  style={styles.dropdown}
                  containerStyle={styles.dropdownContainer}
                  data={carMakes}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Vehicle Make"
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  textStyle={styles.textStyle}
                  value={make}
                  onChange={item => {
                    setMake(item.value);
                    setModel(''); // Reset model when make changes
                    setModels(carModels[item.value] || []);
                  }}
                />
                {errors.make ? <Text style={styles.errorText}>{errors.make}</Text> : null}
                <Dropdown
                  style={styles.dropdown}
                  containerStyle={styles.dropdownContainer}
                  data={models}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Vehicle Model"
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  textStyle={styles.textStyle}
                  value={model}
                  onChange={item => setModel(item.value)}
                  disabled={!make}
                />
                {errors.model ? <Text style={styles.errorText}>{errors.model}</Text> : null}
                <TextInput
                  style={styles.input}
                  placeholder="Vehicle Owner"
                  placeholderTextColor={Colors.inputPlaceholder}
                  value={owner}
                  onChangeText={text => setOwner(text)}
                />
                {errors.owner ? <Text style={styles.errorText}>{errors.owner}</Text> : null}
                <TextInput
                  style={styles.input}
                  placeholder="Vehicle Year"
                  placeholderTextColor={Colors.inputPlaceholder}
                  value={year}
                  onChangeText={text => setYear(text)}
                />
                {errors.year ? <Text style={styles.errorText}>{errors.year}</Text> : null}
              </View>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={handleAddVehicle}
            >
              <Text style={styles.buttonText}>Add Vehicle</Text>
            </TouchableOpacity>
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
    position: 'relative',
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
    backgroundColor: Colors.back,
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    zIndex: 1,
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
    zIndex: 1,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 18,
    color: Colors.textlight,
  },
  dropdown: {
    marginBottom: 15,
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: Colors.translight05,
  },
  dropdownContainer: {
    zIndex: 1000,
  },
  placeholderStyle: {
    color: Colors.inputPlaceholder,
  },
  selectedTextStyle: {
    color: Colors.textlight,
  },
  textStyle: {
    color: Colors.textlight,
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
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 12,
    textTransform: 'uppercase',
    color: Colors.textlight,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
});
