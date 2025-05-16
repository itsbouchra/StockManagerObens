import React from 'react';
import { View, Text } from 'react-native';
const ActivityList = ({ activities }) => {
  return (
    <View className="mt-6 px-4">
      <Text className="text-xl font-semibold mb-2">Recent Activities</Text>
      {activities.map((item, index) => (
        <Text key={index} className="mb-1 text-base text-gray-700">• {item}</Text>
      ))}
    </View>
  );
};

export default ActivityList;
