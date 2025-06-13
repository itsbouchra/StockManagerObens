import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ActivityList = ({ activities }) => {
  const navigation = useNavigation();

  return (
    <View className="my-5 bg-green-100 p-4 rounded-xl">
      <Text className="text-lg font-bold mb-2">Recent Activities</Text>
      <FlatList
        data={activities}
        keyExtractor={(item, index) => (item?.id ? item.id.toString() : index.toString())}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="flex-row justify-between items-center py-2 border-b border-gray-300"
            onPress={() => navigation.navigate('AllActivities')}
          >
            <Text className="flex-1 text-gray-800 font-semibold">{item.description}</Text>
            <Text className="text-gray-600 text-sm">{item.date}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ActivityList;