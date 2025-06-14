import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Home, DollarSign, User } from 'lucide-react-native';

const NAV_ITEMS = [
  { route: 'SupplierDashboard', Icon: Home },
  { route: 'SupplierSell', Icon: DollarSign },
  { route: 'SupplierProfile', Icon: User },
];

const SupplierBottomNavBar = ({ navigation, currentRoute }) => {
  const iconColor = (routeName) =>
    routeName === currentRoute ? '#E1B12C' : '#FFFFFF';

  return (
    <View style={styles.navContainer}>
      {NAV_ITEMS.map(({ route, Icon }) => {
        const active = currentRoute === route;
        return (
          <TouchableOpacity
            key={route}
            onPress={() => navigation.navigate(route)}
            activeOpacity={0.75}
            style={[
              styles.iconWrapper,
              active && styles.iconActiveBackground,
            ]}
          >
            <Icon
              size={26}
              color={iconColor(route)}
              style={active && styles.iconActive}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 14,
    height: 73,
    backgroundColor: 'rgba(112, 130, 56, 0.95)',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 10,
  },
  iconWrapper: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconActiveBackground: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  iconActive: {
    transform: [{ scale: 1.1 }],
  },
});

export default SupplierBottomNavBar; 