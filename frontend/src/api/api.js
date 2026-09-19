import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const currentPath = window.location.pathname;
    const isAuthPage = currentPath === "/signin" || currentPath === "/signup";

    if (error.response?.status === 401 && !isAuthPage) {
      window.location.replace("/signin");
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
