import axios from "axios";

const Api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/",
});

Api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  
  const isAuthRequest =
    config.url?.includes("auth/login") ||
    config.url?.includes("auth/register");

  if (token && !isAuthRequest) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default Api;