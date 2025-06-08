import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import api from '../api/axiosConfig'; // Import the configured axios instance

const NotificationList = ({ userRole }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchNotifications();
    }, [userRole]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/notifications/role/${userRole}`);
            setNotifications(response.data);
            setError(null);
        } catch (err) {
            console.error("Error fetching notifications:", err);
            setError('Failed to fetch notifications.');
            Alert.alert("Error", 'Failed to fetch notifications. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            fetchNotifications(); // Refresh the list
        } catch (err) {
            console.error("Error marking as read:", err);
            setError('Failed to mark notification as read.');
            Alert.alert("Error", 'Failed to mark notification as read.');
        }
    };

    const deleteNotification = async (id) => {
        try {
            await api.delete(`/notifications/${id}`);
            fetchNotifications(); // Refresh the list
        } catch (err) {
            console.error("Error deleting notification:", err);
            setError('Failed to delete notification.');
            Alert.alert("Error", 'Failed to delete notification.');
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading notifications...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={fetchNotifications}>
                    <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Notifications</Text>
            {notifications.length === 0 ? (
                <Text style={styles.noNotificationsText}>No notifications found</Text>
            ) : (
                notifications.map((notification) => (
                    <View 
                        key={notification.id} 
                        style={[styles.notificationItem, !notification.readStatus && styles.unreadItem]}
                    >
                        <View style={styles.notificationHeader}>
                            <Text style={styles.notificationTitle}>{notification.title}</Text>
                            <Text style={styles.timestamp}>
                                {new Date(notification.sentAt).toLocaleString()}
                            </Text>
                        </View>
                        <Text style={styles.message}>{notification.message}</Text>
                        <View style={styles.notificationFooter}>
                            <Text style={styles.sender}>
                                From: {notification.senderUsername} ({notification.senderRole})
                            </Text>
                            <View style={styles.actions}>
                                {!notification.readStatus && (
                                    <TouchableOpacity 
                                        onPress={() => markAsRead(notification.id)}
                                        style={styles.markReadBtn}
                                    >
                                        <Text style={styles.markReadBtnText}>Mark as Read</Text>
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity 
                                    onPress={() => deleteNotification(notification.id)}
                                    style={styles.deleteBtn}
                                >
                                    <Text style={styles.deleteBtnText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                ))
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#f0f2f5',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f2f5',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f0f2f5',
    },
    errorText: {
        color: '#dc3545',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
    },
    retryButton: {
        backgroundColor: '#007bff',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    retryButtonText: {
        color: 'white',
        fontSize: 16,
    },
    noNotificationsText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#666',
    },
    notificationItem: {
        backgroundColor: '#ffffff',
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3, // For Android shadow
    },
    unreadItem: {
        borderLeftWidth: 5,
        borderLeftColor: '#2196f3',
        backgroundColor: '#e6f2ff',
    },
    notificationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    notificationTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        flexShrink: 1,
        marginRight: 10,
    },
    timestamp: {
        fontSize: 12,
        color: '#666',
    },
    message: {
        fontSize: 14,
        color: '#444',
        marginBottom: 12,
        lineHeight: 20,
    },
    notificationFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 10,
    },
    sender: {
        fontSize: 12,
        color: '#666',
    },
    actions: {
        flexDirection: 'row',
        gap: 8, // Requires React Native 0.71+ for `gap` or use margin/padding
    },
    markReadBtn: {
        backgroundColor: '#2196f3',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 4,
    },
    markReadBtnText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    deleteBtn: {
        backgroundColor: '#f44336',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 4,
    },
    deleteBtnText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
});

export default NotificationList; 