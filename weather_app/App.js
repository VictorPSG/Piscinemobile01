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
  Alert,
  PermissionsAndroid,
  Platform
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Geolocation from 'react-native-geolocation-service';

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

const CurrentlyScreen = ({ locationData, searchQuery }) => {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenText}>Currently</Text>
      {locationData && !searchQuery && (  //se tem dados de localização e não tem nada na busca(como um if)
        <View style={styles.locationDataContainer}>
          <Text style={styles.screenText}>Geolocation</Text>
          <Text style={styles.locationText}>Latitude: {locationData.latitude}</Text>
          <Text style={styles.locationText}>Longitude: {locationData.longitude}</Text>
          {locationData.error && (
            <Text style={styles.errorText}>{locationData.error}</Text>
          )}
        </View>
      )}
      {searchQuery && ( //se tem algo na busca
        <View style={styles.locationDataContainer}>
          <Text style={styles.screenText}>{searchQuery}</Text>
        </View>
      )}
    </View>
  );
};

const TodayScreen = ({ locationData, searchQuery }) => {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenText}>Today</Text>
      {locationData && !searchQuery && (
        <View style={styles.locationDataContainer}>
          <Text style={styles.screenText}>Geolocation</Text>
          <Text style={styles.locationText}>Latitude: {locationData.latitude}</Text>
          <Text style={styles.locationText}>Longitude: {locationData.longitude}</Text>
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
  );
};

const WeeklyScreen = ({ locationData, searchQuery }) => {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenText}>Weekly</Text>
      {locationData && !searchQuery && (
        <View style={styles.locationDataContainer}>
          <Text style={styles.screenText}>Geolocation</Text>
          <Text style={styles.locationText}>Latitude: {locationData.latitude}</Text>
          <Text style={styles.locationText}>Longitude: {locationData.longitude}</Text>
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
    return true; // No iOS, a permissão é solicitada diretamente na chamada getCurrentPosition
  };

  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    
    if (!hasPermission) {
      setLocationData({
        latitude: null,
        longitude: null
      });
      return;
    }

    Geolocation.getCurrentPosition(
      (position) => {
        setLocationData({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null
        });
        setSearchQuery('');
      },
      (error) => {
        let errorMessage = "Não foi possível obter a localização";
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = "Permissão de localização negada. Você pode pesquisar manualmente por uma cidade.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMessage = "Localização indisponível. Verifique seu GPS ou conexão.";
        } else if (error.code === error.TIMEOUT) {
          errorMessage = "Tempo esgotado ao tentar obter a localização.";
        }
        
        setLocationData({
          error: errorMessage,
          latitude: null,
          longitude: null
        });
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
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
            {() => <CurrentlyScreen locationData={locationData} searchQuery={searchQuery} />}
          </Tab.Screen>
          <Tab.Screen name="Today">
            {() => <TodayScreen locationData={locationData} searchQuery={searchQuery} />}
          </Tab.Screen>
          <Tab.Screen name="Weekly">
            {() => <WeeklyScreen locationData={locationData} searchQuery={searchQuery} />}
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