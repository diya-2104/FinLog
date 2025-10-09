import React, { useState } from "react";
import Register from "./Register";
import Login from "./Login";

const AuthModalManager = () => {
    const [showRegister, setShowRegister] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    return (
        <div>
            {/* Example buttons to test opening */}
            <button onClick={() => setShowRegister(true)}>Open Register</button>
            <button onClick={() => setShowLogin(true)}>Open Login</button>

            {/* Register Modal */}
            <Register
                isOpen={showRegister}
                onClose={() => setShowRegister(false)}
                onSwitchToLogin={() => {
                    setShowRegister(false);
                    setShowLogin(true);
                }}
            />

            {/* Login Modal */}
            <Login
                isOpen={showLogin}
                onClose={() => setShowLogin(false)}
                onSwitchToRegister={() => {
                    setShowLogin(false);
                    setShowRegister(true);
                }}
            />

        </div>
    );
};

export default AuthModalManager;
