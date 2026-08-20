import { useState, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { verifyToken } from "./auth";

const Unauthenticated = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            const authStatus = await verifyToken();
            setIsAuthenticated(authStatus);
        };
        checkAuth();
    }, []);

    // Show loading state while checking authentication
    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    return !isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default Unauthenticated;
