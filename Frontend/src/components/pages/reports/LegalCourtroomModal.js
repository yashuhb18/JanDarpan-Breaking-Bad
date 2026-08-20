import React, { useState } from 'react';
import { Shield, FileText, Download, Clock, AlertTriangle, CheckCircle, Gavel, X, MapPin } from 'lucide-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const LegalCourtroomModal = ({ isOpen, onClose, pilData, report }) => {
    const [isDownloading, setIsDownloading] = useState(false);

    if (!isOpen || !pilData) return null;

    const citations = pilData.citations || {};

    const handleDownloadPdf = () => {
        setIsDownloading(true);
        toast.loading("Generating Court-Admissible PIL Petition PDF...", { id: "pdf-gen" });

        setTimeout(() => {
            window.print();
            setIsDownloading(false);
            toast.success("PIL Petition exported!", { id: "pdf-gen" });
        }, 800);
    };

    const handleSendWhatsAppNotice = async () => {
        try {
            toast.loading("Dispatching Official Section 80 CPC WhatsApp Notice...", { id: "wa-dispatch" });
            
            const messageText = 
                `JANDARPAN STATUTORY LEGAL NOTICE\n\n` +
                `Case Filing: ${pilData.filingNumber || 'PIL/2026/08812'}\n` +
                `Court: High Court Public Interest Litigation\n` +
                `Location: ${report?.category || 'Civic Infrastructure'} at ${report?.cityName || 'Bangalore Central'}\n` +
                `GLM-4 AI Audit: ${report?.financialDiscrepancy || '34%'} Physical Work Mismatch\n` +
                `Notice Window: 7-Day Section 80 CPC Statutory Response Timer\n` +
                `Polygon Hash: ${report?.polygonTxHash || '0x7f8a...991b'}\n\n` +
                `View Full Forensic Evidence Docket:\n` +
                `http://localhost:3000/report-issue\n\n` +
                `_JanDarpan AI Governance Portal_`;

            const targetPhone = "918050614849";
            
            // 1. Call Backend WhatsApp Dispatch Service
            try {
                const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
                await axios.post(`${backendUrl}/api/v1/whatsapp/send-notice`, {
                    phone: targetPhone,
                    message: messageText
                });
            } catch (backendErr) {
                console.warn("Backend WhatsApp Dispatch Notice error:", backendErr);
            }

            // 2. Trigger Automated On-Screen Push Notification
            window.dispatchEvent(new CustomEvent('whatsappPushAlert', {
                detail: {
                    title: 'Section 80 CPC High Court Notice Dispatched',
                    reportId: pilData.filingNumber || 'JD-9812',
                    phone: '918050614849',
                    body: `Official Section 80 CPC High Court e-Notice dispatched to PWD Chief Engineer (+91 8050614849). 7-Day statutory timer running.`
                }
            }));

            // 3. Launch Direct WhatsApp Web App link
            const whatsappUrl = `https://api.whatsapp.com/send?phone=${targetPhone}&text=${encodeURIComponent(messageText)}`;
            window.open(whatsappUrl, "_blank");

            toast.success("WhatsApp Statutory Notice Dispatched to +91 8050614849!", {
                id: "wa-dispatch",
                duration: 5000
            });
        } catch (err) {
            toast.error("Failed to send WhatsApp notice", { id: "wa-dispatch" });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-swiss-black/80 backdrop-blur-sm overflow-y-auto font-inter">
            <div className="bg-swiss-white border-4 border-swiss-black max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-brutal flex flex-col justify-between">
                
                {/* Modal Header */}
                <div className="border-b-4 border-swiss-black bg-swiss-black text-swiss-white p-6 flex items-center justify-between sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-swiss-accent text-swiss-white flex items-center justify-center border-2 border-swiss-white font-black">
                            <Gavel size={22} />
                        </div>
                        <div>
                            <span className="text-swiss-accent font-black text-[10px] uppercase tracking-widest block">THE SWORD OF DAMOCLES — VIRTUAL COURTROOM</span>
                            <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">HIGH COURT PIL PETITION & E-NOTICE</h2>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 border-2 border-swiss-white hover:bg-swiss-accent transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Modal Body - Authentic High Court Legal Format */}
                <div className="p-6 md:p-10 space-y-8 bg-swiss-white">
                    
                    {/* Official Banner */}
                    <div className="border-4 border-swiss-black p-6 bg-swiss-muted text-center relative swiss-dots">
                        <span className="px-3 py-1 bg-swiss-accent text-swiss-white font-black text-[10px] uppercase tracking-widest border-2 border-swiss-black inline-block mb-3">
                            {pilData.aiMeta?.isAiGenerated ? `POWERED BY ${pilData.aiMeta.modelName}` : 'LEGISLATIVE NLP ENGINE'}
                        </span>
                        <h3 className="font-black text-lg md:text-xl uppercase tracking-wider text-swiss-black leading-tight">
                            {pilData.courtName || "IN THE HIGH COURT OF JUDICATURE AT BENGALURU"}
                        </h3>
                        <p className="font-extrabold text-xs uppercase text-swiss-accent tracking-widest mt-1">
                            {pilData.jurisdiction}
                        </p>
                        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-black uppercase border-t-2 border-swiss-black pt-3">
                            <span className="bg-swiss-black text-swiss-white px-3 py-1">{pilData.pilNumber}</span>
                            <span className="bg-emerald-600 text-swiss-white px-3 py-1">PRE-LITIGATION DOCKET</span>
                            <span>DATE: {pilData.dateGenerated}</span>
                        </div>
                    </div>

                    {/* 7-Day Pre-Litigation Countdown Clock */}
                    <div className="border-4 border-swiss-black bg-swiss-black text-swiss-white p-6">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div>
                                <span className="text-swiss-accent font-black text-xs uppercase tracking-widest block mb-1">SECTION 80 CPC STATUTORY NOTICE COUNTDOWN</span>
                                <h4 className="text-lg font-black uppercase tracking-tight">7-DAY DEPARTMENTAL RESPONSE TIMER</h4>
                                <p className="text-xs text-swiss-white/70 font-medium">If unresolved in 7 days, system auto-files Mock e-FIR & High Court Writ.</p>
                            </div>
                            <div className="flex items-center gap-2 bg-swiss-white text-swiss-black border-2 border-swiss-white px-4 py-2 font-black text-sm uppercase tracking-wider">
                                <Clock className="text-swiss-accent animate-spin" size={18} />
                                <span>6 DAYS, 23 HOURS, 59 MINS</span>
                            </div>
                        </div>
                    </div>

                    {/* Parties */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-4 border-swiss-black p-6 bg-swiss-white">
                        <div>
                            <span className="text-swiss-accent font-black text-xs uppercase tracking-widest block mb-2">PETITIONER (COLLECTIVE):</span>
                            <p className="font-black text-sm uppercase text-swiss-black leading-snug">
                                {pilData.petitioner}
                            </p>
                            <span className="text-[11px] font-bold text-gray-500 block mt-1">Representing 52 Verified Local Citizens via JanDarpan Audit</span>
                        </div>

                        <div>
                            <span className="text-swiss-accent font-black text-xs uppercase tracking-widest block mb-2">RESPONDENTS (DEFENDANTS):</span>
                            <ul className="text-xs font-bold uppercase text-swiss-black space-y-1">
                                {pilData.respondents?.map((resp, i) => (
                                    <li key={i}>{resp}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Statutory Citations & Legal Grounds */}
                    <div className="border-4 border-swiss-black p-6 bg-swiss-white space-y-4">
                        <span className="text-swiss-accent font-black text-xs uppercase tracking-widest block">AUTOMATED LEGISLATIVE CITATIONS & IPC SECTIONS</span>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold uppercase">
                            <div className="p-3 bg-swiss-muted border-2 border-swiss-black">
                                <span className="text-swiss-accent block mb-1">CONSTITUTIONAL MANDATE:</span>
                                {citations.constitutionalArticle}
                            </div>
                            <div className="p-3 bg-swiss-muted border-2 border-swiss-black">
                                <span className="text-swiss-accent block mb-1">PRIMARY STATUTORY ACT:</span>
                                {citations.primaryAct}
                            </div>
                            <div className="p-3 bg-swiss-muted border-2 border-swiss-black">
                                <span className="text-swiss-accent block mb-1">CRIMINAL IPC PROVISIONS:</span>
                                {citations.ipcSections?.join(", ")}
                            </div>
                            <div className="p-3 bg-swiss-muted border-2 border-swiss-black">
                                <span className="text-swiss-accent block mb-1">MUNICIPAL OBLIGATION:</span>
                                {citations.municipalAct}
                            </div>
                        </div>

                        <div className="border-t-2 border-swiss-black pt-4">
                            <span className="text-swiss-accent font-black text-xs uppercase tracking-widest block mb-2">BINDING JUDICIAL PRECEDENTS:</span>
                            <ul className="text-xs font-medium text-swiss-black space-y-1">
                                {citations.precedents?.map((prec, idx) => (
                                    <li key={idx} className="flex items-start gap-2">
                                        <span className="font-black text-swiss-accent">•</span>
                                        <span>{prec}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Statement of Facts & Prayer */}
                    <div className="border-4 border-swiss-black p-6 bg-swiss-white space-y-4">
                        <div>
                            <span className="text-swiss-accent font-black text-xs uppercase tracking-widest block mb-1">STATEMENT OF FACTS:</span>
                            <p className="text-xs font-medium leading-relaxed text-swiss-black">
                                {pilData.factsSummary}
                            </p>
                        </div>

                        <div className="border-t-2 border-swiss-black pt-4">
                            <span className="text-swiss-accent font-black text-xs uppercase tracking-widest block mb-2">PRAYER FOR WRIT OF MANDAMUS:</span>
                            <ul className="text-xs font-bold uppercase text-swiss-black space-y-2">
                                {pilData.prayer?.map((pr, idx) => (
                                    <li key={idx} className="p-2 bg-swiss-muted border border-swiss-black">
                                        {pr}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Mock e-FIR Registration Certificate */}
                    <div className="border-4 border-swiss-black bg-swiss-muted p-6 flex flex-col md:flex-row items-center justify-between gap-4 swiss-grid-pattern">
                        <div>
                            <span className="text-swiss-accent font-black text-xs uppercase tracking-widest block mb-1">CYBER COURT ESCALATION DOCKET</span>
                            <h4 className="text-base font-black uppercase text-swiss-black">CYBER E-FIR DOCKET: {pilData.firNumber}</h4>
                            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 mt-1">
                                <CheckCircle size={14} /> Digitally Signed & Encrypted on JanDarpan Ledger
                            </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <button
                                onClick={handleSendWhatsAppNotice}
                                className="bg-emerald-600 text-swiss-white px-5 py-3 font-black text-xs uppercase tracking-widest border-4 border-swiss-black hover:bg-emerald-700 transition-colors flex items-center gap-2 shadow-brutal cursor-pointer"
                            >
                                <span>📱 DISPATCH WHATSAPP NOTICE →</span>
                            </button>

                            <button
                                onClick={handleDownloadPdf}
                                disabled={isDownloading}
                                className="bg-swiss-accent text-swiss-white px-5 py-3 font-black text-xs uppercase tracking-widest border-4 border-swiss-black hover:bg-swiss-black transition-colors flex items-center gap-2 shadow-brutal cursor-pointer"
                            >
                                <Download size={18} />
                                <span>DOWNLOAD OFFICIAL PIL PDF →</span>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default LegalCourtroomModal;
