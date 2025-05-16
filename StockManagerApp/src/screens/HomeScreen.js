import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';

const HomeScreen = ({ navigation }) => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    console.log("HomeScreen mounted. Fetching from backend...");
    fetch("http://10.0.2.2:8080/")
      .then(response => response.json())
      .then(data => {
        console.log("Response from backend:", data);
        setMessage(data.message);
      })
      .catch(error => {
        console.error("Error fetching from Spring Boot:", error);
      });
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text>Message from Spring Boot:</Text>
      <Text>{message}</Text>

      <View style={{ marginTop: 20 }}>
        <Button
          title="Go to Dashboard"
          onPress={() => navigation.navigate('Dashboard')}
          color="#007AFF"
        />
      </View>
    </View>
  );
};

export default HomeScreen;
