import Report from "../models/report.model.js";
import { generatePilDraftData } from "../services/legalNlpService.js";
import { generateGeminiLegalPil } from "../services/geminiLegalService.js";
import { generateOllamaLegalPil } from "../services/ollamaLegalService.js";

export const generatePilForReport = async (req, res) => {
    try {
        const { reportId } = req.params;
        const report = await Report.findById(reportId);

        if (!report) {
            return res.status(404).json({ success: false, message: "Civic report not found." });
        }

        const upvotes = Math.max(report.upvotesCount || 0, 52); // Demo count >= 50
        
        // 1. Try Local Ollama Model (GLM-4 / Llama-3) first
        let aiResult = await generateOllamaLegalPil(report, upvotes);

        // 2. If local Ollama not running, fallback to Google Gemini Pro
        if (!aiResult.isAiGenerated) {
            aiResult = await generateGeminiLegalPil(report, upvotes);
        }

        const pilData = generatePilDraftData(report, upvotes);

        // Merge citations & metadata
        pilData.citations = aiResult.citations;
        pilData.aiMeta = {
            isAiGenerated: aiResult.isAiGenerated,
            modelName: aiResult.modelName
        };

        // Advance report status to ENOTICE_ISSUED if pending
        if (report.status === "PENDING" || report.status === "SUBMITTED") {
            report.status = "ENOTICE_ISSUED";
            await report.save();
        }

        res.status(200).json({
            success: true,
            message: `Auto-PIL Petition Draft & Statutory e-Notice Generated via ${aiResult.modelName} Successfully!`,
            pilData,
            report
        });
    } catch (error) {
        console.error("PIL Generation Error:", error);
        res.status(500).json({ success: false, message: "Failed to generate PIL Petition.", error: error.message });
    }
};

export const getLegalNoticeStatus = async (req, res) => {
    try {
        const { reportId } = req.params;
        const report = await Report.findById(reportId);

        if (!report) {
            return res.status(404).json({ success: false, message: "Report not found." });
        }

        const pilData = generatePilDraftData(report, report.upvotesCount || 52);

        res.status(200).json({
            success: true,
            status: report.status,
            pilData
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching legal status." });
    }
};
