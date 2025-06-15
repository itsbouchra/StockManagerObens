import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import Toast from 'react-native-toast-message';
import TopBar from '../components/TopBar';

const AdminNotificationsScreen = ({ navigation }) => {
  const { user, fetchUnreadNotificationsCount, unreadNotificationsCount } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const fetchNotifications = async () => {
    if (!user || !user.id_user) {
        console.log("User or user ID is not available, skipping notification fetch.");
        setLoading(false);
        return;
    }
    console.log(`Fetching notifications for ADMIN with id_user: ${user.id_user}`);
    try {
      const response = await fetch(
        `http://10.0.2.2:8080/api/notifications/recipient/ADMIN/${user.id_user}`
      );
      console.log("API Response status:", response.status);
      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Échec de la récupération des notifications. Statut: ${response.status}, Corps: ${errorBody}`);
        throw new Error('Échec du chargement des notifications');
      }
      const data = await response.json();
      console.log("Received notifications data:", data);
      setNotifications(data);
      fetchUnreadNotificationsCount(user.role.toUpperCase(), user.id_user); // Update global count with role
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Échec du chargement des notifications',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user && user.id_user) {
      fetchNotifications();
    }
  }, [user]);

  const renderNotificationItem = ({ item }) => {
    // For AdminNotificationsScreen, all messages are received messages.
    // Determine display name based on senderUsername, with fallback to senderRole.
    const senderRoleUpperCase = item.senderRole ? item.senderRole.toUpperCase() : '';

    const senderDisplayName = item.senderUsername && item.senderUsername.trim() !== ''
      ? item.senderUsername
      : senderRoleUpperCase === 'SUPPLIER' || senderRoleUpperCase === 'FOURNISSEUR' ? 'Fournisseur' :
        senderRoleUpperCase === 'CLIENT' ? 'Client' : 'Inconnu';

    const isSelected = selectedNotification?.id === item.id;

    return (
      <TouchableOpacity
        style={[
          styles.notificationItem,
          styles.receivedMessage, // Always use received message styling on this screen
          isSelected && styles.selectedItem,
        ]}
        onPress={() => setSelectedNotification(item)}
      >
        <View style={styles.messageHeader}>
          <Text style={styles.senderInfo}>
            {`De ${senderDisplayName}`}
          </Text>
          <Text style={styles.timestamp}>
            {new Date(item.sentAt).toLocaleString()}
          </Text>
        </View>
        <Text style={styles.messageText}>{item.message}</Text>
        {!item.readStatus && (
          <View style={styles.unreadIndicator} />
        )}
        <View style={styles.buttonContainer}>
          {!item.readStatus && (
            <TouchableOpacity
              style={[styles.actionButton, styles.markAsReadButton]}
              onPress={() => handleMarkAsRead(item.id)}
            >
              <Text style={styles.actionButtonText}>Marquer comme lu</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteNotification(item.id)}
          >
            <Text style={styles.actionButtonText}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      const response = await fetch(`http://10.0.2.2:8080/api/notifications/${notificationId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Échec de la suppression de la notification. Statut: ${response.status}, Corps: ${errorBody}`);
        throw new Error('Échec de la suppression de la notification');
      }

      Toast.show({
        type: 'success',
        text1: 'Succès',
        text2: 'Notification supprimée avec succès',
      });
      fetchNotifications(); // Refresh the list and update global count
    } catch (error) {
      console.error('Erreur lors de la suppression de la notification:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Échec de la suppression de la notification',
      });
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await fetch(`http://10.0.2.2:8080/api/notifications/read/${notificationId}`, {
        method: 'PUT',
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Échec du marquage comme lu. Statut: ${response.status}, Corps:`, errorBody);
        throw new Error('Échec du marquage de la notification comme lue');
      }

      Toast.show({
        type: 'success',
        text1: 'Succès',
        text2: 'Notification marquée comme lue',
      });
      fetchNotifications(); // Refresh the list and update global count
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Échec du marquage de la notification comme lue',
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar
        title="Notifications"
        onGoBack={() => navigation.goBack()}
        activeLeftIcon="notifications"
        onNotificationPress={() => {}}
        notificationCount={unreadNotificationsCount}
        onSettingsPress={() => navigation.navigate('Settings')}
        activeRightIcon="settings"
      />

      <View style={styles.notificationsContainer}>
        <Text style={styles.sectionTitle}>Messages</Text>
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchNotifications} />
          }
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  notificationsContainer: {
    flex: 1,
    padding: 16,
  },
  notificationItem: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  receivedMessage: {
    borderLeftWidth: 4,
    borderLeftColor: '#28a745',
  },
  sentMessage: {
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  selectedItem: {
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  senderInfo: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  timestamp: {
    fontSize: 12,
    color: '#6c757d',
  },
  messageText: {
    fontSize: 16,
    color: '#2c3e50',
    lineHeight: 22,
  },
  unreadIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#28a745',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginLeft: 10,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  markAsReadButton: {
    backgroundColor: '#007AFF',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default AdminNotificationsScreen; 