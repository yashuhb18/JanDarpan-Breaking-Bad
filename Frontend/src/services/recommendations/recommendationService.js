import userAuthenticatedAxiosInstance from "../users/userAuthenticatedAxiosInstance";

const userAxiosInstance = userAuthenticatedAxiosInstance('/api/v1/recommendations');

export const getPersonalizedRecommendations = async (page = 1, limit = 9) => {
    try {
        const response = await userAxiosInstance.get('/personalized', {
            params: { page, limit },
            withCredentials: true, // Ensure credentials (cookies) are sent
            // headers: {
            //     'Content-Type': 'application/json',
            //     'Authorization': `Bearer ${localStorage.getItem('accessToken')}` // Include JWT token
            // }
        });

        return {
            schemes: response.data.data.schemes,
            totalPages: response.data.data.totalPages,
            currentPage: response.data.data.currentPage,
            totalSchemes: response.data.data.totalSchemes
        };
    } catch (error) {
        throw error; // Ensure the error is thrown to be handled in the calling code
    }
};
