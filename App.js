import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TouchableOpacity, FlatList, Alert, ToastAndroid } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import Profile from './screens/Profile';
import Search from './screens/Search';
import SearchModal from './screens/SearchModal';
import Settings from './screens/Settings';
import MedicineSupply from './screens/MedicineSupply';
import Login from './screens/Login';
import Register from './screens/Register';

const Stack = createNativeStackNavigator();

function Home({ navigation, route }) {
  const [data, setData] = useState([]);
  const [showMoreToday, setShowMoreToday] = useState(false);
  const [showMoreTomorrow, setShowMoreTomorrow] = useState(false);

  const loadData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('medicines');
      if (storedData) {
        const parsedData = JSON.parse(storedData);

        await Notifications.cancelAllScheduledNotificationsAsync();

        setData(parsedData);

        parsedData.forEach((item) => {
          if (item.days.includes('Daily') || item.days.includes(currentDay)) {
            scheduleNotification(item);
          }
        });
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveData = async (newData) => {
    try {
      await AsyncStorage.setItem('medicines', JSON.stringify(newData));
      setData(newData);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const currentDate = new Date();
  const tomorrowDate = new Date();
  tomorrowDate.setDate(currentDate.getDate() + 1);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const currentDay = daysOfWeek[currentDate.getDay()];
  const tomorrowDay = daysOfWeek[tomorrowDate.getDay()];

  const todayItems = data.filter(item => item.days.includes('Daily') || item.days.includes(currentDay));
  const tomorrowItems = data.filter(item => item.days.includes('Daily') || item.days.includes(tomorrowDay));

  todayItems.sort((a, b) => parseInt(a.time) - parseInt(b.time));
  tomorrowItems.sort((a, b) => parseInt(a.time) - parseInt(b.time));

  useEffect(() => {
    if (route.params?.searchData) {
      const newData = [...data, route.params.searchData];
      saveData(newData);
    }
  }, [route.params?.searchData]);

  const handleItemClick = async (itemId, itemName) => {
    Alert.alert(
      `${itemName} verwijderen`,
      `Weet je zeker dat je ${itemName} wilt verwijderen?`,
      [
        {
          text: 'Nee',
          style: 'cancel',
        },
        {
          text: 'Ja',
          onPress: async () => {
            const deletedItem = data.find(i => i.id === itemId);
            const newData = data.filter(i => i.id !== itemId);
            saveData(newData);

            const deletionDate = new Date().toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' });


            const deletedMedicineInfo = await AsyncStorage.getItem('deleted_medicines');
            let updatedDeletedMedicines = deletedMedicineInfo ? JSON.parse(deletedMedicineInfo) : [];
            updatedDeletedMedicines = [...updatedDeletedMedicines, { ...deletedItem, deletionDate }];
            const updatedDeletedMedicinesString = JSON.stringify(updatedDeletedMedicines);
            await AsyncStorage.setItem('deleted_medicines', updatedDeletedMedicinesString);

            setDeletedMedicines(updatedDeletedMedicines);

            console.log(updatedDeletedMedicines);

            ToastAndroid.show(`${itemName} Succesvol verwijderd`, ToastAndroid.SHORT);
            loadData();
          },
        },
      ]
    );
  };

  const [deletedMedicines, setDeletedMedicines] = useState([]);

  const scheduleNotification = async (item) => {
    if (!item.notificationEnabled) {
      return;
    }
    const { id, name, amount, time } = item;
    const timeInMinutes = parseInt(time);
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;

    const trigger = new Date();
    trigger.setHours(hours, minutes, 0, 0);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Medicijn herinnering',
        body: `Het is tijd om ${amount}x ${name} te nemen`,
      },
      trigger,
    });
  };


  const toggleNotification = async (itemId) => {
    const newData = data.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, notificationEnabled: !item.notificationEnabled };
        if (updatedItem.notificationEnabled) {
          scheduleNotification(updatedItem);
        } else {
          Notifications.cancelScheduledNotificationAsync(item.id.toString());
        }
        return updatedItem;
      }
      return item;
    });

    saveData(newData);

    loadData();
  };


  const renderItem = ({ item }) => {
    const timeInMinutes = parseInt(item.time);
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    return (
      <TouchableOpacity onPress={() => handleItemClick(item.id, item.name)}>
        <View style={styles.listItem} key={item.id}>
          <Text style={styles.amount}>{item.amount}x</Text>
          <Text style={styles.medAndBrand} numberOfLines={1}>{item.name}, {item.brand}</Text>
          <Text style={item.notificationEnabled ? styles.time : styles.crossedOutTime} onPress={() => toggleNotification(item.id)}>
            {formattedTime}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };


  const toggleShowMoreToday = () => {
    setShowMoreToday(!showMoreToday);
  };

  const toggleShowMoreTomorrow = () => {
    setShowMoreTomorrow(!showMoreTomorrow);
  };

  const currentDateString = currentDate.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' });
  const tomorrowDateString = tomorrowDate.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.contentHeader}>Uw medicijnlijst</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.dayHeader}>Vandaag</Text>
          <Text style={styles.dateText}>{currentDateString}</Text>
        </View>
        <FlatList
          data={showMoreToday ? todayItems : todayItems.slice(0, 5)}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          style={{ flex: 1 }}
        />
        {todayItems.length > 6 && (
          <TouchableOpacity onPress={toggleShowMoreToday}>
            <Text style={{ color: '#0096FF', fontWeight: 'bold', textAlign: 'center' }}>
              {showMoreToday ? 'Minder weergeven' : 'Meer weergeven'}
            </Text>
          </TouchableOpacity>
        )}

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
          <Text style={styles.dayHeader}>Morgen</Text>
          <Text style={styles.dateText}>{tomorrowDateString}</Text>
        </View>
        <FlatList
          data={showMoreTomorrow ? tomorrowItems : tomorrowItems.slice(0, 5)}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          style={{ flex: 1 }}
        />
        {tomorrowItems.length > 6 && (
          <TouchableOpacity onPress={toggleShowMoreTomorrow}>
            <Text style={{ color: '#0096FF', fontWeight: 'bold', textAlign: 'center' }}>
              {showMoreTomorrow ? 'Minder weergeven' : 'Meer weergeven'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Search')}>
          <View style={{ ...styles.iconContainer, alignItems: 'center' }}>
            <FontAwesome name="search" size={50} color="#0096FF" />
          </View>
          <Text style={{ ...styles.buttonText, textAlign: 'center' }}>Zoek medicijn</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function App() {
  const [user, setUser] = useState({ firstName: '', lastName: '' });
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setLoggedIn(true);
  };

  const updateUserInfo = (firstName, lastName) => {
    setUser({ firstName, lastName });
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUserInfo = await AsyncStorage.getItem('userInfo');
        if (storedUserInfo) {
          const userInfo = JSON.parse(storedUserInfo);
          setUser(userInfo);
        }
      } catch (error) {
        console.error('Error loading user info:', error);
      }
    };

    loadUserData();
  }, []);

  return (
    <NavigationContainer>
      {loggedIn ? (
        <Stack.Navigator
          screenOptions={{
            headerShadowVisible: false,
            headerTitleAlign: 'center',
          }}>
          <Stack.Screen
            name="Home"
            options={({ navigation }) => ({
              headerRight: () => (
                <View style={{ flexDirection: 'row', marginRight: 10, marginTop: 5 }}>
                  <TouchableOpacity
                    onPress={() => { navigation.navigate('MedicineSupply') }}
                    style={{ marginRight: 10 }}
                  >
                    <MaterialIcons name="inventory" size={30} color="#0096FF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => { navigation.navigate('Settings') }}
                  >
                    <FontAwesome name="gear" size={30} color="#0096FF" />
                  </TouchableOpacity>
                </View>
              ),
              headerLeft: () => (
                <View style={styles.header}>
                  <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <FontAwesome name="user" size={30} color="#0096FF" />
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 10 }}>
                          {user.firstName} {user.lastName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              ),
              headerTitle: '',
            })}
          >
            {(props) => <Home {...props} user={user} />}
          </Stack.Screen>
          <Stack.Screen
            name="Search"
            component={Search}
            options={({ navigation }) => ({
              headerRight: () => (
                <TouchableOpacity
                  style={{ marginRight: 10, marginTop: 5 }}
                  onPress={() => navigation.navigate('SearchModal')}>
                  <FontAwesome name="plus" size={30} color="#0096FF" />
                </TouchableOpacity>
              ),
              headerTitle: 'Zoeken',
            })}
          />
          <Stack.Screen name="Settings"
            component={Settings}
            options={{
              headerTitle: 'Instellingen',
            }} />
          <Stack.Screen
            name="Profile"
            options={({ navigation }) => ({
              headerTitle: 'Profiel',
              headerRight: () => (
                <TouchableOpacity onPress={() => console.log('QR gedrukt')}>
                  <FontAwesome name="qrcode" size={30} color="black" style={{ marginRight: 10 }} />
                </TouchableOpacity>
              ),
            })}
          >
            {(props) => <Profile {...props} user={user} updateUserInfo={updateUserInfo} />}
          </Stack.Screen>
          <Stack.Screen
            name="SearchModal"
            component={SearchModal}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="MedicineSupply"
            component={MedicineSupply}
            options={{
              headerTitle: 'Medicijnvoorraad',
            }}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name="Login" options={{ headerShown: false }}>
            {(props) => (
              <Login
                {...props}
                loggedIn={loggedIn}
                handleLoginSuccess={() => setLoggedIn(true)}
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="Register"
            component={Register}
            options={{
              title: 'Register',
            }}
          />
        </Stack.Navigator>
      )}
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
    width: '100%',
  },
  content: {
    flex: 1,
    flexGrow: 1,
    justifyContent: 'center',
    marginLeft: 20,
    marginRight: 20,
  },
  buttonContainer: {
    marginTop: 60,
    marginBottom: 20,
    alignSelf: 'center',
  },
  iconContainer: {
    marginBottom: 10,
    marginRight: 10,
  },
  buttonText: {
    color: '#0096FF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentHeader: {
    color: '#0096FF',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  dayHeader: {
    color: '#0096FF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 40,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  amount: {
    fontWeight: 'bold',
    fontSize: 15,
    marginRight: 10,
  },
  medAndBrand: {
    fontWeight: 'bold',
    fontSize: 15,
    flex: 1,
    marginRight: 15,
  },
  time: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  crossedOutTime: {
    fontWeight: 'bold',
    fontSize: 15,
    textDecorationLine: 'line-through',
    color: 'gray',
  },
});