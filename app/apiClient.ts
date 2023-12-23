import axios from "axios";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_VERCEL_URL
        ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api`
        : "http://localhost:8000/api",
});

export default apiClient;
