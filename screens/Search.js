import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';
import SearchModal from './SearchModal'; // Import SearchModal

const Search = () => {
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false); // Add modal visibility state

  const handleSearch = () => {
    // Implement your search functionality here
    console.log('Search:', searchText);
    // You can use the searchText to perform your search logic
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search..."
        value={searchText}
        onChangeText={(text) => setSearchText(text)}
      />
      <Button title="Search" onPress={handleSearch} />

      {/* Add a button to open the modal */}
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Open Search Modal</Text>
      </TouchableOpacity>

      {/* Render the SearchModal */}
      <SearchModal visible={modalVisible} onClose={() => setModalVisible(false)} onSearch={handleSearch} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    flex: 1,
    marginRight: 10,
    paddingLeft: 10,
  },
  buttonText: {
    color: '#0096FF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Search;
