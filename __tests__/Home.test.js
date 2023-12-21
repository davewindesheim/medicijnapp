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

    // Bekijkt of het home component succesvol opent
    it('renders correctly', () => {
        const { getByText } = render(<Home />);

        // Bekijkt of tekst 'uw medicijnlijst' zichtbaar is
        const medicijnlijstText = getByText('Uw medicijnlijst');
        expect(medicijnlijstText).toBeTruthy();

    });

    // Bekijkt of vandaag en morgen medicijnen succesvol laden
    it('displays today and tomorrow items correctly', async () => {
        // Mock AsyncStorage data
        const mockMedicines = [
            { id: 1, name: 'Medicine 1', amount: 2, time: '08:00', days: ['Monday'], notificationEnabled: true },
            { id: 2, name: 'Medicine 2', amount: 1, time: '12:00', days: ['Tuesday'], notificationEnabled: false },
        ];

        AsyncStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockMedicines));

        const { getByText } = render(<Home />);

        await waitFor(() => {
            expect(AsyncStorage.getItem).toHaveBeenCalled();
        });

        // Bekijkt of tekst 'Vandaag' en 'Morgen' succesvol laden
        const todayHeader = getByText('Vandaag');
        expect(todayHeader).toBeTruthy();

        const tomorrowHeader = getByText('Morgen');
        expect(tomorrowHeader).toBeTruthy();

    });
});