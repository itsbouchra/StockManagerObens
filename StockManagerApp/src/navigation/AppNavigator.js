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
import ProductsAdmin from '../screens/ProductsAdmin';
import AddProductScreen from '../screens/AddProductScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProductScreen from '../screens/EditProductScreen';
import AccountInformationScreen from '../screens/AccountInformationScreen';
import PasswordScreen from '../screens/PasswordScreen';
import SettingsScreen from '../screens/SettingsScreen';
import UsersScreen from '../screens/UsersScreen';
import AddUserScreen from '../screens/AddUserScreen';
import UserInformationScreen from '../screens/UserInformationScreen';
import SettingsCategorieScreen from '../screens/SettingsCategorieScreen';
import AddCategorieScreen from '../screens/AddCategorieScreen';
import BuysScreen from '../screens/BuysScreen';
import AddOrderScreen from '../screens/AddOrderScreen';
import EditAchatScreen from '../screens/EditAchatScreen';
import AddReceptionScreen from '../screens/AddReceptionScreen';
import AddSaleScreen from '../screens/AddSaleScreen';
import SalesListScreen from '../screens/SalesListScreen';
import EditVenteScreen from '../screens/EditVenteScreen';
import ReceptionListScreen from '../screens/ReceptionListScreen';
import PdfViewerScreen from '../screens/PdfViewerScreen';
import ProductReceptionScreen from '../screens/ProductReceptionScreen';
import AllActivitiesScreen from '../screens/AllActivitiesScreen';
import OutOfStockScreen from '../screens/OutOfStockScreen';

// Import new supplier screens
import SupplierDashboardScreen from '../screens/SupplierDashboardScreen';
import SupplierSellScreen from '../screens/SupplierSellScreen';
import SupplierProfileScreen from '../screens/SupplierProfileScreen';
import SupplierReceptionListScreen from '../screens/SupplierReceptionListScreen';
import SupplierPdfViewerScreen from '../screens/SupplierPdfViewerScreen';
import SupplierAccountInfoScreen from '../screens/SupplierAccountInfoScreen';
import SupplierNotificationsScreen from '../screens/SupplierNotificationsScreen';
import AdminNotificationsScreen from '../screens/AdminNotificationsScreen';
import AboutAppScreen from '../screens/AboutAppScreen';

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
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
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
        <Stack.Screen name="Dashboard" component={DashboardWithNavbar} options={{ headerShown: false }} />
        <Stack.Screen name="OutOfStockScreen" component={OutOfStockScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Categorie" component={CategorieScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ProduitScreen" component={ProduitScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ProductAD" component={ProductAD} options={{ headerShown: false }} />
        <Stack.Screen name="ProductsAdmin" component={ProductsAdmin} options={{ headerShown: false }} />
        <Stack.Screen name="AddProductScreen" component={AddProductScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ProductDetailScreen" component={ProductDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EditProductScreen" component={EditProductScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AccountInfo" component={AccountInformationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Password" component={PasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AddUserScreen" component={AddUserScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UsersScreen" component={UsersScreen} options={{ headerShown: false }} />
        <Stack.Screen name="BuysScreen" component={BuysScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AddOrderScreen" component={AddOrderScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EditAchatScreen" component={EditAchatScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AddReceptionScreen" component={AddReceptionScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UserInfo" component={UserInformationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SettingsCategorieScreen" component={SettingsCategorieScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AddCategorieScreen" component={AddCategorieScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AddSaleScreen" component={AddSaleScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SalesListScreen" component={SalesListScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EditVenteScreen" component={EditVenteScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AllActivitiesScreen" component={AllActivitiesScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ReceptionListScreen" component={ReceptionListScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PdfViewerScreen" component={PdfViewerScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ProductReceptionScreen" component={ProductReceptionScreen} options={{ headerShown: false }} />

        {/* Add new supplier screens */}
        <Stack.Screen name="SupplierDashboard" component={SupplierDashboardScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SupplierSell" component={SupplierSellScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SupplierProfile" component={SupplierProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SupplierReceptionList" component={SupplierReceptionListScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SupplierPdfViewerScreen" component={SupplierPdfViewerScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SupplierAccountInfo" component={SupplierAccountInfoScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SupplierNotifications" component={SupplierNotificationsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AdminNotifications" component={AdminNotificationsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AboutApp" component={AboutAppScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
