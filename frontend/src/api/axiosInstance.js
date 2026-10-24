import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://medfinder-734o.onrender.com/api",
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("maf_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
