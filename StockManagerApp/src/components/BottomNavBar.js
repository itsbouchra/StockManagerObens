import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const BottomNavBar = ({ navigation, currentRoute }) => {
  const tabs = [
    { name: 'Home', icon: <Ionicons name="home" size={24} color={currentRoute === 'Home' ? '#10b981' : 'gray'} /> },
    { name: 'Buy', icon: <FontAwesome5 name="shopping-cart" size={20} color={currentRoute === 'Buy' ? '#10b981' : 'gray'} /> },
    { name: 'Sell', icon: <MaterialCommunityIcons name="cash-plus" size={24} color={currentRoute === 'Sell' ? '#10b981' : 'gray'} /> },
    { name: 'Product', icon: <Ionicons name="cube-outline" size={24} color={currentRoute === 'Product' ? '#10b981' : 'gray'} /> },
    { name: 'Stock', icon: <MaterialCommunityIcons name="warehouse" size={24} color={currentRoute === 'Stock' ? '#10b981' : 'gray'} /> },
    { name: 'Profile', icon: <Ionicons name="person" size={24} color={currentRoute === 'Profile' ? '#10b981' : 'gray'} /> },
  ];

  return (
    <View className="flex-row justify-around items-center h-16 bg-white border-t">
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => navigation && navigation.navigate(tab.name)}
          className="items-center"
        >
          {tab.icon}
          <Text className={`text-xs ${currentRoute === tab.name ? 'text-green-600' : 'text-gray-500'}`}>
            {tab.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default BottomNavBar;