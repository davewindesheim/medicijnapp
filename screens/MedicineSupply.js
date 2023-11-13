import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, TextInput, StyleSheet, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const MedicineSupply = () => {
    const [medicines, setMedicines] = useState([]);
    const [stockInputs, setStockInputs] = useState([]);
    const [sortCriteria, setSortCriteria] = useState('name');
    const [selectedItemIndex, setSelectedItemIndex] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

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
    };

    const handleAddStock = () => {
        const updatedMedicines = [...medicines];
        updatedMedicines[selectedItemIndex].stock = parseInt(stockInputs[selectedItemIndex]);
        setMedicines(updatedMedicines);

        AsyncStorage.setItem('medicines', JSON.stringify(updatedMedicines));
        handleCloseModal();
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
            {medicines.map((medicine, index) => (
                <TouchableOpacity key={index} style={styles.medicineContainer} onPress={() => handleOpenModal(index)}>
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
            ))}

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleCloseModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <TextInput
                            style={styles.stockInput}
                            placeholder="Stock"
                            value={stockInputs[selectedItemIndex] || ''}
                            keyboardType="numeric"
                            onChangeText={(text) => {
                                if (/^\d+$/.test(text) || text === '') {
                                    const updatedStockInputs = [...stockInputs];
                                    updatedStockInputs[selectedItemIndex] = text;
                                    setStockInputs(updatedStockInputs);
                                }
                            }}
                        />
                        <TouchableOpacity onPress={handleAddStock} style={styles.addButton}>
                            <Text>Voeg Stock toe</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                            <Text>Close</Text>
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
        marginBottom: 10,
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
    stockInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    addButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        marginBottom: 5,
    },
    closeButton: {
        padding: 10,
        borderRadius: 5,
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
});

export default MedicineSupply;
