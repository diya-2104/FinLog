import React from "react";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = ({ avatarLetter }) => {
    const navigate = useNavigate();
        const [darkMode, setDarkMode] = useState(() => {
            return localStorage.getItem("theme") === "dark";
        });

        useEffect(() => {
            const containers = document.querySelectorAll('.inner-container');
            if (darkMode) {
                document.body.classList.add("dark-mode");
                containers.forEach(container => container.classList.add("dark-mode"));
                localStorage.setItem("theme", "dark");
            } else {
                document.body.classList.remove("dark-mode");
                containers.forEach(container => container.classList.remove("dark-mode"));
                localStorage.setItem("theme", "light");
            }
        }, [darkMode]);

    return (
        <>
            <header className="navbar-header">
                <div className="navbar-logo">
                    <i className="fas fa-chart-line"> </i>
                    <span>FinLog</span>
                </div>
                <div className="navbar-actions">
                    {/* Toggle Button */}
                    <button
                        className="theme-toggle-btn"
                        onClick={() => setDarkMode(!darkMode)}
                    >
                        {darkMode ? "🌙" : "☀️"}
                    </button>
                    <div className="navbar-avatar" title="View Profile" onClick={() => navigate("/profile")} style={{ cursor: "pointer" }}>
                        {avatarLetter}
                    </div>
                </div>
            </header>

            <nav className="navbar-tabs">
                <NavLink to="/income" className={({ isActive }) => isActive ? "navbar-tab navbar-active-tab" : "navbar-tab"}>Income</NavLink>
                <NavLink to="/expense" className={({ isActive }) => isActive ? "navbar-tab navbar-active-tab" : "navbar-tab"}>Expense</NavLink>
                <NavLink to="/category" className={({ isActive }) => isActive ? "navbar-tab navbar-active-tab" : "navbar-tab"}>Category</NavLink>
                <NavLink to="/account" className={({ isActive }) => isActive ? "navbar-tab navbar-active-tab" : "navbar-tab"}>Account</NavLink>
                <NavLink to="/transaction" className={({ isActive }) => isActive ? "navbar-tab navbar-active-tab" : "navbar-tab"}>Transaction</NavLink>
                <NavLink to="/report" className={({ isActive }) => isActive ? "navbar-tab navbar-active-tab" : "navbar-tab"}>Reports</NavLink>
            </nav>
        </>
    );
};

export default Navbar;