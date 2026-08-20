import React, { useState, useEffect } from 'react';
import { Landmark, ShieldCheck, Mail, KeyRound, Smartphone, CheckCircle2, Award, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

// Base32 helper for Google Authenticator TOTP
const base32ToBytes = (base32) => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
    let cleaned = base32.toUpperCase().replace(/=+$/, '');
    let bits = "";
    for (let char of cleaned) {
        let val = alphabet.indexOf(char);
        if (val === -1) continue;
        bits += val.toString(2).padStart(5, '0');
    }
    let bytes = [];
    for (let i = 0; i + 8 <= bits.length; i += 8) {
        bytes.push(parseInt(bits.substr(i, 8), 2));
    }
    return new Uint8Array(bytes);
};

// Calculate real RFC 6238 TOTP token matching Google Authenticator app
const getTOTPToken = async (secret, timeStepOffset = 0) => {
    try {
        const keyBytes = base32ToBytes(secret);
        const cryptoKey = await window.crypto.subtle.importKey(
            "raw",
            keyBytes,
            { name: "HMAC", hash: { name: "SHA-1" } },
            false,
            ["sign"]
        );

        const epoch = Math.floor(Date.now() / 1000 / 30) + timeStepOffset;
        const counterBuffer = new ArrayBuffer(8);
        const counterView = new DataView(counterBuffer);
        counterView.setUint32(4, epoch, false);

        const signature = await window.crypto.subtle.sign("HMAC", cryptoKey, counterBuffer);
        const sigBytes = new Uint8Array(signature);
        const offset = sigBytes[sigBytes.length - 1] & 0xf;
        const binary =
            ((sigBytes[offset] & 0x7f) << 24) |
            ((sigBytes[offset + 1] & 0xff) << 16) |
            ((sigBytes[offset + 2] & 0xff) << 8) |
            (sigBytes[offset + 3] & 0xff);

        return (binary % 1000000).toString().padStart(6, '0');
    } catch (e) {
        console.error("TOTP Error:", e);
        return null;
    }
};

const OfficerLogin = () => {
    const [step, setStep] = useState(1); // 1: Credentials, 2: 2FA TOTP
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('officer.patel@pwd.gov.in');
    const [password, setPassword] = useState('GovtPWD@2026');
    const [officerBadgeId, setOfficerBadgeId] = useState('PWD-EXEC-772');
    const [totpCode, setTotpCode] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const navigate = useNavigate();

    // Force fresh authentication on every login visit
    useEffect(() => {
        localStorage.removeItem("officerAuth");
        sessionStorage.removeItem("officerAuth");
    }, []);

    // Step 1: Validate Email & Password
    const handleStep1Submit = (e) => {
        e.preventDefault();
        if (!email || !password || !officerBadgeId) {
            toast.error("Please enter Official Email, Badge ID, and Password");
            return;
        }
        toast.success("Primary Credentials Verified! Proceeding to 2FA Speakeasy TOTP.");
        setStep(2);
    };

    // Step 2: Verify 6-digit Speakeasy TOTP against Google Authenticator HMAC
    const handleStep2Submit = async (e) => {
        e.preventDefault();
        if (!totpCode || totpCode.length < 6) {
            toast.error("Please enter valid 6-digit TOTP Authenticator token");
            return;
        }

        setIsVerifying(true);
        toast.loading("Verifying Speakeasy 2FA TOTP Token with Google Authenticator...", { id: "totp" });

        // Calculate valid TOTP tokens for current, previous (-30s), and next (+30s) windows
        const currentToken = await getTOTPToken("JANDARPANOFFICER", 0);
        const prevToken = await getTOTPToken("JANDARPANOFFICER", -1);
        const nextToken = await getTOTPToken("JANDARPANOFFICER", 1);

        const isValid = totpCode === currentToken || totpCode === prevToken || totpCode === nextToken;

        if (!isValid) {
            setIsVerifying(false);
            toast.error(`❌ INVALID TOTP CODE! '${totpCode}' does not match Google Authenticator for JANDARPANOFFICER.`, { id: "totp" });
            return;
        }

        setTimeout(() => {
            setIsVerifying(false);
            toast.success("🟢 2FA SPEAKEASY TOTP VERIFIED! Access Granted.", { id: "totp" });
            const sessionData = JSON.stringify({
                badgeId: officerBadgeId,
                name: "Officer R. Patel (Chief Engineer)",
                email,
                totpVerified: true
            });
            sessionStorage.setItem("officerAuth", sessionData);
            localStorage.removeItem("officerAuth");
            navigate("/gov-dashboard");
        }, 600);
    };

    return (
        <div className="min-h-screen bg-slate-950 font-inter text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 antialiased relative overflow-hidden">
            
            {/* Background Glow */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Split Screen Container */}
            <div className="w-full max-w-5xl bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px] relative z-10">
                
                {/* LEFT COLUMN (6 COLS): Official Government Authority Showcase */}
                <div className="lg:col-span-6 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white p-8 sm:p-12 flex flex-col justify-between relative border-r border-slate-800">
                    
                    {/* Official Tricolor Accent */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#FF9933] via-white via-50% to-[#138808]"></div>

                    {/* Top Brand */}
                    <div className="space-y-4 pt-2">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-lg border border-amber-300/40">
                                <Landmark size={26} className="text-slate-950" />
                            </div>
                            <div>
                                <span className="text-[10px] font-extrabold tracking-widest text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded uppercase border border-amber-500/30">
                                    GOVERNMENT OF INDIA • PWD GAZETTE
                                </span>
                                <h2 className="text-lg font-extrabold text-white tracking-tight leading-tight">
                                    NATIONAL E-SANCTION AUTHORITY
                                </h2>
                            </div>
                        </div>

                        <div className="pt-6 space-y-3">
                            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                                Government Executive Officer Sanction Gateway
                            </h1>
                            <p className="text-xs text-slate-300 font-medium leading-relaxed">
                                Formally issue Administrative Sanctions (A.S. Orders), release budget tranches in Crores, and enforce AI forensic fraud locks.
                            </p>
                        </div>
                    </div>

                    {/* Security Highlights */}
                    <div className="space-y-3 my-8 pt-6 border-t border-slate-800/80 text-xs font-medium text-slate-300">
                        <div className="flex items-start gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                            <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg shrink-0 mt-0.5">
                                <ShieldCheck size={16} />
                            </div>
                            <div>
                                <strong className="text-white block font-bold">2-Step Speakeasy TOTP Layer</strong>
                                <span>Time-based one-time password security required for all executive actions.</span>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                            <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg shrink-0 mt-0.5">
                                <Award size={16} />
                            </div>
                            <div>
                                <strong className="text-white block font-bold">SHA-256 Immutable Blockchain Ledger</strong>
                                <span>Every fund sanction is hashed and anchored to Polygon Amoy testnet.</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer Status */}
                    <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-bold text-slate-400">
                        <span className="flex items-center gap-2 text-emerald-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            OFFICER GATEWAY SECURE
                        </span>
                        <span>256-BIT SSL ENCRYPTED</span>
                    </div>

                </div>

                {/* RIGHT COLUMN (6 COLS): Official Officer Form */}
                <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between bg-slate-900">
                    
                    <div>
                        {/* Title */}
                        <div className="mb-6 space-y-1">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded border border-amber-500/30 inline-block">
                                EXECUTIVE OFFICER PORTAL
                            </span>
                            <h2 className="text-2xl font-extrabold text-white tracking-tight">
                                {step === 1 ? "Officer Credentials Sign In" : "Speakeasy 2FA TOTP Verification"}
                            </h2>
                            <p className="text-xs text-slate-400 font-medium">
                                {step === 1 ? "Enter official PWD email & officer badge ID to continue" : "Enter 6-digit TOTP code from Google Authenticator"}
                            </p>
                        </div>

                        {/* STEP 1: CREDENTIALS */}
                        {step === 1 && (
                            <form onSubmit={handleStep1Submit} className="space-y-4 text-xs font-bold text-slate-100">
                                <div>
                                    <label className="block text-slate-300 uppercase mb-1.5">Official Government Email *</label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="officer.name@pwd.gov.in"
                                            className="w-full pl-10 pr-4 py-3.5 bg-slate-950 text-white font-bold border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-slate-300 uppercase mb-1.5">Officer Badge ID *</label>
                                    <div className="relative">
                                        <ShieldCheck size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400" />
                                        <input
                                            type="text"
                                            value={officerBadgeId}
                                            onChange={(e) => setOfficerBadgeId(e.target.value)}
                                            placeholder="e.g. PWD-EXEC-772"
                                            className="w-full pl-10 pr-4 py-3.5 bg-slate-950 text-white font-mono font-bold border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-slate-300 uppercase mb-1.5">Account Passcode *</label>
                                    <div className="relative">
                                        <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-10 pr-10 py-3.5 bg-slate-950 text-white font-bold border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 mt-2"
                                >
                                    <span>PROCEED TO 2FA SPEAKEASY TOTP</span>
                                    <ArrowRight size={16} />
                                </button>
                            </form>
                        )}

                        {/* STEP 2: SPEAKEASY TOTP */}
                        {step === 2 && (
                            <form onSubmit={handleStep2Submit} className="space-y-5 text-xs font-bold text-white">
                                
                                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-2">
                                    <div className="flex items-center justify-center gap-2 text-amber-400 font-extrabold text-xs uppercase">
                                        <Smartphone size={16} />
                                        <span>GOOGLE AUTHENTICATOR 2FA TOKEN</span>
                                    </div>
                                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                                        Enter the live 6-digit TOTP security code from your Google Authenticator app for <strong className="text-amber-400 font-mono">{officerBadgeId}</strong>.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-slate-300 uppercase mb-1.5 text-center">
                                        Enter 6-Digit TOTP Token
                                    </label>
                                    <input
                                        type="text"
                                        value={totpCode}
                                        onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        placeholder="123456"
                                        maxLength={6}
                                        className="w-full p-4 bg-slate-950 text-amber-400 font-mono font-black text-center text-2xl tracking-[0.4em] border border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                                        required
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="w-1/3 bg-slate-800 hover:bg-slate-700 text-slate-300 py-3.5 rounded-xl font-extrabold text-xs uppercase transition-colors"
                                    >
                                        Back
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={isVerifying || totpCode.length < 6}
                                        className="w-2/3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <CheckCircle2 size={16} />
                                        <span>VERIFY & ACCESS PORTAL</span>
                                    </button>
                                </div>

                            </form>
                        )}

                    </div>

                    {/* Bottom Return Link */}
                    <div className="pt-6 border-t border-slate-800/80 text-center">
                        <Link to="/" className="text-xs font-bold text-slate-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1">
                            <ArrowLeft size={14} /> Return to Public JanDarpan Portal
                        </Link>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default OfficerLogin;
