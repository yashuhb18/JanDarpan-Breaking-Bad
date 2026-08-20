import userAuthenticatedAxiosInstance from "../users/userAuthenticatedAxiosInstance";

const userAxiosInstance = userAuthenticatedAxiosInstance('/api/v2/reports');

export const uploadPhotoToCloudinary = async (file) => {
    try {
        const formData = new FormData();
        formData.append('photo', file);
        const { data } = await userAxiosInstance.post('/upload-photo', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (data && data.imageUrl) return data.imageUrl;
        throw new Error("No image URL returned");
    } catch (error) {
        console.warn("Cloudinary upload fallback to local Data URL:", error);
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = (err) => reject(err);
            reader.readAsDataURL(file);
        });
    }
};

export const getAllReports = async () => {
    try {
        const { data } = await userAxiosInstance.get('/get-all-reports');
        return data.reports || [];
    } catch (error) {
        console.error("Error fetching reports:", error);
        throw error.response?.data?.message || error.message || "Failed to fetch civic reports.";
    }
};

export const submitReport = async (reportData) => {
    try {
        const { data } = await userAxiosInstance.post('/submit-report', reportData);
        return data;
    } catch (error) {
        console.error("Error submitting report:", error);
        throw error.response?.data?.message || error.message || "Failed to submit civic report.";
    }
};

export const upvoteReport = async (reportId) => {
    try {
        const { data } = await userAxiosInstance.post(`/upvote-report/${reportId}`);
        return data;
    } catch (error) {
        console.error("Error upvoting report:", error);
        throw error;
    }
};

export const updateReportStatus = async (reportId, status) => {
    try {
        const { data } = await userAxiosInstance.patch(`/update-report-status/${reportId}`, { status });
        return data;
    } catch (error) {
        console.error("Error updating report status:", error);
        throw error;
    }
};
