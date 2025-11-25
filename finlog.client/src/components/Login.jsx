import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import "../styles/Login.css";

const Login = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const navigate = useNavigate();
    if (!isOpen) return null;

    const togglePassword = () => {
        const passwordInput = document.getElementById("password");
        const eyeIcon = document.getElementById("eye-icon");

        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            eyeIcon.classList.remove("fa-eye-slash");
            eyeIcon.classList.add("fa-eye");
        } else {
            passwordInput.type = "password";
            eyeIcon.classList.remove("fa-eye");
            eyeIcon.classList.add("fa-eye-slash");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Login form submission triggered");

        try {
            const payload = {
                email: formData.email,
                password: formData.password
            };

            console.log("Payload:", payload);

            const response = await api.post("/api/login", payload, { withCredentials: true });

            console.log("Response:", response);
            alert(response.data.message || "Login successful");

            // Store user info
            localStorage.setItem("user", JSON.stringify(response.data.user));
            localStorage.setItem("userId", response.data.user.uid);
            console.log("Saved userId:", response.data.user.uid);

            // Print welcome message with username in console
            if (response.data.user && response.data.user.fname) {
                alert(`Welcome, ${response.data.user.fname}!`);
            } else {
                alert("?Welcome, user!");
            }

            onClose();
            navigate("/income");
        } catch (error) {
            if (error.response) {
                console.error("Server responded with error:", error.response.status, error.response.data);
                alert(error.response.data.message || "Login failed.");
            } else if (error.request) {
                console.error("No response received:", error.request);
                alert("No response from server. Check backend URL and port.");
            } else {
                console.error("Error setting up request:", error.message);
                alert("Request setup error: " + error.message);
            }
        }
    };

    return (
        <div className="login-overlay" onClick={onClose}>
            <div
                className="login-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <button className="close-btn" onClick={onClose}>
                    &times;
                </button>

                <div className="login-icon">
                    <i className="fas fa-lock"></i>
                </div>

                <h2>Welcome Back</h2>
                <p>Please login to your account</p>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Email Address</label>
                    <div className="input-wrapper">
                        <i className="fas fa-envelope icon"></i>
                        <input
                            type="email"
                            id="email"
                            placeholder="you@example.com"
                            className="input-highlight"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <label htmlFor="password">Password</label>
                    <div className="input-wrapper">
                        <i className="fas fa-lock icon"></i>
                        <input
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            className="input-highlight"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <div className="eye-icon" onClick={togglePassword}>
                            <i id="eye-icon" className="fas fa-eye-slash"></i>
                        </div>
                    </div>

                    <div className="flex-row">
                        <label className="checkbox-label">
                            <input type="checkbox" />
                            Remember me
                        </label>
                        <a href="#" className="forgot-password">
                            Forgot password?
                        </a>
                    </div>

                    <button type="submit" className="btn-signin">
                        Sign In
                    </button>
                </form>
                <div className="divider">Or sign in with</div>

                {/* Social Buttons */}
                <div className="social-buttons">
                    <button className="social-btn google">
                        <i className="fab fa-google"></i>
                    </button>
                    <button className="social-btn facebook">
                        <i className="fab fa-facebook-f"></i>
                    </button>
                    <button className="social-btn twitter">
                        <i className="fab fa-twitter"></i>
                    </button>
                </div>

                {/* Signup Text */}
                <div className="signup-text">
                    Don't have an account? <a href="#">Sign up</a>
                </div>
            </div>
        </div>
    );
};

export default Login;
