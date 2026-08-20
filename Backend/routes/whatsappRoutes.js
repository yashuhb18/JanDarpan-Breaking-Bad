import express from "express";
import { formatWhatsAppNotice, sendWhatsAppMessage } from "../services/whatsappService.js";

const router = express.Router();

// POST /api/whatsapp/send-notice
router.post("/send-notice", async (req, res) => {
    try {
        const { reportId, category, location, discrepancy, officerName, phone, polygonHash } = req.body;
        
        const messageText = formatWhatsAppNotice({
            reportId,
            category,
            location,
            discrepancy,
            officerName,
            phone,
            polygonHash
        });

        const result = await sendWhatsAppMessage({
            phone: phone || "+918050614849",
            message: messageText
        });

        // Direct WhatsApp deep link URL for browser click-through
        const encodedText = encodeURIComponent(messageText);
        const targetPhone = (phone || "918050614849").replace(/[^0-9]/g, "");
        const whatsappDeepLink = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodedText}`;

        res.json({
            success: true,
            result,
            message: messageText,
            whatsappDeepLink
        });
    } catch (err) {
        console.error("WhatsApp Route Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
});

export default router;
