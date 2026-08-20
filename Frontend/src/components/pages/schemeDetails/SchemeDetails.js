import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { getSchemeById, saveFavoriteSchemes, removeFavoriteSchemes, getFavoriteSchemes } from "../../../services/schemes/schemeService";
import { ArrowLeft, Target, List, FileText, Users, Download, Share2, Bookmark, Sparkles, CheckCircle2, ExternalLink, X, Loader2 } from 'lucide-react';
import ChatBot from "../../common/chatbot/ChatBot";
import { generatePDF } from "../../../helper/generatePdf";
import { shareScheme } from "../../../helper/shareScheme";
import DisplayFormatted from "./components/DisplayFormatted";
import DisplayMarkdown from './components/DisplayMarkdown';
import SchemeAudioExplainer from "../../common/schemeVoice/SchemeAudioExplainer";
import { toast } from "react-hot-toast";
import { useLanguage } from "../../../context/LanguageContext";
import axios from "axios";

const SchemeDetails = () => {
    const { id } = useParams();
    const [scheme, setScheme] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const contentRef = useRef(null);
    const [isSaved, setIsSaved] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');
    const { t, translateText } = useLanguage();

    const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);
    const [isGeneratingChecklist, setIsGeneratingChecklist] = useState(false);
    const [aiChecklistData, setAiChecklistData] = useState(null);

    const handleSendWhatsAppScheme = () => {
        const text = `🎯 *JANDARPAN SCHEME DISCOVERY ALERT* 🎯\n\n` +
                     `📌 *Scheme Name:* ${scheme?.schemeName || 'Welfare Scheme'}\n` +
                     `🏛️ *Ministry:* ${scheme?.nodalMinistryName || 'Central Govt'}\n` +
                     `📍 *State:* ${scheme?.state || 'India'}\n\n` +
                     `👇 *View Full Details & Apply Online:* \n` +
                     `http://localhost:3000/scheme/${id}\n\n` +
                     `_JanDarpan AI Scheme Discovery Engine_`;

        const targetPhone = "918050614849";
        const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
        
        window.dispatchEvent(new CustomEvent('whatsappPushAlert', {
            detail: {
                title: 'Scheme Details Sent to WhatsApp',
                reportId: id?.slice(-6)?.toUpperCase() || 'SCHEME',
                phone: '918050614849',
                body: `Official Scheme Specifications for ${scheme?.schemeName} dispatched to WhatsApp (+91 8050614849).`
            }
        }));

        window.open(whatsappUrl, "_blank");
    };

    const formatDate = (dateString) => {
        if (!dateString) return null;
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    useEffect(() => {
        const fetchSchemeDetails = async () => {
            try {
                const data = await getSchemeById(id);
                setScheme(data);
            } catch (err) {
                setError("Failed to fetch scheme details");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSchemeDetails();
    }, [id]);

    useEffect(() => {
        const checkIfSaved = async () => {
            try {
                const savedSchemes = await getFavoriteSchemes();
                const isSaved = savedSchemes.includes(id);
                setIsSaved(isSaved);
            } catch (error) {
                console.error('Error checking saved status:', error);
            }
        };

        if (id) {
            checkIfSaved();
        }
    }, [id]);

    const handleSaveScheme = async () => {
        if (isSaving) return;

        try {
            setIsSaving(true);
            if (isSaved) {
                await removeFavoriteSchemes(id);
                toast.success('Removed from favorites');
            } else {
                await saveFavoriteSchemes(id);
                toast.success('Added to favorites');
            }

            setIsSaved(!isSaved);
        } catch (error) {
            console.error('Error managing favorite:', error);
            toast.error('Please login to save schemes');
        } finally {
            setIsSaving(false);
        }
    };

    const handleGenerateAiChecklist = async () => {
        setIsChecklistModalOpen(true);
        if (aiChecklistData) return;

        setIsGeneratingChecklist(true);
        try {
            const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
            const { data } = await axios.post(`${backendUrl}/api/v2/schemes/ai-checklist/${id}`);
            if (data.success && data.checklist) {
                setAiChecklistData(data.checklist);
            }
        } catch (err) {
            console.error("AI Checklist Generation Error:", err);
            toast.error("Using standard document checklist");
        } finally {
            setIsGeneratingChecklist(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-swiss-white font-inter flex items-center justify-center">
            <div className="flex items-center gap-4">
                <div className="w-6 h-6 border-4 border-swiss-black border-t-swiss-accent animate-spin"></div>
                <span className="font-black text-sm uppercase tracking-widest text-swiss-black">Loading scheme specifications...</span>
            </div>
        </div>
    );
    
    if (error) return (
        <div className="min-h-screen bg-swiss-white font-inter flex items-center justify-center p-6">
            <div className="bg-swiss-accent text-swiss-white p-6 border-4 border-swiss-black max-w-md w-full text-center">
                <span className="font-black text-sm uppercase tracking-widest">{error}</span>
            </div>
        </div>
    );
    
    if (!scheme) return (
        <div className="min-h-screen bg-swiss-white font-inter flex items-center justify-center p-6">
            <div className="bg-swiss-black text-swiss-white p-6 border-4 border-swiss-black max-w-md w-full text-center">
                <span className="font-black text-sm uppercase tracking-widest">Scheme record not found</span>
            </div>
        </div>
    );

    const tabs = [
        { id: 'overview', label: 'Overview', icon: Target },
        { id: 'eligibility', label: t('det_eligibility'), icon: Users },
        { id: 'benefits', label: t('det_benefits'), icon: List },
        { id: 'documents', label: t('det_docs'), icon: FileText },
        { id: 'apply', label: 'Apply', icon: FileText },
        { id: 'faq', label: t('det_faqs'), icon: List },
    ];

    return (
        <div className="min-h-screen bg-swiss-white font-inter">
            {/* Top Bar Navigation */}
            <div className="border-b-4 border-swiss-black px-6 md:px-12 py-4 bg-swiss-white flex items-center justify-between">
                <button
                    onClick={() => window.history.back()}
                    className="bg-swiss-black text-swiss-white px-4 py-2 font-black uppercase text-xs tracking-widest hover:bg-swiss-accent transition-colors duration-150 flex items-center gap-2 border-2 border-swiss-black"
                >
                    <ArrowLeft size={16} />
                    BACK TO DIRECTORY
                </button>
                <span className="text-swiss-accent font-black text-xs uppercase tracking-widest hidden sm:inline">
                    REF ID: {id ? id.slice(-6).toUpperCase() : 'SCHEME'}
                </span>
            </div>

            <div className="max-w-6xl mx-auto p-6 md:p-12">
                <div ref={contentRef} className="border-4 border-swiss-black bg-swiss-white">
                    {/* Header Section */}
                    <header className="border-b-4 border-swiss-black p-8 md:p-12 bg-swiss-muted swiss-grid-pattern">
                        <span className="text-swiss-accent font-black text-xs uppercase tracking-widest block mb-2">OFFICIAL SCHEME SPECIFICATION</span>
                        <h1 className="text-3xl md:text-5xl font-black text-swiss-black uppercase tracking-tighter leading-none mb-3">
                            {translateText(scheme?.schemeName)}
                        </h1>
                        {scheme?.schemeShortTitle && (
                            <p className="text-swiss-black font-bold text-sm uppercase tracking-wider opacity-70">
                                SHORT IDENTIFIER: {scheme.schemeShortTitle}
                            </p>
                        )}

                        {/* Tags */}
                        <div className="mt-6 flex flex-wrap gap-2">
                            {scheme?.tags?.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-swiss-black text-swiss-white font-black text-[10px] uppercase tracking-widest border-2 border-swiss-black"
                                >
                                    {translateText(tag)}
                                </span>
                            ))}
                        </div>

                        {/* Metadata Grid */}
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-0 border-4 border-swiss-black bg-swiss-white">
                            {scheme?.nodalMinistryName && (
                                <div className="p-4 border-b-2 sm:border-b-0 sm:border-r-2 border-swiss-black">
                                    <span className="text-swiss-accent font-black text-[10px] uppercase tracking-widest block">{t('filter_ministry')}</span>
                                    <span className="font-bold text-xs text-swiss-black uppercase">{scheme.nodalMinistryName}</span>
                                </div>
                            )}
                            {scheme?.state && (
                                <div className="p-4 border-b-2 sm:border-b-0 sm:border-r-2 border-swiss-black">
                                    <span className="text-swiss-accent font-black text-[10px] uppercase tracking-widest block">{t('filter_state')}</span>
                                    <span className="font-bold text-xs text-swiss-black uppercase">{translateText(scheme.state)}</span>
                                </div>
                            )}
                            {scheme?.level && (
                                <div className="p-4 border-b-2 sm:border-b-0 border-swiss-black">
                                    <span className="text-swiss-accent font-black text-[10px] uppercase tracking-widest block">{t('filter_level')}</span>
                                    <span className="font-bold text-xs text-swiss-black uppercase">{translateText(scheme.level)}</span>
                                </div>
                            )}
                            {scheme?.openDate && (
                                <div className="p-4 border-r-2 border-swiss-black">
                                    <span className="text-swiss-accent font-black text-[10px] uppercase tracking-widest block">OPEN DATE</span>
                                    <span className="font-bold text-xs text-swiss-black uppercase">{formatDate(scheme.openDate)}</span>
                                </div>
                            )}
                            {scheme?.closeDate && (
                                <div className="p-4">
                                    <span className="text-swiss-accent font-black text-[10px] uppercase tracking-widest block">CLOSE DATE</span>
                                    <span className="font-bold text-xs text-swiss-black uppercase">{formatDate(scheme.closeDate)}</span>
                                </div>
                            )}
                        </div>

                        {/* NATIVE MULTILINGUAL VOICE EXPLAINER IN KANNADA & TAMIL */}
                        <SchemeAudioExplainer scheme={scheme} />
                    </header>

                    {/* Tab Navigation */}
                    <div className="border-b-4 border-swiss-black bg-swiss-white">
                        <nav className="flex overflow-x-auto">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`
                                            flex items-center gap-2 py-4 px-6 font-black text-xs uppercase tracking-widest whitespace-nowrap transition-colors duration-150 flex-1 border-r-2 border-swiss-black last:border-r-0
                                            ${isActive
                                                ? 'bg-swiss-black text-swiss-white'
                                                : 'bg-swiss-white text-swiss-black hover:bg-swiss-muted'
                                            }
                                        `}
                                    >
                                        <Icon size={16} />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-8 md:p-12">
                        {activeTab === 'overview' && (
                            <div className="prose max-w-none text-swiss-black">
                                <DisplayMarkdown content={scheme?.detailedDescription_md} />
                            </div>
                        )}

                        {activeTab === 'eligibility' && (
                            <div className="prose max-w-none text-swiss-black">
                                <DisplayMarkdown content={scheme?.eligibilityDescription_md} />
                            </div>
                        )}

                        {activeTab === 'benefits' && (
                            <div className="border-4 border-swiss-black p-6 bg-swiss-muted swiss-dots">
                                <DisplayFormatted benefitsData={scheme?.benefits} />
                            </div>
                        )}

                        {activeTab === 'documents' && (
                            <div className="border-4 border-swiss-black p-6 bg-swiss-muted swiss-dots">
                                <DisplayFormatted benefitsData={scheme?.documents_required} />
                            </div>
                        )}

                        {activeTab === 'apply' && (
                            <div className="space-y-6">
                                {scheme?.applicationProcess?.map((process, index) => (
                                    <div key={index} className="border-4 border-swiss-black p-6 bg-swiss-muted">
                                        <h3 className="font-black text-sm uppercase tracking-widest text-swiss-accent mb-4">{process?.mode}:</h3>
                                        <DisplayFormatted benefitsData={process?.process} />
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'faq' && scheme?.faqs?.length > 0 && (
                            <div className="space-y-4">
                                {scheme.faqs.map((faq, index) => (
                                    <div key={index} className="border-4 border-swiss-black p-6 bg-swiss-white">
                                        <h3 className="font-black text-sm uppercase tracking-tight text-swiss-black mb-2">0{index + 1}. {translateText(faq.question)}</h3>
                                        <p className="text-swiss-black font-medium text-sm leading-relaxed">{translateText(faq.answer)}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons Strip */}
                    <div className="flex flex-wrap gap-3 p-6 md:p-8 bg-swiss-muted border-t-4 border-swiss-black">
                        <button
                            onClick={handleSendWhatsAppScheme}
                            className="px-6 py-4 bg-emerald-600 text-swiss-white font-black uppercase text-xs tracking-widest border-4 border-swiss-black hover:bg-emerald-700 transition-colors duration-150 flex items-center gap-2 cursor-pointer shadow-brutal"
                        >
                            <span>📱 SEND SCHEME TO WHATSAPP →</span>
                        </button>

                        <button
                            onClick={handleGenerateAiChecklist}
                            className="px-6 py-4 bg-swiss-accent text-swiss-white font-black uppercase text-xs tracking-widest border-4 border-swiss-black hover:bg-swiss-black transition-colors duration-150 flex items-center gap-2"
                        >
                            <Sparkles size={16} />
                            📄 GLM-4 DOCUMENT CHECKLIST & APPLY GUIDE
                        </button>

                        <button
                            onClick={handleSaveScheme}
                            disabled={isSaving}
                            className={`px-6 py-4 font-black uppercase text-xs tracking-widest flex items-center gap-2 border-4 border-swiss-black transition-colors duration-150 ${
                                isSaving ? 'opacity-50 cursor-not-allowed' : ''
                            } ${
                                isSaved
                                    ? 'bg-swiss-black text-swiss-white border-swiss-black hover:bg-swiss-accent hover:border-swiss-accent'
                                    : 'bg-swiss-white text-swiss-black hover:bg-swiss-black hover:text-swiss-white'
                            }`}
                        >
                            <Bookmark
                                className={`${isSaved ? 'fill-swiss-white' : ''}`}
                                size={16}
                            />
                            {isSaving ? 'PROCESSING...' : isSaved ? t('btn_remove_fav') : t('btn_save_fav')}
                        </button>

                        <button
                            onClick={() => generatePDF(contentRef, scheme?.schemeName)}
                            className="px-6 py-4 bg-swiss-white text-swiss-black font-black uppercase text-xs tracking-widest border-4 border-swiss-black hover:bg-swiss-black hover:text-swiss-white transition-colors duration-150 flex items-center gap-2"
                        >
                            <Download size={16} />
                            DOWNLOAD PDF
                        </button>

                        <button
                            onClick={() => shareScheme(scheme?.schemeName)}
                            className="px-6 py-4 bg-swiss-white text-swiss-black font-black uppercase text-xs tracking-widest border-4 border-swiss-black hover:bg-swiss-accent hover:text-swiss-white hover:border-swiss-accent transition-colors duration-150 flex items-center gap-2"
                        >
                            <Share2 size={16} />
                            SHARE SPECIFICATION
                        </button>
                    </div>
                </div>

                {/* GLM-4 Document Checklist & Apply Guide Modal */}
                {isChecklistModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-swiss-black/70 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-swiss-white border-4 border-swiss-black w-full max-w-2xl max-h-[85vh] flex flex-col justify-between shadow-brutal overflow-hidden">
                            {/* Modal Header */}
                            <div className="bg-swiss-black text-swiss-white p-6 border-b-4 border-swiss-black flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Sparkles className="text-swiss-accent" size={22} />
                                    <div>
                                        <span className="text-swiss-accent font-black text-[10px] uppercase tracking-widest block">GLM-4 AI APPLICATION ASSISTANT</span>
                                        <h3 className="font-black text-base uppercase tracking-tight">{scheme?.schemeName}</h3>
                                    </div>
                                </div>
                                <button onClick={() => setIsChecklistModalOpen(false)} className="p-1.5 hover:bg-swiss-accent transition-colors text-swiss-white border border-swiss-white">
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 md:p-8 overflow-y-auto space-y-6 bg-swiss-white swiss-dots">
                                {isGeneratingChecklist ? (
                                    <div className="p-12 text-center space-y-4">
                                        <Loader2 size={32} className="animate-spin text-swiss-accent mx-auto" />
                                        <p className="font-black text-xs uppercase tracking-widest text-swiss-black">GLM-4 AI Compiling Document Checklist & Apply Guide...</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Required Documents Section */}
                                        <div className="border-4 border-swiss-black p-6 bg-swiss-muted">
                                            <h4 className="font-black text-sm uppercase tracking-widest text-swiss-accent mb-4 flex items-center gap-2">
                                                <FileText size={18} /> REQUIRED DOCUMENTS CHECKLIST:
                                            </h4>
                                            <div className="space-y-2.5">
                                                {aiChecklistData?.documentsRequired?.map((doc, idx) => (
                                                    <div key={idx} className="flex items-start gap-2.5 text-xs font-extrabold uppercase text-swiss-black">
                                                        <CheckCircle2 size={16} className="text-swiss-accent shrink-0 mt-0.5" />
                                                        <span>{doc}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Step by Step Apply Guide */}
                                        <div className="border-4 border-swiss-black p-6 bg-swiss-white">
                                            <h4 className="font-black text-sm uppercase tracking-widest text-swiss-black mb-4 flex items-center gap-2">
                                                <Target size={18} className="text-swiss-accent" /> STEP-BY-STEP APPLICATION GUIDE:
                                            </h4>
                                            <div className="space-y-3">
                                                {aiChecklistData?.stepByStepGuide?.map((step, idx) => (
                                                    <div key={idx} className="p-3 border-2 border-swiss-black bg-swiss-muted text-xs font-bold text-swiss-black uppercase">
                                                        {step}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-4 bg-swiss-black text-swiss-white border-t-4 border-swiss-black flex items-center justify-between">
                                <span className="font-black text-[10px] uppercase tracking-widest text-swiss-accent">VERIFIED BY JAN DARPAN AI</span>
                                <a
                                    href={aiChecklistData?.officialPortalUrl || "https://myscheme.gov.in"}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-swiss-accent text-swiss-white hover:bg-swiss-white hover:text-swiss-black border-2 border-swiss-white px-5 py-2.5 font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-colors"
                                >
                                    <span>LAUNCH OFFICIAL PORTAL</span>
                                    <ExternalLink size={14} />
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                {scheme && <ChatBot schemeId={scheme?._id} />}
            </div>
        </div>
    );
};

export default SchemeDetails;