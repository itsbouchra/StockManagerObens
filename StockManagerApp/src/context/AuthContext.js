import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

// Backend API Base URL (adjust if your backend is on a different address/port)
const BASE_URL = 'http://10.0.2.2:8080/api'; 

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      console.log('AuthContext: Attempting to load user from AsyncStorage...');
      try {
        const storedUser = await AsyncStorage.getItem('userData');
        console.log('AuthContext: Stored user in AsyncStorage:', storedUser);

        if (storedUser) {
          const userData = JSON.parse(storedUser);
          console.log('AuthContext: Parsed user data from AsyncStorage:', userData);

          // Fetch full user data from backend using the ID from stored data
          const userProfileUrl = `${BASE_URL}/users/${userData.id_user}`;
          console.log('AuthContext: Fetching full user profile from:', userProfileUrl);
          const response = await fetch(userProfileUrl);
          console.log('AuthContext: User profile fetch response status:', response.status);

          if (response.ok) {
            const fetchedUser = await response.json();
            console.log('AuthContext: Fetched user data successfully:', fetchedUser);
            setUser(fetchedUser);
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
        console.log('AuthContext: Login successful, received user data:', userData);
        await AsyncStorage.setItem('userData', JSON.stringify(userData));
        setUser(userData);
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
      console.log('AuthContext: User logged out');
    } catch (error) {
      console.error('AuthContext: Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, logout, isLoading, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
