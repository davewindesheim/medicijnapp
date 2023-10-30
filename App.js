import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TouchableOpacity, FlatList } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Profile from './screens/Profile'; 
import Search from './screens/Search'; 
import SearchModal from './screens/SearchModal'; 

const Stack = createNativeStackNavigator();

function Home({ navigation }) {
  const data = [
    { id: '1', name: 'Paracetamol', brand: 'HealthyPharm', days: ['Thursday'], time: '1100', amount: '2', weight: '150 mg' },
    { id: '2', name: 'Azathioprine', brand: 'Mylan', days: ['Thursday'], time: '610', amount: '5', weight: '100 mg' },
    { id: '3', name: 'De Pil', brand: 'Yasmin', days: ['Daily'], time: '540', amount: '1', weight: '200 mg' },
    { id: '4', name: 'Ibuprofen', brand: 'HealthyPharm', days: ['Daily'], time: '915', amount: '1', weight: '200 mg' },
  ];
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

  const renderItem = ({ item }) => {
    const timeInMinutes = parseInt(item.time);
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

    return (
      <View style={styles.listItem} key={item.id}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
          {item.amount}x {item.name}, {item.brand} | {formattedTime}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.contentHeader}>Uw medicijnlijst</Text>
        <Text style={styles.dayHeader}>Vandaag</Text>
        <FlatList
          data={todayItems}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
        <Text style={styles.dayHeader}>Morgen</Text>
        <FlatList
          data={tomorrowItems}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          style={{ marginBottom: 200 }} // later wrs aanpassen, zodat lijst stackable is
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Search')}>
          <View style={{ ...styles.iconContainer, alignItems: 'center' }}>
            <FontAwesomeIcon name="search" size={50} color="#0096FF" />
          </View>
          <Text style={{ ...styles.buttonText, textAlign: 'center' }}>Zoek medicijn</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Settings() {
  return (
    <View style={styles.container}>
      <Text>Settings Screen</Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShadowVisible: false,
          headerTitleAlign: 'center',
        }}>
        <Stack.Screen
          name="Home"
          component={Home}
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity
                style={{ marginRight: 10, marginTop: 5 }}
                onPress={() => { navigation.navigate('Settings') }}>
                <FontAwesomeIcon name="gear" size={30} color="#0096FF" />
              </TouchableOpacity>
            ),
            headerLeft: () => (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 5 }}>
                <TouchableOpacity
                  onPress={() => { navigation.navigate('Profile') }}
                  style={{ marginRight: 10 }}>
                  <FontAwesomeIcon name="user" size={30} color="#0096FF" />
                </TouchableOpacity>
                <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Sigrid Kaag</Text>
              </View>
            ),
            headerTitle: '',
          })}
        />
        <Stack.Screen
          name="Search"
          component={Search}
          options={({ navigation }) => ({
            headerRight: () => (
              <TouchableOpacity
                style={{ marginRight: 10, marginTop: 5 }}
                onPress={() => { navigation.navigate('Settings') }}>
                <FontAwesomeIcon name="plus" size={30} color="#0096FF" />
              </TouchableOpacity>
            ),
            headerTitle: 'Search',
          })}
        />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  buttonContainer: {
    marginBottom: 20,
    alignSelf: 'center',
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
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    width: 200,
  },
});