import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import axios from "axios";

const Signup = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [nameError, setNameError] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsSubmitted(true);
        setNameError("");
        setError("");
        setEmailError("");
        setPasswordError("");

        if (!name || !email || !password) {
            if (!name) setNameError("Name is required");
            if (!email) setEmailError("Email is required");
            if (!password) setPasswordError("Password is required");
            return;
        }

        if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters long");
            return;
        }

        if (password !== confirmPassword) {
            setPasswordError("Passwords do not match");
            return;
        }

        const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
        try {
            const response = await axios.post(
                `${BACKEND_URL}/api/v1/users/signup`,
                { name, email, password }
            );
            console.log("Signup success:", response.data.success);
            navigate("/login");
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.message);
            } else {
                setError("An error occurred. Please try again.");
            }
        }
    };

    return (
        <div className="min-h-[calc(100svh-5rem)] bg-swiss-white font-inter flex items-center justify-center swiss-dots">
            <div className="w-full max-w-lg mx-4 py-12">
                {/* Top bar */}
                <div className="flex items-center justify-between border-b-4 border-swiss-black pb-4 mb-8">
                    <button
                        onClick={() => navigate("/")}
                        className="bg-swiss-black text-swiss-white p-3 hover:bg-swiss-accent transition-colors duration-150"
                        aria-label="Go back"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="text-right">
                        <span className="text-swiss-accent font-black text-xs uppercase tracking-widest block">02. REGISTER</span>
                        <span className="text-swiss-black font-black text-xs uppercase tracking-wider">NEW CITIZEN ACCOUNT</span>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-5xl md:text-7xl font-black text-swiss-black uppercase tracking-tighter leading-[0.9] mb-12 text-left">
                    SIGN<br /><span className="text-swiss-accent">UP.</span>
                </h1>

                {/* Form */}
                <form noValidate onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-swiss-black font-black text-xs uppercase tracking-widest mb-2">
                            FULL NAME *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            autoComplete="name"
                            autoFocus
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-transparent border-b-4 border-swiss-black py-3 text-swiss-black font-bold text-lg focus:border-swiss-accent outline-none transition-colors duration-150 placeholder:text-gray-400 placeholder:font-medium"
                            placeholder="Your full name"
                        />
                        {isSubmitted && nameError && (
                            <p className="text-swiss-accent font-bold text-xs uppercase tracking-wider mt-2">{nameError}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-swiss-black font-black text-xs uppercase tracking-widest mb-2">
                            EMAIL ADDRESS *
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            autoComplete="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-transparent border-b-4 border-swiss-black py-3 text-swiss-black font-bold text-lg focus:border-swiss-accent outline-none transition-colors duration-150 placeholder:text-gray-400 placeholder:font-medium"
                            placeholder="citizen@example.com"
                        />
                        {isSubmitted && emailError && (
                            <p className="text-swiss-accent font-bold text-xs uppercase tracking-wider mt-2">{emailError}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-swiss-black font-black text-xs uppercase tracking-widest mb-2">
                            PASSWORD *
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-transparent border-b-4 border-swiss-black py-3 text-swiss-black font-bold text-lg focus:border-swiss-accent outline-none transition-colors duration-150 placeholder:text-gray-400 placeholder:font-medium"
                            placeholder="••••••••"
                        />
                    </div>

                    <div>
                        <label className="block text-swiss-black font-black text-xs uppercase tracking-widest mb-2">
                            CONFIRM PASSWORD *
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            autoComplete="new-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full bg-transparent border-b-4 border-swiss-black py-3 text-swiss-black font-bold text-lg focus:border-swiss-accent outline-none transition-colors duration-150 placeholder:text-gray-400 placeholder:font-medium"
                            placeholder="••••••••"
                        />
                        {isSubmitted && passwordError && (
                            <p className="text-swiss-accent font-bold text-xs uppercase tracking-wider mt-2">{passwordError}</p>
                        )}
                    </div>

                    {error && (
                        <div className="bg-swiss-accent text-swiss-white p-4 border-2 border-swiss-black">
                            <p className="font-black text-xs uppercase tracking-widest">{error}</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-swiss-black text-swiss-white py-4 font-black uppercase text-sm tracking-widest border-2 border-swiss-black hover:bg-swiss-accent transition-colors duration-150 mt-8"
                    >
                        CREATE ACCOUNT →
                    </button>

                    <button
                        type="button"
                        className="w-full bg-swiss-white text-swiss-black py-4 font-black uppercase text-sm tracking-widest border-4 border-swiss-black hover:bg-swiss-muted transition-colors duration-150"
                    >
                        SIGN UP WITH GOOGLE
                    </button>
                </form>

                {/* Bottom link */}
                <div className="border-t-2 border-swiss-black mt-8 pt-6 flex items-center justify-between">
                    <span className="text-swiss-black font-bold text-sm uppercase tracking-wider">
                        Already have an account?
                    </span>
                    <Link
                        to="/login"
                        className="bg-swiss-accent text-swiss-white px-6 py-3 font-black uppercase text-xs tracking-widest hover:bg-swiss-black transition-colors duration-150"
                    >
                        SIGN IN
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
