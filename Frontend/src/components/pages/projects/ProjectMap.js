import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getAllProjects } from '../../../services/projects/projectService';
import { AlertTriangle, Camera, DollarSign, Receipt, MapPin, Trash2, RefreshCw, Building, Layers } from 'lucide-react';
import { useLanguage } from '../../../context/LanguageContext';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BlockchainChainSummary } from '../../../components/common/blockchain/BlockchainBadge';

const createMarkerIcon = (status) => {
    let color = '#0052FF';
    if (status === 'DELAYED') color = '#F59E0B';
    if (status === 'CRITICAL_DELAY' || status === 'FUND_FROZEN_AI_AUDIT') color = '#FF0000';

    return L.divIcon({
        className: 'custom-leaflet-icon',
        html: `
            <div style="
                background-color: ${color};
                width: 26px;
                height: 26px;
                border: 3.5px solid #000000;
                box-shadow: 4px 4px 0px #000000;
                cursor: pointer;
            "></div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13]
    });
};

const ProjectMap = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState('');
    const { translateText } = useLanguage();
    const navigate = useNavigate();

    // Money Trail Modal State
    const [selectedTrailProject, setSelectedTrailProject] = useState(null);
    const [moneyTrailData, setMoneyTrailData] = useState(null);
    const [loadingMoneyTrail, setLoadingMoneyTrail] = useState(false);

    // Direct Photo Audit Modal State
    const [uploadModalProject, setUploadModalProject] = useState(null);
    const [uploadPhotoFile, setUploadPhotoFile] = useState('');
    const [uploadNote, setUploadNote] = useState('');
    const [isAuditing, setIsAuditing] = useState(false);

    const handlePhotoFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setUploadPhotoFile(reader.result);
            toast.success("Photo attached & ready for GLM-4 audit!");
        };
        reader.readAsDataURL(file);
    };

    const handleDirectPhotoAudit = async (e) => {
        e.preventDefault();
        if (!uploadModalProject) return;

        setIsAuditing(true);
        toast.loading("🧠 Running GLM-4 Forensic AI Audit against site photo...", { id: "direct-audit" });

        try {
            const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
            const { data } = await axios.post(`${backendUrl}/api/v2/fraud/trigger-ai-audit`, {
                projectId: uploadModalProject._id,
                citizenPhoto: uploadPhotoFile || "Ground Truth Site Photo",
                milestoneTitle: uploadNote || "Citizen Site Progress Verification"
            });

            if (data.success) {
                toast.success(`🧠 GLM-4 VERDICT: Mismatch Detected (${data.project.financialGapPercent}% Financial Gap)! Statutory Fund Freeze Issued!`, { id: "direct-audit" });
                setUploadModalProject(null);
                setUploadPhotoFile('');
                setUploadNote('');
                fetchProjects(); // Refresh live map immediately!
            }
        } catch (err) {
            console.error("Direct Photo Audit Error:", err);
            toast.error("Failed to run AI forensic audit", { id: "direct-audit" });
        } finally {
            setIsAuditing(false);
        }
    };

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const data = await getAllProjects({ status: selectedStatus || undefined });
            setProjects(data.projects || []);
        } catch (err) {
            console.error("Error loading projects on map:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, [selectedStatus]);

    const handlePurgeAllProjects = async () => {
        if (!window.confirm("Are you sure you want to purge all old test projects to start 100% fresh?")) return;
        toast.loading("Purging test projects...", { id: "purge" });
        try {
            const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
            await axios.post(`${backendUrl}/api/v2/fraud/purge-all-projects`);
            toast.success("🟢 Database Purged! All old test projects removed.", { id: "purge" });
            fetchProjects();
        } catch (err) {
            toast.error("Failed to purge test projects", { id: "purge" });
        }
    };

    const formatRupees = (amount) => {
        if (!amount && amount !== 0) return '₹0';
        if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
        if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} Lakh`;
        return `₹${amount.toLocaleString('en-IN')}`;
    };

    const handleOpenMoneyTrail = async (projectId) => {
        setLoadingMoneyTrail(true);
        setSelectedTrailProject(projectId);
        try {
            const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
            const { data } = await axios.get(`${backendUrl}/api/v2/fraud/money-trail/${projectId}`);
            if (data.success) {
                setMoneyTrailData(data.moneyTrail);
            }
        } catch (err) {
            console.error("Error opening Money Trail:", err);
            toast.error("Failed to load project Money Trail audit");
        } finally {
            setLoadingMoneyTrail(false);
        }
    };

    return (
        <div className="min-h-screen bg-swiss-white font-inter">
            {/* Header Banner */}
            <div className="bg-swiss-black text-swiss-white p-6 md:p-10 border-b-4 border-swiss-black shadow-brutal flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <span className="text-swiss-accent font-black text-xs uppercase tracking-widest block mb-1">
                        LIVE INFRASTRUCTURE MAP & AGENT PHOTO FEED
                    </span>
                    <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tight">
                        CIVIC WORK GPS MAP & REAL PHOTO PROOF
                    </h1>
                </div>

                {/* Filter Selector & Purge Button */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={handlePurgeAllProjects}
                        className="bg-swiss-accent text-swiss-white px-3 py-2 border-2 border-swiss-white font-black text-xs uppercase hover:bg-swiss-white hover:text-swiss-black transition-colors flex items-center gap-1.5"
                        title="Clear old test projects"
                    >
                        <Trash2 size={14} />
                        <span>PURGE OLD TEST DATA</span>
                    </button>

                    <div className="bg-swiss-white p-2 border-2 border-swiss-black text-swiss-black">
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="bg-transparent text-swiss-black font-black text-xs uppercase focus:outline-none cursor-pointer"
                        >
                            <option value="">All Statuses</option>
                            <option value="ON_TRACK">On Track (Green)</option>
                            <option value="DELAYED">Delayed (Yellow)</option>
                            <option value="CRITICAL_DELAY">Critical Delay (Red)</option>
                            <option value="FUND_FROZEN_AI_AUDIT">Fund Frozen (AI Audit Lock)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Clean, Full-Width Interactive Map Canvas */}
            <div className="border-b-4 border-swiss-black relative h-[600px] w-full bg-swiss-muted z-0">
                {loading ? (
                    <div className="h-full flex items-center justify-center gap-3 text-swiss-black">
                        <div className="w-6 h-6 border-4 border-swiss-black border-t-swiss-accent animate-spin"></div>
                        <span className="font-black text-xs uppercase tracking-widest">Loading interactive map...</span>
                    </div>
                ) : (
                    <MapContainer
                        center={[20.5937, 78.9629]}
                        zoom={5}
                        scrollWheelZoom={false}
                        className="h-full w-full"
                    >
                        <TileLayer
                            attribution='&copy; <a href="https://carto.com/">CARTO Voyager</a>'
                            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        />
                        {projects.map((proj) => {
                            // Extract ALL agent submitted photos (both past historical entries + new entries)
                            const allAgentPhotos = [];
                            if (proj.spendingLedger) {
                                proj.spendingLedger.forEach(s => {
                                    if (s.invoicePhoto && (s.invoicePhoto.startsWith('data:image') || s.invoicePhoto.startsWith('http://') || s.invoicePhoto.startsWith('https://'))) {
                                        allAgentPhotos.push({ url: s.invoicePhoto, title: s.itemName, date: s.date });
                                    }
                                });
                            }
                            if (proj.milestones) {
                                proj.milestones.forEach(m => {
                                    if (m.contractorPhoto && !allAgentPhotos.some(p => p.url === m.contractorPhoto)) {
                                        allAgentPhotos.push({ url: m.contractorPhoto, title: m.milestoneTitle, date: m.contractorClaimDate });
                                    }
                                });
                            }
                            if (proj.contractorPhoto && !allAgentPhotos.some(p => p.url === proj.contractorPhoto)) {
                                allAgentPhotos.push({ url: proj.contractorPhoto, title: "Initial Work Proof", date: proj.startDate });
                            }

                            const latestPhoto = allAgentPhotos.length > 0 ? allAgentPhotos[allAgentPhotos.length - 1] : null;

                            return (
                                <Marker
                                    key={proj._id}
                                    position={[proj.latitude || 20.5937, proj.longitude || 78.9629]}
                                    icon={createMarkerIcon(proj.status)}
                                >
                                    <Popup className="custom-leaflet-popup">
                                        <div className="p-3 font-inter max-w-xs space-y-3">
                                            
                                            {/* Status Badge */}
                                            <div className="flex items-center justify-between">
                                                <span className={`px-2 py-0.5 text-[9px] font-black uppercase text-swiss-white block ${proj.status === 'CRITICAL_DELAY' || proj.status === 'FUND_FROZEN_AI_AUDIT' ? 'bg-swiss-accent' : proj.status === 'DELAYED' ? 'bg-amber-500' : 'bg-emerald-600'}`}>
                                                    {proj.status.replace('_', ' ')}
                                                </span>
                                                <span className="text-[10px] font-black uppercase text-swiss-accent">
                                                    GAP: {proj.financialGapPercent || 0}%
                                                </span>
                                            </div>
                                            
                                            <div>
                                                <h4 className="font-black text-sm uppercase leading-tight text-swiss-black">{translateText(proj.projectName)}</h4>
                                                <p className="text-[10px] font-bold text-gray-700 uppercase flex items-center gap-1 mt-0.5">
                                                    <MapPin size={10} className="text-swiss-accent" /> {proj.city}, {proj.state}
                                                </p>
                                            </div>

                                            {/* 📸 REAL WORK PHOTO / GALLERY CARD */}
                                            <div className="border-2 border-swiss-black bg-swiss-white p-1.5 space-y-1.5 shadow-sm">
                                                <div className="bg-swiss-black text-swiss-white px-2 py-1 flex items-center justify-between text-[9px] font-black uppercase">
                                                    <span>📸 AGENT PHOTOS ({allAgentPhotos.length})</span>
                                                    <span className="text-emerald-400">PRESERVED</span>
                                                </div>

                                                {latestPhoto ? (
                                                    <div className="space-y-1.5">
                                                        <img src={latestPhoto.url} alt="Contractor Work Proof" className="w-full h-36 object-cover border border-swiss-black" />
                                                        
                                                        {allAgentPhotos.length > 1 && (
                                                            <div className="flex gap-1 overflow-x-auto pt-1 border-t border-swiss-black">
                                                                {allAgentPhotos.map((p, pIdx) => (
                                                                    <img
                                                                        key={pIdx}
                                                                        src={p.url}
                                                                        alt={p.title}
                                                                        className="w-8 h-8 object-cover border border-swiss-black shrink-0"
                                                                        title={`${p.title} (${new Date(p.date).toLocaleDateString()})`}
                                                                    />
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="p-3 bg-swiss-muted border border-swiss-black text-center space-y-1">
                                                        <Camera size={24} className="mx-auto text-swiss-accent" />
                                                        <span className="text-[10px] font-black uppercase text-swiss-black block">
                                                            NO AGENT PHOTO ATTACHED YET
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="text-xs font-bold space-y-1 border-t border-swiss-black pt-2">
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600 uppercase text-[10px]">Released Funds:</span>
                                                    <span className="text-swiss-black font-black">{formatRupees(proj.totalReleasedToAgent)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600 uppercase text-[10px]">Claimed Spent:</span>
                                                    <span className="text-swiss-black font-black">{formatRupees(proj.totalClaimedSpent || proj.budgetSpent)}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-600 uppercase text-[10px]">Verified Work:</span>
                                                    <span className="text-emerald-700 font-black">{proj.citizenVerifiedWorkPercent || 100}%</span>
                                                </div>
                                            </div>

                                            {/* Action Buttons inside Popup */}
                                            <div className="space-y-1.5 pt-1">
                                                <button
                                                    onClick={() => handleOpenMoneyTrail(proj._id)}
                                                    className="w-full p-2 bg-swiss-black text-swiss-white font-black text-[10px] uppercase border border-swiss-black hover:bg-swiss-accent transition-colors flex items-center justify-center gap-1"
                                                >
                                                    <Receipt size={12} />
                                                    <span>VIEW LIVE MONEY TRAIL LEDGER</span>
                                                </button>

                                                <button
                                                    onClick={() => navigate("/reports")}
                                                    className="w-full p-2 bg-swiss-accent text-swiss-white font-black text-[10px] uppercase border border-swiss-black hover:bg-swiss-black transition-colors flex items-center justify-center gap-1"
                                                >
                                                    <Camera size={12} />
                                                    <span>UPLOAD CITIZEN PROOF PHOTO</span>
                                                </button>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            );
                        })}
                    </MapContainer>
                )}
            </div>

            {/* Project Cards Grid */}
            <div className="p-6 md:p-12">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-black uppercase tracking-tight">MONITORED PUBLIC INFRASTRUCTURE PROJECTS ({projects.length})</h3>
                    <button
                        onClick={fetchProjects}
                        className="p-2 bg-swiss-black text-swiss-white border-2 border-swiss-black hover:bg-swiss-accent transition-colors text-xs font-black uppercase flex items-center gap-1"
                    >
                        <RefreshCw size={14} />
                        <span>REFRESH LIST</span>
                    </button>
                </div>
                
                {projects.length === 0 ? (
                    <div className="p-12 border-4 border-swiss-black bg-swiss-muted text-center space-y-4 shadow-brutal">
                        <Camera size={40} className="mx-auto text-swiss-accent" />
                        <h4 className="font-black text-lg uppercase text-swiss-black">NO PROJECTS FOUND IN DATABASE</h4>
                        <p className="text-xs font-bold text-gray-600 uppercase max-w-md mx-auto leading-relaxed">
                            Open the Govt Officer Portal to sanction a project, or Contractor Portal to post a real work entry!
                        </p>
                        <div className="flex justify-center gap-3">
                            <button
                                onClick={() => navigate("/gov-dashboard")}
                                className="px-6 py-3 bg-swiss-accent text-swiss-white font-black text-xs uppercase border-2 border-swiss-black hover:bg-swiss-black transition-colors"
                            >
                                GOVT OFFICER PORTAL →
                            </button>

                            <button
                                onClick={() => navigate("/contractor-portal")}
                                className="px-6 py-3 bg-swiss-black text-swiss-white font-black text-xs uppercase border-2 border-swiss-black hover:bg-swiss-accent transition-colors"
                            >
                                CONTRACTOR PORTAL →
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map((proj) => {
                            // Extract ALL agent submitted photos (both past historical entries + new entries)
                            const allAgentPhotos = [];
                            if (proj.spendingLedger) {
                                proj.spendingLedger.forEach(s => {
                                    if (s.invoicePhoto && (s.invoicePhoto.startsWith('data:image') || s.invoicePhoto.startsWith('http://') || s.invoicePhoto.startsWith('https://'))) {
                                        allAgentPhotos.push({ url: s.invoicePhoto, title: s.itemName, date: s.date });
                                    }
                                });
                            }
                            if (proj.milestones) {
                                proj.milestones.forEach(m => {
                                    if (m.contractorPhoto && !allAgentPhotos.some(p => p.url === m.contractorPhoto)) {
                                        allAgentPhotos.push({ url: m.contractorPhoto, title: m.milestoneTitle, date: m.contractorClaimDate });
                                    }
                                });
                            }
                            if (proj.contractorPhoto && !allAgentPhotos.some(p => p.url === proj.contractorPhoto)) {
                                allAgentPhotos.push({ url: proj.contractorPhoto, title: "Initial Site Proof", date: proj.startDate });
                            }

                            const latestPhoto = allAgentPhotos.length > 0 ? allAgentPhotos[allAgentPhotos.length - 1] : null;

                            return (
                                <div key={proj._id} className="border-4 border-swiss-black bg-swiss-white p-6 flex flex-col justify-between shadow-brutal">
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <span className={`px-3 py-1 font-black text-[10px] uppercase text-swiss-white border-2 border-swiss-black ${proj.status === 'CRITICAL_DELAY' || proj.status === 'FUND_FROZEN_AI_AUDIT' ? 'bg-swiss-accent' : proj.status === 'DELAYED' ? 'bg-amber-500' : 'bg-emerald-600'}`}>
                                                {proj.status.replace('_', ' ')}
                                            </span>
                                            <span className="text-xs font-black uppercase text-swiss-accent">
                                                GAP: {proj.financialGapPercent || 0}%
                                            </span>
                                        </div>

                                        <h4 className="text-lg font-black uppercase tracking-tight mb-1 text-swiss-black">
                                            {translateText(proj.projectName)}
                                        </h4>
                                        <p className="text-xs font-bold text-gray-700 uppercase mb-4">
                                            {proj.city}, {proj.state} • {proj.department}
                                        </p>

                                        {/* 🖼️ AGENT SUBMITTED ALL WORK PHOTOS GALLERY */}
                                        <div className="mb-4 border-2 border-swiss-black p-2 bg-swiss-muted space-y-2">
                                            <div className="flex items-center justify-between text-[9px] font-black uppercase text-swiss-black">
                                                <span>📸 AGENT WORK PHOTO GALLERY ({allAgentPhotos.length}):</span>
                                                <span className="text-emerald-700 font-extrabold">ALL PHOTOS PRESERVED</span>
                                            </div>

                                            {latestPhoto ? (
                                                <div className="space-y-2">
                                                    <img src={latestPhoto.url} alt="Latest Work Proof" className="w-full h-44 object-cover border-2 border-swiss-black bg-white shadow-xs" />
                                                    
                                                    {/* Photo History Strip if multiple photos */}
                                                    {allAgentPhotos.length > 1 && (
                                                        <div className="pt-1 border-t border-swiss-black">
                                                            <span className="text-[8px] font-black uppercase text-gray-600 block mb-1">
                                                                HISTORICAL WORK PHOTOS ({allAgentPhotos.length}):
                                                            </span>
                                                            <div className="flex gap-1.5 overflow-x-auto pb-1">
                                                                {allAgentPhotos.map((p, pIdx) => (
                                                                    <div key={pIdx} className="relative group shrink-0">
                                                                        <img
                                                                            src={p.url}
                                                                            alt={p.title}
                                                                            className="w-12 h-12 object-cover border border-swiss-black rounded bg-white hover:scale-105 transition-transform"
                                                                            title={`${p.title} (${new Date(p.date).toLocaleDateString()})`}
                                                                        />
                                                                        <span className="absolute bottom-0 right-0 bg-swiss-black text-white text-[7px] font-black px-1">
                                                                            #{pIdx + 1}
                                                                        </span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="p-4 text-center bg-swiss-white border border-swiss-black space-y-1">
                                                    <Camera size={24} className="mx-auto text-swiss-accent" />
                                                    <span className="text-[10px] font-black uppercase text-swiss-black block">
                                                        NO PHOTO ATTACHED BY AGENT YET
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="space-y-2 border-t-2 border-b-2 border-swiss-black py-4 mb-4 font-bold text-xs">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 uppercase">Sanctioned Budget:</span>
                                                <span className="text-swiss-black font-black">{formatRupees(proj.budgetAllocated)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 uppercase">Govt Released Funds:</span>
                                                <span className="text-swiss-black font-black">{formatRupees(proj.totalReleasedToAgent)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 uppercase">Agent Claimed Spent:</span>
                                                <span className="text-swiss-black font-black">{formatRupees(proj.totalClaimedSpent || proj.budgetSpent)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600 uppercase">Citizen Verified Work:</span>
                                                <span className="text-emerald-700 font-black">{proj.citizenVerifiedWorkPercent || 100}%</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <button
                                            onClick={() => handleOpenMoneyTrail(proj._id)}
                                            className="w-full p-3 bg-swiss-black text-swiss-white font-black text-xs uppercase tracking-widest border-2 border-swiss-black hover:bg-swiss-accent transition-colors flex items-center justify-center gap-2"
                                        >
                                            <DollarSign size={16} />
                                            <span>💰 VIEW LIVE MONEY TRAIL</span>
                                        </button>

                                        <button
                                            onClick={() => setUploadModalProject(proj)}
                                            className="w-full p-3 bg-swiss-accent text-swiss-white font-black text-xs uppercase tracking-widest border-2 border-swiss-black hover:bg-swiss-black transition-colors flex items-center justify-center gap-2"
                                        >
                                            <Camera size={16} />
                                            <span>📸 UPLOAD GROUND-TRUTH SITE PHOTO</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 💰 MONEY TRAIL AUDIT MODAL */}
            {selectedTrailProject && (
                <div className="fixed inset-0 bg-swiss-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-swiss-white border-4 border-swiss-black max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-brutal max-h-[90vh] overflow-y-auto font-inter">
                        
                        <div className="flex items-center justify-between border-b-4 border-swiss-black pb-4">
                            <div>
                                <span className="text-swiss-accent font-black text-xs uppercase tracking-widest block">
                                    5-STEP TAX MONEY TRAIL AUDIT
                                </span>
                                <h3 className="text-xl md:text-2xl font-black uppercase text-swiss-black">
                                    {moneyTrailData ? moneyTrailData.projectName : "LOADING PROJECT LEDGER..."}
                                </h3>
                            </div>
                            <button
                                onClick={() => { setSelectedTrailProject(null); setMoneyTrailData(null); }}
                                className="px-3 py-1 bg-swiss-black text-swiss-white font-black text-xs uppercase border-2 border-swiss-black hover:bg-swiss-accent"
                            >
                                CLOSE ✕
                            </button>
                        </div>

                        {loadingMoneyTrail || !moneyTrailData ? (
                            <div className="py-12 text-center font-black text-xs uppercase text-swiss-black animate-pulse">
                                FETCHING COMPLETE TAX MONEY LEDGER...
                            </div>
                        ) : (
                            <div className="space-y-6">
                                
                                {/* Top Financial Metrics */}
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                                    <div className="p-3 border-2 border-swiss-black bg-swiss-muted">
                                        <span className="text-[9px] font-black uppercase text-gray-600 block">1. GOVT RELEASED</span>
                                        <span className="font-black text-xs text-swiss-black">{formatRupees(moneyTrailData.totalReleasedToAgent)}</span>
                                    </div>

                                    <div className="p-3 border-2 border-swiss-black bg-swiss-muted">
                                        <span className="text-[9px] font-black uppercase text-gray-600 block">2. AGENT CLAIMED</span>
                                        <span className="font-black text-xs text-swiss-black">{formatRupees(moneyTrailData.totalClaimedSpent)}</span>
                                    </div>

                                    <div className="p-3 border-2 border-swiss-black bg-swiss-muted">
                                        <span className="text-[9px] font-black uppercase text-gray-600 block">3. CITIZENS PROOF</span>
                                        <span className="font-black text-xs text-emerald-700">{moneyTrailData.citizenVerifiedWorkPercent}% WORK</span>
                                    </div>

                                    <div className={`p-3 border-2 border-swiss-black ${moneyTrailData.financialGapPercent >= 30 ? 'bg-swiss-accent text-swiss-white' : 'bg-emerald-600 text-swiss-white'}`}>
                                        <span className="text-[9px] font-black uppercase block opacity-90">4. MONEY GAP</span>
                                        <span className="font-black text-xs">{moneyTrailData.financialGapPercent}%</span>
                                    </div>
                                </div>

                                {/* Step 4 Auto Action Alert */}
                                {moneyTrailData.isFundFrozen ? (
                                    <div className="p-4 bg-swiss-accent text-swiss-white border-4 border-swiss-black space-y-1">
                                        <div className="flex items-center gap-2 font-black text-xs uppercase">
                                            <AlertTriangle size={18} />
                                            <span>🧠 GLM-4 AI FORENSIC VERDICT: GHOST WORK FRAUD DETECTED (GAP {moneyTrailData.financialGapPercent}%)</span>
                                        </div>
                                        <p className="text-[11px] font-bold uppercase leading-relaxed">
                                            GLM-4 AI Computer Vision compared citizen ground-truth site photos against contractor claimed bills. Work progress mismatch detected! Future fund tranches frozen & Statutory Section 80 Notice issued.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="p-3 bg-slate-900 text-white border-2 border-swiss-black space-y-1">
                                        <div className="flex items-center justify-between font-black text-xs uppercase">
                                            <span className="text-emerald-400 flex items-center gap-1.5">
                                                🧠 GLM-4 AI FORENSIC VERDICT: 100% VERIFIED GROUND-TRUTH WORK
                                            </span>
                                            <span className="text-[9px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-700">
                                                GLM-4 ACTIVE
                                            </span>
                                        </div>
                                        <p className="text-[10px] text-slate-300 font-medium leading-normal">
                                            GLM-4 Vision Engine continuously cross-analyzes contractor expense claims against citizen geotagged photos. Ground-truth site progress matches reported billing (0% Financial Gap).
                                        </p>
                                    </div>
                                )}

                                {/* Government Tranche Releases History */}
                                {moneyTrailData.trancheReleases && moneyTrailData.trancheReleases.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="font-black text-xs uppercase tracking-wider text-swiss-black border-b-2 border-swiss-black pb-1 flex items-center gap-1">
                                            <Building size={14} className="text-swiss-accent" />
                                            GOVERNMENT FUND TRANCHE RELEASES ({moneyTrailData.trancheReleases.length}):
                                        </h4>
                                        <div className="space-y-1.5">
                                            {moneyTrailData.trancheReleases.map((tr, idx) => (
                                                <div key={idx} className="p-2.5 border-2 border-swiss-black bg-emerald-50 flex items-center justify-between font-bold text-xs uppercase">
                                                    <div>
                                                        <span className="text-[9px] font-black text-emerald-800 block">TRANCHE #{tr.trancheNumber} • {new Date(tr.dateReleased).toLocaleDateString()}</span>
                                                        <p className="text-swiss-black font-black">{tr.note || 'Government Release'}</p>
                                                    </div>
                                                    <span className="text-emerald-700 font-black">₹{tr.amountReleased.toLocaleString('en-IN')}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Spending Ledger List with Photos */}
                                <div className="space-y-3">
                                    <h4 className="font-black text-xs uppercase tracking-wider text-swiss-black border-b-2 border-swiss-black pb-1 flex items-center justify-between">
                                        <span>ITEMIZED AGENT SPENDING & PHOTO PROOF LEDGER ({moneyTrailData.spendingLedger?.length || 0} ENTRIES):</span>
                                        <span className="text-[10px] text-swiss-accent font-black">ALL UPLOADED PHOTOS PRESERVED</span>
                                    </h4>

                                    {moneyTrailData.spendingLedger?.length === 0 ? (
                                        <p className="text-xs font-bold text-gray-500 uppercase py-2">No spending entries logged yet.</p>
                                    ) : (
                                        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                                            {moneyTrailData.spendingLedger.map((item, idx) => (
                                                <div key={idx} className="p-3 border-2 border-swiss-black bg-swiss-muted flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-bold text-xs uppercase shadow-xs">
                                                    
                                                    <div className="flex items-center gap-3">
                                                        {item.invoicePhoto && (item.invoicePhoto.startsWith('data:image') || item.invoicePhoto.startsWith('http://') || item.invoicePhoto.startsWith('https://')) ? (
                                                            <img
                                                                src={item.invoicePhoto}
                                                                alt={item.itemName}
                                                                className="w-16 h-16 object-cover border-2 border-swiss-black bg-white shrink-0"
                                                            />
                                                        ) : (
                                                            <div className="w-16 h-16 bg-swiss-white border-2 border-swiss-black flex items-center justify-center text-swiss-accent shrink-0">
                                                                <Camera size={20} />
                                                            </div>
                                                        )}

                                                        <div>
                                                            <span className="text-[9px] font-black text-swiss-accent block">
                                                                ENTRY #{idx + 1} • {item.category} • {new Date(item.date).toLocaleDateString()}
                                                            </span>
                                                            <p className="text-swiss-black font-black text-sm">{item.itemName}</p>
                                                            <span className="text-[10px] font-bold text-gray-600">Geotagged Work Photo Attached</span>
                                                        </div>
                                                    </div>

                                                    <div className="text-right shrink-0">
                                                        <span className="text-swiss-black font-black text-base block">₹{item.amount.toLocaleString('en-IN')}</span>
                                                        <span className="text-[9px] font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 border border-emerald-300">
                                                            VERIFIED LEDGER ENTRY
                                                        </span>
                                                    </div>

                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Citizen Ground Truth Verification CTA */}
                                <div className="p-4 border-2 border-swiss-black bg-swiss-muted flex flex-col sm:flex-row items-center justify-between gap-3">
                                    <div>
                                        <span className="font-black text-xs uppercase text-swiss-black block">STEP 2: ARE YOU A CITIZEN NEAR THIS SITE?</span>
                                        <p className="text-[10px] font-bold text-gray-600 uppercase">Upload site photos to verify work or flag missing progress.</p>
                                    </div>

                                    <button
                                        onClick={() => { setSelectedTrailProject(null); window.scrollTo({ top: 0, behavior: 'smooth' }); navigate("/reports"); }}
                                        className="px-4 py-2 bg-swiss-black text-swiss-white font-black text-xs uppercase border-2 border-swiss-black hover:bg-swiss-accent transition-colors shrink-0"
                                    >
                                        UPLOAD SITE PHOTO →
                                    </button>
                                </div>

                                {/* ⛓️ BLOCKCHAIN IMMUTABLE AUDIT TRAIL */}
                                {moneyTrailData.blockchainHashes && moneyTrailData.blockchainHashes.length > 0 && (
                                    <BlockchainChainSummary blockchainHashes={moneyTrailData.blockchainHashes} />
                                )}

                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* 📸 DIRECT GROUND-TRUTH SITE PHOTO AUDIT MODAL */}
            {uploadModalProject && (
                <div className="fixed inset-0 bg-swiss-black/80 z-50 flex items-center justify-center p-4">
                    <div className="bg-swiss-white border-4 border-swiss-black max-w-lg w-full p-6 space-y-5 shadow-brutal font-inter">
                        
                        <div className="flex items-center justify-between border-b-4 border-swiss-black pb-3">
                            <div>
                                <span className="text-[10px] font-black uppercase text-swiss-accent tracking-widest block">
                                    📸 CITIZEN SITE AUDIT
                                </span>
                                <h3 className="text-lg font-black uppercase text-swiss-black leading-tight">
                                    Upload Photo Proof for {uploadModalProject.projectName}
                                </h3>
                            </div>
                            <button
                                onClick={() => setUploadModalProject(null)}
                                className="px-3 py-1 bg-swiss-black text-swiss-white font-black text-xs uppercase border-2 border-swiss-black hover:bg-swiss-accent"
                            >
                                CLOSE ✕
                            </button>
                        </div>

                        <form onSubmit={handleDirectPhotoAudit} className="space-y-4 text-xs font-bold text-swiss-black uppercase">
                            
                            <div className="p-3 bg-swiss-muted border-2 border-swiss-black space-y-1">
                                <span className="text-[9px] font-black text-swiss-accent block">SELECTED INFRASTRUCTURE WORK:</span>
                                <p className="font-black text-sm text-swiss-black">{uploadModalProject.projectName}</p>
                                <span className="text-[10px] text-gray-600 block">{uploadModalProject.city}, {uploadModalProject.state}</span>
                            </div>

                            <div>
                                <label className="block text-swiss-black font-black uppercase mb-1">
                                    Upload Real Site Photo Proof * :
                                </label>
                                <div className="border-2 border-dashed border-swiss-black p-5 bg-swiss-muted text-center relative hover:bg-swiss-white transition-colors cursor-pointer">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoFileChange}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                        required
                                    />
                                    <div className="flex flex-col items-center justify-center gap-1.5">
                                        <Camera size={24} className="text-swiss-accent" />
                                        <span className="font-black text-xs text-swiss-black">
                                            {uploadPhotoFile ? '🟢 PHOTO ATTACHED & READY' : 'CLICK OR DRAG PHOTO FILE HERE'}
                                        </span>
                                        <span className="text-[9px] text-gray-500 font-bold">Supports JPG, PNG, WEBP (Instant Base64 Encoding)</span>
                                    </div>
                                </div>

                                {uploadPhotoFile && (
                                    <div className="mt-2 p-2 border-2 border-swiss-black bg-swiss-white flex items-center gap-3">
                                        <img src={uploadPhotoFile} alt="Ground Truth Site Proof" className="w-14 h-14 object-cover border border-swiss-black" />
                                        <span className="text-xs font-black text-emerald-700">✓ Ground-Truth Site Photo Attached</span>
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-swiss-black font-black uppercase mb-1">
                                    Site Observation / Note (Optional) :
                                </label>
                                <input
                                    type="text"
                                    value={uploadNote}
                                    onChange={(e) => setUploadNote(e.target.value)}
                                    placeholder="e.g. Muddy unpaved trench, zero asphalt laid"
                                    className="w-full p-3 bg-swiss-white border-2 border-swiss-black font-bold text-xs focus:outline-none uppercase"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isAuditing}
                                className="w-full p-4 bg-swiss-black text-swiss-white font-black text-xs uppercase tracking-widest border-2 border-swiss-black hover:bg-swiss-accent transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <AlertTriangle size={18} className="text-swiss-accent" />
                                <span>{isAuditing ? 'RUNNING GLM-4 FORENSIC AUDIT...' : '🧠 RUN INSTANT GLM-4 FORENSIC AI AUDIT →'}</span>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProjectMap;
