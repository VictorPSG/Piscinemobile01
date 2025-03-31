import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AppBar = ({ searchQuery, setSearchQuery }) => {
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
      <TouchableOpacity style={styles.locationButton} onPress={() => setSearchQuery("Geolocation")}>
        <Icon name="my-location" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

// Screen Components
const CurrentlyScreen = ({ searchQuery }) => {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenText}>Currently</Text>
      {searchQuery && (
        <Text style={styles.searchResultText}>{searchQuery}</Text>
      )}
    </View>
  );
};

const TodayScreen = ({ searchQuery }) => {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenText}>Today</Text>
      {searchQuery && (
        <Text style={styles.searchResultText}>{searchQuery}</Text>
      )}
    </View>
  );
};

const WeeklyScreen = ({ searchQuery }) => {
  return (
    <View style={styles.screenContainer}>
      <Text style={styles.screenText}>Weekly</Text>
      {searchQuery && (
        <Text style={styles.searchResultText}>{searchQuery}</Text>
      )}
    </View>
  );
};

// Create Bottom Tab Navigator
const Tab = createBottomTabNavigator();

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <AppBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
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
            {() => <CurrentlyScreen searchQuery={searchQuery} />}
          </Tab.Screen>
          <Tab.Screen name="Today">
            {() => <TodayScreen searchQuery={searchQuery} />}
          </Tab.Screen>
          <Tab.Screen name="Weekly">
            {() => <WeeklyScreen searchQuery={searchQuery} />}
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
  searchResultText: {
    fontSize: 20,
	fontWeight: 'bold',
  },
});

export default App;