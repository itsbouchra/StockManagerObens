import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import {
  Home,
  DollarSign,
  ShoppingCart,
  Package, 
  Boxes,
  User,
} from 'lucide-react-native'; // Lucide icons

const BottomNavBar = ({ navigation, currentRoute }) => {
  const iconColor = (routeName) =>
    routeName === currentRoute ? '#E1B12C' : '#FFFFFF';

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#708238',
        paddingVertical: 10,
        height: 60,
        alignItems: 'center',
      }}
    >
      <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
        <Home size={28} color={iconColor('Dashboard')} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Sell')}>
        <DollarSign size={28} color={iconColor('Sell')} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Buy')}>
        <ShoppingCart size={28} color={iconColor('Buy')} />
      </TouchableOpacity>

  
      <TouchableOpacity onPress={() => navigation.navigate('Product')}>
        <Package size={28} color={iconColor('Product')} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('ProductStock')}>
        <Boxes size={28} color={iconColor('ProductStock')} />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
        <User size={28} color={iconColor('Profile')} />
      </TouchableOpacity>
    </View>
  );
};

export default BottomNavBar;
