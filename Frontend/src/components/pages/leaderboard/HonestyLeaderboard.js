import React, { useState, useEffect } from 'react';
import { Trophy, HardHat, UserCheck, AlertTriangle, Camera, MapPin, CheckCircle, ShieldAlert } from 'lucide-react';
import axios from 'axios';

const HonestyLeaderboard = () => {
    const [contractors, setContractors] = useState([]);
    const [officers, setOfficers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                setLoading(true);
                const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
                const { data } = await axios.get(`${backendUrl}/api/v2/fraud/leaderboard`);
                if (data.success) {
                    setContractors(data.contractors || []);
                    setOfficers(data.officers || []);
                }
            } catch (err) {
                console.error("Leaderboard fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    const formatRupees = (amount) => {
        if (!amount && amount !== 0) return '₹0';
        if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
        if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)} Lakh`;
        return `₹${amount.toLocaleString('en-IN')}`;
    };

    return (
        <div className="bg-swiss-white min-h-screen font-inter p-6 md:p-12">
            <div className="max-w-6xl mx-auto space-y-10">

                {/* Banner */}
                <div className="bg-swiss-black text-swiss-white p-8 border-4 border-swiss-black shadow-brutal flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <span className="text-swiss-accent font-black text-xs uppercase tracking-widest block mb-1">
                            REAL-TIME PUBLIC REPUTATION AUDIT ENGINE
                        </span>
                        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight flex items-center gap-3">
                            <Trophy className="text-swiss-accent" size={36} />
                            PUBLIC HONESTY LEADERBOARD & WORK PROOF
                        </h1>
                        <p className="text-swiss-white/70 font-semibold text-xs uppercase tracking-wider mt-2">
                            Live Contractor Honesty Ratings with Ground-Truth Work Photo Proof & Officer Transparency Scores.
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 text-center border-4 border-swiss-black bg-swiss-white">
                        <div className="w-8 h-8 border-4 border-swiss-black border-t-swiss-accent animate-spin mx-auto mb-3"></div>
                        <span className="font-black text-xs uppercase tracking-widest">Loading Live Database Ratings & Photo Proofs...</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        
                        {/* Contractor Honesty Scores */}
                        <div className="border-4 border-swiss-black bg-swiss-white p-6 md:p-8 space-y-6 shadow-brutal">
                            <div className="flex items-center justify-between border-b-4 border-swiss-black pb-4">
                                <div className="flex items-center gap-3">
                                    <HardHat size={24} className="text-swiss-accent" />
                                    <h2 className="font-black text-lg uppercase tracking-tight text-swiss-black">
                                        CONTRACTOR HONESTY SCORES
                                    </h2>
                                </div>
                                <span className="text-[10px] font-black uppercase bg-swiss-black text-swiss-white px-2.5 py-1">
                                    REAL DATABASE DATA
                                </span>
                            </div>

                            {contractors.length === 0 ? (
                                <p className="font-black text-xs uppercase text-swiss-black p-4 bg-swiss-muted border-2 border-swiss-black">
                                    No contractor audit records found in database yet. Submit a claim in Contractor Portal!
                                </p>
                            ) : (
                                <div className="space-y-6">
                                    {contractors.map((c, idx) => {
                                        const isLow = c.honestyScore < 60;
                                        const isValidImg = c.photo && (c.photo.startsWith('data:image') || c.photo.startsWith('http://') || c.photo.startsWith('https://'));

                                        return (
                                            <div key={idx} className={`p-5 border-4 border-swiss-black space-y-4 ${isLow ? 'bg-swiss-accent/10 border-swiss-accent' : 'bg-swiss-muted'}`}>
                                                
                                                {/* Contractor Title & Score */}
                                                <div className="flex items-start justify-between gap-2 border-b-2 border-swiss-black pb-3">
                                                    <div>
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-swiss-accent block">
                                                            RANK #0{idx + 1} • {c.city || 'INDIA'}
                                                        </span>
                                                        <h3 className="font-black text-base uppercase tracking-tight text-swiss-black">{c.contractorName}</h3>
                                                        <p className="text-xs font-bold text-gray-700 uppercase mt-0.5">{c.projectName}</p>
                                                    </div>

                                                    <div className="text-right shrink-0">
                                                        <span className={`text-3xl font-black block leading-none ${isLow ? 'text-swiss-accent' : 'text-emerald-700'}`}>
                                                            {c.honestyScore}%
                                                        </span>
                                                        <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded text-white inline-block mt-1 ${isLow ? 'bg-swiss-accent' : 'bg-emerald-700'}`}>
                                                            {isLow ? 'CAUGHT LYING' : 'HONEST RATING'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* 📸 REAL SITE WORK PHOTO PROOF DISPLAY */}
                                                <div className="border-2 border-swiss-black bg-swiss-white p-2 space-y-1 shadow-sm">
                                                    <div className="bg-swiss-black text-swiss-white px-2.5 py-1 flex items-center justify-between text-[9px] font-black uppercase">
                                                        <span className="flex items-center gap-1">
                                                            <Camera size={12} className="text-swiss-accent" />
                                                            REAL WORK PHOTO PROOF
                                                        </span>
                                                        <span>CLAIMED: {formatRupees(c.totalClaimedSpent)}</span>
                                                    </div>

                                                    {isValidImg ? (
                                                        <img src={c.photo} alt="Contractor Work Proof" className="w-full h-44 object-cover border border-swiss-black" />
                                                    ) : (
                                                        <div className="p-4 bg-swiss-muted border border-swiss-black text-center space-y-1">
                                                            <Camera size={24} className="mx-auto text-swiss-accent" />
                                                            <span className="text-[10px] font-black uppercase text-swiss-black block">
                                                                WORK ENTRY SUBMITTED IN {c.city ? c.city.toUpperCase() : "SITE"}
                                                            </span>
                                                            <p className="text-[10px] font-bold text-emerald-700 uppercase">
                                                                Claimed: {formatRupees(c.totalClaimedSpent)} (Govt Released: {formatRupees(c.totalReleasedToAgent)})
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Audit Details Footer */}
                                                <div className="flex items-center justify-between text-[11px] font-extrabold uppercase pt-1">
                                                    <span className={c.mismatchesCaught > 0 ? 'text-swiss-accent' : 'text-emerald-700'}>
                                                        ⚠️ {c.mismatchesCaught || 0} Mismatches Caught by AI
                                                    </span>
                                                    <span className="text-swiss-black font-black">
                                                        Released: {formatRupees(c.totalReleasedToAgent)}
                                                    </span>
                                                </div>

                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Officer Transparency Ratings */}
                        <div className="border-4 border-swiss-black bg-swiss-white p-6 md:p-8 space-y-6 shadow-brutal">
                            <div className="flex items-center justify-between border-b-4 border-swiss-black pb-4">
                                <div className="flex items-center gap-3">
                                    <UserCheck size={24} className="text-swiss-accent" />
                                    <h2 className="font-black text-lg uppercase tracking-tight text-swiss-black">
                                        OFFICER TRANSPARENCY RATINGS
                                    </h2>
                                </div>
                                <span className="text-[10px] font-black uppercase bg-swiss-black text-swiss-white px-2.5 py-1">
                                    REAL DATABASE DATA
                                </span>
                            </div>

                            {officers.length === 0 ? (
                                <p className="font-black text-xs uppercase text-swiss-black p-4 bg-swiss-muted border-2 border-swiss-black">
                                    No officer decision records found in database yet. Process claims in Govt Dashboard!
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {officers.map((o, idx) => (
                                        <div key={idx} className="p-4 border-4 border-swiss-black bg-swiss-muted text-swiss-black flex items-center justify-between">
                                            <div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-swiss-accent block">
                                                    RANK #0{idx + 1} — {o.city}
                                                </span>
                                                <h3 className="font-black text-sm uppercase tracking-tight">{o.officerName}</h3>
                                                <p className="text-xs font-bold text-gray-700 uppercase mt-0.5">{o.projectName}</p>
                                                <p className="text-[11px] font-bold uppercase mt-1 text-emerald-700">
                                                    🛡️ {o.fakeClaimsRejected || 0} AI Fraud Locks Issued • Budget: {formatRupees(o.totalSanctionedBudget)}
                                                </p>
                                            </div>

                                            <div className="text-right shrink-0">
                                                <span className="text-2xl font-black text-swiss-black block leading-none">
                                                    {o.transparencyScore}%
                                                </span>
                                                <span className="text-[9px] font-black uppercase tracking-widest text-swiss-accent">
                                                    TRANSPARENCY
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    </div>
                )}

            </div>
        </div>
    );
};

export default HonestyLeaderboard;
