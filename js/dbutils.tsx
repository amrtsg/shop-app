import { Alert } from 'react-native';

import { doc, getDoc, updateDoc, collection, getDocs, setDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "@/js/firebase";
import { getAuth } from "firebase/auth";

export const fetchUserVehicles = async (setVehicles) => {
  const user = getAuth().currentUser;
  try {
    const vehiclesCollectionRef = collection(FIRESTORE_DB, 'users', user.uid, 'vehicles');
    const vehiclesSnapshot = await getDocs(vehiclesCollectionRef);
    const vehiclesList = vehiclesSnapshot.docs.map(doc => {
      console.log("Vehicle fetched:", doc.data());
      return { id: doc.id, ...doc.data() }; // Include document ID along with data
    });
    setVehicles(vehiclesList);
  } catch (err) {
    console.error("Error fetching vehicles:", err);
  }
};

export const setPrimaryVehicle = async (vehicleId) => {
  const user = getAuth().currentUser;

  try {
    if (user) {
      const userRef = doc(FIRESTORE_DB, 'users', user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        
        // Check if primary_vehicle field exists in the document
        if (userData.hasOwnProperty('primary_vehicle')) {
          // Update existing primary_vehicle field
          await updateDoc(userRef, {
            primary_vehicle: vehicleId
          });
        } else {
          // Create new primary_vehicle field
          await setDoc(userRef, {
            primary_vehicle: vehicleId
          }, { merge: true });
        }

        console.log("Primary vehicle set successfully");
        Alert.alert("Primary vehicle set successfully!");
      } else {
        console.error("User document does not exist");
        // Handle case where user document does not exist
      }
    } else {
      console.error("User not authenticated");
      // Handle case where user is not authenticated
    }
  } catch (error) {
    console.error("Error setting primary vehicle: ", error);
    // Handle error scenario
  }
};

export const fetchPrimaryID = async () => {
  const user = getAuth().currentUser;
  try {
    const userDocRef = doc(FIRESTORE_DB, 'users', user.uid);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      const userData = userDocSnapshot.data();
      const primaryVehicleId = userData.primary_vehicle;
      return primaryVehicleId;
    } else {
      console.log('User document does not exist');
      return null;
    }
  } catch (error) {
    console.error('Error fetching user document:', error);
    return null;
  }
};

export const fetchPrimaryVehicle = async (setPrimaryVehicle) => {
  const user = getAuth().currentUser;
  try {
    if (user) {
      const userRef = doc(FIRESTORE_DB, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.primary_vehicle) {
          const vehicleRef = doc(FIRESTORE_DB, 'users', user.uid, 'vehicles', userData.primary_vehicle);
          const vehicleSnap = await getDoc(vehicleRef);
          if (vehicleSnap.exists()) {
            setPrimaryVehicle(vehicleSnap.data());
          } else {
            console.warn("Primary vehicle document not found");
            setPrimaryVehicle(null);
          }
        } else {
          console.log("Primary vehicle field is null");
          setPrimaryVehicle(null);
        }
      } else {
        console.error("User document does not exist");
        setPrimaryVehicle(null);
      }
    } else {
      console.error("User not authenticated");
      setPrimaryVehicle(null);
    }
  } catch (error) {
    console.error("Error fetching primary vehicle:", error);
    Alert.alert("Error", "Failed to fetch primary vehicle. Please try again.");
    setPrimaryVehicle(null);
  }
};

export const handleRemoveCars = async (selectedCars, setSelectedCars, onRemoveCars) => {
  const primaryVehicleID = await fetchPrimaryID();

  // Loop through selected cars and check if their ID matches primaryVehicleID
  selectedCars.forEach(async (carId:any) => {
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