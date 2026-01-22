import axios from "axios";

const api = axios.create({
    baseURL: process.env.API_URL || "http://localhost:3030",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

export default api;
