// src/api/api.js
import axios from "axios";

const api = axios.create({
    baseURL: "https://localhost:7123", // backend port
    withCredentials: true
});

export default api;
