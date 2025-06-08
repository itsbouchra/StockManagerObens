import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import api from '../api/axiosConfig'; // Import the configured axios instance

// If you have @lucide/react-native installed, uncomment and import the Bell icon:
// import { Bell } from 'lucide-react-native';

const NotificationBell = ({ userRole, navigation }) => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                setLoading(true);
                const response = await api.get(`/notifications/unread/${userRole}`);
                setUnreadCount(response.data.length);
                setError(null);
            } catch (err) {
                console.error("Error fetching unread notifications count:", err);
                setError('Failed to fetch unread notifications.');
                Alert.alert("Error", 'Failed to fetch notification count.');
            } finally {
                setLoading(false);
            }
        };

        fetchUnreadCount();

        // Optional: Poll for new notifications every 30 seconds (adjust as needed)
        const intervalId = setInterval(fetchUnreadCount, 30000);

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, [userRole]);

    const handleBellClick = () => {
        if (navigation) {
            // Assuming a 'Notifications' screen exists in your React Navigation setup
            navigation.navigate('Notifications'); 
        } else {
            console.log("Notification bell clicked! Navigation prop not provided.");
        }
    };

    if (loading) {
        return (
            <View style={styles.bellContainer}>
                <ActivityIndicator size="small" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.bellContainer}>
                <Text style={styles.errorText}>!</Text>
            </View>
        );
    }

    return (
        <TouchableOpacity style={styles.bellContainer} onPress={handleBellClick}>
            {/* 
             * Replace the Text component below with your Lucide Bell icon component. 
             * Make sure you have installed @lucide/react-native (e.g., npm install @lucide/react-native)
             * and import Bell as shown at the top of this file.
             * Example: <Bell size={24} color="#333" /> 
             */}
            <Text style={styles.bellIconPlaceholder}>🔔</Text> 
            {unreadCount > 0 && (
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>{unreadCount}</Text>
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    bellContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: 20, // Makes it circular
        backgroundColor: '#f0f0f0',
    },
    bellIconPlaceholder: {
        fontSize: 24, // Adjust size as needed
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#f44336',
        borderRadius: 10,
        paddingHorizontal: 6,
        minWidth: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    errorText: {
        color: '#f44336',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default NotificationBell; 