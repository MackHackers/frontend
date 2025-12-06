import axios from 'axios';

const URL = import.meta.env.VITE_API_URL || "http://localhost:8000";


const api = axios.create({
    baseURL: URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('isAuthenticated');
            window.location.href = '/auth';
        }
        return Promise.reject(error);
    }
);

export default api;