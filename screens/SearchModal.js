import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Modal } from 'react-native';

const SearchModal = ({ visible, onClose, onSearch, navigation }) => {
  const [medicine, setMedicine] = useState('');
  const [brand, setBrand] = useState('');
  const [days, setDays] = useState('');
  const [time, setTime] = useState('');
  const [amount, setAmount] = useState('');
  const [weight, setWeight] = useState('');

  const handleSearch = () => {
    const searchData = { medicine, brand, days, time, amount, weight };
    onSearch(searchData);
    onClose();
  };

  const handlePress = () => {
    navigation.goBack();
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Medicine"
          value={medicine}
          onChangeText={(text) => setMedicine(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Brand"
          value={brand}
          onChangeText={(text) => setBrand(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Days"
          value={days}
          onChangeText={(text) => setDays(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Time"
          value={time}
          onChangeText={(text) => setTime(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Amount"
          value={amount}
          onChangeText={(text) => setAmount(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Weight"
          value={weight}
          onChangeText={(text) => setWeight(text)}
        />
        <Button title="Add Medicine" onPress={handleSearch} />
        <Button title="Close" onPress={handlePress} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: '100%',
    paddingLeft: 10,
  },
});

export default SearchModal;