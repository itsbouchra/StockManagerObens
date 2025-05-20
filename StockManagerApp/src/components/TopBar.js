import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  ArrowLeft,
  Home,
  Bell,
  Settings,
} from 'lucide-react-native';

const TopBar = ({ title = 'Overview', onGoBack }) => {
  return (
    <View
      style={{
        backgroundColor: '#708238',
        paddingTop: 40, // adjust for status bar
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
            <ArrowLeft size={24} color="#E1B12C" />
          </TouchableOpacity>
        )}
        <Home size={28} color="#E1B12C" />
        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginLeft: 12 }}>
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
