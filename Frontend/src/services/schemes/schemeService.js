import userAuthenticatedAxiosInstance from "../users/userAuthenticatedAxiosInstance";

const userAxiosInstance = userAuthenticatedAxiosInstance('/api/v2/schemes');

export const getFilteredSchemes = async (filters, page = 1, limit = 9) => {
    try {
        const params = {
            page,
            limit,
            ...(filters.search && { search: filters.search }),
            ...(filters.schemeName && { schemeName: filters.schemeName }),
            ...(filters.openDate && { openDate: filters.openDate }),
            ...(filters.closeDate && { closeDate: filters.closeDate }),
            ...(filters.state && { state: filters.state }),
            ...(filters.nodalMinistryName && { nodalMinistryName: filters.nodalMinistryName }),
            ...(filters.level && { level: filters.level }),
            ...(filters.category && { category: filters.category }),
            ...(filters.gender && { gender: filters.gender }),
            ...(filters.incomeGroup && { incomeGroup: filters.incomeGroup })
        };

        const { data } = await userAxiosInstance.get('/get-filtered-schemes', { params });
        return {
            schemes: data.schemes || [],
            totalPages: data.totalPages || 1,
            currentPage: data.currentPage || 1,
            totalSchemes: data.totalSchemes || 0
        };
    } catch (error) {
        console.error("Error fetching filtered schemes:", error);
        throw error.response?.data?.message || error.message || "Failed to fetch schemes.";
    }
};

export const getAllSchemes = async (page = 1, limit = 9) => {
    try {
        const { data } = await userAxiosInstance.get('/get-all-schemes', {
            params: { page, limit }
        });
        return {
            schemes: data.schemes || [],
            totalPages: data.totalPages || 1,
            currentPage: data.currentPage || 1,
            totalSchemes: data.totalSchemes || 0
        };
    } catch (error) {
        console.error("Error fetching all schemes:", error);
        throw error.response?.data?.message || error.message || "Failed to fetch schemes.";
    }
};

export const getSchemeById = async (id) => {
    try {
        const { data } = await userAxiosInstance.get(`/get-scheme-by-id/${id}`);
        return data;
    } catch (error) {
        console.error("Error fetching scheme by ID:", error);
        throw error.response?.data?.message || error.message || "Failed to fetch scheme details.";
    }
};

export const saveFavoriteSchemes = async (schemeId) => {
    try {
        const response = await userAxiosInstance.post('/save-favorite-schemes', { schemeId });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const removeFavoriteSchemes = async (schemeId) => {
    try {
        const response = await userAxiosInstance.delete(`/remove-favorite-schemes/${schemeId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getFavoriteSchemes = async () => {
    try {
        const response = await userAxiosInstance.get('/get-favorite-schemes');
        return response.data;
    } catch (error) {
        throw error;
    }
};