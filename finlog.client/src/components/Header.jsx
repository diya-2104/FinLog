import React, { useState } from "react";
import "../styles/Header.css";
import Login from "./Login"; // Adjust the path according to your folder structure
import Register from "./Register";

const Header = () => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegisterOpen, setIsRegisterOpen] = useState(false);

    return (
        <>
            <header className="header">
                <div className="container">
                    <div className="logo">
                        <i className="fas fa-chart-line"></i>
                        <h1>FinTrack</h1>
                    </div>
                    <div className="auth-buttons">
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
                    </div>
                </div>
            </header>

            {/* Render the modals only when open */}
            <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
            <Register isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
        </>
    );
};

export default Header;
