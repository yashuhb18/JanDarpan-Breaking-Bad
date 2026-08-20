import Report from "../models/report.model.js";

export const submitReport = async (req, res) => {
    try {
        const { title, category, description, imageUrl, cityName, latitude, longitude } = req.body;

        if (!title || !category || !description || !cityName) {
            return res.status(400).json({ success: false, message: "Please provide all required report fields." });
        }

        const report = await Report.create({
            title,
            category,
            description,
            imageUrl: imageUrl || "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b2?w=800",
            cityName,
            latitude: latitude || 12.9716,
            longitude: longitude || 77.5946,
            submittedBy: req.user?._id,
            status: "SUBMITTED"
        });

        res.status(201).json({ success: true, message: "Civic issue report submitted successfully!", report });
    } catch (error) {
        console.error("Error submitting report:", error);
        res.status(500).json({ success: false, message: "Failed to submit report", error: error.message });
    }
};

export const getAllReports = async (req, res) => {
    try {
        const reports = await Report.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: reports.length, reports });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching civic reports" });
    }
};

export const upvoteReport = async (req, res) => {
    try {
        const report = await Report.findByIdAndUpdate(
            req.params.id,
            { $inc: { upvotesCount: 1 } },
            { new: true }
        );
        res.status(200).json({ success: true, upvotesCount: report.upvotesCount });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to upvote report" });
    }
};

export const updateReportStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const report = await Report.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.status(200).json({ success: true, message: "Report status updated", report });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update report status" });
    }
};
