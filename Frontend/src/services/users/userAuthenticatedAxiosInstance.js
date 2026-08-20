import axios from "axios";
import refreshAccessToken from "./refreshAccessToken";

const createAxiosInstance = (endpoint, setIsUserLoggedIn) => {
    const axiosInstance = axios.create({
        baseURL: `${process.env.REACT_APP_BACKEND_URL}${endpoint}`,
        withCredentials: true,
    });

    // Dynamically attach Bearer token to every request
    axiosInstance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem("accessToken");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    axiosInstance.interceptors.response.use(
        response => response,
        async error => {
            const token = localStorage.getItem("accessToken");
            if (error.response?.status === 401 || error.response?.status === 403) {
                if (token && (token.startsWith("ya29.") || token.startsWith("demo_") || token.startsWith("google_") || !token.includes("."))) {
                    return Promise.resolve({ data: { success: false, message: "OAuth Session Active" } });
                }
                const newAccessToken = await refreshAccessToken(setIsUserLoggedIn);
                if (newAccessToken) {
                    error.config.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axiosInstance.request(error.config);
                }
            }

            return Promise.reject(error);
        }
    );

    return axiosInstance;
};

export default createAxiosInstance;
