import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen'; 
import Dashboard from '../screens/Dashboard';
import BottomNavBar from '../components/BottomNavBar';
import CategorieScreen from '../screens/CategorieScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AccountInformationScreen from '../screens/AccountInformationScreen';
import PasswordScreen from '../screens/PasswordScreen';
import SettingsScreen from '../screens/SettingsScreen';


const Stack = createNativeStackNavigator();

const DashboardWithNavbar = ({ navigation }) => (
  <>
    <Dashboard navigation={navigation} />
    <BottomNavBar navigation={navigation} currentRoute="Dashboard" />
  </>
);

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
            title: '',
            headerTransparent: true,
            headerBackTitleVisible: false,
            headerTintColor: '#fff',
          }}
        />
       
        <Stack.Screen
          name="Dashboard"
          component={DashboardWithNavbar}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Categorie"
          component={CategorieScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
  name="Profile"
  component={ProfileScreen}
  options={{ headerShown: false }}
/>
<Stack.Screen
  name="AccountInfo"
  component={AccountInformationScreen}
  options={{ headerShown: false }}
/>
<Stack.Screen
  name="Password"
  component={PasswordScreen}
  options={{ headerShown: false }}
/>
<Stack.Screen
  name="Settings"
  component={SettingsScreen}
  options={{ headerShown: false }}
/>



      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
