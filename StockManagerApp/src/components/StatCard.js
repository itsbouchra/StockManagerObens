import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import {
  Package,
  AlertCircle,
  ArrowDownCircle,  
  History,
  CheckCircle,
  XCircle,
} from 'lucide-react-native';

const iconMap = {
  package: Package,
  'alert-circle': AlertCircle,
  'arrow-down-circle': ArrowDownCircle,  
  history: History,
  'check-circle': CheckCircle,
  'x-circle': XCircle,
};

const StatCard = ({ label, value, bgColor, iconName, style, onPress }) => {
  const Icon = iconMap[iconName] || Package;

  return (
    <View style={[{
      backgroundColor: bgColor,
      borderRadius: 12,
      padding: 12,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    }, style]}> {/* This View always renders with the complete styling */}
      <View>
        <Text style={{ fontSize: 17, fontWeight: 'bold', color: '#fff' }}>{label}</Text>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#fff' }}>{value}</Text>
      </View>
      <Icon size={33} color="#fff" />

      {onPress && (
        <TouchableOpacity
          onPress={onPress}
          activeOpacity={1} // Ensures no visual feedback on press
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            // backgroundColor: 'rgba(0,0,0,0.1)', // Uncomment for debugging hit area
            borderRadius: 12, // Match parent borderRadius for correct hit area on corners
          }}
        />
      )}
    </View>
  );
};

export default StatCard;
