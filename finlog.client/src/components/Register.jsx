import React, { useState } from "react";
import api from "../api/api";
import "../styles/Register.css";

const Register = ({ isOpen, onClose, onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        fname: "",
        lname: "",
        email: "",
        password: ""
    });

    const togglePassword = () => {
        const passwordInput = document.getElementById("reg-password");
        const eyeIcon = document.getElementById("reg-eye-icon");

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
        console.log("Form submission triggered");

        try {
            const payload = {
                fname: formData.fname,
                lname: formData.lname,
                email: formData.email,
                password: formData.password
            };

            console.log("Payload:", payload);

            const response = await api.post("/api/register", payload);


            console.log("Response:", response);
            alert(response.data.message || "Registration successful");
            onClose();
        } catch (error) {
            if (error.response) {
                console.error("Server responded with error:", error.response.status, error.response.data);
                alert(error.response.data.message || "Registration failed.");
            } else if (error.request) {
                console.error("No response received:", error.request);
                alert("No response from server. Check backend URL and port.");
            } else {
                console.error("Error setting up request:", error.message);
                alert("Request setup error: " + error.message);
            }
        }

    };

    if (!isOpen) return null;

    return (
        <div className="login-overlay" onClick={onClose}>
            <div className="login-modal" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>
                    &times;
                </button>

                <div className="login-icon">
                    <i className="fas fa-user-plus"></i>
                </div>

                <h2>Create Account</h2>
                <p>Please fill in the details to register</p>

                <form onSubmit={handleSubmit}>
                    {/* First Name */}
                    <label htmlFor="fname">First Name</label>
                    <div className="input-wrapper">
                        <i className="fas fa-user icon"></i>
                        <input
                            type="text"
                            id="fname"
                            placeholder="John"
                            className="input-highlight"
                            value={formData.fname}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Last Name */}
                    <label htmlFor="lname">Last Name</label>
                    <div className="input-wrapper">
                        <i className="fas fa-user icon"></i>
                        <input
                            type="text"
                            id="lname"
                            placeholder="Doe"
                            className="input-highlight"
                            value={formData.lname}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Email */}
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

                    {/* Password */}
                    <label htmlFor="reg-password">Password</label>
                    <div className="input-wrapper">
                        <i className="fas fa-lock icon"></i>
                        <input
                            type="password"
                            id="reg-password"
                            placeholder="��������"
                            className="input-highlight"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                        <div className="eye-icon" onClick={togglePassword}>
                            <i id="reg-eye-icon" className="fas fa-eye-slash"></i>
                        </div>
                    </div>

                    <button type="submit" className="btn-signin">
                        Sign Up
                    </button>
                </form>

                <p className="signup-text">
                    Already have an account?{" "}
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            onClose(); // close Register
                            if (typeof onSwitchToLogin === "function") {
                                onSwitchToLogin(); // open Login
                            }
                        }}
                    >
                        Sign In
                    </a>

                </p>

            </div>
        </div>
    );
};

export default Register;