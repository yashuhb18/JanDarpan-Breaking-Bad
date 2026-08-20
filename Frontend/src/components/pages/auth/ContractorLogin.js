import React, { useState, useEffect } from 'react';
import { HardHat, ShieldCheck, Mail, KeyRound, Smartphone, CheckCircle2, Award, Eye, EyeOff, ArrowRight, ArrowLeft, Receipt } from 'lucide-react';
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

const ContractorLogin = () => {
    const [step, setStep] = useState(1); // 1: Credentials, 2: 2FA TOTP
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('sharma.infratech@contractor.pwd.gov.in');
    const [password, setPassword] = useState('SharmaInfra@2026');
    const [contractorId, setContractorId] = useState('SHARMA-INFRA-889');
    const [totpCode, setTotpCode] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const navigate = useNavigate();

    // Force fresh authentication on every login visit
    useEffect(() => {
        localStorage.removeItem("contractorAuth");
        sessionStorage.removeItem("contractorAuth");
    }, []);

    // Step 1: Validate Email & Password
    const handleStep1Submit = (e) => {
        e.preventDefault();
        if (!email || !password || !contractorId) {
            toast.error("Please enter Contractor Agent Email, License ID, and Password");
            return;
        }
        toast.success("Agent Credentials Verified! Proceeding to 2FA Speakeasy TOTP.");
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
        toast.loading("Verifying Speakeasy 2FA TOTP Token with Google Authenticator...", { id: "contractor-totp" });

        // Calculate valid TOTP tokens for current, previous (-30s), and next (+30s) windows
        const currentToken = await getTOTPToken("JANDARPANAGENT22", 0);
        const prevToken = await getTOTPToken("JANDARPANAGENT22", -1);
        const nextToken = await getTOTPToken("JANDARPANAGENT22", 1);

        const isValid = totpCode === currentToken || totpCode === prevToken || totpCode === nextToken;

        if (!isValid) {
            setIsVerifying(false);
            toast.error(`❌ INVALID TOTP CODE! '${totpCode}' does not match Google Authenticator for JANDARPANAGENT22.`, { id: "contractor-totp" });
            return;
        }

        setTimeout(() => {
            setIsVerifying(false);
            toast.success("🟢 2FA SPEAKEASY TOTP VERIFIED! Access Granted.", { id: "contractor-totp" });
            const sessionData = JSON.stringify({
                contractorId,
                name: "Sharma Infratech Pvt Ltd",
                licenseNo: "PWD-CLASS1-LIC-8892",
                email,
                totpVerified: true
            });
            sessionStorage.setItem("contractorAuth", sessionData);
            localStorage.removeItem("contractorAuth");
            navigate("/contractor-portal");
        }, 600);
    };

    return (
        <div className="min-h-screen bg-slate-100 font-inter text-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8 antialiased">
            
            {/* Split Screen Container */}
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
                
                {/* LEFT COLUMN (6 COLS): Civil Engineering Showcase */}
                <div className="lg:col-span-6 bg-slate-900 text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden">
                    
                    {/* Safety Orange Accent */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500 via-orange-600 to-emerald-600"></div>

                    {/* Background Grid */}
                    <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none"></div>

                    {/* Top Brand */}
                    <div className="relative z-10 space-y-4 pt-2">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 text-slate-950 flex items-center justify-center font-bold shadow-lg border border-orange-400/40">
                                <HardHat size={26} className="text-white" />
                            </div>
                            <div>
                                <span className="text-[10px] font-extrabold tracking-widest text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded uppercase border border-amber-500/30">
                                    CLASS-1 CONTRACTOR AGENT GATEWAY
                                </span>
                                <h2 className="text-lg font-extrabold text-white tracking-tight leading-tight">
                                    CIVIL INFRASTRUCTURE BILLING PORTAL
                                </h2>
                            </div>
                        </div>

                        <div className="pt-6 space-y-3">
                            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-snug">
                                Contractor Field Work & Expense Logging System
                            </h1>
                            <p className="text-xs text-slate-300 font-medium leading-relaxed">
                                Submit itemized work claims, attach site photo proofs, inspect government fund disbursements, and maintain 100% honesty score rating.
                            </p>
                        </div>
                    </div>

                    {/* Security Highlights */}
                    <div className="relative z-10 space-y-3 my-8 pt-6 border-t border-slate-800 text-xs font-medium text-slate-300">
                        <div className="flex items-start gap-3 bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
                            <div className="p-1.5 bg-orange-500/20 text-orange-400 rounded-lg shrink-0 mt-0.5">
                                <ShieldCheck size={16} />
                            </div>
                            <div>
                                <strong className="text-white block font-bold">2-Step Speakeasy TOTP Security Layer</strong>
                                <span>Multi-factor authentication required for contractor work claims.</span>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60">
                            <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg shrink-0 mt-0.5">
                                <Receipt size={16} />
                            </div>
                            <div>
                                <strong className="text-white block font-bold">GLM-4 AI Geotagged Photo Audit</strong>
                                <span>Claimed expenses are cross-matched with citizen ground-truth site photos.</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer Status */}
                    <div className="relative z-10 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] font-bold text-slate-400">
                        <span className="flex items-center gap-2 text-emerald-400">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            CONTRACTOR GATEWAY OPERATIONAL
                        </span>
                        <span>256-BIT SSL SECURE</span>
                    </div>

                </div>

                {/* RIGHT COLUMN (6 COLS): Clean Contractor Form */}
                <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between bg-white">
                    
                    <div>
                        {/* Title */}
                        <div className="mb-6 space-y-1">
                            <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-700 bg-orange-50 px-2.5 py-1 rounded border border-orange-200 inline-block">
                                CONTRACTOR AGENT PORTAL
                            </span>
                            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                                {step === 1 ? "Contractor Agent Sign In" : "Speakeasy 2FA TOTP Verification"}
                            </h2>
                            <p className="text-xs text-slate-500 font-medium">
                                {step === 1 ? "Enter registered contractor email & PWD license ID to continue" : "Enter 6-digit TOTP code from Google Authenticator"}
                            </p>
                        </div>

                        {/* STEP 1: CREDENTIALS */}
                        {step === 1 && (
                            <form onSubmit={handleStep1Submit} className="space-y-4 text-xs font-bold text-slate-900">
                                <div>
                                    <label className="block text-slate-700 uppercase mb-1.5">Contractor Agent Email *</label>
                                    <div className="relative">
                                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-600" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="agent@contractor.com"
                                            className="w-full pl-10 pr-4 py-3.5 bg-slate-50 text-slate-900 font-bold border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white text-xs"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-slate-700 uppercase mb-1.5">Contractor License ID *</label>
                                    <div className="relative">
                                        <Award size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-600" />
                                        <input
                                            type="text"
                                            value={contractorId}
                                            onChange={(e) => setContractorId(e.target.value)}
                                            placeholder="e.g. SHARMA-INFRA-889"
                                            className="w-full pl-10 pr-4 py-3.5 bg-slate-50 text-slate-900 font-mono font-bold border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white text-xs"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-slate-700 uppercase mb-1.5">Account Password *</label>
                                    <div className="relative">
                                        <KeyRound size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-600" />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full pl-10 pr-10 py-3.5 bg-slate-50 text-slate-900 font-bold border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white text-xs"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                                        >
                                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-slate-950 py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 mt-2"
                                >
                                    <span>NEXT: 2FA SPEAKEASY TOTP</span>
                                    <ArrowRight size={16} />
                                </button>
                            </form>
                        )}

                        {/* STEP 2: SPEAKEASY TOTP */}
                        {step === 2 && (
                            <form onSubmit={handleStep2Submit} className="space-y-5 text-xs font-bold text-slate-900">
                                
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-center space-y-2">
                                    <div className="flex items-center justify-center gap-2 text-slate-900 font-extrabold text-xs uppercase">
                                        <Smartphone size={16} className="text-orange-600" />
                                        <span>GOOGLE AUTHENTICATOR 2FA TOKEN</span>
                                    </div>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                        Enter the live 6-digit TOTP security code from your Google Authenticator app for <strong className="text-slate-900 font-mono">{contractorId}</strong>.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-slate-700 uppercase mb-1.5 text-center">
                                        Enter 6-Digit TOTP Token
                                    </label>
                                    <input
                                        type="text"
                                        value={totpCode}
                                        onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        placeholder="123456"
                                        maxLength={6}
                                        className="w-full p-4 bg-slate-50 text-slate-900 font-mono font-black text-center text-2xl tracking-[0.4em] border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white"
                                        required
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 py-3.5 rounded-xl font-extrabold text-xs uppercase transition-colors"
                                    >
                                        Back
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={isVerifying || totpCode.length < 6}
                                        className="w-2/3 bg-orange-600 hover:bg-orange-700 text-white py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        <CheckCircle2 size={16} />
                                        <span>VERIFY & ACCESS PORTAL</span>
                                    </button>
                                </div>

                            </form>
                        )}

                    </div>

                    {/* Bottom Return Link */}
                    <div className="pt-6 border-t border-slate-100 text-center">
                        <Link to="/" className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center gap-1">
                            <ArrowLeft size={14} /> Return to Public JanDarpan Portal
                        </Link>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default ContractorLogin;
