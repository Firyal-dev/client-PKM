import axios from "axios";
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: process.env.API_URL || "http://localhost:3030/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = Cookies.get('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
