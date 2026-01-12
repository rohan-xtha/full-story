import axios from 'axios';

// Create an axios instance with the base URL
const api = axios.create({
  baseURL: 'https://rohanmaske.pythonanywhere.com/api/', // Production backend URL (use HTTPS)
  // baseURL: 'http://127.0.0.1:8000/api/', // Local development URL (commented out)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the access token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;