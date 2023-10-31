import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const Search = () => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    console.log('Search:', searchText);
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
});

export default Search;
