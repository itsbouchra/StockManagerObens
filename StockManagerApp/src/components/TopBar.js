import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  ArrowLeft,
  Home,
  Boxes,
  Bell,
  Package, 
  Settings,
} from 'lucide-react-native';

const TopBar = ({ title, active = 'home', onGoBack }) => {
  const iconColor = (iconName) => (active === iconName ? '#E1B12C' : 'white');

  const renderIcon = () => {
    switch (active) {
      case 'home':
        return <Home size={28} color={iconColor('home')} />;
      case 'stock':
        return <Boxes size={28} color={iconColor('stock')} />;
         case 'ProductAD':
        return <Package size={28} color={iconColor('ProductAD')} />;
      default:
        return null;
    }
  };

  return (
    <View
      style={{
        backgroundColor: '#708238',
        paddingTop: 40,
        paddingBottom: 12,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        elevation: 4,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {onGoBack && (
          <TouchableOpacity onPress={onGoBack} style={{ marginRight: 16 }}>
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
        )}

        {renderIcon()}
        <Text
          style={{
            color: 'white',
            fontSize: 26,
            fontWeight: 'bold',
            marginLeft: 12,
          }}
        >
          {title}
        </Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity style={{ marginRight: 16 }}>
          <Bell size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Settings size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TopBar;
