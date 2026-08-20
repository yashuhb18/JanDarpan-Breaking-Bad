import { jwtDecode } from "jwt-decode";
import refreshAccessToken from "../services/users/refreshAccessToken";

export const verifyToken = async () => {
    const token = localStorage.getItem('accessToken');

    if (!token) return false;

    // Google OAuth Access Tokens (ya29...) or Demo Tokens
    if (token.startsWith('ya29.') || token.startsWith('demo_') || token.startsWith('google_') || !token.includes('.')) {
        return true;
    }

    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        // Check if token is expired
        if (decoded.exp && decoded.exp < currentTime) {
            try {
                const newToken = await refreshAccessToken();
                if (newToken) {
                    return true;
                }
                return false;
            } catch (refreshError) {
                if (refreshError.response?.status === 403) {
                    localStorage.removeItem('accessToken');
                    return false;
                }
                return false;
            }
        }

        return true;
    } catch (error) {
        console.warn("Token decoding fallback for OAuth session:", error);
        return true;
    }
};
