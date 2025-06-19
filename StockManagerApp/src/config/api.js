// API Configuration
export const API_BASE_URL = 'http://10.0.2.2:8080';

export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/api/users/login`,
  USERS: `${API_BASE_URL}/api/users`,
  PRODUCTS: `${API_BASE_URL}/produits`,
  CATEGORIES: `${API_BASE_URL}/api/categories`,
  SALES: `${API_BASE_URL}/api/ventes`,
  ORDERS: `${API_BASE_URL}/api/orders`,
  DELIVERIES: `${API_BASE_URL}/api/livraisons`,
  DELIVERIES_POST: `${API_BASE_URL}/livraisons`,
  ACTIVITIES: `${API_BASE_URL}/api/activities`,
  NOTIFICATIONS: `${API_BASE_URL}/api/notifications`,
};

export const handleApiError = (error) => {
  console.error('API Error:', error);
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    return {
      message: error.response.data?.message || 'Une erreur est survenue',
      status: error.response.status,
    };
  } else if (error.request) {
    // The request was made but no response was received
    return {
      message: 'Impossible de se connecter au serveur',
      status: 0,
    };
  } else {
    // Something happened in setting up the request that triggered an Error
    return {
      message: error.message || 'Une erreur inattendue est survenue',
      status: 0,
    };
  }
}; 