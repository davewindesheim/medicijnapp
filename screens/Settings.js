import React, { useState, useEffect } from 'react';
import { View, Text, Button, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

export default function Settings() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
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

  const showScheduledNotifications = async () => {
    try {
      const allScheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
      console.log('All scheduled notifications:', allScheduledNotifications);
    } catch (error) {
      console.error('Error getting scheduled notifications:', error);
    }
  };

  const clearScheduledNotifications = async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('All scheduled notifications cleared');
    } catch (error) {
      console.error('Error clearing scheduled notifications:', error);
    }
  };

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
      { id: 1, name: 'Paracetamol', brand: 'Panadol', days: ['Monday', 'Wednesday', 'Friday'], time: '0800', amount: '2', weight: '500', weightUnit: 'mg', stock: 50, notificationEnabled: true },
      { id: 2, name: 'Ibuprofen', brand: 'Advil', days: ['Tuesday', 'Thursday'], time: '1200', amount: '1', weight: '200', weightUnit: 'mg', stock: 30, notificationEnabled: true },
      { id: 3, name: 'Aspirin', brand: 'Bayer', days: ['Daily'], time: '0900', amount: '4', weight: '300', weightUnit: 'mg', stock: 40, notificationEnabled: true },
      { id: 4, name: 'Omeprazole', brand: 'Prilosec', days: ['Daily'], time: '1400', amount: '2', weight: '20', weightUnit: 'mcg', stock: 20, notificationEnabled: true },
      { id: 5, name: 'Loratadine', brand: 'Claritin', days: ['Daily'], time: '0800', amount: '1', weight: '10', weightUnit: 'mg', stock: 60, notificationEnabled: true },
      { id: 6, name: 'Simvastatin', brand: 'Zocor', days: ['Daily'], time: '1400', amount: '2', weight: '40', weightUnit: 'mcg', stock: 25, notificationEnabled: true },
      { id: 7, name: 'Metformin', brand: 'Glucophage', days: ['Daily'], time: '0800', amount: '2', weight: '500', weightUnit: 'mg', stock: 35, notificationEnabled: true },
      { id: 8, name: 'Levothyroxine', brand: 'Synthroid', days: ['Daily'], time: '0700', amount: '1', weight: '100', weightUnit: 'mcg', stock: 45, notificationEnabled: true },
      { id: 9, name: 'Cetirizine', brand: 'Zyrtec', days: ['Daily'], time: '0900', amount: '1', weight: '10', weightUnit: 'mg', stock: 55, notificationEnabled: true },
      { id: 10, name: 'Atorvastatin', brand: 'Lipitor', days: ['Daily'], time: '1300', amount: '5', weight: '20', weightUnit: 'mg', stock: 30, notificationEnabled: true },
      { id: 11, name: 'Amoxicillin', brand: 'Amoxil', days: ['Monday', 'Wednesday', 'Friday'], time: '1000', amount: '1', weight: '250', weightUnit: 'mg', stock: 40, notificationEnabled: true },
      { id: 12, name: 'Ciprofloxacin', brand: 'Cipro', days: ['Tuesday', 'Thursday'], time: '1400', amount: '2', weight: '500', weightUnit: 'mg', stock: 25, notificationEnabled: true },
      { id: 13, name: 'Panadol Extra', brand: 'Panadol', days: ['Monday', 'Thursday'], time: '1200', amount: '1', weight: '500', weightUnit: 'mg', stock: 20, notificationEnabled: true },
      { id: 14, name: 'Advil PM', brand: 'Advil', days: ['Tuesday', 'Friday'], time: '1200', amount: '2', weight: '200', weightUnit: 'mg', stock: 15, notificationEnabled: true },
      { id: 15, name: 'Bayer Aspirin', brand: 'Bayer', days: ['Wednesday'], time: '0900', amount: '2', weight: '300', weightUnit: 'mg', stock: 30, notificationEnabled: true },
      { id: 16, name: 'Prilosec OTC', brand: 'Prilosec', days: ['Thursday'], time: '1100', amount: '1', weight: '20', weightUnit: 'mcg', stock: 15, notificationEnabled: true },
      { id: 17, name: 'Claritin-D', brand: 'Claritin', days: ['Friday'], time: '0800', amount: '1', weight: '20', weightUnit: 'mg', stock: 25, notificationEnabled: true },
      { id: 18, name: 'Zocor Forte', brand: 'Zocor', days: ['Saturday'], time: '1000', amount: '2', weight: '80', weightUnit: 'mcg', stock: 20, notificationEnabled: true },
      { id: 19, name: 'Glucophage XR', brand: 'Glucophage', days: ['Sunday'], time: '0800', amount: '3', weight: '1000', weightUnit: 'mg', stock: 40, notificationEnabled: true },
      { id: 20, name: 'Synthroid Plus', brand: 'Synthroid', days: ['Monday'], time: '0700', amount: '2', weight: '150', weightUnit: 'mcg', stock: 35, notificationEnabled: true },
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
      <Button title="Show Scheduled Notifications" onPress={showScheduledNotifications} />
      <Button title="Clear Scheduled Notifications" onPress={clearScheduledNotifications} />
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
