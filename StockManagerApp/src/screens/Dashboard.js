import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text, ScrollView, StyleSheet } from 'react-native';

import StatCard from '../components/StatCard';
import ActivityList from '../components/ActivityList';
import PieChartSection from '../components/PieChartSection';
import TopBar from '../components/TopBar';
import BottomNavBar from '../components/BottomNavBar';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = "http://10.0.2.2:8080";

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

        const transformedDistribution = Object.entries(distribution).map(([category, value], index) => ({
          category,
          value,
          color: ['#83966b', '#cfdccf', '#deb945', '#f59e0b', '#10b981'][index % 5],
        }));

        setDashboardData({
          ...summary,
          recentActivityCount: activities.length,
          activities,
          distribution: transformedDistribution,
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <ScrollView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#00cc99" style={styles.loadingIndicator} />
      </ScrollView>
    );
  }

  if (!dashboardData) {
    return (
      <ScrollView style={[styles.container, styles.errorContainer]}>
        <Text style={styles.errorText}>Failed to load dashboard data.</Text>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar />
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.overviewTitle}>Overview</Text>

        <View style={styles.statsContainer}>
          <StatCard label="Product" value={dashboardData.totalProducts ?? 0} bgColor="#facc15" /> {/* bg-yellow-500 */}
          <StatCard label="Out of stock" value={dashboardData.outOfStock ?? 0} bgColor="#84cc16" /> {/* bg-lime-500 */}
          <StatCard label="Low stock" value={dashboardData.lowStock ?? 0} bgColor="#27272a" /> {/* bg-gray-800 */}
          <StatCard label="Recent activity" value={dashboardData.recentActivityCount ?? 0} bgColor="#86efac" /> {/* bg-green-300 */}
        </View>

        <ActivityList activities={dashboardData.activities} />
        <PieChartSection distributionData={dashboardData.distribution} />
      </ScrollView>
      <BottomNavBar currentRoute="Home" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6', // bg-gray-100
  },
  loadingContainer: {
    paddingTop: 48, // pt-12
  },
  loadingIndicator: {
    marginTop: 40,
  },
  errorContainer: {
    paddingTop: 48, // pt-12
  },
  errorText: {
    fontSize: 24,
    paddingHorizontal: 16,
  },
  contentContainer: {
    paddingTop: 16, // pt-4
    paddingHorizontal: 16, // px-4
  },
  overviewTitle: {
    fontSize: 28, // text-3xl
    fontWeight: '700', // font-bold
    marginBottom: 16, // mb-4
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 24, // mb-6
  },
});

export default Dashboard;
