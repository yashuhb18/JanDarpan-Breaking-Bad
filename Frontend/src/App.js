import React from "react";
import Home from "./components/pages/home/Home";
import AboutUs from "./components/pages/home/components/AboutUs";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/common/header/Header";
import Footer from "./components/common/footer/Footer";
import Login from "./components/pages/auth/Login";
import Signup from "./components/pages/auth/Signup";
import ContractorLogin from "./components/pages/auth/ContractorLogin";
import OfficerLogin from "./components/pages/auth/OfficerLogin";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import Unauthenticated from "./routes/Unauthenticated";
import UserProvider from "./context/UserContext";
import SchemeDetails from "./components/pages/schemeDetails/SchemeDetails";
import Schemes from "./components/pages/schemes/Schemes";
import Profile from "./components/pages/profile/Profile";
import Recommendations from "./components/pages/recommendations/Recommendations";
import ProjectMap from "./components/pages/projects/ProjectMap";
import CivicReporting from "./components/pages/reports/CivicReporting";
import GovDashboard from "./components/pages/govDashboard/GovDashboard";
import ContractorPortal from "./components/pages/contractor/ContractorPortal";
import HonestyLeaderboard from "./components/pages/leaderboard/HonestyLeaderboard";
import JanDarpanAssistant from "./components/common/aiChatbot/JanDarpanAssistant";
import DemoMode from "./components/common/demoMode/DemoMode";
import WhatsAppPushNotification from "./components/common/notifications/WhatsAppPushNotification";
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID || "666459438303-7g1qpjuv12m3q9c0pj8np1ugcuaj31cl.apps.googleusercontent.com";

function AppContent() {
    const location = useLocation();

    // Purge any stale permanent localStorage portal keys
    React.useEffect(() => {
        localStorage.removeItem("officerAuth");
        localStorage.removeItem("contractorAuth");
    }, []);

    // Standalone enterprise portals & logins (No Citizen Header/Footer)
    const isStandalonePortal = ['/contractor-portal', '/contractor-login', '/gov-dashboard', '/officer-login'].includes(location.pathname);

    return (
        <div className="App">
            <Toaster position="bottom-right" />
            <WhatsAppPushNotification />

            {/* Public Citizen Header - Hidden on Standalone Portals */}
            {!isStandalonePortal && (
                <div className="fixed z-40 w-full">
                    <Header />
                </div>
            )}

            {/* Content Container */}
            <div className={isStandalonePortal ? "" : "content-wrapper pt-[5rem]"}>
                <Routes>
                    {/* Public Citizen Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/honesty-leaderboard" element={<HonestyLeaderboard />} />

                    {/* Dedicated Standalone Enterprise Portal Routes (Direct Access via URL) */}
                    <Route path="/contractor-login" element={<ContractorLogin />} />
                    <Route path="/contractor-portal" element={<ContractorPortal />} />
                    <Route path="/officer-login" element={<OfficerLogin />} />
                    <Route path="/gov-dashboard" element={<GovDashboard />} />

                    {/* Citizen Unauthenticated Routes */}
                    <Route element={<Unauthenticated />}>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                    </Route>

                    {/* Protected Citizen Routes */}
                    <Route element={<ProtectedRoutes />}>
                        <Route path="/schemes" element={<Schemes />} />
                        <Route path="/scheme/:id" element={<SchemeDetails />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/recommendations" element={<Recommendations />} />
                        <Route path="/projects" element={<ProjectMap />} />
                        <Route path="/report-issue" element={<CivicReporting />} />
                    </Route>
                </Routes>
            </div>

            {/* Unified Floating AI & Voice Assistant Hub */}
            {!isStandalonePortal && <JanDarpanAssistant />}

            {/* 🎭 Demo Mode - Only on Citizen/User Interface */}
            {!isStandalonePortal && <DemoMode />}

            {/* Public Footer - Hidden on Standalone Portals */}
            {!isStandalonePortal && (
                <div>
                    <Footer />
                </div>
            )}
        </div>
    );
}

function App() {
    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <BrowserRouter>
                <UserProvider>
                    <AppContent />
                </UserProvider>
            </BrowserRouter>
        </GoogleOAuthProvider>
    );
}

export default App;
