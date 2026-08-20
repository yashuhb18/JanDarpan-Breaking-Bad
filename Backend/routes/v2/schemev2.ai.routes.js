import express from "express";
import { parseConversationalSchemeSearch, generateSchemeChecklist } from "../../services/glmSchemeService.js";
import Schemev2 from "../../models/schemev2.model.js";

const router = express.Router();

/**
 * @route POST /api/v2/schemes/ai-parse-search
 * @desc Parse conversational query with GLM-4 into structured filters
 */
router.post("/ai-parse-search", async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ message: "Query string is required" });
        }

        const parsedResult = await parseConversationalSchemeSearch(query);
        return res.status(200).json({ success: true, parsed: parsedResult });
    } catch (err) {
        console.error("AI Parse Error:", err);
        return res.status(500).json({ message: "Failed to parse query with GLM-4" });
    }
});

/**
 * @route POST /api/v2/schemes/ai-checklist/:schemeId
 * @desc Generate GLM-4 document checklist & application guide
 */
router.post("/ai-checklist/:schemeId", async (req, res) => {
    try {
        const { schemeId } = req.params;
        const { language = 'en' } = req.body;

        let scheme = null;
        try {
            scheme = await Schemev2.findById(schemeId);
        } catch (e) {}

        const checklist = await generateSchemeChecklist(scheme, language);
        return res.status(200).json({ success: true, checklist });
    } catch (err) {
        console.error("AI Checklist Error:", err);
        return res.status(500).json({ message: "Failed to generate checklist" });
    }
});

export default router;
