import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const PieChartSection = ({ distributionData }) => {
  const data = distributionData?.map((item, index) => ({
    name: item.category || `Item ${index + 1}`,
    population: item.value,
    color: item.color || ['#83966b', '#cfdccf', '#deb945'][index % 3],
    legendFontColor: '#333',
    legendFontSize: 12,
  })) || [];

  return (
    <View style={styles.container}>
      {data.length > 0 && (
        <PieChart
          data={data}
          width={Dimensions.get('window').width - 40}
          height={160}
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            color: () => '#000',
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#bbf7d0', // Tailwind green-100
    borderRadius: 12,
    marginHorizontal: 16, // mx-4
    padding: 8, // p-2
    marginVertical: 16, // my-4
  },
});

export default PieChartSection;
