import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const ActivityList = ({ activities }) => {
  return (
    <View style={styles.activityListContainer}>
      <Text style={styles.activityListTitle}>Recent Activities</Text>
      <FlatList
        data={activities}
        keyExtractor={(item, index) => (item?.id ? item.id.toString() : index.toString())}
        renderItem={({ item }) => (
          <View style={styles.activityItem}>
            <Text>{item.description}</Text>
            <Text style={styles.activityDate}>{item.date}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  activityListContainer: {
    marginVertical: 20, // "my-5"
  },
  activityListTitle: {
    fontSize: 18, // "text-lg"
    fontWeight: '700', // "font-bold"
    marginBottom: 8, // "mb-2"
  },
  activityItem: {
    paddingVertical: 8, // "py-2"
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db', // Tailwind gray-300 hex
  },
  activityDate: {
    color: '#6b7280', // Tailwind gray-500 hex
  },
});

export default ActivityList;
