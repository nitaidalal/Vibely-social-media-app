import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      window.location.pathname !== "/signin" &&
      window.location.pathname !== "/signup"
    ) {
      window.location.assign("/signin");
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
