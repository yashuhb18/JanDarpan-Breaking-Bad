// JanDarpan AI - Official WhatsApp Civic Dispatch Service

export const formatWhatsAppNotice = ({ reportId, category, location, discrepancy, officerName, phone, polygonHash }) => {
    const text = `🚨 *JANDARPAN CIVIC TRANSPARENCY NOTICE* 🚨\n\n` +
                 `📌 *Report ID:* ${reportId || 'JD-2026-8812'}\n` +
                 `📍 *Category & Location:* ${category || 'Road Defect'} at ${location || 'Bangalore Central'}\n` +
                 `🧠 *GLM-4 AI Verdict:* Discrepancy ${discrepancy || '34%'} (Physical vs Claimed)\n` +
                 `⚖️ *Statutory Action:* Section 80 CPC Show-Cause Notice Issued\n` +
                 `⏱️ *Response Window:* 7 Days Statutory Notice Period\n` +
                 `⛓️ *Polygon Ledger Hash:* ${polygonHash || '0x7f8a...991b'}\n\n` +
                 `👇 *View Full Forensic Evidence & Ledger:* \n` +
                 `http://localhost:3000/report-issue\n\n` +
                 `_JanDarpan AI Governance & Legal Enforcement Engine_`;

    return text;
};

export const sendWhatsAppMessage = async ({ phone, message }) => {
    try {
        console.log(`[WHATSAPP DISPATCH] Sending to ${phone || '+91-8050614849'}...`);
        console.log(`[WHATSAPP PAYLOAD]\n${message}`);
        
        // Return simulated success payload for sandbox / Meta API
        return {
            success: true,
            status: "DELIVERED",
            messageId: `wa_msg_${Date.now()}`,
            recipient: phone || "+91-8050614849",
            timestamp: new Date().toISOString()
        };
    } catch (err) {
        console.error("WhatsApp Service Error:", err);
        return { success: false, error: err.message };
    }
};
