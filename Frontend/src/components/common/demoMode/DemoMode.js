import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Play, Pause, SkipForward, X, Presentation, ChevronRight, ChevronLeft } from 'lucide-react';
import './DemoMode.css';

/**
 * 🎭 Demo Mode — 5-Act Interactive Walkthrough for Hackathon Judges
 * 
 * Guides through the complete JanDarpan user journey:
 * ACT 1: Citizen Discovery (Home → Search → Scheme Details)
 * ACT 2: Government Officer (Sanction Project → Release Funds)
 * ACT 3: Contractor Portal (Submit Expense → Upload Photo)
 * ACT 4: AI Fraud Detection (Milestone Claim → AI Mismatch → Fund Freeze)
 * ACT 5: Citizen Audit (Project Map → Money Trail → Civic Report → Auto-PIL)
 */

const DEMO_STEPS = [
    // ACT 1: Citizen Discovery
    {
        act: 1,
        actTitle: "CITIZEN DISCOVERY",
        title: "Welcome to JanDarpan AI",
        description: "India's first AI-powered government scheme discovery platform with 4,290+ schemes across all states. Citizens can search by voice, text, or AI-powered natural language in 6 Indian languages.",
        route: "/",
        narration: "This is the JanDarpan homepage. Notice the multi-language support, hero carousel, and the AI chatbot floating on the bottom right."
    },
    {
        act: 1,
        actTitle: "CITIZEN DISCOVERY",
        title: "Smart AI Scheme Search Engine",
        description: "Citizens can type plain English sentences like 'I am a 45-year-old farmer in Karnataka looking for crop insurance' and our GLM-4 AI model automatically extracts the relevant filters — state, category, gender, income group.",
        route: "/schemes",
        narration: "The scheme explorer supports keyword search, AI conversational search, voice input, and advanced multi-parameter filtering."
    },
    // ACT 2: Government Officer
    {
        act: 2,
        actTitle: "GOVERNMENT OFFICER",
        title: "Official Project Sanction & Fund Release",
        description: "Government Executive Engineers can sanction infrastructure projects, set budgets in Crores, and release Tranche 1 funds. Every transaction is BLOCKCHAIN-HASHED for tamper-proof audit trail.",
        route: "/gov-dashboard",
        narration: "This is the Government Officer portal. Officers can sanction projects, release fund tranches, and review AI audit reports. Every action is recorded on an immutable blockchain hash chain."
    },
    // ACT 3: Contractor Portal
    {
        act: 3,
        actTitle: "CONTRACTOR PORTAL",
        title: "Agent Spending & Photo Proof Submission",
        description: "Contractors submit itemized expenses (Cement, Steel, Labor) with real invoice photos uploaded to Cloudinary. The system tracks every rupee against government-released tranches.",
        route: "/contractor-portal",
        narration: "Contractors log expenses with photo proof. The system builds a real-time spending ledger that citizens can verify against ground-truth site photos."
    },
    // ACT 4: AI Fraud Detection
    {
        act: 4,
        actTitle: "AI FRAUD DETECTION",
        title: "GLM-4 Forensic AI Audit Engine",
        description: "When a contractor submits a milestone claim, our GLM-4 AI model compares their photo against citizen-uploaded GPS-tagged site photos from the same location. If mismatch detected → AUTOMATIC FUND FREEZE.",
        route: "/contractor-portal",
        narration: "The AI Forensic Audit compares contractor claims against citizen ground-truth. Mismatches trigger automatic fund freeze, honesty score drop, and 7-day pre-litigation e-notice."
    },
    // ACT 5: Citizen Audit
    {
        act: 5,
        actTitle: "CITIZEN AUDIT & LEGAL",
        title: "Live Infrastructure Map & Money Trail",
        description: "Citizens can view all sanctioned projects on a GPS map, track every rupee from Government → Contractor → Ground Work, and see the AI fraud detection status with blockchain verification.",
        route: "/projects",
        narration: "The Project Map shows all infrastructure projects with real-time status. Click any project to see the complete 5-step Money Trail audit with blockchain hash verification."
    },
    {
        act: 5,
        actTitle: "CITIZEN AUDIT & LEGAL",
        title: "Geo-Tagged Civic Reporting & Auto-PIL",
        description: "Citizens upload GPS-tagged photos of substandard work. Reports with 50+ upvotes automatically trigger High Court PIL drafting and 7-Day Pre-Litigation Statutory e-Notices using our Legal-BERT NLP engine.",
        route: "/report-issue",
        narration: "The Legal-Tech escalation engine automatically generates High Court PIL petitions and statutory e-notices when community verification threshold is reached. This is the Sword of Damocles for corrupt contractors."
    },
    {
        act: 5,
        actTitle: "CITIZEN AUDIT & LEGAL",
        title: "Contractor Honesty Leaderboard",
        description: "AI-computed honesty scores for every contractor based on milestone verification, spending audits, and citizen feedback. Transparent ranking visible to all citizens and government officers.",
        route: "/honesty-leaderboard",
        narration: "The Honesty Leaderboard ranks contractors by their AI-verified integrity scores. Fund-frozen contractors are flagged red with their fraud evidence visible to all."
    }
];

const DemoMode = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isDemoActive, setIsDemoActive] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [autoAdvanceTimer, setAutoAdvanceTimer] = useState(null);

    const step = DEMO_STEPS[currentStep];
    const totalSteps = DEMO_STEPS.length;
    const progressPercent = ((currentStep + 1) / totalSteps) * 100;

    // Auto-advance timer (12 seconds per step)
    useEffect(() => {
        if (isDemoActive && !isPaused) {
            const timer = setTimeout(() => {
                if (currentStep < totalSteps - 1) {
                    goToStep(currentStep + 1);
                } else {
                    // Demo complete
                    setIsDemoActive(false);
                    setCurrentStep(0);
                }
            }, 12000);
            setAutoAdvanceTimer(timer);
            return () => clearTimeout(timer);
        }
    }, [isDemoActive, currentStep, isPaused]);

    // Navigate to step's route
    const goToStep = useCallback((stepIndex) => {
        if (stepIndex >= 0 && stepIndex < totalSteps) {
            setCurrentStep(stepIndex);
            const targetRoute = DEMO_STEPS[stepIndex].route;
            if (location.pathname !== targetRoute) {
                navigate(targetRoute);
            }
        }
    }, [navigate, location.pathname, totalSteps]);

    // Start demo
    const startDemo = () => {
        setIsDemoActive(true);
        setCurrentStep(0);
        setIsPaused(false);
        navigate(DEMO_STEPS[0].route);
    };

    // Stop demo
    const stopDemo = () => {
        setIsDemoActive(false);
        setCurrentStep(0);
        setIsPaused(false);
        if (autoAdvanceTimer) clearTimeout(autoAdvanceTimer);
    };

    // Next step
    const nextStep = () => {
        if (currentStep < totalSteps - 1) {
            goToStep(currentStep + 1);
        } else {
            stopDemo();
        }
    };

    // Previous step
    const prevStep = () => {
        if (currentStep > 0) {
            goToStep(currentStep - 1);
        }
    };

    // Toggle pause
    const togglePause = () => {
        setIsPaused(!isPaused);
        if (!isPaused && autoAdvanceTimer) {
            clearTimeout(autoAdvanceTimer);
        }
    };

    return (
        <>
            {/* Demo Mode Toggle Button — Always visible */}
            <button
                className={`demo-toggle-btn ${isDemoActive ? 'running' : ''}`}
                onClick={isDemoActive ? stopDemo : startDemo}
            >
                {isDemoActive ? (
                    <>
                        <X size={14} />
                        EXIT DEMO
                    </>
                ) : (
                    <>
                        <Presentation size={14} />
                        DEMO MODE
                    </>
                )}
            </button>

            {/* Demo Active Overlay */}
            {isDemoActive && (
                <>
                    {/* Semi-transparent backdrop */}
                    <div className="demo-backdrop" onClick={(e) => e.stopPropagation()} />

                    {/* Narration Panel — Fixed to bottom */}
                    <div className="demo-narration-panel">
                        {/* Progress Bar */}
                        <div className="demo-progress-container">
                            <div className="demo-progress-bar">
                                <div className="demo-progress-fill" style={{ width: `${progressPercent}%` }} />
                            </div>
                        </div>

                        <div className="demo-narration-inner">
                            {/* Act Badge */}
                            <div className="demo-act-badge">
                                <span className="act-num">{step.act}</span>
                                <span className="act-label">ACT</span>
                            </div>

                            {/* Narration Text */}
                            <div className="demo-narration-text">
                                <div className="step-title">
                                    {step.actTitle} — {step.title}
                                </div>
                                <div className="step-description">
                                    {step.narration}
                                </div>
                            </div>

                            {/* Step Dots */}
                            <div className="demo-step-dots">
                                {DEMO_STEPS.map((_, idx) => (
                                    <div
                                        key={idx}
                                        className={`demo-step-dot ${idx === currentStep ? 'active' : ''} ${idx < currentStep ? 'completed' : ''}`}
                                        onClick={() => goToStep(idx)}
                                        style={{ cursor: 'pointer' }}
                                        title={`Step ${idx + 1}: ${DEMO_STEPS[idx].title}`}
                                    />
                                ))}
                            </div>

                            {/* Controls */}
                            <div className="demo-controls">
                                <button className="demo-control-btn" onClick={prevStep} disabled={currentStep === 0}>
                                    <ChevronLeft size={14} />
                                </button>
                                <button className="demo-control-btn" onClick={togglePause}>
                                    {isPaused ? <Play size={14} /> : <Pause size={14} />}
                                </button>
                                <button className="demo-control-btn primary" onClick={nextStep}>
                                    {currentStep === totalSteps - 1 ? 'FINISH' : <><span>NEXT</span> <SkipForward size={14} /></>}
                                </button>
                                <button className="demo-control-btn exit" onClick={stopDemo}>
                                    <X size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default DemoMode;
