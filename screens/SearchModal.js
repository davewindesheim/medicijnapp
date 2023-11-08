import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Modal, TouchableOpacity, Text, Alert, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { v4 as uuidv4 } from 'uuid';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesome } from '@expo/vector-icons';

const SearchModal = ({ visible, selectedItem, navigation }) => {
  const [name, setMedicine] = useState(selectedItem ? selectedItem.name : '');
  const [brand, setBrand] = useState(selectedItem ? selectedItem.brand : '');
  const [amount, setAmount] = useState('');
  const [weight, setWeight] = useState(selectedItem ? selectedItem.weight : '');
  const [weightUnit, setWeightUnit] = useState(selectedItem ? selectedItem.weightUnit : 'mg');
  const [selectedDays, setSelectedDays] = useState([]);
  const [calculationResult, setCalculationResult] = useState(0);
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const toggleDay = (day) => {
    if (day === 'Daily') {
      setSelectedDays(['Daily']);
    } else {
      setSelectedDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
      setSelectedDays(prev => prev.filter(d => d !== 'Daily'));
    }
  };

  useEffect(() => {
    const amountInt = parseInt(amount, 10);
    const weightInt = parseInt(weight, 10);

    if (!isNaN(amountInt) && !isNaN(weightInt)) {
      setCalculationResult(amountInt * weightInt);
    } else {
      setCalculationResult(0);
    }
  }, [amount, weight]);

  const handleTimeChange = (event, selected) => {
    setShowTimePicker(false);
    if (selected) {
      setSelectedTime(selected);
    }
  };

  const handleSearch = () => {
    if (!name || !brand) {
      alert("Vul zowel de naam als merk in.");
      return;
    }

    const amountInt = parseInt(amount, 10);
    const weightInt = parseInt(weight, 10);

    if (isNaN(amountInt) || isNaN(weightInt)) {
      alert("Hoeveelheid en gewicht moeten in cijfers zijn.");
      return;
    }

    const weightInGrams = weightUnit === 'mg' ? weightInt / 1000 : weightInt;

    const searchData = {
      id: uuidv4(),
      name,
      brand,
      days: selectedDays,
      time: selectedTime.getHours() * 60 + selectedTime.getMinutes(),
      amount: amountInt,
      weight: weightInGrams,
      weightUnit: weightUnit,
    };
    navigation.navigate('Home', { searchData });
  };

  const handlePress = () => {
    const isAnyInputFilled = !!name || !!brand || !!amount || !!weight || selectedDays.length > 0 || weightUnit !== 'mg';;

    if (isAnyInputFilled) {
      Alert.alert(
        'Bevestiging',
        'Weet je zeker dat je wilt teruggaan? Je wijzigingen worden niet opgeslagen.',
        [
          {
            text: 'Annuleren',
            style: 'cancel',
          },
          {
            text: 'Ja',
            onPress: () => {
              navigation.goBack();
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      navigation.goBack();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={styles.modalContainer}>
          <View style={styles.modal}>
            <View style={styles.headerContainer}>
              <TouchableOpacity onPress={handlePress} style={styles.headerButton}>
                <FontAwesome name="times-circle" size={26} color="lightgrey" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Medicijngegevens</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Medicijnnaam"
              value={name}
              onChangeText={(text) => setMedicine(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Merk"
              value={brand}
              onChangeText={(text) => setBrand(text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Hoeveelheid"
              value={amount}
              onChangeText={(text) => setAmount(text)}
              keyboardType="numeric"
            />
            <View style={styles.weightInputContainer}>
              <TextInput
                style={[styles.weightInput, { width: '60%' }]}
                placeholder="Gewicht per pil"
                value={weight}
                onChangeText={(text) => setWeight(text)}
                keyboardType="numeric"
              />
              <Picker
                selectedValue={weightUnit}
                onValueChange={(itemValue) => setWeightUnit(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="mg" value="mg" />
                <Picker.Item label="mcg" value="mcg" />
              </Picker>
            </View>
            <Text style={styles.calculationResultText}>Totaal: {calculationResult} {weightUnit}</Text>
            <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.timeContainer}>
              <FontAwesome name="clock-o" size={24} color="black" style={styles.timeIcon} />
              <Text style={styles.timeText}>{`${selectedTime.getHours().toString().padStart(2, '0')}:${selectedTime.getMinutes().toString().padStart(2, '0')}`}</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={selectedTime}
                mode="time"
                display="spinner"
                style={styles.timePicker}
                onChange={handleTimeChange}
                is24Hour={true}
              />
            )}
            <View style={styles.daysContainer}>
              {['Daily', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                <TouchableOpacity
                  key={day}
                  onPress={() => toggleDay(day)}
                  style={[styles.day, selectedDays.includes(day) && styles.selectedDay]}
                >
                  <Text style={styles.dayText}>{day}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Voeg medicijn toe" onPress={handleSearch} style={styles.button} />
            </View>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(227, 227, 227, 0.8)',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    width: '80%',
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderBottomWidth: 1,
    marginBottom: 10,
    width: '100%',
    paddingLeft: 0,
    paddingRight: 0,
  },
  weightInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  weightInput: {
    height: 40,
    borderColor: 'gray',
    borderBottomWidth: 1,
    marginBottom: 10,
    width: '48%',
    paddingLeft: 0, // Adjusted paddingLeft
    paddingRight: 0, // Added paddingRight
  },
  calculationResultText: {
    marginLeft: 0,
    color: 'gray',
    fontSize: 16,
  },
  picker: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    width: '40%',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  day: {
    backgroundColor: 'white',
    borderRadius: 5,
    paddingVertical: 6,
    paddingHorizontal: 12,
    margin: 5,
    borderWidth: 1,
    borderColor: 'gray',
  },
  selectedDay: {
    backgroundColor: '#0096FF',
  },
  dayText: {
    color: 'gray',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  button: {
    width: '50%',
  },
  timePicker: {
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 5,
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'gray',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  timeIcon: {
    marginRight: 5,
    fontSize: 25,
  },
  timeText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerButton: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0096FF',
    marginLeft: 20,
  },
});

export default SearchModal;
