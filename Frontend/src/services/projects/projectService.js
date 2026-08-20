import axios from "axios";

const BACKEND_URLV2 = `${process.env.REACT_APP_BACKEND_URL}/api/v2/projects`;

const api = axios.create({
    baseURL: BACKEND_URLV2,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getAllProjects = async (params = {}) => {
    try {
        const { data } = await api.get('/get-all-projects', { params });
        return data;
    } catch (error) {
        console.error("Error fetching projects:", error);
        throw error.response?.data?.message || error.message || "Failed to fetch infrastructure projects.";
    }
};

export const createProject = async (projectData) => {
    try {
        const { data } = await api.post('/create-project', projectData);
        return data;
    } catch (error) {
        console.error("Error registering project:", error);
        throw error.response?.data?.message || error.message || "Failed to register project.";
    }
};

export const getProjectById = async (id) => {
    try {
        const { data } = await api.get(`/get-project-by-id/${id}`);
        return data.project;
    } catch (error) {
        console.error("Error fetching project details:", error);
        throw error.response?.data?.message || error.message || "Failed to fetch project specifications.";
    }
};
