import React from 'react';
import { View, Text } from 'react-native';
import {
  ChartBar,
  BarChart2,
  PieChart,  // (for example)
  User,      // Use proper icon according to iconName mapping
} from 'lucide-react-native';

// Create a mapping for iconName to Lucide icon components
const iconMap = {
  chart: ChartBar,
  barChart: BarChart2,
  pieChart: PieChart,
  user: User,
  // add more mappings as needed
};

const StatCard = ({ label, value, bgColor, iconName, style }) => {
  const IconComponent = iconMap[iconName] || User; // fallback icon

  return (
    <View
      style={[
        {
          backgroundColor: bgColor,
          borderRadius: 16,
          paddingVertical: 16,
          paddingHorizontal: 12,
          minHeight: 110,
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 4,
          shadowColor: '#000',
          shadowOpacity: 0.25,
          shadowRadius: 4,
          shadowOffset: { width: 0, height: 2 },
        },
        style,
      ]}
    >
      <IconComponent size={30} color="#fff" style={{ marginBottom: 8 }} />
      <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>
        {label}
      </Text>
      <Text style={{ color: 'white', fontSize: 26, fontWeight: 'bold' }}>
        {value}
      </Text>
    </View>
  );
};

export default StatCard;
