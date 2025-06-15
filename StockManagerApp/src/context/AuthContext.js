import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

// Backend API Base URL (adjust if your backend is on a different address/port)
const BASE_URL = 'http://10.0.2.2:8080/api'; 

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [token, setToken] = useState(null);

  const fetchUnreadNotificationsCount = async (userRole, userId) => {
    if (!userId || !userRole) {
      console.log('AuthContext: fetchUnreadNotificationsCount received invalid userId or userRole. Current user role:', userRole, 'Current user ID:', userId);
      return;
    }
    try {
      console.log('AuthContext: Attempting to fetch notifications for role:', userRole.toUpperCase(), 'and userId:', userId);
      const response = await fetch(`${BASE_URL}/notifications/user/${userRole.toUpperCase()}/${userId}`);
      if (response.ok) {
        const allNotifications = await response.json();
        console.log('AuthContext: Fetched allNotifications for', userRole.toUpperCase(), userId, ':', allNotifications);

        let count = 0;
        allNotifications.forEach(item => {
          const isReceived = item.recipientRole.toUpperCase() === userRole.toUpperCase();
          const isSent = item.senderRole.toUpperCase() === userRole.toUpperCase();

          if (isReceived && !item.read_status) {
            // Count unread received messages
            count++;
          } else if (isSent && item.recipientRole.toUpperCase() === 'ADMIN' && item.read_status) {
            // Count messages sent by current user to ADMIN that have been read
            count++;
          } else if (userRole.toUpperCase() === 'ADMIN' && item.recipientRole.toUpperCase() === 'ADMIN' && item.read_status) {
              // Special case for admin: count read messages received by admin too, if they are from a supplier or client
              if (item.senderRole.toUpperCase() === 'FOURNISSEUR' || item.senderRole.toUpperCase() === 'CLIENT') {
                  count++;
              }
          }
        });

        console.log('AuthContext: calculated unread notifications count for', userRole.toUpperCase(), userId, ':', count);
        setUnreadNotificationsCount(count);
      } else {
        console.error(`AuthContext: Failed to fetch all notifications for count. Status: ${response.status}, Status Text: ${response.statusText}`);
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
          console.log('AuthContext: User role from AsyncStorage:', userData.role, 'User ID from AsyncStorage:', userData.id_user);

          const storedToken = await AsyncStorage.getItem('token');
          if (storedToken) {
            setToken(storedToken);
            console.log('AuthContext: Token loaded from AsyncStorage.');
          }

          const userProfileUrl = `${BASE_URL}/users/${userData.id_user}`;
          console.log('AuthContext: Fetching full user profile from:', userProfileUrl);
          const response = await fetch(userProfileUrl);
          console.log('AuthContext: User profile fetch response status:', response.status, 'Status Text:', response.statusText);

          if (response.ok) {
            const fetchedUser = await response.json();
            console.log('AuthContext: Fetched user data successfully (post-fetch):', fetchedUser);
            console.log('AuthContext: Fetched user role:', fetchedUser.role, 'Fetched user ID:', fetchedUser.id_user);
            setUser(fetchedUser);
            console.log('AuthContext: Calling fetchUnreadNotificationsCount from loadUser with role:', fetchedUser.role, 'and userId:', fetchedUser.id_user);
            fetchUnreadNotificationsCount(fetchedUser.role, fetchedUser.id_user); 
          } else {
            console.error('AuthContext: Failed to fetch user profile. Status:', response.status, 'Status Text:', response.statusText);
            await AsyncStorage.removeItem('userData');
          }
        } else {
          console.log('AuthContext: No user data found in AsyncStorage.');
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
      console.log('AuthContext: Login API call response status:', response.status, 'Status Text:', response.statusText);

      if (response.ok) {
        const responseData = await response.json();
        const userData = responseData.user;
        const token = responseData.token;

        console.log('AuthContext: Login successful, received user data:', userData);
        console.log('AuthContext: Login user role:', userData.role, 'Login user ID:', userData.id_user);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        
        if (token) {
          await AsyncStorage.setItem('token', token);
          setToken(token);
          console.log('AuthContext: Token saved to AsyncStorage and set in state.');
        }

        setUser(userData);
        console.log('AuthContext: Calling fetchUnreadNotificationsCount from login with role:', userData.role, 'and userId:', userData.id_user);
        fetchUnreadNotificationsCount(userData.role, userData.id_user); 
        console.log('AuthContext: User data set in state and AsyncStorage.');
        return { success: true };
      } else {
        const errorText = await response.text();
        console.error('AuthContext: Login failed. Status:', response.status, 'Error:', errorText);
        return { success: false, message: errorText || 'Identifiants invalides' };
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
      await AsyncStorage.removeItem('token');
      setUser(null);
      setToken(null);
      setUnreadNotificationsCount(0); // Reset count on logout
      console.log('AuthContext: User logged out');
    } catch (error) {
      console.error('AuthContext: Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, logout, isLoading, login, unreadNotificationsCount, fetchUnreadNotificationsCount, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
