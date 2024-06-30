import React, { useState } from 'react';
import { StyleSheet, View, Modal, TouchableOpacity, SafeAreaView, ScrollView, Image, Text } from 'react-native';
import Colors from '@/components/lists/Colors';
import Icons from '@/components/lists/Icons';
import StatInfoModal from '@/components/modals/StatInfoModal';
import CircularProgressBar from '@/components/CircProgressBar';
import vehicleMakesImages from '@/components/lists/Logos';

export default function CarStatsModal({ visible, onClose, vehicle }) {
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

  // Render each grid item with icon, progress bar, and info text
  const renderGridItem = (iconName, infoText) => {
    return (
      <View style={styles.gridItem}>
        <TouchableOpacity onPress={() => openModal('statinfo')}>
          <CircularProgressBar
            size={100}
            width={10}
            progress={75}
            backFill={Colors.translight5}
            children={<Icons.MaterialCommunityIcons name={iconName} color={Colors.accent} size={30} />}
          />
        </TouchableOpacity>
        <Text style={styles.infoText}>{infoText}</Text>
      </View>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Close button */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Icons.Ionicons name="arrow-back" size={24} color={Colors.textlight} />
        </TouchableOpacity>

        {/* Car image and name */}
        <View style={styles.carHeaderContainer}>
          <Image
            source={{ uri: vehicleMakesImages[vehicle.Make] }}
            style={styles.carImage}
            resizeMode="contain"
          />
          <Text style={styles.carName}>{vehicle.Year} {vehicle.Make} {vehicle.Model}</Text>
        </View>

        {/* Body section */}
        <View style={styles.bodyContainer}>
          <ScrollView>
            {/* Grid of icons and progress bars */}
            <View style={styles.gridContainer}>
              {renderGridItem('engine', 'Engine Status')}
              {renderGridItem('oil-level', 'Oil Level')}
              {renderGridItem('oil-temperature', 'Oil Temperature')}
              {renderGridItem('car-brake-abs', 'ABS Status')}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
      {/* Render the modal */}
      {modalVisible && (
        <StatInfoModal
          visible={modalVisible}
          onClose={closeModal}
        />
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  carHeaderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  carImage: {
    width: 200,
    height: 150,
  },
  carName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: Colors.textlight,
  },
  bodyContainer: {
    flex: 1,
    marginTop: 20,
    paddingHorizontal: 16,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  gridItem: {
    width: '30%', // based on the number of items per row
    alignItems: 'center',
    marginBottom: 20,
  },
  infoText: {
    textAlign: 'center',
    marginTop: 8,
    color: Colors.textlight,
  },
});
