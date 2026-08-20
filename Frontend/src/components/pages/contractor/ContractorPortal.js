import React, { useEffect, useState } from 'react';
import { HardHat, Upload, DollarSign, Loader2, LogOut, CheckCircle2, Building, MapPin, Camera, Image, Lock, ShieldCheck, Award, Receipt, Plus, Check, AlertTriangle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAllProjects } from '../../../services/projects/projectService';

const INDIAN_CITIES = [
    "Bengaluru",
    "Delhi",
    "Mumbai",
    "Chennai",
    "Hyderabad",
    "Kolkata",
    "Puducherry",
    "Perambalur",
    "Pune",
    "Ahmedabad",
    "Jaipur",
    "Lucknow",
    "Kochi",
    "Thiruvananthapuram",
    "Other (Type City Below)"
];

const ContractorPortal = () => {
    // List of active Govt Sanctioned Projects
    const [sanctionedProjects, setSanctionedProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState('');

    // Form State
    const [invoiceNo, setInvoiceNo] = useState(`INV-2026-${Math.floor(1000 + Math.random() * 9000)}`);
    const [projectName, setProjectName] = useState('');
    const [selectedCityOption, setSelectedCityOption] = useState('Bengaluru');
    const [customCityText, setCustomCityText] = useState('');

    const [category, setCategory] = useState('Cement');
    const [itemName, setItemName] = useState('');
    const [amount, setAmount] = useState('');
    const [photo, setPhoto] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successResult, setSuccessResult] = useState(null);

    const navigate = useNavigate();
    const authRaw = sessionStorage.getItem("contractorAuth");
    const contractorAccount = authRaw ? JSON.parse(authRaw) : null;

    const isGovtSanctionedLocked = Boolean(selectedProjectId);
    const effectiveCity = selectedCityOption === "Other (Type City Below)" ? customCityText : selectedCityOption;

    const fetchSanctionedProjects = async () => {
        try {
            const data = await getAllProjects();
            setSanctionedProjects(data.projects || []);
        } catch (err) {
            console.error("Error fetching projects:", err);
        }
    };

    useEffect(() => {
        // Enforce 2FA Speakeasy TOTP Authentication Guard
        if (!contractorAccount || !contractorAccount.totpVerified) {
            toast.error("🔒 Security Authentication Required: Please complete 2FA Speakeasy TOTP Login", { id: "contractor-auth" });
            navigate("/contractor-login");
        } else {
            fetchSanctionedProjects();
        }
    }, [navigate]);

    // When a Govt Sanctioned project is selected from dropdown
    const handleSelectProject = (projectId) => {
        setSelectedProjectId(projectId);
        if (projectId) {
            const proj = sanctionedProjects.find(p => p._id === projectId);
            if (proj) {
                const rawName = proj.projectName.split(' [AS:')[0];
                setProjectName(rawName);
                setSelectedCityOption(proj.city || 'Bengaluru');
            }
        } else {
            setProjectName('');
            setSelectedCityOption('Bengaluru');
        }
    };

    // File Upload Handler (Converts device image file to Base64)
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("File size exceeds 5MB. Please choose a smaller image.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhoto(reader.result);
                toast.success(`Photo attached: ${file.name}`);
            };
            reader.readAsDataURL(file);
        }
    };

    // Submit Work Entry & Broadcast Notification
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!projectName || !itemName || !amount || !effectiveCity) {
            toast.error("Please select/enter Project Name, City Location, Work Description, and Amount");
            return;
        }

        setIsSubmitting(true);
        setSuccessResult(null);
        toast.loading("Submitting Work Entry & Updating Live Map...", { id: "contractor-submit" });

        try {
            const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
            const { data } = await axios.post(`${backendUrl}/api/v2/fraud/agent-spending`, {
                projectId: selectedProjectId || undefined,
                customProjectName: projectName,
                customCity: effectiveCity.trim(),
                contractorName: contractorAccount.name,
                category,
                itemName: `[Invoice: ${invoiceNo}] ${itemName}`,
                amount,
                invoicePhoto: photo || ""
            });

            if (data.success) {
                setSuccessResult(data);

                // Dispatch broadcast notification for citizens
                const newNotif = {
                    id: Date.now(),
                    title: `🔔 NEW WORK ENTRY IN ${effectiveCity.toUpperCase()}`,
                    message: `Contractor '${contractorAccount.name}' posted ₹${Number(amount).toLocaleString('en-IN')} work entry for "${projectName}". Verify on live map!`,
                    date: new Date()
                };
                const existingNotifs = JSON.parse(localStorage.getItem("citizenNotifications") || "[]");
                localStorage.setItem("citizenNotifications", JSON.stringify([newNotif, ...existingNotifs]));

                toast.success(`🟢 Work Entry Logged for ${effectiveCity}! Live GPS Map Updated!`, { id: "contractor-submit" });
                
                setItemName('');
                setAmount('');
                setPhoto('');
                setInvoiceNo(`INV-2026-${Math.floor(1000 + Math.random() * 9000)}`);
                fetchSanctionedProjects();
            }
        } catch (err) {
            console.error("Contractor submission error:", err);
            toast.error("Failed to log contractor work entry", { id: "contractor-submit" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem("contractorAuth");
        localStorage.removeItem("contractorAuth");
        toast.success("Logged out from Contractor Portal");
        navigate("/contractor-login");
    };

    const formatRupees = (amount) => {
        if (!amount && amount !== 0) return '₹0';
        if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
        if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} Lakh`;
        return `₹${amount.toLocaleString('en-IN')}`;
    };

    const activeSelectedProject = sanctionedProjects.find(p => p._id === selectedProjectId);
    const contractorProjects = sanctionedProjects.filter(p => p.contractorName?.includes(contractorAccount.name) || p.contractorName?.includes("Sharma"));
    const totalClaimedSum = (contractorProjects.length > 0 ? contractorProjects : sanctionedProjects).reduce((acc, p) => acc + (p.totalClaimedSpent || p.budgetSpent || 0), 0);
    const totalReleasedSum = (contractorProjects.length > 0 ? contractorProjects : sanctionedProjects).reduce((acc, p) => acc + (p.totalReleasedToAgent || 0), 0);

    return (
        <div className="min-h-screen bg-slate-50 font-inter text-slate-900 flex flex-col antialiased">
            
            {/* 👷 SAFETY ORANGE ACCENT STRIPE */}
            <div className="h-1.5 w-full bg-gradient-to-r from-amber-500 via-orange-600 to-emerald-600"></div>

            {/* 🏗️ CONTRACTOR ENTERPRISE HEADER */}
            <header className="bg-slate-900 text-white shadow-lg border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
                    
                    {/* Brand & Badge */}
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center text-slate-900 font-bold shadow-md shrink-0 border border-orange-400/40">
                            <HardHat size={26} className="text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-bold tracking-widest text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded uppercase border border-amber-500/30 flex items-center gap-1.5">
                                    <Award size={12} /> CLASS-1 REGISTERED INFRASTRUCTURE CONTRACTOR PORTAL
                                </span>
                            </div>
                            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
                                CONTRACTOR FIELD WORK & BILLING SYSTEM
                            </h1>
                        </div>
                    </div>

                    {/* Contractor Credentials & Logout */}
                    <div className="flex items-center gap-3">
                        <div className="bg-slate-800/90 border border-slate-700 rounded-lg px-4 py-2 text-right text-xs">
                            <span className="text-[9px] text-amber-400 font-bold block uppercase tracking-wider">CONTRACTOR AGENT</span>
                            <p className="text-white font-bold text-xs truncate max-w-xs">{contractorAccount?.name || 'Sharma Infratech Pvt Ltd'}</p>
                            <p className="text-[9px] text-slate-400 tracking-wider uppercase font-mono">LIC: {contractorAccount?.licenseNo || 'PWD-CLASS1-LIC-8892'}</p>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white border border-slate-700 p-2.5 rounded-lg transition-all shadow-sm"
                            title="Exit Contractor Portal"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>

                </div>
            </header>

            {/* 📊 METRICS KPI BAR */}
            <section className="bg-white border-b border-slate-200 py-6 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-5 shadow-sm border border-slate-800 flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Assigned Sanctioned Works</span>
                                <div className="p-2 bg-slate-800 rounded-lg border border-slate-700 text-orange-400">
                                    <Building size={18} />
                                </div>
                            </div>
                            <div className="mt-2">
                                <span className="text-3xl font-black text-white tracking-tight">{sanctionedProjects.length} WORKS</span>
                                <span className="text-[11px] font-medium text-slate-400 block mt-1">Government Approved</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Government Tranches Disbursed</span>
                                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
                                    <DollarSign size={18} />
                                </div>
                            </div>
                            <div className="mt-2">
                                <span className="text-2xl font-black text-emerald-700 tracking-tight">{formatRupees(totalReleasedSum)}</span>
                                <span className="text-[11px] font-medium text-emerald-600 block mt-1">Available Funds</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Billed & Claimed</span>
                                <div className="p-2 bg-amber-50 text-amber-700 rounded-lg border border-amber-200">
                                    <Receipt size={18} />
                                </div>
                            </div>
                            <div className="mt-2">
                                <span className="text-2xl font-black text-slate-900 tracking-tight">{formatRupees(totalClaimedSum)}</span>
                                <span className="text-[11px] font-medium text-slate-500 block mt-1">Logged Work Expenses</span>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Honesty Score Rating</span>
                                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
                                    <Award size={18} />
                                </div>
                            </div>
                            <div className="mt-2">
                                <span className="text-3xl font-black text-emerald-700 tracking-tight">100%</span>
                                <span className="text-[11px] font-bold text-emerald-600 block mt-1">Verified Site Work</span>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* MAIN CONTENT SPLIT LAYOUT */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-6">
                
                {/* ⚠️ CONTRACTOR AGENT STATUTORY SHOW-CAUSE NOTICE ALERT CARD */}
                {sanctionedProjects.some(p => p.isFundFrozen || p.financialGapPercent >= 30) && (
                    <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-6 space-y-4 shadow-sm">
                        <div className="flex items-center justify-between border-b border-rose-200 pb-3">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-rose-600 text-white rounded-xl shadow-xs">
                                    <AlertTriangle size={22} className="animate-bounce" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-rose-800 bg-rose-200/80 px-2 py-0.5 rounded border border-rose-300 inline-block mb-0.5">
                                        STATUTORY NOTICE RECEIVED FROM GOVT SANCTION AUTHORITY
                                    </span>
                                    <h4 className="font-extrabold text-base text-rose-950">
                                        Section 80 CPC Show-Cause Legal Notice & Tranche Freeze
                                    </h4>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-rose-600 text-white rounded font-extrabold text-xs uppercase tracking-wider shadow-xs">
                                TRANCHE DISBURSEMENT LOCKED
                            </span>
                        </div>

                        {sanctionedProjects.filter(p => p.isFundFrozen || p.financialGapPercent >= 30).map(p => (
                            <div key={p._id} className="bg-white rounded-xl border border-rose-200 p-4 space-y-2 text-xs">
                                <div className="flex items-center justify-between font-extrabold">
                                    <span className="text-slate-900 text-sm">{p.projectName} ({p.city})</span>
                                    <span className="text-rose-700 bg-rose-100 px-2.5 py-0.5 rounded border border-rose-300">
                                        FINANCIAL GAP: {p.financialGapPercent || 72}%
                                    </span>
                                </div>
                                <p className="text-slate-700 font-medium leading-relaxed">
                                    <strong>GLM-4 AI Citizen Ground-Truth Warning:</strong> Citizen site photos uploaded at GPS location verified only {p.citizenVerifiedWorkPercent}% of visible work versus your claimed expenses ({formatRupees(p.totalClaimedSpent)}). Future tranche releases have been suspended by the Government Executive Officer.
                                </p>
                                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between border-t border-slate-100 text-[11px] font-bold text-slate-500 gap-1">
                                    <span>Officer In-Charge: {p.officerName}</span>
                                    <span className="text-rose-700 uppercase font-black">Action Required: Submit Physical Rectification Proof</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    
                    {/* LEFT 7 COLS: WORK CLAIM SUBMISSION FORM */}
                    <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
                        
                        {/* Form Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                            <div>
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded border border-amber-200 inline-block mb-1">
                                    FIELD WORK & MEASUREMENT LOG
                                </span>
                                <h3 className="text-lg font-extrabold text-slate-900">Submit Work Claim & Field Invoice</h3>
                            </div>

                            <span className="font-mono text-xs font-extrabold bg-slate-900 text-white px-3 py-1.5 rounded-lg shadow-sm">
                                {invoiceNo}
                            </span>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5 text-xs font-bold text-slate-900">
                            
                            {/* SELECT GOVT SANCTIONED PROJECT DROPDOWN */}
                            <div>
                                <label className="block text-slate-900 font-extrabold uppercase mb-1.5">
                                    🏛️ Select Government Sanctioned Project * :
                                </label>
                                <select
                                    value={selectedProjectId}
                                    onChange={(e) => handleSelectProject(e.target.value)}
                                    className="w-full p-3.5 bg-white text-slate-900 font-bold border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                                >
                                    <option value="">-- Select Government Sanctioned Project --</option>
                                    {sanctionedProjects.map(p => (
                                        <option key={p._id} value={p._id}>
                                            {p.projectName} ({p.city}) — Govt Released: {formatRupees(p.totalReleasedToAgent)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Active Selected Project Card */}
                            {activeSelectedProject && (
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-3 gap-3 text-center text-xs">
                                    <div>
                                        <span className="text-[10px] text-slate-500 block font-bold uppercase">Budget</span>
                                        <span className="font-extrabold text-slate-900">{formatRupees(activeSelectedProject.budgetAllocated)}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-500 block font-bold uppercase">Govt Released</span>
                                        <span className="font-extrabold text-emerald-700">{formatRupees(activeSelectedProject.totalReleasedToAgent)}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-500 block font-bold uppercase">Claimed Spent</span>
                                        <span className="font-extrabold text-amber-600">{formatRupees(activeSelectedProject.totalClaimedSpent)}</span>
                                    </div>
                                </div>
                            )}

                            {/* Project Name & City Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="block text-slate-900 font-extrabold uppercase">
                                            Project Work Title * :
                                        </label>
                                        {isGovtSanctionedLocked && (
                                            <span className="text-[9px] font-extrabold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-300 flex items-center gap-1 uppercase">
                                                <Lock size={10} /> LOCKED
                                            </span>
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        value={projectName}
                                        onChange={(e) => setProjectName(e.target.value)}
                                        disabled={isGovtSanctionedLocked}
                                        placeholder="Select a project above..."
                                        className={`w-full p-3.5 font-bold border rounded-xl text-xs ${isGovtSanctionedLocked ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed' : 'bg-white text-slate-900 border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500'}`}
                                        required
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="block text-slate-900 font-extrabold uppercase">
                                            Execution City / Location * :
                                        </label>
                                        {isGovtSanctionedLocked && (
                                            <span className="text-[9px] font-extrabold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-300 flex items-center gap-1 uppercase">
                                                <Lock size={10} /> LOCKED
                                            </span>
                                        )}
                                    </div>
                                    <select
                                        value={selectedCityOption}
                                        onChange={(e) => setSelectedCityOption(e.target.value)}
                                        disabled={isGovtSanctionedLocked}
                                        className={`w-full p-3.5 font-bold border rounded-xl text-xs ${isGovtSanctionedLocked ? 'bg-slate-100 text-slate-500 border-slate-200 cursor-not-allowed' : 'bg-white text-slate-900 border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500'}`}
                                    >
                                        {INDIAN_CITIES.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Category & Amount Claimed Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-900 font-extrabold uppercase mb-1">
                                        Work Material Category:
                                    </label>
                                    <select
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                        className="w-full p-3.5 bg-white text-slate-900 font-bold border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    >
                                        <option value="Cement">Cement (Concreting & Pillars)</option>
                                        <option value="Steel">Steel Framework & Rebar</option>
                                        <option value="Labor">Labor & Workforce</option>
                                        <option value="Machinery & Equipment">Machinery & Heavy Excavation</option>
                                        <option value="Asphalt & Paving">Asphalt & Road Laying</option>
                                        <option value="Sanitary & Piping">Sanitary & Pipeline Materials</option>
                                        <option value="Other">Other Construction Expense</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-slate-900 font-extrabold uppercase mb-1">
                                        Invoice Spent Amount (₹ Rupees) * :
                                    </label>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="e.g. 4000000"
                                        className="w-full p-3.5 bg-white text-slate-900 font-bold border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        required
                                    />
                                    {amount && (
                                        <span className="text-[10px] text-emerald-700 font-bold block mt-1">
                                            Amount: {formatRupees(Number(amount))}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Work Item Details */}
                            <div>
                                <label className="block text-slate-900 font-extrabold uppercase mb-1">
                                    Item Description & Work Details * :
                                </label>
                                <input
                                    type="text"
                                    value={itemName}
                                    onChange={(e) => setItemName(e.target.value)}
                                    placeholder="e.g. Completed Concrete Foundation Piling & Sea Wall Work"
                                    className="w-full p-3.5 bg-white text-slate-900 font-bold border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    required
                                />
                            </div>

                            {/* 📷 ATTACH REAL SITE PROOF PHOTO AREA */}
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                                <label className="block text-slate-900 font-extrabold uppercase text-xs">
                                    📷 Attach Site Ground-Truth Work Photo Proof:
                                </label>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    
                                    {/* Device File Picker Button */}
                                    <div className="border border-dashed border-slate-300 rounded-xl p-4 text-center bg-white flex flex-col items-center justify-center space-y-2">
                                        <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center">
                                            <Camera size={18} />
                                        </div>
                                        <span className="text-[11px] font-bold text-slate-700 uppercase block">
                                            Camera / File Upload
                                        </span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                            className="hidden"
                                            id="contractor-clean-file-input"
                                        />
                                        <label htmlFor="contractor-clean-file-input" className="cursor-pointer px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold uppercase transition-colors shadow-sm">
                                            Browse File →
                                        </label>
                                    </div>

                                    {/* Paste Image URL */}
                                    <div className="border border-slate-300 rounded-xl p-4 bg-white flex flex-col justify-center space-y-1.5">
                                        <span className="text-[10px] font-bold text-slate-600 uppercase flex items-center gap-1">
                                            <Image size={12} className="text-amber-600" /> Or Paste Direct Photo URL:
                                        </span>
                                        <input
                                            type="text"
                                            value={photo}
                                            onChange={(e) => setPhoto(e.target.value)}
                                            placeholder="Paste photo URL..."
                                            className="w-full p-2.5 bg-white text-slate-900 font-bold border border-slate-300 rounded-lg text-xs focus:outline-none"
                                        />
                                    </div>

                                </div>

                                {photo && (
                                    <div className="border border-slate-300 rounded-xl p-2 bg-white space-y-1">
                                        <span className="text-[10px] font-bold text-emerald-700 block uppercase">Attached Work Photo Preview:</span>
                                        <img src={photo} alt="Site Work Proof" className="w-full h-44 object-cover rounded-lg border border-slate-200" />
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full p-4 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-extrabold text-xs uppercase tracking-wider transition-all rounded-xl shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Upload size={18} />}
                                <span>{isSubmitting ? "SUBMITTING WORK ENTRY..." : "SUBMIT WORK CLAIM & UPDATE LIVE MAP →"}</span>
                            </button>
                        </form>

                        {/* Result Success Box */}
                        {successResult && (
                            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-300 text-emerald-900 space-y-1 font-bold text-xs">
                                <div className="flex items-center gap-2 text-emerald-700 font-extrabold">
                                    <CheckCircle2 size={18} />
                                    <span>🟢 WORK CLAIM SUBMITTED SUCCESSFULLY FOR {effectiveCity.toUpperCase()}</span>
                                </div>
                                <p className="text-emerald-800">
                                    Project: {successResult.project.projectName} | Total Claimed: {formatRupees(successResult.project.totalClaimedSpent)}
                                </p>
                            </div>
                        )}

                    </div>

                    {/* RIGHT 5 COLS: ACTIVE ASSIGNED PROJECTS & INSTRUCTION GUIDE */}
                    <div className="lg:col-span-5 space-y-6">
                        
                        {/* Active Projects Register Card */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                <div>
                                    <h4 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                                        <Building size={18} className="text-amber-600" />
                                        Assigned Govt Infrastructure Works ({sanctionedProjects.length})
                                    </h4>
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">Select any project to populate billing form</p>
                                </div>
                            </div>

                            {sanctionedProjects.length === 0 ? (
                                <div className="p-6 text-center text-slate-500 font-bold text-xs uppercase bg-slate-50 rounded-xl border border-slate-200">
                                    No assigned projects found in database.
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                                    {sanctionedProjects.map((proj) => (
                                        <div
                                            key={proj._id}
                                            onClick={() => handleSelectProject(proj._id)}
                                            className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                                                selectedProjectId === proj._id 
                                                    ? 'bg-amber-50/80 border-amber-400 shadow-sm' 
                                                    : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className={`px-2.5 py-0.5 rounded text-[9px] font-extrabold uppercase ${proj.isFundFrozen ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                                                    {proj.status.replace('_', ' ')}
                                                </span>
                                                {selectedProjectId === proj._id && (
                                                    <span className="text-[10px] font-bold text-amber-700 bg-amber-200/60 px-2 py-0.5 rounded flex items-center gap-1">
                                                        <Check size={12} /> ACTIVE SELECTED
                                                    </span>
                                                )}
                                            </div>

                                            <h5 className="font-bold text-sm text-slate-900 leading-snug">{proj.projectName}</h5>
                                            
                                            <div className="flex items-center justify-between text-xs text-slate-600 font-medium">
                                                <span>City: <strong className="text-slate-900">{proj.city}</strong></span>
                                                <span>Released: <strong className="text-emerald-700">{formatRupees(proj.totalReleasedToAgent)}</strong></span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Guidelines Card */}
                        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm space-y-3">
                            <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
                                <ShieldCheck size={18} />
                                <span>ANTI-TAMPER BILLING GUIDELINES</span>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed font-medium">
                                All work claims and attached photo proofs are verified by the GLM-4 Forensic AI Auditor against citizen ground-truth geotagged site photos. Ensure photo proofs clearly show progress to prevent automatic fund freezes.
                            </p>
                        </div>

                    </div>

                </div>
            </main>

            {/* FOOTER */}
            <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-4 text-center text-xs font-bold">
                <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <span className="text-amber-400 font-bold text-[10px] uppercase tracking-wider">
                        PWD CONTRACTOR FIELD WORK PORTAL
                    </span>
                    <span className="text-slate-400 text-[11px]">NATIONAL INFRASTRUCTURE PUBLIC MONEY TRAIL</span>
                </div>
            </footer>

        </div>
    );
};

export default ContractorPortal;
