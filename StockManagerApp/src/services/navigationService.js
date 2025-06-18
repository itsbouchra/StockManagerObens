import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export const navigationService = {
  navigate: (name, params) => {
    if (navigationRef.isReady()) {
      navigationRef.navigate(name, params);
    }
  },
  reset: (name, params) => {
    if (navigationRef.isReady()) {
      navigationRef.reset({
        index: 0,
        routes: [{ name, params }],
      });
    }
  },
  goBack: () => {
    if (navigationRef.isReady()) {
      navigationRef.goBack();
    }
  },
};

export const getInitialRoute = (userRole) => {
  switch (userRole) {
    case 'admin':
      return 'Dashboard';
    case 'fournisseur':
      return 'SupplierDashboard';
    case 'client':
      return 'CustomerDashboard';
    default:
      return 'Welcome';
  }
};

export const canAccessScreen = (userRole, screenName) => {
  const roleBasedScreens = {
    admin: [
      'Dashboard',
      'Categorie',
      'ProduitScreen',
      'ProductAD',
      'ProductsAdmin',
      'AddProductScreen',
      'ProductDetailScreen',
      'EditProductScreen',
      'Profile',
      'AccountInfo',
      'Password',
      'Settings',
      'AddUserScreen',
      'UsersScreen',
      'BuysScreen',
      'AddOrderScreen',
      'EditAchatScreen',
      'AddReceptionScreen',
      'UserInfo',
      'SettingsCategorieScreen',
      'AddCategorieScreen',
      'AddSaleScreen',
      'SalesListScreen',
      'EditVenteScreen',
      'AddLivraisonScreen',
      'ReceptionListScreen',
      'PdfViewerScreen',
      'ProductReceptionScreen',
      'AllActivitiesScreen',
      'AboutApp',
      'AdminNotifications',
    ],
    fournisseur: [
      'SupplierDashboard',
      'SupplierSell',
      'SupplierProfile',
      'SupplierSettings',
      'SupplierReceptionList',
      'SupplierPdfViewerScreen',
      'SupplierAccountInfo',
      'SupplierNotifications',
    ],
    client: [
      'CustomerDashboard',
      'CustomerOrderScreen',
      'CustomerPdfViewerScreen',
      'CustomerProfileScreen',
      'CustomerInformationScreen',
      'CustomerNotificationsScreen',
      'CustomerSettingsScreen',
      'LivraisonListScreen',
    ],
  };

  return roleBasedScreens[userRole]?.includes(screenName) || false;
}; 