import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, FlatList, Text, TouchableOpacity, Modal } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SearchModal from './SearchModal';

const Search = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);


  const handleSearch = () => {
    console.log('Search:', searchText);

    const fakeData = [
      { id: 12, name: 'Paracetamol', brand: 'Livsane', info: 'funny text hihi', weight: '500', weightUnit: 'mg', },
      { id: 13, name: 'Paracetamol', brand: 'Da', info: 'funny text hihi', weight: '500', weightUnit: 'mg', },
      { id: 14, name: 'Paracetamol', brand: 'HealthyPharm', info: 'funny text hihi', weight: '500', weightUnit: 'mcg', },
      { id: 15, name: 'Paracetamol', brand: 'Sanias', info: 'funny text hihi', weight: '500', weightUnit: 'mcg', },
      { id: 16, name: 'Paracetamol', brand: 'Teva', info: 'funny text hihi', weight: '500', weightUnit: 'mg', },
    ];

    setSearchResults(fakeData);
  };

  const handleResultClick = (item) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchText) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchText]);

  const onAddMedicijnPress = () => {
    console.log('Medicijn toevoegen pressed');
    setIsSearchModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Zoek medicijn"
            value={searchText}
            onChangeText={(text) => setSearchText(text)}
          />
        </View>
      </View>
      <View style={styles.resultsContainer}>
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleResultClick(item)}>
              <View style={styles.resultItem}>
                <Text style={styles.resultName}>{item.name}, {item.brand} - {item.weight}{item.weightUnit}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
        {searchResults.length > 0 && (
          <Text style={styles.noResultsText}>
            Staat uw medicijn er niet tussen? Voeg 'm zelf toe d.m.v. het plusje (+) rechtsboven!
          </Text>
        )}
      </View>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <TouchableOpacity
          style={styles.overlay}
          onPress={handleCloseModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <View style={styles.headerContainer}>
                <TouchableOpacity onPress={handleCloseModal} style={styles.headerButton}>
                  <FontAwesome name="times-circle" size={24} color="lightgray" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{selectedItem && `${selectedItem.name}, ${selectedItem.brand}`}</Text>
              </View>
              <Text>{selectedItem && `Information: ${selectedItem.info}`}</Text>
              <Text>{selectedItem && `Weight: ${selectedItem.weight} ${selectedItem.weightUnit}`}</Text>
              <TouchableOpacity onPress={onAddMedicijnPress} style={styles.addButton}>
                <Text style={styles.addButtonText}>Voeg medicijn toe</Text>
              </TouchableOpacity>
              {isSearchModalVisible && (
                <SearchModal
                  visible={isSearchModalVisible}
                  selectedItem={selectedItem} // Pass the selected item to the SearchModal
                  navigation={navigation}
                />
              )}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
  },
  searchContainer: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'lightgray',
    width: '90%',
    alignSelf: 'center',
    backgroundColor: 'lightgray',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    textAlign: 'center',
  },
  resultsContainer: {
    flex: 1,
    marginTop: 30,
    marginLeft: 20,
    marginRight: 20,
  },
  resultItem: {
    paddingTop: 5,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
    marginTop: 10,
  },
  resultName: {
    fontSize: 16,
    fontWeight: 'bold',

  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    width: '80%',
    borderColor: 'lightgray',
    borderWidth: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0096FF',
    marginLeft: 10,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    left: 10,
  },
  addButton: {
    backgroundColor: '#0096FF',
    borderRadius: 8,
    padding: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noResultsText: {
    flex: 1,
    fontSize: 14,
    textAlign: 'center',
    color: 'gray',
  }
});

export default Search;
