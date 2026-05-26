import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

const publicEndpoints = [
  "/users/forgot-password",
  "/users/reset-password",
  "/users/login",
  "/users/register",
];

let isProcessing401 = false;

api.interceptors.response.use(
  (response) => response,
  async (error: any) => {
    const originalRequest = error.config;

    const isPublicEndpoint = publicEndpoints.some((endpoint) =>
      originalRequest.url?.includes(endpoint),
    );

    if (isPublicEndpoint) {
      return Promise.reject(error);
    }

    if (window.location.pathname === "/login" || isProcessing401) {
      return Promise.reject(error);
    }

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
      isProcessing401 = true;

      try {
        const res = await api.post("/users/refresh", null, {
          _isRefreshRequest: true,
        });

        if (res.data.message === "No refresh token!") {
          localStorage.removeItem("user");
          localStorage.removeItem("token");

          alert("Session expired. Please login again");

          window.location.href = "/login";
          return Promise.reject(new Error("No refresh token"));
        }

        isProcessing401 = false;
        return api(originalRequest);
      } catch (refreshError) {
        console.log("Refresh failed", refreshError);

        localStorage.removeItem("user");
        localStorage.removeItem("token");

        alert("Session expired. Please login again");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    isProcessing401 = false;
    return Promise.reject(error);
  },
);

export default api;
