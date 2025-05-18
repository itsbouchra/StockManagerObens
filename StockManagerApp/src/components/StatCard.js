import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StatCard = ({ label, value, bgColor }) => {
  return (
    <View style={[styles.card, { backgroundColor: bgColor }]}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16, // p-4
    borderRadius: 12,
    margin: 8, // m-2
    width: 144, // w-36 (9rem * 16px)
    justifyContent: 'center',
  },
  label: {
    color: 'white',
    fontSize: 16, // text-base
    fontWeight: '700', // font-bold
  },
  value: {
    color: 'white',
    fontSize: 28, // text-2xl
    marginTop: 8, // mt-2
  },
});

export default StatCard;
