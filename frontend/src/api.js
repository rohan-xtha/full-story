import axios from 'axios';

// Create an axios instance with the backend base URL
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
});

// Add a request interceptor to include the JWT token in headers
api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage
    const token = localStorage.getItem('access_token');
    
    // If token exists, add it to the headers
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
