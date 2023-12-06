import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet, Modal, ToastAndroid, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

const MedicineSupply = ({ handleItemClick }) => {
    const [medicines, setMedicines] = useState([]);
    const [stockInputs, setStockInputs] = useState([]);
    const [sortCriteria, setSortCriteria] = useState('name');
    const [selectedItemIndex, setSelectedItemIndex] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [deletedMedicines, setDeletedMedicines] = useState([]);
    const [showDeleted, setShowDeleted] = useState(false);

    useEffect(() => {
        const getMedicinesFromStorage = async () => {
            try {
                const medicinesFromStorage = await AsyncStorage.getItem('medicines');

                if (medicinesFromStorage !== null) {
                    const parsedMedicines = JSON.parse(medicinesFromStorage);
                    const sortedMedicines = [...parsedMedicines].sort((a, b) => a.name.localeCompare(b.name));
                    setMedicines(sortedMedicines);
                    const initialStockInputs = sortedMedicines.map((medicine) => (medicine.stock ? medicine.stock.toString() : ''));
                    setStockInputs(initialStockInputs);
                }
            } catch (error) {
                console.error('Fout bij het ophalen van medicijnen:', error);
            }
        };

        getMedicinesFromStorage();
    }, []);

    const handleOpenModal = (index) => {
        setSelectedItemIndex(index);
        setModalVisible(true);
    };

    const handleCloseModal = () => {
        setSelectedItemIndex(null);
        setModalVisible(false);

        const initialStockInputs = medicines.map((medicine) => (medicine.stock ? medicine.stock.toString() : ''));
        setStockInputs(initialStockInputs);
    };

    const handleAddStock = () => {
        const updatedMedicines = [...medicines];
        const newStockValue = parseInt(stockInputs[selectedItemIndex]);

        if (newStockValue >= 0) {
            updatedMedicines[selectedItemIndex].stock = newStockValue;
            setMedicines(updatedMedicines);

            AsyncStorage.setItem('medicines', JSON.stringify(updatedMedicines));
            handleCloseModal();

            ToastAndroid.showWithGravityAndOffset(
                'Voorraad aangepast',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
                25,
                50
            );
        } else {
            ToastAndroid.showWithGravityAndOffset(
                'Voorraad kan niet onder 0 zijn',
                ToastAndroid.SHORT,
                ToastAndroid.BOTTOM,
                25,
                50
            );
        }
    };

    const handleDecreaseStock = () => {
        const updatedStockInputs = [...stockInputs];
        const currentInput = updatedStockInputs[selectedItemIndex];

        const currentValue = parseInt(currentInput);
        if (!isNaN(currentValue) && currentValue > 0) {
            const updatedValue = currentValue - 1;
            updatedStockInputs[selectedItemIndex] = updatedValue.toString();
            setStockInputs(updatedStockInputs);
        }
    };

    const handleIncreaseStock = () => {
        const updatedStockInputs = [...stockInputs];
        const currentInput = updatedStockInputs[selectedItemIndex];
        const updatedValue = (parseInt(currentInput) || 0) + 1;
        updatedStockInputs[selectedItemIndex] = updatedValue.toString();
        setStockInputs(updatedStockInputs);
    };

    const sortMedicines = (criteria) => {
        const sortedMedicines = [...medicines];

        if (criteria === 'nameAZ') {
            sortedMedicines.sort((a, b) => a.name.localeCompare(b.name));
        } else if (criteria === 'nameZA') {
            sortedMedicines.sort((a, b) => b.name.localeCompare(a.name));
        } else if (criteria === 'mostStock') {
            sortedMedicines.sort((a, b) => (b.stock / b.amount) - (a.stock / a.amount));
        } else if (criteria === 'leastStock') {
            sortedMedicines.sort((a, b) => (a.stock / a.amount) - (b.stock / b.amount));
        }

        setMedicines(sortedMedicines);

        const updatedStockInputs = sortedMedicines.map((medicine) => (medicine.stock ? medicine.stock.toString() : ''));
        setStockInputs(updatedStockInputs);
    };

    const calculateEndDate = (medicine) => {
        const daysLeft = Math.floor(medicine.stock / medicine.amount);
        const today = new Date();
        const endDate = new Date(today.getTime() + daysLeft * 24 * 60 * 60 * 1000);

        const day = endDate.getDate().toString().padStart(2, '0');
        const month = (endDate.getMonth() + 1).toString().padStart(2, '0');
        const year = endDate.getFullYear();

        return `${day}-${month}-${year}`;
    };

    const handleSwitchView = async () => {
        setShowDeleted(!showDeleted);

        if (!showDeleted) {
            const deletedMedicineJSON = await AsyncStorage.getItem('deleted_medicines');
            if (deletedMedicineJSON !== null){
              const deletedMedicines = JSON.parse(deletedMedicineJSON)
              console.log(deletedMedicines)
              setDeletedMedicines(deletedMedicines)
            }
          }
      };
  
      return (
        <ScrollView style={styles.container}>
          <View style={styles.sortContainer}>
            <Picker
              selectedValue={sortCriteria}
              style={styles.sortPicker}
              onValueChange={(itemValue) => {
                setSortCriteria(itemValue);
                sortMedicines(itemValue);
              }}
            >
              <Picker.Item label="Naam A-Z" value="nameAZ" />
              <Picker.Item label="Naam Z-A" value="nameZA" />
              <Picker.Item label="Meeste dagen voorraad" value="mostStock" />
              <Picker.Item label="Minste dagen voorraad" value="leastStock" />
            </Picker>
          </View>
          <TouchableOpacity
            style={styles.garbageBinButton}
            onPress={handleSwitchView}
          >
            {showDeleted ? (
                <FontAwesome5 name="pills" size={30} color="#0096FF" />
              ) : (
                <FontAwesome name="trash" size={30} color="#0096FF" />
              )}
          </TouchableOpacity>
          {showDeleted ? (
            deletedMedicines.map((medicine, index) => (
              <TouchableOpacity
                key={index}
                style={styles.medicineContainer}
                onPress={() => handleItemClick(medicine.id, medicine.name)}
              >
                <View style={styles.medicineInfo}>
                  <Text style={styles.medicineName}>{medicine.name}, {medicine.brand}</Text>
                  <Text style={styles.medicineDetails}>{medicine.weight}{medicine.weightUnit}</Text>
                </View>
                <View style={styles.medicineDaysContainer}>
                  <Text style={styles.medicineDaysLeft}>
                    Verwijderd op {medicine.deletionDate}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            medicines.map((medicine, index) => (
              <TouchableOpacity
                key={index}
                style={styles.medicineContainer}
                onPress={() => handleOpenModal(index)}
              >
                <View style={styles.medicineInfo}>
                  <Text style={styles.medicineName}>{medicine.name}, {medicine.brand}</Text>
                  <Text style={styles.medicineDetails}>{medicine.weight}{medicine.weightUnit}</Text>
                </View>
                <View style={styles.medicineDaysContainer}>
                  <Text style={styles.medicineDaysLeft}>
                    Nog {Math.floor(medicine.stock / medicine.amount)} dagen voorraad
                  </Text>
                  <Text style={styles.medicineEndDate}>
                    t/m {calculateEndDate(medicine)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
    
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={handleCloseModal}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={handleCloseModal} style={styles.modalCloseButton}>
                    <FontAwesome name="times-circle" size={26} color="lightgrey" />
                  </TouchableOpacity>
                  <Text style={styles.modalHeaderTitle}>Voorraad aanpassen</Text>
                </View>
                <View style={styles.modalStockInputContainer}>
                  <TouchableOpacity
                    onPress={handleDecreaseStock}
                    style={[
                      styles.modalStockButton,
                      { backgroundColor: stockInputs[selectedItemIndex] <= '0' || !stockInputs[selectedItemIndex] ? '#ccc' : '#007bff' },
                    ]}
                    disabled={stockInputs[selectedItemIndex] <= '0' || !stockInputs[selectedItemIndex]}
                  >
                    <FontAwesome name="minus" size={20} color="white" />
                  </TouchableOpacity>
                  <TextInput
                    style={styles.modalStockInputText}
                    keyboardType="numeric"
                    value={stockInputs[selectedItemIndex] || ''}
                    onChangeText={(text) => setStockInputs((prevStockInputs) => {
                      const sanitizedInput = text.replace(/[^0-9]/g, '');
                      const updatedStockInputs = [...prevStockInputs];
                      updatedStockInputs[selectedItemIndex] = sanitizedInput;
                      return updatedStockInputs;
                    })}
                  />
                  <TouchableOpacity onPress={handleIncreaseStock} style={styles.modalStockButton}>
                    <FontAwesome name="plus" size={20} color="white" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={handleAddStock} style={styles.modalAddButton}>
                  <Text style={styles.modalAddButtonText}>Voeg voorraad toe</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </ScrollView>
      );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 10,
    },
    sortContainer: {
        marginBottom: 30,
    },
    sortPicker: {
        height: 50,
        width: '100%',
    },
    medicineContainer: {
        marginBottom: 10,
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 10,
    },
    garbageBinButton: {
    position: 'absolute',
    top: 45, // Adjust the top value as needed
    right: 10,
    },
    medicineInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    medicineName: {
        fontSize: 16,
        marginBottom: 5,
        fontWeight: 'bold',
    },
    medicineDetails: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    medicineAmount: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    medicineDaysContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    medicineDaysLeft: {
        flex: 1,
        textDecorationLine: 'underline',
    },
    medicineEndDate: {
        marginLeft: 10,
        fontStyle: 'italic'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalHeaderTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#0096FF',
    },
    modalCloseButton: {
        marginRight: 10,
    },
    modalStockInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    modalStockButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        margin: 10,
    },
    modalStockInputText: {
        height: 40,
        borderColor: 'gray',
        borderBottomWidth: 1,
        width: 80,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalAddButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    modalAddButtonText: {
        color: '#fff',
    },
});

export default MedicineSupply;