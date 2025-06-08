import axios from 'axios';

// IMPORTANT: Adjust this baseURL based on your environment:
// - For Android Emulator: 'http://10.0.2.2:8080/api'
// - For iOS Simulator: 'http://localhost:8080/api'
// - For Physical Device: 'http://YOUR_MACHINE_IP:8080/api' (e.g., http://192.168.1.5:8080/api)
const API_BASE_URL = 'http://10.0.2.2:8080/api'; // Default for Android Emulator

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 10 seconds timeout
    // You can add default headers here, e.g., for authentication:
    // headers: {
    //     'Authorization': 'Bearer YOUR_AUTH_TOKEN
    // }
});

export default api; 