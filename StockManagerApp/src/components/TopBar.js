import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const TopBar = () => {
  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <Ionicons name="home" size={24} color="black" />
        <Text style={styles.title}>Overview</Text>
      </View>
      <View style={styles.rightSection}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="settings-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16, // px-4
    paddingVertical: 12,   // py-3
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20, // text-xl
    fontWeight: '700',
    marginLeft: 8,
  },
  rightSection: {
    flexDirection: 'row',
    gap: 16, // React Native doesn't support 'gap' natively, so we'll use margin on buttons instead
  },
  iconButton: {
    marginLeft: 16,
  },
});

export default TopBar;
