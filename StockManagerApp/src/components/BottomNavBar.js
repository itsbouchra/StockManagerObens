import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import {
  Home,
  DollarSign,
  ShoppingCart,
  Package,
  Boxes,
  User,
} from 'lucide-react-native';

const NAV_ITEMS = [
  { route: 'Dashboard', Icon: Home },
 { route: 'SalesListScreen', Icon: DollarSign, relatedRoutes: ['SalesListScreen', 'AddSaleScreen'] },
  { route: 'BuysScreen', Icon: ShoppingCart },
  { route: 'ProductAD', Icon: Package },
  { route: 'Categorie', Icon: Boxes, iconRoute: 'ProductStock' },
  { route: 'Profile', Icon: User },
];

const BottomNavBar = ({ navigation, currentRoute }) => {
  const iconColor = (routeName) =>
    routeName === currentRoute ? '#E1B12C' : '#FFFFFF';

  return (
    <View style={styles.container}>
      {NAV_ITEMS.map(({ route, Icon, iconRoute }) => (
        <View key={route} style={styles.iconElevatedWrapper}>
          <TouchableOpacity
            onPress={() => navigation.navigate(route)}
            activeOpacity={0.7}
            style={styles.iconWrapper}
          >
            <Icon
              size={28}
              color={iconColor(iconRoute || route)}
              style={
                currentRoute === (iconRoute || route)
                  ? styles.activeIcon
                  : null
              }
            />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(112, 130, 56, 0.95)', // semi-transparent
    paddingTop: 19, // increased to add space above icons
    paddingBottom: 25, // reduced so icons sit inside the bar
    height: 85,
    alignItems: 'flex-end', // align icons to the bottom
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 10,
    // Remove marginHorizontal and marginBottom to avoid white corners
  },
  iconElevatedWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0, // set to 0 so icons stay inside the navbar
    paddingTop: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 8,
    backgroundColor: 'transparent',
    borderRadius: 20,
  },
  iconWrapper: {
    padding: 12, // increased from 8 to 12
    borderRadius: 20, // increased for a bigger circle
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  activeIcon: {
    transform: [{ scale: 1.10 }], // reduced from 1.18 to 1.10
  },
});

export default BottomNavBar;
