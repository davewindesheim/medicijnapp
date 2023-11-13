import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';

function Profile({ updateUserInfo }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedUserInfo = await AsyncStorage.getItem('userInfo');
        if (storedUserInfo) {
          const userInfo = JSON.parse(storedUserInfo);
          setFirstName(userInfo.firstName);
          setLastName(userInfo.lastName);
          setAge(userInfo.age);
          setProfilePhoto(userInfo.profilePhoto);
        }
      } catch (error) {
        console.error('Error loading user info:', error);
      }
    };

    loadData();
  }, []);

  const handleSave = async () => {
    updateUserInfo(firstName, lastName);

    try {
      const userInfo = { firstName, lastName, age, profilePhoto };
      await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
    } catch (error) {
      console.error('Error saving user info:', error);
    }

    navigation.goBack();
  };

  const handleUploadPhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setProfilePhoto(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleUploadPhoto}>
        <View style={styles.profilePhotoContainer}>
          {profilePhoto ? (
            <Image source={{ uri: profilePhoto }} style={styles.profilePhoto} />
          ) : (
            <View style={styles.defaultPhoto}>
              <Icon name="camera" size={100} color="#ccc" />
            </View>
          )}
        </View>
      </TouchableOpacity>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Voornaam</Text>
        <TextInput
          style={styles.input}
          placeholder="Vul uw voornaam in"
          value={firstName}
          onChangeText={(text) => setFirstName(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Achternaam</Text>
        <TextInput
          style={styles.input}
          placeholder="Vul uw achternaam in"
          value={lastName}
          onChangeText={(text) => setLastName(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Leeftijd</Text>
        <TextInput
          style={styles.input}
          placeholder="Vul uw leeftijd in"
          value={age}
          onChangeText={(text) => setAge(text)}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePhotoContainer: {
    marginBottom: 40,
    marginTop: -60,
    alignItems: 'center',
  },
  profilePhoto: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 1,
    borderColor: '#0096FF',
  },
  defaultPhoto: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderColor: '#0096FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    width: 200,
  },
  buttonContainer: {
    marginTop: 20,
  },
  saveButton: {
    backgroundColor: '#0096FF',
    padding: 10,
    borderRadius: 5,
    width: 150,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Profile;