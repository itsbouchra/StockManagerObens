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
import { useNavigation } from '@react-navigation/native';
import { API_ENDPOINTS, handleApiError } from '../config/api';
import Toast from 'react-native-toast-message';
import CustomerTopBar from '../components/CustomerTopBar';
import CustomerBottomNavBar from '../components/CustomerBottomNavBar';

const CustomerNotificationsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [newMessageBody, setNewMessageBody] = useState('');

  const fetchNotifications = async () => {
    if (!user || !user.id_user) {
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(
        `http://10.0.2.2:8080/api/notifications/user/CUSTOMER/${user.id_user}`
      );
      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Échec de la récupération des notifications. Statut: ${response.status}, Corps: ${errorBody}`);
        throw new Error('Erreur lors de la récupération des notifications');
      }
      const data = await response.json();
      setNotifications(data);
    } catch (error) {
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

  const handleSendNewMessage = async () => {
    if (!newMessageBody.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Veuillez saisir un corps de message.',
      });
      return;
    }
    if (!user || !user.id_user) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Utilisateur non connecté ou ID manquant.',
      });
      return;
    }
    const messageData = {
      title: `Message de ${user.username}`,
      message: newMessageBody,
      senderId: user.id_user.toString(),
      senderRole: 'CUSTOMER',
      recipientRole: 'ADMIN',
      senderUsername: user.username,
      recipientUsername: 'admin',
    };
    try {
      const response = await fetch('http://10.0.2.2:8080/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      });
      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Échec de l'envoi du nouveau message. Réponse du serveur: ${errorBody}`);
      }
      Toast.show({
        type: 'success',
        text1: 'Succès',
        text2: 'Nouveau message envoyé avec succès à l\'Admin !',
      });
      setNewMessageBody('');
      fetchNotifications();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: `Échec de l'envoi du nouveau message: ${error.message}`,
      });
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const renderNotificationItem = ({ item }) => {
    const isReceived = item.senderRole === 'ADMIN';
    const isSelected = selectedNotification?.id === item.id;
    return (
      <TouchableOpacity
        style={[
          styles.notificationItem,
          isReceived ? styles.receivedMessage : styles.sentMessage,
          isSelected && styles.selectedItem,
        ]}
        onPress={() => setSelectedNotification(item)}
      >
        <View style={styles.messageHeader}>
          <Text style={styles.senderInfo}>{isReceived ? 'De l\'Admin' : 'À l\'Admin'}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.timestamp}>{new Date(item.sentAt).toLocaleString()}</Text>
            {!isReceived && item.readStatus && (
              <Text style={styles.readStatusText}> (Lu)</Text>
            )}
          </View>
        </View>
        <Text style={styles.messageText}>{item.message}</Text>
        {isReceived && !item.readStatus && (
          <View style={styles.unreadIndicator} />
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#708238" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomerTopBar
        title="Notifications"
        active="notification"
        onGoBack={() => navigation.goBack()}
        onNotificationPress={() => navigation.navigate('CustomerNotificationsScreen')}
        onSettingsPress={() => navigation.navigate('CustomerSettingsScreen')}
      />
      <View style={styles.newMessageContainer}>
        <Text style={styles.sectionTitle}>Envoyer un nouveau message</Text>
        <TextInput
          style={[styles.input, styles.messageInput]}
          placeholder="Corps du message"
          multiline
          value={newMessageBody}
          onChangeText={setNewMessageBody}
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSendNewMessage}>
          <Text style={styles.sendButtonText}>Envoyer le message</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.notificationsContainer}>
        <Text style={styles.sectionTitle}>Messages</Text>
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={() => (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
              <Text style={{ color: '#6b7280', fontSize: 16, textAlign: 'center' }}>Aucune notification</Text>
            </View>
          )}
        />
      </View>
      <CustomerBottomNavBar navigation={navigation} currentRoute="CustomerNotificationsScreen" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  notificationItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  receivedMessage: {
    backgroundColor: '#ffffff',
    marginRight: 40,
  },
  sentMessage: {
    backgroundColor: '#e3f2fd',
    marginLeft: 40,
  },
  selectedItem: {
    borderWidth: 2,
    borderColor: '#2196f3',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  senderInfo: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  unreadIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2196f3',
  },
  readStatusText: {
    fontSize: 12,
    color: '#007AFF',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  newMessageContainer: {
    padding: 16,
    backgroundColor: '#ffffff',
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    color: '#495057',
  },
  messageInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  notificationsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
});

export default CustomerNotificationsScreen;