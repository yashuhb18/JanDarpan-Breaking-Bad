import { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { verifyToken } from "./auth";
import toast from "react-hot-toast";

const ProtectedRoutes = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            const authStatus = await verifyToken();
            if (!authStatus) {
                toast.error("Please login to access government schemes & details!", { id: "login-required" });
            }
            setIsAuthenticated(authStatus);
        };
        checkAuth();
    }, []);

    // Show loading state while checking authentication
    if (isAuthenticated === null) {
        return (
            <div className="min-h-[50vh] flex items-center justify-center bg-swiss-white font-inter">
                <div className="flex items-center gap-4 border-4 border-swiss-black p-8 bg-swiss-muted">
                    <div className="w-6 h-6 border-4 border-swiss-black border-t-swiss-accent animate-spin"></div>
                    <span className="font-black text-sm uppercase tracking-widest text-swiss-black">VERIFYING ACCESS PERMISSIONS...</span>
                </div>
            </div>
        );
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
