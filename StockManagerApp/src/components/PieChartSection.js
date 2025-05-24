import React from 'react';
import { View, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const PieChartSection = ({ distributionData }) => {
  const data = distributionData?.map((item, index) => ({
    name: item.category || `Item ${index + 1}`,
    population: item.value,
    color: item.color,
    legendFontColor: '#333',
    legendFontSize: 12,
  })) || [];

  return (
    <View className="bg-green-100 rounded-xl mx-4 p-2 my-4">
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

export default PieChartSection;