import React, { useState, useEffect } from "react";
import "../styles/Header.css";
import Login from "./Login";
import Register from "./Register";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);
    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    // Load logged-in user from localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    // Extract first letter for avatar
    const avatarLetter =
        user?.fname
            ? user.fname.charAt(0).toUpperCase()
            : user?.email
                ? user.email.charAt(0).toUpperCase()
                : "";


    return (
        <>
            <header className="header">
                <div className="container">

                    {/* Logo Section */}
                    <div className="logo">
                        <i className="fas fa-chart-line"></i>
                        <h1>FinLog</h1>
                    </div>

                    {/* AUTH BUTTONS OR AVATAR */}
                    <div className="auth-buttons">
                        {user ? (
                            // ?? SHOW AVATAR AFTER LOGIN
                            <div
                                className="user-avatar"
                                onClick={() => navigate("/profile")}
                                title="Go to profile"
                            >
                                {avatarLetter}
                            </div>
                        ) : (
                            // ?? SHOW SIGN IN / SIGN UP BEFORE LOGIN
                            <>
                                <button
                                    className="btn-outline"
                                    onClick={() => setIsLoginOpen(true)}
                                >
                                    Sign In
                                </button>

                                <button
                                    className="btn-primary"
                                    onClick={() => setIsRegisterOpen(true)}
                                >
                                    Sign Up
                                </button>
                            </>
                        )}
                    </div>

                </div>
            </header>

            {/* LOGIN MODAL */}
            <Login
                isOpen={isLoginOpen}
                onClose={() => setIsLoginOpen(false)}
                afterLogin={() =>
                    setUser(JSON.parse(localStorage.getItem("user")))
                }
            />

            {/* REGISTER MODAL */}
            <Register
                isOpen={isRegisterOpen}
                onClose={() => setIsRegisterOpen(false)}
            />
        </>
    );
};

export default Header;
