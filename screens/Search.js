import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, FlatList, Text, TouchableOpacity, Modal, Linking } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import SearchModal from './SearchModal';
import searchData from '../assets/data.json';

const ITEMS_PER_PAGE = 10;

const Search = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isSearchModalVisible, setIsSearchModalVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = () => {
    console.log('Search:', searchText);

    const filteredData = searchData.filter((item) => {
      const productname = item.PRODUCTNAAM.toLowerCase();
      const searchQuery = searchText.toLowerCase();
      return productname.includes(searchQuery);
    });

    setSearchResults(filteredData);
    setCurrentPage(1); // Reset to the first page when performing a new search
  };

  const handleResultClick = (item) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
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

  const itemsPerPage = ITEMS_PER_PAGE;
  const totalItems = searchResults.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const canGoBack = currentPage > 1;
  const canGoForward = endIndex < totalItems;

  const renderPagination = () => {
    if (searchResults.length === 0) {
      return null;
    }

    return (
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          onPress={handlePrevPage}
          style={[
            styles.paginationButton,
            { opacity: canGoBack ? 1 : 0.5 },
          ]}
          disabled={!canGoBack}
        >
          <Text style={styles.paginationButtonText}>{'<'}</Text>
        </TouchableOpacity>
        <Text style={styles.pageNumberText}>{`Pagina ${currentPage} van de ${totalPages}`}</Text>
        <TouchableOpacity
          onPress={handleNextPage}
          style={[
            styles.paginationButton,
            { opacity: canGoForward ? 1 : 0.5 },
          ]}
          disabled={!canGoForward}
        >
          <Text style={styles.paginationButtonText}>{'>'}</Text>
        </TouchableOpacity>
      </View>
    );
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
          data={searchResults.slice(startIndex, endIndex)}
          keyExtractor={(item, index) => `${item.PRODUCTNAAM}-${index}`}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleResultClick(item)}>
              <View
                key={`${item.PRODUCTNAAM}-${item.brand}`}
                style={styles.resultItem}
              >
                <Text style={styles.resultName}>{item.PRODUCTNAAM}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
        {renderPagination()}
        {searchResults.length === 0 && searchText.length > 0 && (
          <Text style={styles.noResultsText}>
            Geen resultaten? Probeer het opnieuw of voeg het medicijn zelf toe door het
            (+) rechtsboven te klikken!
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
          <View style={styles.modalContent}>
            <View style={styles.headerContainer}>
              <TouchableOpacity onPress={handleCloseModal} style={styles.headerButton}>
                <FontAwesome name="times-circle" size={24} color="lightgray" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>
                {selectedItem && selectedItem.PRODUCTNAAM}
              </Text>
            </View>
            <Text>
              {selectedItem && (
                <Text style={{ fontWeight: 'bold' }}>
                  Vorm:
                </Text>
              )}
              {selectedItem && ` ${selectedItem.FARMACEUTISCHEVORM}`}
            </Text>
            <Text>
              {selectedItem && (
                <Text style={{ fontWeight: 'bold' }}>
                  Hulpstoffen:
                </Text>
              )}
              {selectedItem &&
                selectedItem.HULPSTOFFEN.split("#").map((hulpstof, index) => (
                  <Text key={index}>{index > 0 ? `, ${hulpstof}` : ` ${hulpstof}`}</Text>
                ))
              }
            </Text>

            {selectedItem && (
              <View style={styles.pdfButtonsContainer}>
                <TouchableOpacity
                  onPress={() => handleOpenPDF(selectedItem.SMPC_FILENAAM)}
                  style={[styles.pdfButton, selectedItem.SMPC_FILENAAM ? null : styles.disabledButton]}
                  disabled={!selectedItem.SMPC_FILENAAM}
                >
                  <Text style={styles.pdfButtonText}>SMPC</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleOpenPDF(selectedItem.BIJSLUITER_FILENAAM)}
                  style={[styles.pdfButton, selectedItem.BIJSLUITER_FILENAAM ? null : styles.disabledButton]}
                  disabled={!selectedItem.BIJSLUITER_FILENAAM}
                >
                  <Text style={styles.pdfButtonText}>BIJSLUITER</Text>
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity onPress={onAddMedicijnPress} style={styles.addButton}>
              <Text style={styles.addButtonText}>Voeg medicijn toe</Text>
            </TouchableOpacity>
            {isSearchModalVisible && (
              <SearchModal
                visible={isSearchModalVisible}
                selectedItem={selectedItem}
                navigation={navigation}
              />
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const handleOpenPDF = (filename) => {
  if (filename) {
    Linking.openURL(filename);
  }
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
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginTop: 10,
  },
  paginationButton: {
    backgroundColor: '#0096FF',
    borderRadius: 8,
    padding: 8,
    marginRight: 16,
    marginLeft: 16,
    width: '15%',
    alignItems: 'center',
    marginBottom: 16,
  },
  pageNumberText: {
    color: 'gray',
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
  paginationButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pdfButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  pdfButton: {
    backgroundColor: '#0096FF',
    borderRadius: 8,
    padding: 8,
    margin: 5,
  },
  pdfButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: 'lightgray',
  },
});

export default Search;
