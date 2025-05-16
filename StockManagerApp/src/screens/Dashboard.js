import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import StatCard from '../components/StatCard';
import ActivityList from '../components/ActivityList';
import PieChartSection from '../components/PieChartSection';
import { ActivityIndicator } from 'react-native'; 


const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = "http://10.0.2.2:8080"; // Use your local IP if testing on a physical device

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, activityRes, distRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/dashboard/summary`),
          fetch(`${API_BASE_URL}/api/dashboard/activity`),
          fetch(`${API_BASE_URL}/api/dashboard/distribution`)
        ]);

        const summary = await summaryRes.json();
        const activities = await activityRes.json();
        const distribution = await distRes.json();

       const transformedDistribution = Object.entries(distribution).map(([category, value], index) => ({
  category,
  value,
  color: ['#83966b', '#cfdccf', '#deb945', '#f59e0b', '#10b981'][index % 5],
}));

setDashboardData({
  ...summary,
  recentActivityCount: activities.length,
  activities,
  distribution: transformedDistribution
});


        setLoading(false);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

 if (loading) {
  return (
    <ScrollView className="bg-gray-100 pt-12">
      <ActivityIndicator size="large" color="#00cc99" style={{ marginTop: 40 }} />
    </ScrollView>
  );
}

  if (!dashboardData) {
    return (
      <ScrollView className="bg-gray-100 pt-12">
        <Text className="text-2xl px-4">Failed to load dashboard data.</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView className="bg-gray-100 pt-12">
      <Text className="text-3xl font-bold px-4 mb-4">Overview</Text>

      <View className="flex-row flex-wrap justify-around">
        <StatCard label="Product" value={dashboardData.totalProducts ?? 0} bgColor="bg-yellow-500" />
        <StatCard label="Out of stock" value={dashboardData.outOfStock ?? 0} bgColor="bg-lime-500" />
        <StatCard label="Low stock" value={dashboardData.lowStock ?? 0} bgColor="bg-gray-800" />
        <StatCard label="Recent activity" value={dashboardData.recentActivityCount ?? 0} bgColor="bg-green-300" />
      </View>

      <ActivityList activities={dashboardData.activities} />
      <PieChartSection distributionData={dashboardData.distribution} />
    </ScrollView>
  );
};

export default Dashboard;