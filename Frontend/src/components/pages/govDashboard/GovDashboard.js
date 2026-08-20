import React, { useState, useEffect } from 'react';
import { getAllProjects } from '../../../services/projects/projectService';
import { getAllReports } from '../../../services/reports/reportService';
import { AlertTriangle, CheckCircle, Building, LogOut, PlusCircle, DollarSign, MapPin, Landmark, FileText, CheckCheck, RefreshCcw, Award, Stamp, Plus, Users, HardHat, ShieldCheck, UserPlus, Search, UserCheck, Camera } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../../context/LanguageContext';
import axios from 'axios';
import LegalCourtroomModal from '../reports/LegalCourtroomModal';
import { generatePilDraftData } from '../../../services/legalNlpFallback';

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
    "Thiruvananthapuram"
];

const REGISTERED_CONTRACTORS = [
    { name: "Sharma Infratech Pvt Ltd", licenseNo: "PWD-CLASS1-LIC-8892" },
    { name: "L&T Heavy Civil Infrastructure", licenseNo: "CPWD-CLASS1-LIC-0412" },
    { name: "NCC Urban Infrastructure Ltd", licenseNo: "PWD-CLASS1-LIC-3910" },
    { name: "KNR Constructions Ltd", licenseNo: "PWD-CLASS2-LIC-5521" },
    { name: "Afcons Infrastructure Ltd", licenseNo: "CPWD-CLASS1-LIC-9901" }
];

const INITIAL_WORKERS = [
    { id: "1", name: "Ramesh Kumar", eshramId: "ESHRAM-2026-9812", trade: "Masonry & Civil Concrete", assignedProject: "Bengaluru ORR Service Road Asphalt", dailyWage: 850, verified: true, dateAdded: "2026-08-15" },
    { id: "2", name: "Suresh Gowda", eshramId: "ESHRAM-2026-4431", trade: "Steel Framework & Rebar", assignedProject: "Bengaluru ORR Service Road Asphalt", dailyWage: 900, verified: true, dateAdded: "2026-08-16" },
    { id: "3", name: "Anand Verma", eshramId: "ESHRAM-2026-1109", trade: "Heavy Machinery Operator", assignedProject: "Puducherry Promenade Sea Wall", dailyWage: 1200, verified: true, dateAdded: "2026-08-18" },
    { id: "4", name: "Murugan Swamy", eshramId: "ESHRAM-2026-7723", trade: "Piping & Drainage Specialist", assignedProject: "Puducherry Promenade Sea Wall", dailyWage: 800, verified: true, dateAdded: "2026-08-19" }
];

const GovDashboard = () => {
    const [activeSection, setActiveSection] = useState('ALL_PROJECTS');
    const [projects, setProjects] = useState([]);
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const { translateText } = useLanguage();
    const navigate = useNavigate();

    // Registered Field Workers State (Managed by Govt Hand)
    const [workers, setWorkers] = useState(INITIAL_WORKERS);
    const [showAddWorkerModal, setShowAddWorkerModal] = useState(false);
    const [workerName, setWorkerName] = useState('');
    const [workerTrade, setWorkerTrade] = useState('Masonry & Civil Concrete');
    const [workerEshramId, setWorkerEshramId] = useState(`ESHRAM-2026-${Math.floor(1000 + Math.random() * 9000)}`);
    const [workerWage, setWorkerWage] = useState('850');
    const [workerAssignedProj, setWorkerAssignedProj] = useState('Bengaluru ORR Service Road Asphalt');

    // Government Administrative Sanction Order Form State
    const [showSanctionModal, setShowSanctionModal] = useState(false);
    const [asOrderNo, setAsOrderNo] = useState(`AS/PWD/2026/${Math.floor(1000 + Math.random() * 9000)}`);
    const [tenderNo, setTenderNo] = useState(`NIT-PWD-2026-${Math.floor(100 + Math.random() * 900)}`);
    const [newProjectName, setNewProjectName] = useState('');
    const [newCity, setNewCity] = useState('Bengaluru');
    const [newDepartment, setNewDepartment] = useState('Public Works Department (PWD)');
    const [totalSanctionedBudget, setTotalSanctionedBudget] = useState('50000000');
    const [initialReleaseAmount, setInitialReleaseAmount] = useState('10000000');
    const [selectedContractorObj, setSelectedContractorObj] = useState(REGISTERED_CONTRACTORS[0]);
    const [isSanctioning, setIsSanctioning] = useState(false);

    // Tranche Release State
    const [selectedProjectForTranche, setSelectedProjectForTranche] = useState(null);
    const [trancheReleaseAmount, setTrancheReleaseAmount] = useState('');
    const [trancheNote, setTrancheNote] = useState('');
    const [isReleasingTranche, setIsReleasingTranche] = useState(false);

    // Legal Courtroom Dossier Modal State
    const [selectedPilData, setSelectedPilData] = useState(null);
    const [isPilModalOpen, setIsPilModalOpen] = useState(false);

    const handleInspectDossier = (proj) => {
        const pilData = generatePilDraftData({
            _id: proj._id,
            title: proj.projectName,
            category: "Substandard Public Construction & Financial Misuse",
            cityName: proj.city || "Bengaluru",
            description: `Statutory Section 80 Action initiated. Contractor ${proj.contractorName} claimed ${formatRupees(proj.totalClaimedSpent)}, but citizen ground-truth site photos verified only ${proj.citizenVerifiedWorkPercent}% of visible work on site. Financial gap of ${proj.financialGapPercent}% detected.`
        });
        setSelectedPilData(pilData);
        setIsPilModalOpen(true);
    };

    const officerAuthRaw = sessionStorage.getItem("officerAuth");
    const officerAccount = officerAuthRaw ? JSON.parse(officerAuthRaw) : null;

    const loadData = async () => {
        try {
            setLoading(true);
            const [projRes, repRes] = await Promise.all([
                getAllProjects(),
                getAllReports()
            ]);
            setProjects(projRes.projects || []);
            setReports(repRes || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Enforce 2FA Speakeasy TOTP Authentication Guard
        if (!officerAccount || !officerAccount.totpVerified) {
            toast.error("🔒 Security Authentication Required: Please complete 2FA Speakeasy TOTP Login", { id: "officer-auth" });
            navigate("/officer-login");
        } else {
            loadData();
        }
    }, [navigate]);

    // Generate new AS order number when modal opens
    const handleOpenSanctionModal = () => {
        setAsOrderNo(`AS/PWD/2026/${Math.floor(1000 + Math.random() * 9000)}`);
        setTenderNo(`NIT-PWD-2026-${Math.floor(100 + Math.random() * 900)}`);
        setShowSanctionModal(true);
    };

    // Register New Field Worker (Govt Authority)
    const handleRegisterWorker = (e) => {
        e.preventDefault();
        if (!workerName || !workerEshramId || !workerWage) {
            toast.error("Please fill in Worker Name, e-SHRAM ID, and Daily Wage Rate");
            return;
        }

        const newWorker = {
            id: Date.now().toString(),
            name: workerName.trim(),
            eshramId: workerEshramId,
            trade: workerTrade,
            assignedProject: workerAssignedProj,
            dailyWage: Number(workerWage),
            verified: true,
            dateAdded: new Date().toISOString().split('T')[0]
        };

        setWorkers(prev => [newWorker, ...prev]);
        toast.success(`👷 WORKER REGISTERED! ${workerName} added to Official PWD Gazette Register with ID ${workerEshramId}!`);
        setShowAddWorkerModal(false);
        setWorkerName('');
        setWorkerEshramId(`ESHRAM-2026-${Math.floor(1000 + Math.random() * 9000)}`);
    };

    // Submit Administrative Sanction Order (A.S. Order)
    const handleSanctionProject = async (e) => {
        e.preventDefault();

        if (!newProjectName || !totalSanctionedBudget || !initialReleaseAmount) {
            toast.error("Please fill in Project Work Title, Administrative Sanctioned Budget, and Initial Tranche 1 Release");
            return;
        }

        setIsSanctioning(true);
        toast.loading("Issuing Official Administrative Sanction (A.S.) Order & Releasing Tranche 1...", { id: "sanction" });

        try {
            const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
            const { data } = await axios.post(`${backendUrl}/api/v2/fraud/sanction-project`, {
                projectName: `${newProjectName.trim()} [AS: ${asOrderNo}]`,
                department: newDepartment,
                city: newCity,
                totalSanctionedBudget,
                initialReleaseAmount,
                contractorName: `${selectedContractorObj.name} (${selectedContractorObj.licenseNo})`,
                officerName: officerAccount.name
            });

            if (data.success) {
                toast.success(`📜 A.S. ORDER ISSUED! Project Sanctioned & Tranche 1 (₹${Number(initialReleaseAmount).toLocaleString('en-IN')}) Released!`, { id: "sanction" });
                setShowSanctionModal(false);
                setNewProjectName('');
                loadData();
            }
        } catch (err) {
            console.error("Sanction Project error:", err);
            toast.error("Failed to issue Administrative Sanction order", { id: "sanction" });
        } finally {
            setIsSanctioning(false);
        }
    };

    // Release Additional Fund Tranche
    const handleReleaseTranche = async (e) => {
        e.preventDefault();
        if (!selectedProjectForTranche || !trancheReleaseAmount) {
            toast.error("Please enter tranche release amount");
            return;
        }

        setIsReleasingTranche(true);
        toast.loading("Issuing Fund Disbursement Tranche...", { id: "tranche" });

        try {
            const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
            const { data } = await axios.post(`${backendUrl}/api/v2/fraud/release-tranche`, {
                projectId: selectedProjectForTranche._id,
                releaseAmount: trancheReleaseAmount,
                officerName: officerAccount.name,
                note: trancheNote
            });

            if (data.success) {
                toast.success(`🟢 Fund Tranche Disbursed Officially!`, { id: "tranche" });
                setSelectedProjectForTranche(null);
                setTrancheReleaseAmount('');
                setTrancheNote('');
                loadData();
            }
        } catch (err) {
            console.error("Tranche Release error:", err);
            toast.error(err.response?.data?.message || "Failed to release tranche funds", { id: "tranche" });
        } finally {
            setIsReleasingTranche(false);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem("officerAuth");
        localStorage.removeItem("officerAuth");
        toast.success("Logged out from Government Executive Portal");
        navigate("/officer-login");
    };

    const formatRupees = (amount) => {
        if (!amount && amount !== 0) return '₹0';
        if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
        if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} Lakh`;
        return `₹${amount.toLocaleString('en-IN')}`;
    };

    const flaggedGapProjects = projects.filter(p => p.financialGapPercent >= 30 || p.isFundFrozen || p.milestones?.some(m => m.aiVerdict === 'MISMATCH'));
    const totalAllocatedSum = projects.reduce((acc, p) => acc + (p.budgetAllocated || 0), 0);
    const totalReleasedSum = projects.reduce((acc, p) => acc + (p.totalReleasedToAgent || 0), 0);

    return (
        <div className="min-h-screen bg-slate-50 font-inter text-slate-900 flex flex-col antialiased">
            
            {/* 🇮🇳 OFFICIAL GOVERNMENT TRICOLOR HEADER STRIPE */}
            <div className="h-1.5 w-full bg-gradient-to-r from-[#FF9933] via-white via-50% to-[#138808]"></div>

            {/* 🏛️ EXECUTIVE ENTERPRISE GOVERNMENT HEADER */}
            <header className="bg-slate-900 text-white shadow-lg border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
                    
                    {/* Official Emblem & Portal Title */}
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-slate-900 font-bold shadow-md shrink-0 border border-amber-300/40">
                            <Landmark size={26} className="text-white" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-bold tracking-widest text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded uppercase border border-amber-500/30 flex items-center gap-1.5">
                                    <Award size={12} /> GOVERNMENT OF INDIA • NATIONAL E-PROCUREMENT & SANCTION AUTHORITY
                                </span>
                            </div>
                            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
                                PUBLIC WORKS DEPARTMENT (PWD) EXECUTIVE PORTAL
                            </h1>
                        </div>
                    </div>

                    {/* Officer Details & Create Button Header Action */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowAddWorkerModal(true)}
                            className="bg-amber-600 hover:bg-amber-500 text-slate-950 px-4 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 border border-amber-400/30"
                        >
                            <UserPlus size={16} />
                            <span>+ ADD WORKER</span>
                        </button>

                        <button
                            onClick={handleOpenSanctionModal}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 border border-emerald-400/30"
                        >
                            <PlusCircle size={16} />
                            <span>+ SANCTION PROJECT</span>
                        </button>

                        <div className="bg-slate-800/90 border border-slate-700 rounded-lg px-3.5 py-2 text-right text-xs">
                            <span className="text-[9px] text-amber-400 font-bold block uppercase tracking-wider">SANCTIONING AUTHORITY</span>
                            <p className="text-white font-bold text-xs">{officerAccount?.name || 'Officer R. Patel'}</p>
                            <p className="text-[9px] text-slate-400 tracking-wider uppercase font-mono">{officerAccount?.badgeId || 'PWD-EXEC-772'}</p>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white border border-slate-700 p-2.5 rounded-lg transition-all shadow-sm"
                            title="Exit Government Portal"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>

                </div>
            </header>

            {/* 📊 KPI METRICS SECTION */}
            <section className="bg-white border-b border-slate-200 py-6 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Header bar with direct Quick Add Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-5 pb-3 border-b border-slate-100 gap-3">
                        <div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">EXECUTIVE OVERVIEW & GAZETTE AUDIT SUMMARY</span>
                            <h2 className="text-lg font-extrabold text-slate-900">National Infrastructure Sanctions, Workers & Funds</h2>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowAddWorkerModal(true)}
                                className="bg-amber-600 hover:bg-amber-700 text-slate-950 px-4 py-2.5 rounded-lg font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all"
                            >
                                <UserPlus size={16} />
                                <span>+ REGISTER FIELD WORKER</span>
                            </button>

                            <button
                                onClick={handleOpenSanctionModal}
                                className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white px-5 py-2.5 rounded-lg font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
                            >
                                <Plus size={18} />
                                <span>+ SANCTION NEW PUBLIC WORK</span>
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        
                        {/* KPI 1 */}
                        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-5 shadow-sm border border-slate-800 flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Sanctioned Projects</span>
                                <div className="p-2 bg-slate-800 rounded-lg border border-slate-700 text-amber-400">
                                    <Building size={18} />
                                </div>
                            </div>
                            <div className="mt-2">
                                <span className="text-3xl font-black text-white tracking-tight">{projects.length} WORKS</span>
                                <span className="text-[11px] font-medium text-slate-400 block mt-1">Gazette Approved</span>
                            </div>
                        </div>

                        {/* KPI 2: REGISTERED WORKERS */}
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">e-SHRAM / PWD Workers</span>
                                <div className="p-2 bg-amber-50 text-amber-700 rounded-lg border border-amber-200">
                                    <HardHat size={18} />
                                </div>
                            </div>
                            <div className="mt-2">
                                <span className="text-3xl font-black text-slate-900 tracking-tight">{workers.length} WORKERS</span>
                                <span className="text-[11px] font-medium text-slate-500 block mt-1">Verified Field Labor</span>
                            </div>
                        </div>

                        {/* KPI 3 */}
                        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Released Tranches</span>
                                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
                                    <CheckCircle size={18} />
                                </div>
                            </div>
                            <div className="mt-2">
                                <span className="text-2xl font-black text-emerald-700 tracking-tight">{formatRupees(totalReleasedSum)}</span>
                                <span className="text-[11px] font-medium text-emerald-600 block mt-1">Disbursed Funds</span>
                            </div>
                        </div>

                        {/* KPI 4 */}
                        <div className={`rounded-xl p-5 shadow-sm border flex flex-col justify-between ${flaggedGapProjects.length > 0 ? 'bg-rose-50 border-rose-200 text-rose-900' : 'bg-white border-slate-200 text-slate-900'}`}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">AI Audit Fraud Locks</span>
                                <div className={`p-2 rounded-lg ${flaggedGapProjects.length > 0 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>
                                    <AlertTriangle size={18} />
                                </div>
                            </div>
                            <div className="mt-2">
                                <span className="text-3xl font-black tracking-tight">{flaggedGapProjects.length}</span>
                                <span className="text-[11px] font-bold uppercase tracking-wider block mt-1 opacity-90">
                                    {flaggedGapProjects.length > 0 ? '⚠️ Statutory Section 80 Action' : 'All Works Verified'}
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* 🏛️ TAB TOOLBAR */}
            <div className="bg-slate-100 border-b border-slate-200 sticky top-0 z-20 shadow-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 py-3">
                    
                    {/* Navigation Tabs */}
                    <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                        <button
                            onClick={() => setActiveSection('ALL_PROJECTS')}
                            className={`px-4 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shrink-0 ${activeSection === 'ALL_PROJECTS' ? 'bg-slate-900 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'}`}
                        >
                            <Building size={15} />
                            <span>SANCTIONED WORKS ({projects.length})</span>
                        </button>

                        <button
                            onClick={() => setActiveSection('REGISTERED_WORKERS')}
                            className={`px-4 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shrink-0 ${activeSection === 'REGISTERED_WORKERS' ? 'bg-amber-600 text-slate-950 shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'}`}
                        >
                            <HardHat size={15} />
                            <span>REGISTERED WORKERS & LABOR ({workers.length})</span>
                        </button>

                        <button
                            onClick={() => setActiveSection('MISUSE_ALERTS')}
                            className={`px-4 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shrink-0 ${activeSection === 'MISUSE_ALERTS' ? 'bg-rose-700 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'}`}
                        >
                            <AlertTriangle size={15} />
                            <span>AI FRAUD LOCKS ({flaggedGapProjects.length})</span>
                        </button>

                        <button
                            onClick={() => setActiveSection('CITIZEN_REPORTS')}
                            className={`px-4 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shrink-0 ${activeSection === 'CITIZEN_REPORTS' ? 'bg-sky-800 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'}`}
                        >
                            <Camera size={15} />
                            <span>📸 CITIZEN GEOTAGGED PWD INBOX ({reports.length})</span>
                        </button>
                    </div>

                    {/* Primary Actions */}
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <button
                            onClick={() => setShowAddWorkerModal(true)}
                            className="bg-amber-600 hover:bg-amber-700 text-slate-950 px-4 py-2.5 rounded-lg font-extrabold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
                        >
                            <UserPlus size={15} />
                            <span>+ ADD WORKER</span>
                        </button>

                        <button
                            onClick={handleOpenSanctionModal}
                            className="bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-lg font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all"
                        >
                            <Plus size={16} />
                            <span>+ SANCTION PROJECT</span>
                        </button>
                    </div>

                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
                
                {/* SECTION 1: ALL SANCTIONED PROJECTS */}
                {activeSection === 'ALL_PROJECTS' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                            <div>
                                <h3 className="text-lg md:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                                    <Building className="text-emerald-700" size={22} />
                                    Officially Sanctioned Infrastructure Works Register ({projects.length})
                                </h3>
                                <p className="text-xs text-slate-500 font-medium mt-1">
                                    Official Gazette register of public infrastructure projects with Administrative Sanction (A.S.) Orders.
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleOpenSanctionModal}
                                    className="px-3.5 py-2 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:bg-emerald-100 transition-colors"
                                >
                                    <Plus size={14} />
                                    <span>ADD PROJECT</span>
                                </button>

                                <button
                                    onClick={loadData}
                                    className="px-3.5 py-2 bg-white text-slate-700 border border-slate-300 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:bg-slate-100 transition-colors"
                                >
                                    <RefreshCcw size={14} />
                                    <span>REFRESH</span>
                                </button>
                            </div>
                        </div>

                        {projects.length === 0 ? (
                            <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 p-12 text-center space-y-4 shadow-sm">
                                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-500">
                                    <Landmark size={32} />
                                </div>
                                <h4 className="font-extrabold text-xl text-slate-900">No Infrastructure Projects Sanctioned Yet</h4>
                                <p className="text-xs text-slate-500 font-medium max-w-md mx-auto">
                                    Click "+ Sanction New Project" below to formally sanction a public works project and release Tranche 1 funds.
                                </p>
                                <button
                                    onClick={handleOpenSanctionModal}
                                    className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-extrabold text-xs uppercase tracking-wider shadow-md transition-colors inline-flex items-center gap-2"
                                >
                                    <Plus size={16} />
                                    <span>CREATE FIRST PUBLIC WORK SANCTION →</span>
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                
                                {/* Quick Add Card inside Grid */}
                                <div 
                                    onClick={handleOpenSanctionModal}
                                    className="bg-emerald-50/60 border-2 border-dashed border-emerald-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-emerald-100/60 transition-all duration-200 group min-h-[340px]"
                                >
                                    <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform">
                                        <Plus size={28} />
                                    </div>
                                    <h4 className="font-extrabold text-base text-emerald-900">SANCTION NEW WORK PROJECT</h4>
                                    <p className="text-xs font-medium text-emerald-700 mt-1 max-w-xs">
                                        Issue official Administrative Sanction (A.S.) Order & release Tranche 1
                                    </p>
                                    <span className="mt-4 px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider group-hover:bg-emerald-800 transition-colors">
                                        + CREATE NOW
                                    </span>
                                </div>

                                {projects.map((proj) => (
                                    <div key={proj._id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md flex flex-col justify-between overflow-hidden transition-all duration-200">
                                        <div>
                                            
                                            {/* Card Header */}
                                            <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between">
                                                <span className={`px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider ${proj.isFundFrozen ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'}`}>
                                                    {proj.status.replace('_', ' ')}
                                                </span>
                                                <span className="text-xs font-extrabold tracking-wider">
                                                    GAP: <strong className={proj.financialGapPercent >= 30 ? 'text-rose-400' : 'text-emerald-400'}>{proj.financialGapPercent || 0}%</strong>
                                                </span>
                                            </div>

                                            {/* Card Body */}
                                            <div className="p-5 space-y-4">
                                                <div>
                                                    <h4 className="font-extrabold text-base text-slate-900 leading-snug">{proj.projectName}</h4>
                                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1 mt-1.5">
                                                        <MapPin size={13} className="text-amber-600" /> {proj.city}, {proj.state} • {proj.department}
                                                    </p>
                                                </div>

                                                {/* Contractor & Officer */}
                                                <div className="bg-slate-50 rounded-xl border border-slate-200 p-3 text-[11px] text-slate-700 space-y-1">
                                                    <p><span className="font-bold text-slate-500 uppercase">Contractor:</span> <strong className="text-slate-900">{proj.contractorName}</strong></p>
                                                    <p><span className="font-bold text-slate-500 uppercase">Officer:</span> <strong className="text-slate-900">{proj.officerName}</strong></p>
                                                </div>

                                                {/* Financials Breakdown */}
                                                <div className="space-y-2 pt-1 text-xs border-t border-slate-100 font-medium">
                                                    <div className="flex justify-between">
                                                        <span className="text-slate-500">Sanctioned Budget:</span>
                                                        <span className="font-bold text-slate-900">{formatRupees(proj.budgetAllocated)}</span>
                                                    </div>

                                                    <div className="flex justify-between">
                                                        <span className="text-slate-500">Released Tranches:</span>
                                                        <span className="font-bold text-emerald-700">{formatRupees(proj.totalReleasedToAgent)}</span>
                                                    </div>

                                                    <div className="flex justify-between">
                                                        <span className="text-slate-500">Agent Spent:</span>
                                                        <span className="font-bold text-slate-900">{formatRupees(proj.totalClaimedSpent || proj.budgetSpent)}</span>
                                                    </div>

                                                    <div className="flex justify-between">
                                                        <span className="text-slate-500">Verified Work:</span>
                                                        <span className="font-bold text-emerald-700">{proj.citizenVerifiedWorkPercent || 100}%</span>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>

                                        {/* Card Action */}
                                        <div className="p-4 bg-slate-50 border-t border-slate-200">
                                            <button
                                                onClick={() => setSelectedProjectForTranche(proj)}
                                                className="w-full bg-slate-900 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-sm"
                                            >
                                                <DollarSign size={15} />
                                                <span>RELEASE DISBURSEMENT TRANCHE</span>
                                            </button>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* SECTION 2: REGISTERED FIELD WORKERS & LABOR (GOVT MANAGED) */}
                {activeSection === 'REGISTERED_WORKERS' && (
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-4 gap-3">
                            <div>
                                <h3 className="text-lg md:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                                    <HardHat className="text-amber-600" size={22} />
                                    Registered Construction Workers & Field Labor Register ({workers.length})
                                </h3>
                                <p className="text-xs text-slate-500 font-medium mt-1">
                                    Official e-SHRAM & PWD Gazette register of construction labor, masons, welders, and equipment operators.
                                </p>
                            </div>

                            <button
                                onClick={() => setShowAddWorkerModal(true)}
                                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-slate-950 font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all flex items-center gap-2"
                            >
                                <UserPlus size={16} />
                                <span>+ REGISTER NEW FIELD WORKER</span>
                            </button>
                        </div>

                        {/* Workers Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            
                            {/* Add Worker Card */}
                            <div 
                                onClick={() => setShowAddWorkerModal(true)}
                                className="bg-amber-50/60 border-2 border-dashed border-amber-300 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-amber-100/60 transition-all duration-200 group min-h-[220px]"
                            >
                                <div className="w-14 h-14 rounded-full bg-amber-600 text-slate-950 flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform">
                                    <UserPlus size={26} />
                                </div>
                                <h4 className="font-extrabold text-base text-amber-950">REGISTER NEW FIELD WORKER</h4>
                                <p className="text-xs font-medium text-amber-800 mt-1 max-w-xs">
                                    Add verified e-SHRAM / PWD construction worker to official gazette
                                </p>
                            </div>

                            {workers.map(w => (
                                <div key={w.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4">
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded border border-emerald-200 flex items-center gap-1">
                                                <UserCheck size={12} /> PWD & e-SHRAM VERIFIED
                                            </span>
                                            <span className="font-mono text-xs font-bold text-slate-500">{w.eshramId}</span>
                                        </div>

                                        <h4 className="font-extrabold text-lg text-slate-900">{w.name}</h4>
                                        <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mt-0.5">{w.trade}</p>

                                        <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                                            <div className="flex justify-between">
                                                <span>Assigned Work:</span>
                                                <span className="font-bold text-slate-900 truncate max-w-[180px]">{w.assignedProject}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Daily Wage Rate:</span>
                                                <span className="font-extrabold text-emerald-700">₹{w.dailyWage} / Day</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Registered On:</span>
                                                <span className="font-mono text-slate-500">{w.dateAdded}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* SECTION 3: AI FRAUD LOCKS */}
                {activeSection === 'MISUSE_ALERTS' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                            <div>
                                <h3 className="text-lg md:text-xl font-extrabold text-rose-700 flex items-center gap-2">
                                    <AlertTriangle size={22} />
                                    Statutory Section 80 AI Fraud Locks ({flaggedGapProjects.length})
                                </h3>
                                <p className="text-xs text-slate-500 font-medium mt-1">
                                    Projects automatically locked by GLM-4 AI where claimed expenses exceed ground-truth site work.
                                </p>
                            </div>
                        </div>

                        {flaggedGapProjects.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 shadow-sm">
                                <CheckCheck size={56} className="mx-auto text-emerald-600" />
                                <h4 className="font-extrabold text-xl text-slate-900">Zero Financial Gap Alerts</h4>
                                <p className="text-xs text-slate-500 font-medium max-w-md mx-auto">
                                    All sanctioned infrastructure works are operating with 0% financial gap and verified site photos.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-5">
                                {flaggedGapProjects.map(proj => (
                                    <div key={proj._id} className="bg-white rounded-2xl border border-rose-200 p-6 shadow-sm space-y-5">
                                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                                            <div>
                                                <span className="bg-rose-100 text-rose-800 font-extrabold text-[10px] uppercase tracking-wider px-3 py-1 rounded border border-rose-200 inline-block mb-2">
                                                    STATUTORY FUND FREEZE (GAP: {proj.financialGapPercent}%)
                                                </span>
                                                <h4 className="text-xl font-extrabold text-slate-900">{proj.projectName}</h4>
                                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">{proj.city}, {proj.state} • {proj.department}</p>
                                            </div>

                                            <div className="text-right font-bold text-xs uppercase space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-200">
                                                <p className="text-slate-600">Govt Released: {formatRupees(proj.totalReleasedToAgent)}</p>
                                                <p className="text-rose-700 font-black text-sm">Agent Claimed: {formatRupees(proj.totalClaimedSpent)}</p>
                                            </div>
                                        </div>

                                        <div className="bg-rose-50/70 rounded-xl border border-rose-200 p-4 text-slate-900 space-y-2 text-xs font-medium">
                                            <div className="flex items-center gap-2 text-rose-700 font-extrabold">
                                                <AlertTriangle size={16} />
                                                <span>STATUTORY LEGAL SHOW-CAUSE NOTICE ISSUED</span>
                                            </div>
                                            <p className="text-slate-700 leading-relaxed">
                                                Contractor '{proj.contractorName}' claimed {formatRupees(proj.totalClaimedSpent)}, but citizen ground-truth site photos verified only {proj.citizenVerifiedWorkPercent}% of visible work on site. Future fund tranches locked automatically.
                                            </p>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3 pt-1">
                                            <button
                                                onClick={() => handleInspectDossier(proj)}
                                                className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-3 px-6 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                                            >
                                                <FileText size={15} />
                                                <span>INSPECT COURTROOM DOSSIER</span>
                                            </button>

                                            <button
                                                onClick={() => setSelectedProjectForTranche(proj)}
                                                className="flex-1 bg-white hover:bg-slate-100 text-slate-800 py-3 px-6 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-300 shadow-sm transition-colors"
                                            >
                                                <DollarSign size={15} />
                                                <span>REVIEW TRANCHE DISBURSEMENT</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* SECTION 4: CITIZEN GEOTAGGED PWD FIELD REPORTS INBOX */}
                {activeSection === 'CITIZEN_REPORTS' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                            <div>
                                <h3 className="text-lg md:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                                    <Camera size={22} className="text-sky-700" />
                                    Citizens Geotagged Field Reports & PWD Inspection Inbox ({reports.length})
                                </h3>
                                <p className="text-xs text-slate-500 font-medium mt-1">
                                    Live field site photos and geotagged issues submitted by citizens across Indian infrastructure sites.
                                </p>
                            </div>
                        </div>

                        {reports.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 shadow-sm">
                                <CheckCheck size={56} className="mx-auto text-emerald-600" />
                                <h4 className="font-extrabold text-xl text-slate-900">Zero Pending Citizen Field Reports</h4>
                                <p className="text-xs text-slate-500 font-medium max-w-md mx-auto">
                                    All citizen geotagged reports have been reviewed and audited by PWD officers.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {reports.map(rep => (
                                    <div key={rep._id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 flex flex-col justify-between">
                                        <div className="space-y-3">
                                            
                                            <div className="flex items-center justify-between">
                                                <span className="text-[10px] font-extrabold uppercase bg-sky-100 text-sky-800 px-2.5 py-1 rounded border border-sky-200">
                                                    {rep.category || "Substandard Public Construction"}
                                                </span>
                                                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                                                    <MapPin size={12} className="text-amber-600" /> {rep.cityName || "Bengaluru"}
                                                </span>
                                            </div>

                                            <h4 className="font-extrabold text-base text-slate-900 leading-snug">{rep.title}</h4>

                                            {/* Citizen Geotagged Site Photo */}
                                            {rep.imageUrl && (rep.imageUrl.startsWith('data:image') || rep.imageUrl.startsWith('http://') || rep.imageUrl.startsWith('https://')) ? (
                                                <div className="relative group">
                                                    <img src={rep.imageUrl} alt="Citizen Ground Truth Photo" className="w-full h-48 object-cover rounded-xl border border-slate-300" />
                                                    <span className="absolute bottom-2 left-2 bg-slate-900/90 text-white font-mono text-[9px] px-2 py-0.5 rounded border border-slate-700">
                                                        GPS: {rep.latitude ? rep.latitude.toFixed(4) : "12.9716"}, {rep.longitude ? rep.longitude.toFixed(4) : "77.5946"}
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center text-slate-500 font-bold text-xs uppercase">
                                                    No Site Photo Attached
                                                </div>
                                            )}

                                            <p className="text-xs text-slate-600 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-200">
                                                "{rep.description}"
                                            </p>

                                            <div className="flex items-center justify-between text-xs text-slate-500 font-bold border-t border-slate-100 pt-2">
                                                <span>Submitted On: {new Date(rep.createdAt || Date.now()).toLocaleDateString()}</span>
                                                <span className="text-emerald-700">👍 {rep.upvotesCount || 1} Citizen Votes</span>
                                            </div>

                                        </div>

                                        {/* PWD Executive Officer Actions */}
                                        <div className="pt-2 flex flex-col sm:flex-row gap-2">
                                            <button
                                                onClick={() => toast.success(`✅ RECTIFICATION NOTICE SENT: Contractor served for '${rep.title}'`)}
                                                className="flex-1 bg-slate-900 hover:bg-emerald-700 text-white py-2.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                                            >
                                                <CheckCircle size={14} />
                                                <span>ISSUE RECTIFICATION ORDER</span>
                                            </button>

                                            <button
                                                onClick={() => handleInspectDossier({
                                                    _id: rep._id,
                                                    projectName: rep.title,
                                                    city: rep.cityName || "Bengaluru",
                                                    contractorName: "Sharma Infratech Pvt Ltd",
                                                    totalClaimedSpent: 50000000,
                                                    citizenVerifiedWorkPercent: 15,
                                                    financialGapPercent: 72
                                                })}
                                                className="bg-amber-600 hover:bg-amber-700 text-slate-950 py-2.5 px-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                                            >
                                                <FileText size={14} />
                                                <span>PIL DOSSIER</span>
                                            </button>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

            </main>

            {/* 👷 REGISTER NEW FIELD WORKER MODAL (GOVT HAND) */}
            {showAddWorkerModal && (
                <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl border border-slate-300 max-w-lg w-full p-6 space-y-5 shadow-2xl font-inter text-xs font-bold text-slate-900">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                            <div className="flex items-center gap-2">
                                <HardHat className="text-amber-600" size={20} />
                                <h3 className="font-extrabold text-base uppercase text-slate-900">
                                    REGISTER NEW FIELD WORKER (e-SHRAM & PWD)
                                </h3>
                            </div>
                            <button
                                onClick={() => setShowAddWorkerModal(false)}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleRegisterWorker} className="space-y-4">
                            <div>
                                <label className="block text-slate-700 uppercase mb-1">Worker Full Name * :</label>
                                <input
                                    type="text"
                                    value={workerName}
                                    onChange={(e) => setWorkerName(e.target.value)}
                                    placeholder="e.g. Rajesh Sharma"
                                    className="w-full p-3 bg-white text-slate-900 font-bold border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-slate-700 uppercase mb-1">e-SHRAM / Aadhaar ID * :</label>
                                    <input
                                        type="text"
                                        value={workerEshramId}
                                        onChange={(e) => setWorkerEshramId(e.target.value)}
                                        placeholder="ESHRAM-2026-9812"
                                        className="w-full p-3 bg-white text-slate-900 font-mono font-bold border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-slate-700 uppercase mb-1">Daily Wage Rate (₹) * :</label>
                                    <input
                                        type="number"
                                        value={workerWage}
                                        onChange={(e) => setWorkerWage(e.target.value)}
                                        placeholder="850"
                                        className="w-full p-3 bg-white text-emerald-700 font-bold border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-700 uppercase mb-1">Trade / Skill Category * :</label>
                                <select
                                    value={workerTrade}
                                    onChange={(e) => setWorkerTrade(e.target.value)}
                                    className="w-full p-3 bg-white text-slate-900 font-bold border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                                >
                                    <option value="Masonry & Civil Concrete">Masonry & Civil Concrete</option>
                                    <option value="Steel Framework & Rebar">Steel Framework & Rebar</option>
                                    <option value="Heavy Machinery Operator">Heavy Machinery Operator</option>
                                    <option value="Piping & Drainage Specialist">Piping & Drainage Specialist</option>
                                    <option value="Asphalt Road Laying Specialist">Asphalt Road Laying Specialist</option>
                                    <option value="General Civil Construction Labor">General Civil Construction Labor</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-slate-700 uppercase mb-1">Assigned Public Infrastructure Work * :</label>
                                <select
                                    value={workerAssignedProj}
                                    onChange={(e) => setWorkerAssignedProj(e.target.value)}
                                    className="w-full p-3 bg-white text-slate-900 font-bold border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                                >
                                    {projects.map(p => (
                                        <option key={p._id} value={p.projectName}>{p.projectName} ({p.city})</option>
                                    ))}
                                    {projects.length === 0 && (
                                        <option value="Bengaluru ORR Service Road Asphalt">Bengaluru ORR Service Road Asphalt</option>
                                    )}
                                </select>
                            </div>

                            <button
                                type="submit"
                                className="w-full p-4 bg-amber-600 hover:bg-amber-700 text-slate-950 font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
                            >
                                <UserCheck size={16} />
                                <span>REGISTER WORKER IN GAZETTE →</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* 📜 AUTHENTIC GOVERNMENT ADMINISTRATIVE SANCTION (A.S.) ORDER MEMORANDUM MODAL */}
            {showSanctionModal && (
                <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl border border-slate-300 max-w-2xl w-full shadow-2xl max-h-[92vh] overflow-y-auto font-inter">
                        
                        {/* Header */}
                        <div className="bg-slate-900 text-white p-6 rounded-t-2xl border-b border-slate-800 flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-11 h-11 rounded-xl bg-amber-500 text-slate-900 flex items-center justify-center font-bold shrink-0">
                                    <Landmark size={22} className="text-slate-900" />
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold tracking-widest text-amber-300 bg-amber-950 px-2 py-0.5 rounded uppercase border border-amber-500/30">
                                        FORM GOVT-AS-2026 • ARTICLE 282 GAZETTE SANCTION
                                    </span>
                                    <h3 className="text-lg font-extrabold text-white mt-1">
                                        ADMINISTRATIVE SANCTION (A.S.) ORDER MEMORANDUM
                                    </h3>
                                    <p className="text-[11px] text-slate-400 font-medium">
                                        Issued by Public Works Department (PWD) Chief Engineer Authority
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => setShowSanctionModal(false)}
                                className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-700 hover:text-white transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Order Metadata Strip */}
                        <div className="bg-slate-50 border-b border-slate-200 px-6 py-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-bold text-slate-700">
                            <div>
                                <span className="text-slate-400 block text-[10px] uppercase">A.S. ORDER REF NO:</span>
                                <span className="font-mono text-amber-600">{asOrderNo}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 block text-[10px] uppercase">E-TENDER CONTRACT NO:</span>
                                <span className="font-mono text-slate-900">{tenderNo}</span>
                            </div>
                            <div>
                                <span className="text-slate-400 block text-[10px] uppercase">SANCTION DATE:</span>
                                <span>{new Date().toLocaleDateString('en-IN')}</span>
                            </div>
                        </div>

                        <form onSubmit={handleSanctionProject} className="p-6 space-y-5 text-xs font-bold text-slate-900">
                            
                            {/* Project Work Title */}
                            <div>
                                <label className="block font-extrabold uppercase text-slate-900 mb-1 flex items-center gap-1.5">
                                    <FileText size={15} className="text-emerald-700" />
                                    1. PUBLIC WORK TITLE & DESCRIPTION * :
                                </label>
                                <input
                                    type="text"
                                    value={newProjectName}
                                    onChange={(e) => setNewProjectName(e.target.value)}
                                    placeholder="e.g. Construction of Bengaluru ORR Service Road Asphalt & Drain"
                                    className="w-full p-3 bg-white text-slate-900 font-bold border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600 text-xs"
                                    required
                                />
                            </div>

                            {/* City & Department Selection */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-extrabold uppercase text-slate-900 mb-1 flex items-center gap-1.5">
                                        <MapPin size={15} className="text-emerald-700" />
                                        2. EXECUTION LOCATION / CITY * :
                                    </label>
                                    <select
                                        value={newCity}
                                        onChange={(e) => setNewCity(e.target.value)}
                                        className="w-full p-3 bg-white text-slate-900 font-bold border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
                                    >
                                        {INDIAN_CITIES.map(c => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block font-extrabold uppercase text-slate-900 mb-1 flex items-center gap-1.5">
                                        <Building size={15} className="text-emerald-700" />
                                        3. SANCTIONING DEPARTMENT * :
                                    </label>
                                    <select
                                        value={newDepartment}
                                        onChange={(e) => setNewDepartment(e.target.value)}
                                        className="w-full p-3 bg-white text-slate-900 font-bold border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
                                    >
                                        <option value="Public Works Department (PWD)">Public Works Department (PWD)</option>
                                        <option value="Jal Shakti (Water Supply)">Jal Shakti (Water Supply)</option>
                                        <option value="Urban Development & Housing">Urban Development & Housing</option>
                                        <option value="Renewable Energy & Solar">Renewable Energy & Solar</option>
                                        <option value="Education & Schools Infrastructure">Education & Schools</option>
                                        <option value="Health & Hospitals Infrastructure">Health & Hospitals</option>
                                    </select>
                                </div>
                            </div>

                            {/* Financial Sanction Schedule */}
                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                                <span className="font-extrabold text-slate-900 uppercase text-[11px] block border-b border-slate-200 pb-1 flex items-center gap-1.5">
                                    <DollarSign size={15} className="text-emerald-700" />
                                    4. GAZETTE FINANCIAL SANCTION SCHEDULE (RUPEES ₹)
                                </span>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-slate-700 font-bold uppercase mb-1 text-[10px]">
                                            TOTAL A.S. SANCTIONED BUDGET (₹) * :
                                        </label>
                                        <input
                                            type="number"
                                            value={totalSanctionedBudget}
                                            onChange={(e) => setTotalSanctionedBudget(e.target.value)}
                                            placeholder="e.g. 50000000"
                                            className="w-full p-3 bg-white text-slate-900 font-bold border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
                                            required
                                        />
                                        <span className="text-[10px] text-slate-500 font-bold mt-1 block">
                                            Budget: {formatRupees(Number(totalSanctionedBudget))}
                                        </span>
                                    </div>

                                    <div>
                                        <label className="block text-slate-700 font-bold uppercase mb-1 text-[10px]">
                                            INITIAL TRANCHE 1 MOBILIZATION RELEASE (₹) * :
                                        </label>
                                        <input
                                            type="number"
                                            value={initialReleaseAmount}
                                            onChange={(e) => setInitialReleaseAmount(e.target.value)}
                                            placeholder="e.g. 10000000"
                                            className="w-full p-3 bg-white text-emerald-700 font-bold border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
                                            required
                                        />
                                        <span className="text-[10px] text-emerald-700 font-bold mt-1 block">
                                            Disbursement: {formatRupees(Number(initialReleaseAmount))}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Registered Contractor License Selection */}
                            <div>
                                <label className="block font-extrabold uppercase text-slate-900 mb-1 flex items-center gap-1.5">
                                    <Award size={15} className="text-emerald-700" />
                                    5. ASSIGNED CLASS-1 LICENSED CONTRACTOR AGENT * :
                                </label>
                                <select
                                    value={selectedContractorObj.name}
                                    onChange={(e) => {
                                        const found = REGISTERED_CONTRACTORS.find(c => c.name === e.target.value);
                                        if (found) setSelectedContractorObj(found);
                                    }}
                                    className="w-full p-3 bg-white text-slate-900 font-bold border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
                                >
                                    {REGISTERED_CONTRACTORS.map(c => (
                                        <option key={c.name} value={c.name}>
                                            {c.name} • License: [{c.licenseNo}]
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Officer Seal Disclaimer */}
                            <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-[11px] font-bold text-slate-700 flex items-center justify-between">
                                <div>
                                    <span className="font-extrabold text-slate-900 block uppercase">DIGITAL SIGNATURE SEAL:</span>
                                    <span>Signed by: {officerAccount.name} ({officerAccount.badgeId})</span>
                                </div>
                                <div className="px-3 py-1 bg-slate-900 text-amber-400 font-bold rounded text-[10px] uppercase tracking-wider flex items-center gap-1">
                                    <Stamp size={12} /> DIGITALLY SEALED
                                </div>
                            </div>

                            {/* Submit Order Button */}
                            <button
                                type="submit"
                                disabled={isSanctioning}
                                className="w-full p-4 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs uppercase tracking-wider transition-all rounded-xl shadow-md flex items-center justify-center gap-2"
                            >
                                <Stamp size={18} />
                                <span>{isSanctioning ? "ISSUING ADMINISTRATIVE SANCTION ORDER..." : "SIGN & ISSUE OFFICIAL A.S. ORDER MEMORANDUM →"}</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* 💵 TRANCHE RELEASE MODAL */}
            {selectedProjectForTranche && (
                <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl border border-slate-300 max-w-md w-full p-6 space-y-4 shadow-2xl font-inter text-xs font-bold text-slate-900">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                            <h3 className="font-extrabold text-sm uppercase text-slate-900">
                                Disburse Tranche: {selectedProjectForTranche.projectName}
                            </h3>
                            <button
                                onClick={() => setSelectedProjectForTranche(null)}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 space-y-1">
                            <p>Sanctioned Budget: <strong className="text-slate-900">{formatRupees(selectedProjectForTranche.budgetAllocated)}</strong></p>
                            <p>Already Released: <strong className="text-emerald-700">{formatRupees(selectedProjectForTranche.totalReleasedToAgent)}</strong></p>
                            <p>Agent Claimed Spent: <strong className="text-rose-700">{formatRupees(selectedProjectForTranche.totalClaimedSpent)}</strong></p>
                        </div>

                        <form onSubmit={handleReleaseTranche} className="space-y-4 font-bold">
                            <div>
                                <label className="block text-slate-700 uppercase mb-1">
                                    TRANCHE DISBURSEMENT AMOUNT (₹) * :
                                </label>
                                <input
                                    type="number"
                                    value={trancheReleaseAmount}
                                    onChange={(e) => setTrancheReleaseAmount(e.target.value)}
                                    placeholder="e.g. 2500000"
                                    className="w-full p-3 bg-white text-slate-900 font-bold border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 uppercase mb-1">
                                    OFFICER MEMORANDUM / NOTE:
                                </label>
                                <input
                                    type="text"
                                    value={trancheNote}
                                    onChange={(e) => setTrancheNote(e.target.value)}
                                    placeholder="e.g. Tranche 2 for Foundation Concrete Completion"
                                    className="w-full p-3 bg-white text-slate-900 font-bold border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isReleasingTranche}
                                className="w-full p-4 bg-slate-900 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-md"
                            >
                                {isReleasingTranche ? "DISBURSING TRANCHE..." : "AUTHORIZE TRANCHE DISBURSEMENT →"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* ⚖️ LEGAL COURTROOM DOSSIER MODAL */}
            <LegalCourtroomModal
                isOpen={isPilModalOpen}
                onClose={() => setIsPilModalOpen(false)}
                pilData={selectedPilData}
            />

            {/* 🇮🇳 OFFICIAL FOOTER BANNER */}
            <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-4 text-center text-xs font-bold">
                <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <span className="text-amber-400 font-bold text-[10px] uppercase tracking-wider">
                        GOVERNMENT OF INDIA • MINISTRY OF HOUSING & URBAN AFFAIRS
                    </span>
                    <span className="text-slate-400 text-[11px]">STATUTORY AUDIT & INFRASTRUCTURE MONITORING AUTHORITY</span>
                </div>
            </footer>

        </div>
    );
};

export default GovDashboard;
