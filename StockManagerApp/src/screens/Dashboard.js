import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import StatCard from '../components/StatCard';
import PieChartSection from '../components/PieChartSection';
import TopBar from '../components/TopBar';
import { useAuth } from '../context/AuthContext';
import { ArrowRightCircle, ArrowLeftCircle } from 'lucide-react-native';

const Dashboard = ({ navigation }) => {
  const { unreadNotificationsCount } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
 
  const API_BASE_URL = 'http://10.0.2.2:8080';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, distRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/dashboard/summary`),
          fetch(`${API_BASE_URL}/api/dashboard/distribution`),
        ]);

        const summary = await summaryRes.json();
        const distribution = await distRes.json();

        const transformedActivities = summary.activities.map(activity => {
          const [year, month, day] = activity.date.split('-');
          const formattedDate = `${day}/${month}/${year}`;
          return {
            id: activity.id,
            type: activity.type.toLowerCase(),
            amount: `${activity.montant}dh`,
            date: formattedDate,
          };
        });

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
          activities: transformedActivities.slice(0, 3),
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
      bgColor: '#E1B12C',
      iconName: 'package',
    },
    {
      label: 'Out of Stock',
      value: dashboardData.outOfStock ?? 0,
      bgColor: '#A6C34B',
      iconName: 'alert-circle',
      onPress: () => navigation.navigate('OutOfStockScreen'),
    },
    {
      label: 'Low Stock',
      value: dashboardData.lowStock ?? 0,
      bgColor: '#4A4A4A',
      iconName: 'arrow-down-circle'
    },
    {
      label: 'Recent Activity',
      value: dashboardData.recentActivityCount ?? 0,
      bgColor: '#A8BDA0',
      iconName: 'history',
    },
  ];

  const renderActivityItem = ({ item }) => {
    return (
      <View style={styles.activityItem}>
        <View style={styles.activityTypeContainer}>
          {item.type === 'achat' ? (<ArrowRightCircle size={20} color="#4CAF50" />) : (<ArrowLeftCircle size={20} color="#F44336" />)}
          <Text style={styles.activityDescription}>{item.type}</Text>
        </View>
        <View style={styles.verticalDivider} /><Text style={styles.activityAmount}>{item.amount}</Text>
        <View style={styles.verticalDivider} /><Text style={styles.activityDate}>{item.date}</Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f3f4f6' }}>
      <TopBar
        title="Overview"
        activeLeftIcon="home"
        onGoBack={() => navigation.goBack()}
        onNotificationPress={() => navigation.navigate('AdminNotifications')}
        notificationCount={unreadNotificationsCount}
        onSettingsPress={() => navigation.navigate('Settings')}
      />
      <ScrollView>
        <View><View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              padding: 13,
            }}
          >{cardsData.map(({ label, value, bgColor, iconName, onPress }) => (<React.Fragment key={label}><StatCard label={label} value={value} bgColor={bgColor} iconName={iconName} style={{ width: '48%', marginBottom: 13, height: 95 }} onPress={onPress} /></React.Fragment>))}</View><View><TouchableOpacity
            style={styles.recentActivityBox}
            onPress={() => navigation.navigate('AllActivitiesScreen')}
          ><Text style={styles.recentActivityTitle}>Recent activity</Text>
            <FlatList
              data={dashboardData.activities}
              keyExtractor={(item, index) =>
                item?.id ? item.id.toString() : index.toString()
              }
              renderItem={renderActivityItem}
              scrollEnabled={false}
              contentContainerStyle={{ paddingBottom: 0 }}
            />
          </TouchableOpacity></View><View><Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              marginLeft: 16,
              marginBottom: 8,
            }}
          >
            Distribution des Produits
          </Text><View
            style={{
              backgroundColor: '#ffffff',
              padding: 15,
              borderRadius: 10,
              marginHorizontal: 16,
              marginBottom: 80,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.2,
              shadowRadius: 1.41,
              elevation: 2,
            }}
          >
            <PieChartSection distributionData={dashboardData.distribution} />
          </View></View></View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  recentActivityBox: {
    backgroundColor: '#FFF8E1',
    borderRadius: 15,
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  recentActivityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingRight: 5,
  },
  activityTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  activityDescription: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  activityAmount: {
    fontSize: 16,
    color: '#555',
    fontWeight: 'bold',
  },
  activityDate: {
    fontSize: 14,
    color: '#777',
  },
  verticalDivider: {
    width: 1,
    backgroundColor: '#ccc',
    height: '70%',
    marginHorizontal: 10,
  },
});

export default Dashboard;
