import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import StatCard from '../components/StatCard';
import PieChartSection from '../components/PieChartSection';
import TopBar from '../components/TopBar';

const Dashboard = ({ navigation }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
 
  const API_BASE_URL = 'http://10.0.2.2:8080';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, activityRes, distRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/dashboard/summary`),
          fetch(`${API_BASE_URL}/api/dashboard/activity`),
          fetch(`${API_BASE_URL}/api/dashboard/distribution`),
        ]);

        const summary = await summaryRes.json();
        const activities = await activityRes.json();
        const distribution = await distRes.json();

        const transformedDistribution = Object.entries(distribution).map(
          ([category, value], index) => ({
            category,
            value,
            color: ['#83966b', '#cfdccf', '#deb945', '#f59e0b', '#10b981'][
              index % 5
            ],
          })
        );

        setDashboardData({
          ...summary,
          recentActivityCount: activities.length,
          activities,
          distribution: transformedDistribution,
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f3f4f6',
        }}
      >
        <ActivityIndicator size="large" color="#00cc99" />
      </View>
    );
  }

  if (!dashboardData) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#f3f4f6',
        }}
      >
        <Text style={{ fontSize: 20, paddingHorizontal: 16 }}>
          Failed to load dashboard data.
        </Text>
      </View>
    );
  }

  const cardsData = [
    {
      label: 'Products',
      value: dashboardData.totalProducts ?? 0,
      bgColor: '#E1B12C', // gold
      iconName: 'package',
    },
    {
      label: 'Out of Stock',
      value: dashboardData.outOfStock ?? 0,
      bgColor: '#A6C34B', // greenish
      iconName: 'alert-circle',
    },
    {
      label: 'Low Stock',
      value: dashboardData.lowStock ?? 0,
      bgColor: '#4A4A4A', // dark gray
      iconName: 'arrow-down-circle',
    },
    {
      label: 'Recent Activity',
      value: dashboardData.recentActivityCount ?? 0,
      bgColor: '#A8BDA0', // light greenish-gray
      iconName: 'history',
    },
  ];

  const renderItem = ({ item }) => (
    <View
      style={{
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#d1d5db',
        paddingHorizontal: 16,
      }}
    >
      <Text>{item.description}</Text>
      <Text style={{ color: '#6b7280' }}>{item.date}</Text>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <TopBar
        title="Overview"
        activeLeftIcon="home"
        onNotificationPress={() => navigation.navigate('AdminNotifications')}
      />
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          padding: 13,
        }}
      >
        {cardsData.map(({ label, value, bgColor, iconName }) => (
          <StatCard
            key={label}
            label={label}
            value={value}
            bgColor={bgColor}
            iconName={iconName}
            style={{ width: '48%', marginBottom: 13, height: 95 }}
          />
        ))}
      </View>
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          marginLeft: 16,
          marginBottom: 8,
        }}
      >
        Recent Activities
      </Text>
      <FlatList
        data={dashboardData.activities}
        keyExtractor={(item, index) =>
          item?.id ? item.id.toString() : index.toString()
        }
        renderItem={renderItem}
        ListFooterComponent={
          <PieChartSection distributionData={dashboardData.distribution} />
        }
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </View>
  );
};

export default Dashboard;
