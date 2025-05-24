import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.0.2.2:8080/api', // Use 10.0.2.2 for Android emulator to access localhost
});

export default api;