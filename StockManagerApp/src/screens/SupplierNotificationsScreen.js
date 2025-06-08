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

const SupplierNotificationsScreen = ({ navigation }) => {
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
        `http://10.0.2.2:8080/api/notifications/user/SUPPLIER/${user.id_user}`
      );
      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Échec de la récupération des notifications. Statut: ${response.status}, Corps: ${errorBody}`);
        throw new Error('Échec du chargement des notifications');
      }
      const data = await response.json();
      setNotifications(data);
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
      senderRole: 'SUPPLIER',
      recipientRole: 'ADMIN',
      senderUsername: user.username,
    };
    console.log('Envoi d\'un nouveau message du Fournisseur:', messageData);

    try {
      const response = await fetch('http://10.0.2.2:8080/api/notifications/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error(`Échec de l\'envoi du nouveau message. Statut: ${response.status}, Corps: ${errorBody}`);
        throw new Error(`Échec de l\'envoi du nouveau message. Réponse du serveur: ${errorBody}`);
      }

      Toast.show({
        type: 'success',
        text1: 'Succès',
        text2: 'Nouveau message envoyé avec succès à l\'Admin !',
      });

      setNewMessageBody('');
      fetchNotifications();
    } catch (error) {
      console.error('Erreur lors de l\'envoi du nouveau message:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: `Échec de l\'envoi du nouveau message: ${error.message}`,
      });
    }
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
          <Text style={styles.senderInfo}>
            {isReceived ? 'De l\'Admin' : 'À l\'Admin'}
          </Text>
          <Text style={styles.timestamp}>
            {new Date(item.sentAt).toLocaleString()}
          </Text>
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
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar
        title="Notifications"
        onGoBack={() => navigation.goBack()}
        activeLeftIcon="bell"
        activeRightIcon={null}
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
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
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
  replyContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  replyInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  replyButton: {
    backgroundColor: '#2196f3',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  replyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  newMessageContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
  },
  messageInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationsContainer: {
    padding: 16,
  },
});

export default SupplierNotificationsScreen; 