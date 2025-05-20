import React from 'react';
import { View, Text, FlatList } from 'react-native';

const ActivityList = ({ activities }) => {
  return (
    <View className="my-5">
      <Text className="text-lg font-bold mb-2">Recent Activities</Text>
      <FlatList
        data={activities}
        keyExtractor={(item, index) => (item?.id ? item.id.toString() : index.toString())}
        renderItem={({ item }) => (
          <View className="py-2 border-b border-gray-300">
            <Text>{item.description}</Text>
            <Text className="text-gray-500">{item.date}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default ActivityList;