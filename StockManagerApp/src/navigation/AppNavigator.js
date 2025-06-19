import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigationRef, getInitialRoute, canAccessScreen } from '../services/navigationService';

// Common Screens
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
import EditProductScreen from '../screens/EditProductScreen';
import ProfileScreen from '../screens/ProfileScreen';
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
import AddLivraisonScreen from '../screens/AddLivraisonScreen';
import LivraisonListScreen from '../screens/LivraisonListScreen';
import AboutAppScreen from '../screens/AboutAppScreen';

// Supplier Screens
import SupplierDashboardScreen from '../screens/SupplierDashboardScreen';
import SupplierSellScreen from '../screens/SupplierSellScreen';
import SupplierProfileScreen from '../screens/SupplierProfileScreen';
import SupplierSettingsScreen from '../screens/SupplierSettingsScreen';
import SupplierReceptionListScreen from '../screens/SupplierReceptionListScreen';
import SupplierPdfViewerScreen from '../screens/SupplierPdfViewerScreen';
import SupplierAccountInfoScreen from '../screens/SupplierAccountInfoScreen';
import SupplierNotificationsScreen from '../screens/SupplierNotificationsScreen';

// Admin Notifications
import AdminNotificationsScreen from '../screens/AdminNotificationsScreen';

// Customer Screens
import CustomerDashboard from '../screens/CustomerDashboard';
import CustomerOrderScreen from '../screens/CustomerOrderScreen';
import CustomerPdfViewerScreen from '../screens/CustomerPdfViewerScreen';
import CustomerProfileScreen from '../screens/CustomerProfileScreen';
import CustomerInformationScreen from '../screens/CustomerInformationScreen';
import CustomerNotificationsScreen from '../screens/CustomerNotificationsScreen';
import CustomerSettingsScreen from '../screens/CustomerSettingsScreen';

const Stack = createNativeStackNavigator();

const DashboardWithNavbar = ({ navigation }) => (
  <>
    <Dashboard navigation={navigation} />
    <BottomNavBar navigation={navigation} currentRoute="Dashboard" />
  </>
);

const AppNavigator = () => {
  const [initialRoute, setInitialRoute] = useState('Welcome');
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const { role } = JSON.parse(userData);
          setUserRole(role);
          setInitialRoute(getInitialRoute(role));
        }
      } catch (error) {
        console.error('Error checking user session:', error);
      }
    };

    checkUserSession();
  }, []);

  const screenOptions = {
    headerShown: false,
  };

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName={initialRoute}>
        {/* Public Screens */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={screenOptions} />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            ...screenOptions,
            headerTransparent: true,
            headerBackTitleVisible: false,
            headerTintColor: '#fff',
          }}
        />

        {/* Admin Screens */}
        {userRole === 'admin' && (
          <>
            <Stack.Screen name="Dashboard" component={DashboardWithNavbar} options={screenOptions} />
            <Stack.Screen name="OutOfStockScreen" component={OutOfStockScreen} options={screenOptions} />
            <Stack.Screen name="Categorie" component={CategorieScreen} options={screenOptions} />
            <Stack.Screen name="ProduitScreen" component={ProduitScreen} options={screenOptions} />
            <Stack.Screen name="ProductAD" component={ProductAD} options={screenOptions} />
            <Stack.Screen name="ProductsAdmin" component={ProductsAdmin} options={screenOptions} />
            <Stack.Screen name="AddProductScreen" component={AddProductScreen} options={screenOptions} />
            <Stack.Screen name="ProductDetailScreen" component={ProductDetailScreen} options={screenOptions} />
            <Stack.Screen name="EditProductScreen" component={EditProductScreen} options={screenOptions} />
            <Stack.Screen name="Profile" component={ProfileScreen} options={screenOptions} />
            <Stack.Screen name="AccountInfo" component={AccountInformationScreen} options={screenOptions} />
            <Stack.Screen name="Password" component={PasswordScreen} options={screenOptions} />
            <Stack.Screen name="Settings" component={SettingsScreen} options={screenOptions} />
            <Stack.Screen name="AddUserScreen" component={AddUserScreen} options={screenOptions} />
            <Stack.Screen name="UsersScreen" component={UsersScreen} options={screenOptions} />
            <Stack.Screen name="BuysScreen" component={BuysScreen} options={screenOptions} />
            <Stack.Screen name="AddOrderScreen" component={AddOrderScreen} options={screenOptions} />
            <Stack.Screen name="EditAchatScreen" component={EditAchatScreen} options={screenOptions} />
            <Stack.Screen name="AddReceptionScreen" component={AddReceptionScreen} options={screenOptions} />
            <Stack.Screen name="UserInfo" component={UserInformationScreen} options={screenOptions} />
            <Stack.Screen name="SettingsCategorieScreen" component={SettingsCategorieScreen} options={screenOptions} />
            <Stack.Screen name="AddCategorieScreen" component={AddCategorieScreen} options={screenOptions} />
            <Stack.Screen name="AddSaleScreen" component={AddSaleScreen} options={screenOptions} />
            <Stack.Screen name="SalesListScreen" component={SalesListScreen} options={screenOptions} />
            <Stack.Screen name="EditVenteScreen" component={EditVenteScreen} options={screenOptions} />
            <Stack.Screen name="AddLivraisonScreen" component={AddLivraisonScreen} options={screenOptions} />
            <Stack.Screen name="LivraisonListScreen" component={LivraisonListScreen} options={screenOptions} />
            <Stack.Screen name="ReceptionListScreen" component={ReceptionListScreen} options={screenOptions} />
            <Stack.Screen name="PdfViewerScreen" component={PdfViewerScreen} options={screenOptions} />
            <Stack.Screen name="ProductReceptionScreen" component={ProductReceptionScreen} options={screenOptions} />
            <Stack.Screen name="AllActivitiesScreen" component={AllActivitiesScreen} options={screenOptions} />
            <Stack.Screen name="AboutApp" component={AboutAppScreen} options={screenOptions} />
            <Stack.Screen name="AdminNotifications" component={AdminNotificationsScreen} options={screenOptions} />
          </>
        )}

        {/* Supplier Screens */}
        {userRole === 'fournisseur' && (
          <>
            <Stack.Screen name="SupplierDashboard" component={SupplierDashboardScreen} options={screenOptions} />
            <Stack.Screen name="SupplierSell" component={SupplierSellScreen} options={screenOptions} />
            <Stack.Screen name="SupplierProfile" component={SupplierProfileScreen} options={screenOptions} />
            <Stack.Screen name="SupplierSettings" component={SupplierSettingsScreen} options={screenOptions} />
            <Stack.Screen name="SupplierReceptionList" component={SupplierReceptionListScreen} options={screenOptions} />
            <Stack.Screen name="SupplierPdfViewerScreen" component={SupplierPdfViewerScreen} options={screenOptions} />
            <Stack.Screen name="SupplierAccountInfo" component={SupplierAccountInfoScreen} options={screenOptions} />
            <Stack.Screen name="SupplierNotifications" component={SupplierNotificationsScreen} options={screenOptions} />
          </>
        )}

        {/* Customer Screens */}
        {userRole === 'client' && (
          <>
            <Stack.Screen name="CustomerDashboard" component={CustomerDashboard} options={screenOptions} />
            <Stack.Screen name="CustomerOrderScreen" component={CustomerOrderScreen} options={screenOptions} />
            <Stack.Screen name="CustomerPdfViewerScreen" component={CustomerPdfViewerScreen} options={screenOptions} />
            <Stack.Screen name="CustomerProfileScreen" component={CustomerProfileScreen} options={screenOptions} />
            <Stack.Screen name="CustomerInformationScreen" component={CustomerInformationScreen} options={screenOptions} />
            <Stack.Screen name="CustomerNotificationsScreen" component={CustomerNotificationsScreen} options={screenOptions} />
            <Stack.Screen name="LivraisonListScreen" component={LivraisonListScreen} options={screenOptions} />
            <Stack.Screen name="CustomerSettingsScreen" component={CustomerSettingsScreen} options={screenOptions} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;