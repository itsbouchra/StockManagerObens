import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

const App = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    console.log("App mounted. Fetching from backend...");
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
      <Text>{message}</Text> {/* This needs to be inside <Text> */}
    </View>
  );
};

export default App;
