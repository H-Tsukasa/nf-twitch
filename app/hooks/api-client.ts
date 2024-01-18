import axios from "axios";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_VERCEL_URL
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}`
        : "http://localhost:8000/api",
});

export default apiClient;
