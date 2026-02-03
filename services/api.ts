import axios from "axios";

import { toast } from "sonner";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002/api",
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (typeof window !== 'undefined') {
            const message = error.response?.data?.message || "Terjadi kesalahan, silakan coba lagi nanti.";
            toast.error(message);
        }
        return Promise.reject(error);
    }
);

export default api;