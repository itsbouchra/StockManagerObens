import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Platform // Import Platform for OS-specific date picker handling
} from 'react-native';
import { ArrowRightCircle, ArrowLeftCircle, XCircle } from 'lucide-react-native';
import TopBar from '../components/TopBar';
import BottomNavBar from '../components/BottomNavBar';
import { useAuth } from '../context/AuthContext';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const API_BASE_URL = 'http://10.0.2.2:8080';

const activitiesData = [
  { id: '1', type: 'achat', amount: '540dh', date: '25/06/2025' },
  { id: '2', type: 'achat', amount: '16dh', date: '23/06/2025' },
  { id: '3', type: 'achat', amount: '5495dh', date: '21/06/2025' },
  { id: '4', type: 'vente', amount: '120dh', date: '20/06/2025' },
  { id: '5', type: 'achat', amount: '800dh', date: '18/06/2025' },
];

const AllActivitiesScreen = ({ navigation }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { unreadNotificationsCount } = useAuth();
  const [selectedActivityType, setSelectedActivityType] = useState('all'); // 'all', 'achat', 'vente'
  const [selectedDate, setSelectedDate] = useState(null); // For date filter
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fetchAllActivities = async () => {
    setRefreshing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/allActivities`);
      if (!response.ok) {
        throw new Error('Échec de la récupération des activités.');
      }
      const data = await response.json();
      const transformedData = data.map(activity => {
        // Directly use activity.type and activity.montant from the API response
        const type = activity.type ? activity.type.toLowerCase() : '';
        const amount = activity.montant ? `${activity.montant}dh` : '';
        const date = activity.date || '';

        // Format date from YYYY-MM-DD to DD/MM/YYYY, or use original if split fails
        let formattedDate = date;
        if (date && date.includes('-')) {
          const [year, month, day] = date.split('-');
          formattedDate = `${day}/${month}/${year}`;
        }

        return {
          id: activity.id, // Keep original id
          type: type,
          amount: amount,
          date: formattedDate,
        };
      });
      setActivities(transformedData);
    } catch (error) {
      console.error('Erreur lors de la récupération des activités:', error);
      // Optionally, show a toast message here
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllActivities();
  }, []);

  const onDateChange = (event, date) => {
    setShowDatePicker(Platform.OS === 'ios'); // Hide picker on iOS after selection
    if (date) {
      setSelectedDate(date);
    }
  };

  const clearFilters = () => {
    setSelectedActivityType('all');
    setSelectedDate(null);
  };

  // Filter activities based on selected type and date
  const filteredActivities = activities.filter(activity => {
    const typeMatch = selectedActivityType === 'all' || activity.type === selectedActivityType;
    
    // Convert activity.date from DD/MM/YYYY to YYYY-MM-DD for Date object comparison
    const [day, month, year] = activity.date.split('/');
    const activityDate = new Date(`${year}-${month}-${day}`);

    const dateMatch = !selectedDate || 
                      (activityDate.getDate() === selectedDate.getDate() &&
                       activityDate.getMonth() === selectedDate.getMonth() &&
                       activityDate.getFullYear() === selectedDate.getFullYear());

    return typeMatch && dateMatch;
  });

  const renderActivityItem = ({ item }) => (
    <View style={styles.activityItem}>
      <View style={styles.activityTypeContainer}>
        {item.type === 'achat' ? (
          <ArrowRightCircle size={20} color="#4CAF50" /> // Green for Achat
        ) : (
          <ArrowLeftCircle size={20} color="#F44336" /> // Red for Vente
        )}
        <Text style={styles.activityDescription}>{item.type}</Text>
      </View>
      <View style={styles.verticalDivider} /> {/* Vertical Divider */}
      <Text style={styles.activityAmount}>{item.amount}</Text>
      <View style={styles.verticalDivider} /> {/* Vertical Divider */}
      <Text style={styles.activityDate}>{item.date}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00cc99" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar
        title="Activités Récentes"
        onGoBack={() => navigation.goBack()}
        activeLeftIcon="home" // Or a more suitable icon if you have one for activities
        onNotificationPress={() => navigation.navigate('AdminNotifications')}
        notificationCount={unreadNotificationsCount}
        onSettingsPress={() => navigation.navigate('Settings')}
      />

      {/* Filter Section */}
      <View style={styles.filtersContainer}>
        <View style={styles.filterGroupsWrapper}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Type:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedActivityType}
                onValueChange={(itemValue) => setSelectedActivityType(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="All" value="all" />
                <Picker.Item label="Achat" value="achat" />
                <Picker.Item label="Vente" value="vente" />
              </Picker>
            </View>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Date:</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
              <Text style={styles.datePickerButtonText}>
                {selectedDate ? selectedDate.toLocaleDateString() : 'Select Date'}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={selectedDate || new Date()}
                mode="date"
                display="default"
                onChange={onDateChange}
              />
            )}
          </View>
        </View>
        {/* Clear Filters Button */}
        <TouchableOpacity onPress={clearFilters} style={styles.clearButton}>
          <XCircle size={24} color="#FF6347" />
        </TouchableOpacity>
      </View>

      {/* New container for Recent Activity box */}
      <View style={styles.recentActivityBox}>
        <Text style={styles.recentActivityTitle}>Recent activity</Text>
        <FlatList
          data={filteredActivities.length > 0 ? filteredActivities : activitiesData} // Use filtered data, or mock data if filters result in empty
          keyExtractor={(item) => item.id}
          renderItem={renderActivityItem}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchAllActivities} />
          }
          ListEmptyComponent={
            <Text style={styles.emptyListText}>No activities found for selected filters.</Text>
          }
        />
      </View>
      <BottomNavBar navigation={navigation} currentRoute="Dashboard" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
  },
  recentActivityBox: {
    backgroundColor: '#FFF8E1', // Light yellow color from image
    borderRadius: 15,
    marginHorizontal: 16, // Apply horizontal margin
    marginTop: 16, // Apply top margin
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    flex: 1, // Allow the box to expand
  },
  recentActivityTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  filtersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 10, // Revert to standard padding (except for top and right)
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
    position: 'relative',
    paddingTop: 40,
  },
  filterGroupsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1, // Allow filter groups to take available space
  },
  filterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
    color: '#555',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
    height: 40,
    justifyContent: 'center',
  },
  picker: {
    width: 120,
    height: 40,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
  },
  datePickerButtonText: {
    fontSize: 16,
    color: '#555',
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  activityTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  activityDescription: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8, // Space between icon and text
  },
  verticalDivider: {
    width: 1, // Thickness of the vertical border
    backgroundColor: '#e0e0e0',
    height: '80%', // Adjust height as needed
    marginHorizontal: 10, // Space around the divider
  },
  activityAmount: {
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
    flex: 1.2,
  },
  activityDate: {
    fontSize: 14, // Smaller font size as in the image
    color: '#555',
    textAlign: 'right',
    flex: 1.5,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666',
  },
  clearButton: {
    position: 'absolute',
    top: 10, // Adjust as needed to position it vertically
    right: 10, // Adjust as needed to position it horizontally
    zIndex: 1, // Ensure it's above other content
  },
});

export default AllActivitiesScreen; 