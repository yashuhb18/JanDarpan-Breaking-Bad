import { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(localStorage.getItem("accessToken") ? true : false);

    useEffect(() => {
        const handleStorageChange = () => {
            setIsUserLoggedIn(localStorage.getItem("accessToken") ? true : false);
        };

        window.addEventListener("storage", handleStorageChange);
        window.addEventListener("userLoginStateChange", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
            window.removeEventListener("userLoginStateChange", handleStorageChange);
        };
    }, []);

    return (
        <UserContext.Provider value={{ isUserLoggedIn, setIsUserLoggedIn }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;