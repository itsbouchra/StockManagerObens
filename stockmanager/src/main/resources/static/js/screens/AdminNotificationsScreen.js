import React from 'react';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import NotificationList from './NotificationList'; // Adjust relative path as needed

const AdminNotificationsScreen = ({ route }) => {
    // In a real application, you would get the userRole from authentication context or navigation params.
    // For this example, we'll assume the role is 'admin'.
    const userRole = route.params?.userRole || 'admin'; 

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <Text style={styles.screenTitle}>Notifications</Text>
            </View>
            <NotificationList userRole={userRole} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5',
    },
    headerContainer: {
        padding: 16,
        backgroundColor: '#f0f2f5', // Match the overall background
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        alignItems: 'center',
        justifyContent: 'center',
    },
    screenTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
});

export default AdminNotificationsScreen; 