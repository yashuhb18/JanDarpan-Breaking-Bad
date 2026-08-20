import React, { useState, useEffect } from 'react';
import { MessageSquare, X, ExternalLink, CheckCheck } from 'lucide-react';

const WhatsAppPushNotification = () => {
    const [alertData, setAlertData] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handlePushEvent = (e) => {
            if (e.detail) {
                setAlertData(e.detail);
                setIsVisible(true);

                // Auto dismiss after 8 seconds
                const timer = setTimeout(() => {
                    setIsVisible(false);
                }, 8000);

                return () => clearTimeout(timer);
            }
        };

        window.addEventListener('whatsappPushAlert', handlePushEvent);
        return () => window.removeEventListener('whatsappPushAlert', handlePushEvent);
    }, []);

    if (!isVisible || !alertData) return null;

    const targetPhone = alertData.phone || "918050614849";
    const encodedText = encodeURIComponent(alertData.message || "JanDarpan AI Statutory Notice");
    const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodedText}`;

    return (
        <div className="fixed top-20 right-6 z-50 max-w-sm w-full bg-[#128C7E] text-white p-4 rounded-xl shadow-2xl border-2 border-white/20 font-inter animate-slide-down transform transition-all duration-300">
            <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-white shadow-sm">
                        <MessageSquare size={18} />
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-xs tracking-tight">WhatsApp • JanDarpan AI Bot</span>
                            <span className="text-[10px] bg-emerald-700 px-1.5 py-0.5 rounded font-mono">+91 8050614849</span>
                        </div>
                        <span className="text-[10px] opacity-80 block">Just now • Automated Dispatch</span>
                    </div>
                </div>

                <button 
                    onClick={() => setIsVisible(false)}
                    className="text-white/80 hover:text-white p-1"
                >
                    <X size={16} />
                </button>
            </div>

            <div className="bg-[#075E54] p-3 rounded-lg text-xs leading-relaxed font-medium space-y-1 text-emerald-50 mb-3 border border-white/10">
                <p className="font-bold text-white uppercase text-[11px] tracking-wider mb-1 flex items-center gap-1">
                    🚨 {alertData.title || "Section 80 CPC Legal Notice Issued"}
                </p>
                <p className="line-clamp-3 text-[11px]">
                    {alertData.body || `Statutory High Court e-Notice dispatched to PWD Chief Engineer (+91 8050614849) for Report #${alertData.reportId || 'JD-9812'}. 7-Day Timer Running.`}
                </p>
                <div className="flex items-center justify-end gap-1 text-[10px] text-emerald-200 pt-1">
                    <span>Delivered</span>
                    <CheckCheck size={12} className="text-emerald-300" />
                </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/10 text-xs font-bold">
                <span className="text-[10px] text-emerald-100 uppercase tracking-widest">
                    AUTOMATED DISPATCH ACTIVE
                </span>
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-[#075E54] hover:bg-emerald-50 px-3 py-1.5 rounded font-black text-[11px] uppercase tracking-wider flex items-center gap-1 shadow-sm transition-colors"
                >
                    <span>Open Chat</span>
                    <ExternalLink size={12} />
                </a>
            </div>
        </div>
    );
};

export default WhatsAppPushNotification;
