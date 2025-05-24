import React from 'react';
import { View, Text } from 'react-native';
import {
  Package,
  AlertCircle,
  ArrowDownCircle,  
  History,
} from 'lucide-react-native';

const iconMap = {
  package: Package,
  'alert-circle': AlertCircle,
  'arrow-down-circle': ArrowDownCircle,  
  history: History,
};

const StatCard = ({ label, value, bgColor, iconName, style }) => {
  const Icon = iconMap[iconName] || Package;

  return (
    <View style={[{
      backgroundColor: bgColor,
      borderRadius: 12,
      padding: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    }, style]}>
      <View>
        <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#fff' }}>{label}</Text>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>{value}</Text>
      </View>
      <Icon size={33} color="#fff" />
    </View>
  );
};

export default StatCard;
