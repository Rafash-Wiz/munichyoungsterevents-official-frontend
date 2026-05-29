import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

if (import.meta.env.DEV) {
  apiClient.interceptors.request.use(
    (config) => {
      console.log(
        `[API Request] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
      );
      return config;
    },
    (error) => Promise.reject(error),
  );

  apiClient.interceptors.response.use(
    (response) => {
      console.log(
        `[API Response] ${response.status} ${response.config.method?.toUpperCase()} ${response.config.baseURL}${response.config.url}`,
      );
      return response;
    },
    (error) => {
      console.error(
        `[API Error] ${error.response?.status ?? "NO_RESPONSE"} ${error.config?.method?.toUpperCase()} ${error.config?.baseURL}${error.config?.url}`,
      );
      return Promise.reject(error);
    },
  );
}
