import React from 'react';
import { View, Text, Button } from 'react-native';

export default function Home({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home</Text>
      <Button
        title="Go to Profile"
        onPress={() => navigation.navigate('Details')}
      />
    </View>
  );
}