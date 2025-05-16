import React from 'react';
import { View, Text } from 'react-native';

const StatCard = ({ label, value, bgColor }) => {
  return (
    <View className={`rounded-xl p-4 m-2 flex-1 justify-center items-center ${bgColor}`}>
      <Text className="text-white text-2xl font-bold">{value}</Text>
      <Text className="text-white text-sm mt-1">{label}</Text>
    </View>
  );
};

export default StatCard;
