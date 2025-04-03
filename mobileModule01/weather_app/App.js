import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import { 
  SafeAreaView, 
  StatusBar, 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity,
  PermissionsAndroid,
  Platform
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import GestureRecognizer from 'react-native-swipe-gestures';

const AppBar = ({ searchQuery, setSearchQuery, onLocationPress }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.appBar}>
      <View style={[
        styles.searchContainer, 
        isFocused && styles.searchContainerFocused
      ]}>
        <Icon name="search" size={24} color={isFocused ? 'tomato' : 'gray'} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar localização..."
          placeholderTextColor="gray"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close" size={20} color="gray" />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity style={styles.locationButton} onPress={onLocationPress}>
        <Icon name="my-location" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const ScreenWrapper = ({ children, onSwipeLeft, onSwipeRight }) => {
  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80
  };

  return (
    <GestureRecognizer
      onSwipeLeft={onSwipeLeft}
      onSwipeRight={onSwipeRight}
      config={config}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        {children}
      </View>
    </GestureRecognizer>
  );
};

const CurrentlyScreen = ({ locationData, searchQuery, navigation }) => {
  return (
    <ScreenWrapper 
      onSwipeLeft={() => navigation.navigate('Today')}
    >
      <View style={styles.screenContainer}>
        <Text style={styles.screenText}>Currently</Text>
        {locationData && !searchQuery && (
          <View style={styles.locationDataContainer}>
            <Text style={styles.screenText}>Geolocation</Text>
            {locationData.error && (
              <Text style={styles.errorText}>{locationData.error}</Text>
            )}
          </View>
        )}
        {searchQuery && (
          <View style={styles.locationDataContainer}>
            <Text style={styles.screenText}>{searchQuery}</Text>
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
};

const TodayScreen = ({ locationData, searchQuery, navigation }) => {
  return (
    <ScreenWrapper 
      onSwipeLeft={() => navigation.navigate('Weekly')}
      onSwipeRight={() => navigation.navigate('Currently')}
    >
      <View style={styles.screenContainer}>
        <Text style={styles.screenText}>Today</Text>
        {locationData && !searchQuery && (
          <View style={styles.locationDataContainer}>
            <Text style={styles.screenText}>Geolocation</Text>
            {locationData.error && (
              <Text style={styles.errorText}>{locationData.error}</Text>
            )}
          </View>
        )}
        {searchQuery && (
          <View style={styles.locationDataContainer}>
            <Text style={styles.screenText}>{searchQuery}</Text>
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
};

const WeeklyScreen = ({ locationData, searchQuery, navigation }) => {
  return (
    <ScreenWrapper 
      onSwipeRight={() => navigation.navigate('Today')}
    >
      <View style={styles.screenContainer}>
        <Text style={styles.screenText}>Weekly</Text>
        {locationData && !searchQuery && (
          <View style={styles.locationDataContainer}>
            <Text style={styles.screenText}>Geolocation</Text>
            {locationData.error && (
              <Text style={styles.errorText}>{locationData.error}</Text>
            )}
          </View>
        )}
        {searchQuery && (
          <View style={styles.locationDataContainer}>
            <Text style={styles.screenText}>{searchQuery}</Text>
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
};

const Tab = createBottomTabNavigator();

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [locationData, setLocationData] = useState(null);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: "Permissão de Localização",
            message: "Este aplicativo precisa acessar sua localização para fornecer informações meteorológicas precisas.",
            buttonNeutral: "Perguntar Depois",
            buttonNegative: "Cancelar",
            buttonPositive: "OK"
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  };

  const getCurrentLocation = async () => {
    setLocationData(true);
    setSearchQuery('');
  };

  useEffect(() => {
    // getCurrentLocation(); // Descomente se quiser buscar automaticamente
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <AppBar 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        onLocationPress={getCurrentLocation}
      />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Currently') {
                iconName = focused ? 'schedule' : 'schedule';
              } else if (route.name === 'Today') {
                iconName = focused ? 'today' : 'today';
              } else if (route.name === 'Weekly') {
                iconName = focused ? 'date-range' : 'date-range';
              }

              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
            headerShown: false,
          })}
        >
          <Tab.Screen name="Currently">
            {({ navigation }) => (
              <CurrentlyScreen 
                locationData={locationData} 
                searchQuery={searchQuery} 
                navigation={navigation} 
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Today">
            {({ navigation }) => (
              <TodayScreen 
                locationData={locationData} 
                searchQuery={searchQuery} 
                navigation={navigation} 
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Weekly">
            {({ navigation }) => (
              <WeeklyScreen 
                locationData={locationData} 
                searchQuery={searchQuery} 
                navigation={navigation} 
              />
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    elevation: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flex: 1,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  searchContainerFocused: {
    borderColor: 'tomato',
    backgroundColor: 'white',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: 'black',
    paddingVertical: 0,
  },
  locationButton: {
    padding: 4,
  },
  screenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  screenText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  locationDataContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  locationText: {
    fontSize: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default App;