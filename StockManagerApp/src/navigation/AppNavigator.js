// src/navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';



import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen'; 
import ProfileScreen from '../screens/ProfileScreen';
import DashboardScreen from '../screens/DashboardScreen';


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
          name="Dashboard"
          component={DashboardScreen} // <-- Ici on utilise DashboardScreen.js
          options={{ title: 'Dashboard' }}
        />
  <Stack.Screen   name="Profile"
          component={ProfileScreen}
          options={{ title: '',
           
             headerShown: false ,
            
           
           
           
           }} />

</Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
