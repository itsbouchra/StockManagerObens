import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SupplierDashboardScreen from '../screens/SupplierDashboardScreen';
import SupplierProfileScreen from '../screens/SupplierProfileScreen';
import SupplierSettingsScreen from '../screens/SupplierSettingsScreen';
import SupplierAccountInfoScreen from '../screens/SupplierAccountInfoScreen';
import SupplierNotificationsScreen from '../screens/SupplierNotificationsScreen';

const Stack = createStackNavigator();

const SupplierNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SupplierDashboard"
        component={SupplierDashboardScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SupplierProfile"
        component={SupplierProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SupplierSettings"
        component={SupplierSettingsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SupplierAccountInfo"
        component={SupplierAccountInfoScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SupplierNotifications"
        component={SupplierNotificationsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default SupplierNavigator; 