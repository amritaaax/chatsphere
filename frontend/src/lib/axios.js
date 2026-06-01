import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api"
      : "https://chatsphere-backend-fu77.onrender.com/api",
  withCredentials: true,
});