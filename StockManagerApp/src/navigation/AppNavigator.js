import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen'; 
import Dashboard from '../screens/Dashboard';
import BottomNavBar from '../components/BottomNavBar';
import CategorieScreen from '../screens/CategorieScreen'; 
import ProduitScreen from '../screens/ProduitScreen'; 
import ProductAD from '../screens/ProductAD'; 


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
          name="ProduitScreen"
          component={ProduitScreen}
          options={{ headerShown: false }}
        />
         <Stack.Screen
          name="ProductAD"
          component={ProductAD}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
