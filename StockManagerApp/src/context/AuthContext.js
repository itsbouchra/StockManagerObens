import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

// Backend API Base URL (adjust if your backend is on a different address/port)
const BASE_URL = 'http://10.0.2.2:8080/api'; 

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);

  const fetchUnreadNotificationsCount = async (userRole, userId) => {
    if (!userId || !userRole) return;
    try {
      // Fetch all notifications for the user (both sent and received)
      const response = await fetch(`${BASE_URL}/notifications/user/${userRole.toUpperCase()}/${userId}`);
      if (response.ok) {
        const allNotifications = await response.json();

        // Filter and count notifications based on the new logic
        let count = 0;
        allNotifications.forEach(item => {
          const isReceived = item.recipientRole.toUpperCase() === userRole.toUpperCase();
          const isSent = item.senderRole.toUpperCase() === userRole.toUpperCase();

          if (isReceived && !item.read_status) {
            // Unread received messages
            count++;
          } else if (isSent && item.recipientRole.toUpperCase() === 'ADMIN' && item.read_status) {
            // Sent messages to Admin that have been read
            count++;
          }
        });

        console.log('AuthContext: calculated unread notifications count for', userRole, userId, ':', count);
        setUnreadNotificationsCount(count);
      } else {
        console.error(`AuthContext: Failed to fetch all notifications for count: ${response.status}`);
      }
    } catch (error) {
      console.error('AuthContext: Error fetching and calculating unread notifications count:', error);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      console.log('AuthContext: Attempting to load user from AsyncStorage...');
      try {
        const storedUser = await AsyncStorage.getItem('userData');
        console.log('AuthContext: Stored user in AsyncStorage:', storedUser);

        if (storedUser) {
          const userData = JSON.parse(storedUser);
          console.log('AuthContext: Parsed user data from AsyncStorage (pre-fetch):', userData);
          console.log('AuthContext: Role from AsyncStorage:', userData.role);

          // Fetch full user data from backend using the ID from stored data
          const userProfileUrl = `${BASE_URL}/users/${userData.id_user}`;
          console.log('AuthContext: Fetching full user profile from:', userProfileUrl);
          const response = await fetch(userProfileUrl);
          console.log('AuthContext: User profile fetch response status:', response.status);

          if (response.ok) {
            const fetchedUser = await response.json();
            console.log('AuthContext: Fetched user data successfully (post-fetch):', fetchedUser);
            console.log('AuthContext: Role fetched from API:', fetchedUser.role);
            setUser(fetchedUser);
            // Pass the user's role to fetchUnreadNotificationsCount
            console.log('AuthContext: Calling fetchUnreadNotificationsCount with role:', fetchedUser.role, 'and userId:', fetchedUser.id_user);
            fetchUnreadNotificationsCount(fetchedUser.role, fetchedUser.id_user); 
          } else {
            console.error('AuthContext: Failed to fetch user profile (response not ok):', response.status);
            await AsyncStorage.removeItem('userData');
          }
        } else {
          console.log('AuthContext: No user found in AsyncStorage.');
        }
      } catch (error) {
        console.error('AuthContext: Error loading user from storage or API (catch block):', error);
      } finally {
        setIsLoading(false);
        console.log('AuthContext: Finished user loading attempt. isLoading set to false.');
      }
    };

    loadUser();
  }, []);

  const login = async (username, password) => {
    setIsLoading(true);
    console.log('AuthContext: Attempting login with username:', username);
    try {
      const response = await fetch(`${BASE_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      console.log('AuthContext: Login API call response status:', response.status);

      if (response.ok) {
        const userData = await response.json();
        console.log('AuthContext: Login successful, received user data (pre-set):', userData);
        console.log('AuthContext: Role from login response:', userData.role);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        setUser(userData);
        // Pass the user's role to fetchUnreadNotificationsCount
        console.log('AuthContext: Calling fetchUnreadNotificationsCount with role (from login):', userData.role, 'and userId:', userData.id_user);
        fetchUnreadNotificationsCount(userData.role, userData.id_user); 
        console.log('AuthContext: User data set in state and AsyncStorage.');
        return { success: true };
      } else {
        const errorData = await response.text();
        console.error('AuthContext: Login failed (response not ok):', response.status, errorData);
        return { success: false, message: errorData || 'Identifiants invalides' };
      }
    } catch (error) {
      console.error('AuthContext: Login error (catch block):', error);
      return { success: false, message: 'Erreur de connexion au serveur' };
    } finally {
      setIsLoading(false);
      console.log('AuthContext: Finished login attempt. isLoading set to false.');
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userData');
      setUser(null);
      setUnreadNotificationsCount(0); // Reset count on logout
      console.log('AuthContext: User logged out');
    } catch (error) {
      console.error('AuthContext: Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, logout, isLoading, login, unreadNotificationsCount, fetchUnreadNotificationsCount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
