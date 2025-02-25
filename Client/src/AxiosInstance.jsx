import axios from 'axios';


// Create an instance of Axios
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL , 
  timeout: 10000, // Optional timeout, e.g., 10 seconds
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the token in the headers
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');  // Get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;  // Attach token if available
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);  // Handle request error
  }
);

// Optionally, add a response interceptor to handle errors globally
axiosInstance.interceptors.response.use(
  (response) => response,  // Handle the response data
  (error) => {
    // Handle global response errors, such as 401 (Unauthorized) or 500 (Internal Server Error)
    if (error.response && error.response.status === 401) {
      console.log('Token expired or invalid');
      window.location.href = '/login';  // Redirect to login page
    }
    return Promise.reject(error);  // Reject the error for the calling code to handle
  }
);

export default axiosInstance;
