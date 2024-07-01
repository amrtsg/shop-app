import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Switch,
  Image,
  ScrollView,
} from 'react-native';
import Colors from '@/components/lists/Colors';
import Icons from '@/components/lists/Icons';
import ContactModal from '@/components/modals/ContactModal';
import DeleteModal from '@/components/modals/DelAccModal';
import SignOutModal from '@/components/modals/SignOutModal';
import EditProfileModal from '@/components/modals/EditProfileModal';
import { getAuth } from "firebase/auth";

export default function SettingsPage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [user, setUser] = useState(getAuth().currentUser);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const openModal = (modalType) => {
    setActiveModal(modalType);
    setModalVisible(true);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalVisible(false);
  };

  // Render the modal based on activeModal state
  const renderModal = () => {
    switch (activeModal) {
      case 'contact':
        return (
          <ContactModal
            visible={modalVisible}
            onClose={closeModal}
          />
        );
      case 'delete':
        return (
          <DeleteModal
            visible={modalVisible}
            onClose={closeModal}
          />
        );
      case 'signout':
        return (
          <SignOutModal
            visible={modalVisible}
            onClose={closeModal}
          />
        );
      case 'edit':
        return (
          <EditProfileModal
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

      <View style={styles.profileContainer}>
        <Image
          source={{ uri: 'https://christopherscottedwards.com/wp-content/uploads/2018/07/Generic-Profile.jpg' }}
          style={styles.profileImage}
        />
        <Text style={styles.sectionTitle}>{user?.displayName}</Text>
        <Text style={styles.sectionTitle}>{user?.email}</Text>
        <Text style={styles.rowLabel}>{user?.uid}</Text>
        <TouchableOpacity style={styles.editAcc} onPress={() => openModal('edit')}>
          <Text style={styles.rowLabel}>Edit Profile <Icons.FontAwesome name="edit" size={16} /></Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Email Notifications</Text>
            <Switch value={emailNotifications} onValueChange={() => setEmailNotifications(prev => !prev)} />
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Push Notifications</Text>
            <Switch value={pushNotifications} onValueChange={() => setPushNotifications(prev => !prev)} />
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Dark Mode</Text>
            <Switch value={darkMode} onValueChange={() => setDarkMode(prev => !prev)} />
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.section}>
        <TouchableOpacity style={styles.row} onPress={() => openModal('contact')}>
            <Text style={styles.rowLabel}>Contact Us</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.row} onPress={() => openModal('signout')}>
            <Text style={styles.signout}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.separator} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          <TouchableOpacity style={styles.row} onPress={() => openModal('delete')}>
            <Text style={styles.signout}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.separator} />
      </ScrollView>

      {/* Render the modal */}
      {renderModal()}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.back,
  },
  profileContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    backgroundColor: Colors.back,
    borderBottomWidth: 1,
    borderColor: Colors.translight1,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  editAcc: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    backgroundColor: Colors.translight05,
    borderRadius: 8,
    marginTop: 10,
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 50,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.textlight,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.translight05,
    borderRadius: 8,
    marginBottom: 8,
  },
  rowLabel: {
    fontSize: 16,
    color: Colors.textlight,
  },
  signout: {
    color: Colors.accent,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.translight1,
    marginVertical: 2,
  },
});
