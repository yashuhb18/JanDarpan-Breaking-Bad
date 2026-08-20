import Project from "../models/project.model.js";

export const getAllProjects = async (req, res) => {
    try {
        const { city, state, department, status } = req.query;
        const filter = {};

        if (city) filter.city = new RegExp(city, "i");
        if (state) filter.state = state;
        if (department) filter.department = department;
        if (status) filter.status = status;

        const projects = await Project.find(filter).sort({ updatedAt: -1 });
        
        // Calculate aggregate statistics
        const totalProjects = projects.length;
        const totalBudgetAllocated = projects.reduce((sum, p) => sum + p.budgetAllocated, 0);
        const totalBudgetSpent = projects.reduce((sum, p) => sum + p.budgetSpent, 0);
        const delayedProjects = projects.filter(p => p.status === "DELAYED" || p.status === "CRITICAL_DELAY").length;

        res.status(200).json({
            success: true,
            totalProjects,
            totalBudgetAllocated,
            totalBudgetSpent,
            delayedProjects,
            projects
        });
    } catch (error) {
        console.error("Error fetching projects:", error);
        res.status(500).json({ success: false, message: "Error fetching infrastructure projects", error: error.message });
    }
};

export const createProject = async (req, res) => {
    try {
        const {
            projectName, department, city, state, latitude, longitude,
            budgetAllocated, budgetSpent, progressPercentage, startDate,
            targetCompletionDate, status, contractorName, description
        } = req.body;

        if (!projectName || !department || !city || !state || !budgetAllocated) {
            return res.status(400).json({ success: false, message: "Please fill in all required project fields." });
        }

        const project = await Project.create({
            projectName,
            department,
            city,
            state,
            latitude: latitude || 12.9716,
            longitude: longitude || 77.5946,
            budgetAllocated: Number(budgetAllocated),
            budgetSpent: Number(budgetSpent || 0),
            progressPercentage: Number(progressPercentage || 0),
            startDate: startDate ? new Date(startDate) : new Date(),
            targetCompletionDate: targetCompletionDate ? new Date(targetCompletionDate) : new Date(Date.now() + 365*24*60*60*1000),
            status: status || "ON_TRACK",
            contractorName: contractorName || "Public Works Department Contractor",
            description: description || ""
        });

        res.status(201).json({ success: true, message: "Real infrastructure project registered successfully!", project });
    } catch (error) {
        console.error("Error creating project:", error);
        res.status(500).json({ success: false, message: "Failed to register project", error: error.message });
    }
};

export const getProjectById = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" });
        }
        res.status(200).json({ success: true, project });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching project details" });
    }
};
