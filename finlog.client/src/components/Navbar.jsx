import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = ({ avatarLetter }) => {
    const navigate = useNavigate();

    return (
        <>
            <header className="navbar-header">
                <div className="navbar-logo">
                    <i className="fas fa-chart-line"></i>
                    <span>FinTrack</span>
                </div>
                <div className="navbar-actions">
                    <button className="navbar-icon-btn" title="Notifications">
                        <svg className="navbar-notification-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22c1.1 0 2-.9 2-2H10c0 1.1.9 2 2 2z"></path>
                            <path d="M18 16v-5c0-3.31-2.69-6-6-6s-6 2.69-6 6v5l-2 2v1h16v-1l-2-2z"></path>
                        </svg>
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