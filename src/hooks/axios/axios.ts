import axios from "axios";
import { logout } from "../auth/useLogout";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest._isRefreshRequest) {
      return Promise.reject(error);
    }

    const noRefreshToken =
      error.response?.data?.message === "No referesh token!";

    if (
      (error.response?.status === 401 || noRefreshToken) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const res = await api.post("/users/refresh", null, {
          _isRefreshRequest: true,
        });

        if (res.data.message === "No refresh token!") {
          alert("Session expired. Please login again");
          await logout();
          window.location.href = "/";
          return Promise.reject(new Error("No refresh token"));
        }

        return api(originalRequest);
      } catch (refreshError) {
        console.log("Refresh failed", refreshError);
        alert("Session expired. Please login again");
        await logout();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
