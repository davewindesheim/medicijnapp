import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Home from '../App';

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
}));

// Checkt het home component
describe('Home component', () => {

    // Bekijkt of vandaag en morgen medicijnen succesvol laden
    it('displays today and tomorrow items correctly', async () => {
        // Mock AsyncStorage data
        const mockMedicines = [
            { id: 1, name: 'Medicine 1', amount: 2, time: '08:00', days: ['Monday'], notificationEnabled: true },
            { id: 2, name: 'Medicine 2', amount: 1, time: '12:00', days: ['Tuesday'], notificationEnabled: false },
        ];

        AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockMedicines));

    });
});
