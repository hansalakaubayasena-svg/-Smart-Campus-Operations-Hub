import axios from "axios";

/**
 * Single Axios instance used by every feature module.
 * WHY a shared instance?
 *  - Base URL defined once — change backend port in one place only
 *  - Request interceptor attaches JWT automatically — no manual headers anywhere
 *  - Response interceptor handles 401 globally — token expired = auto logout
 */
const axiosClient = axios.create({
  baseURL: "http://localhost:8081",
  headers: {
    "Content-Type": "application/json",
  },
});

// ── REQUEST INTERCEPTOR ───────────────────────────────────────────────────────
// Runs before every outgoing request
// Reads token from localStorage and adds Authorization: Bearer <token>
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── RESPONSE INTERCEPTOR ──────────────────────────────────────────────────────
// Runs after every response
// 401 = token expired or invalid → clear storage and redirect to login
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
