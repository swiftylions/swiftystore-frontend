import axios from "axios";
import Cookies from "js-cookie";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
  withCredentials: true,
});

// متغیر global برای نگهداری CSRF token
let cachedCsrfToken = null;

apiClient.interceptors.request.use(
  async (config) => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (jwtToken) {
      config.headers.Authorization = `Bearer ${jwtToken}`;
    }

    // Only fetch CSRF token for non-safe methods
    const safeMethods = ["GET", "HEAD", "OPTIONS"];
    if (!safeMethods.includes(config.method.toUpperCase())) {
      // اول از cache استفاده کن
      if (!cachedCsrfToken) {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/csrf-token`,
            { withCredentials: true }
          );

          // استفاده از token در response body
          if (response.data?.token) {
            cachedCsrfToken = response.data.token;
            console.log("CSRF token fetched:", cachedCsrfToken);
          }
        } catch (error) {
          console.warn("Could not fetch CSRF token:", error);
        }
      }

      // اضافه کردن token به header
      if (cachedCsrfToken) {
        config.headers["X-XSRF-TOKEN"] = cachedCsrfToken;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // اگه 403 گرفتیم و به خاطر CSRF بود، token رو refresh کن
    if (error.response?.status === 403) {
      const originalRequest = error.config;

      if (!originalRequest._retry) {
        originalRequest._retry = true;

        try {
          // دریافت token جدید
          const response = await axios.get(
            `${import.meta.env.VITE_API_BASE_URL}/csrf-token`,
            { withCredentials: true }
          );

          if (response.data?.token) {
            cachedCsrfToken = response.data.token;
            originalRequest.headers["X-XSRF-TOKEN"] = cachedCsrfToken;
            console.log("CSRF token refreshed, retrying request");
            return apiClient(originalRequest);
          }
        } catch (retryError) {
          console.error("Failed to refresh CSRF token:", retryError);
        }
      }
    }

    if (error.response?.status === 401) {
      const jwtToken = localStorage.getItem("jwtToken");
      if (jwtToken) {
        localStorage.removeItem("jwtToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
