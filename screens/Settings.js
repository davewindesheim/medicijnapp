import React, { useState, useEffect } from 'react';
import { View, Text, Button, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Settings() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Load mode from AsyncStorage when component mounts
    const loadMode = async () => {
      try {
        const mode = await AsyncStorage.getItem('darkMode');
        if (mode !== null) {
          setIsDarkMode(mode === 'true');
        }
      } catch (error) {
        console.error('Error loading mode:', error);
      }
    };

    loadMode();
  }, []);

  const toggleDarkMode = async () => {
    try {
      setIsDarkMode(prevMode => !prevMode);
      await AsyncStorage.setItem('darkMode', (!isDarkMode).toString());
    } catch (error) {
      console.error('Error toggling mode:', error);
    }
  };

  const showLogs = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const items = await AsyncStorage.multiGet(keys);
      console.log(items);
    } catch (error) {
      console.error('Error getting AsyncStorage logs:', error);
    }
  };

  const deleteAllData = async () => {
    try {
      await AsyncStorage.clear();
      console.log('All data deleted');
    } catch (error) {
      console.error('Error deleting data:', error);
    }
  };

  const insertData = async () => {
    const sampleData = [
      { id: 5, name: 'Sample Medicine 1', brand: 'Sample Brand 1', days: ['Daily'], time: '1200', amount: '3', weight: '250', weightUnit: 'mg', },
      { id: 6, name: 'Sample Medicine 6Toolooong', brand: 'Sample Medicine 6Toolooong', days: ['Daily'], time: '800', amount: '1', weight: '100', weightUnit: 'mcg', },
      { id: 7, name: 'Sample Medicine 3', brand: 'Sample Brand 3', days: ['Daily'], time: '600', amount: '3', weight: '250', weightUnit: 'mg', },
      { id: 8, name: 'Sample Medicine 4', brand: 'Sample Brand 4', days: ['Daily'], time: '1400', amount: '1', weight: '100', weightUnit: 'mcg', },
      { id: 9, name: 'Sample Medicine 5', brand: 'Sample Brand 5', days: ['Daily'], time: '200', amount: '3', weight: '250', weightUnit: 'mg', },
      { id: 10, name: 'Sample Medicine 6Toolooong', brand: 'Sample Medicine 6Toolooong', days: ['Daily'], time: '100', amount: '1', weight: '100', weightUnit: 'mcg', },
      { id: 11, name: 'Sample Medicine 3', brand: 'Sample Brand 3', days: ['Daily'], time: '600', amount: '3', weight: '250', weightUnit: 'mg', },
      { id: 12, name: 'Sample Medicine 4', brand: 'Sample Brand 4', days: ['Daily'], time: '1400', amount: '1', weight: '100', weightUnit: 'mcg', },
      { id: 13, name: 'Sample Medicine 6Toolooong', brand: 'Sample Medicine 6Toolooong', days: ['Daily'], time: '200', amount: '3', weight: '250', weightUnit: 'mg', },
      { id: 14, name: 'Sample Medicine 6', brand: 'Sample Brand 6', days: ['Daily'], time: '100', amount: '1', weight: '100', weightUnit: 'mcg', },
    ];

    try {
      await AsyncStorage.setItem('medicines', JSON.stringify(sampleData));
      console.log('Sample data inserted');
    } catch (error) {
      console.error('Error inserting sample data:', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Show AsyncStorage Logs" onPress={showLogs} />
      <Button title="Delete All Data" onPress={deleteAllData} />
      <Button title="Insert Sample Data" onPress={insertData} />

      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
        <Text>Dark Mode:</Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleDarkMode}
        />
      </View>
    </View>
  );
}
