// src/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen'; 
import HomeScreen from '../screens/HomeScreen';


const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
  <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
  <Stack.Screen
    name="Welcome"
    component={WelcomeScreen}
    options={{ headerShown: false }}
  />
  <Stack.Screen
    name="Login"
    component={LoginScreen}
          options={{
            title: '', // ❌ supprime le titre "Login"
            headerTransparent: true, // ✅ laisse voir l'image en fond
            headerBackTitleVisible: false, // ❌ cache "Back" (iOS)
            headerTintColor: '#fff', // ✅ flèche blanche
          }}
  />
  <Stack.Screen
    name="Home"
    component={HomeScreen}
    options={{ title: 'Dashboard' }}
  />
</Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
