import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/Expense.css";

const Expense = () => {
    const [avatarLetter, setAvatarLetter] = useState("");

    useEffect(() => {
        // Reset scroll position
        const container = document.querySelector(".expense-page");
        if (container) container.scrollLeft = 0;

        // Get user from localStorage
        const userData = localStorage.getItem("user");
        if (userData) {
            const user = JSON.parse(userData);
            if (user.fname && user.fname.length > 0) {
                setAvatarLetter(user.fname[0].toUpperCase());
            } else if (user.email && user.email.length > 0) {
                setAvatarLetter(user.email[0].toUpperCase());
            }
        }
    }, []);

    return (
        <div className="expense-page">
            <div className="inner-container">
                {/* Header */}
                <header className="header">
                    <div className="logo">
                        <i className="fas fa-chart-line"></i>
                        <span>FinTrack</span>
                    </div>
                    <div className="header-actions">
                        <button className="icon-btn" title="Notifications">
                            <svg
                                className="notification-icon"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M12 22c1.1 0 2-.9 2-2H10c0 1.1.9 2 2 2z"></path>
                                <path d="M18 16v-5c0-3.31-2.69-6-6-6s-6 2.69-6 6v5l-2 2v1h16v-1l-2-2z"></path>
                            </svg>
                        </button>

                        <div className="avatar">{avatarLetter}</div>
                    </div>
                </header>

                {/* Tabs */}
                <nav className="tabs">
                    <NavLink to="/income" className={({ isActive }) => isActive ? "tab active-tab" : "tab"}>
                        Income
                    </NavLink>
                    <NavLink to="/expense" className={({ isActive }) => isActive ? "tab active-tab" : "tab"}>
                        Expense
                    </NavLink>
                    <NavLink to="/category" className={({ isActive }) => isActive ? "tab active-tab" : "tab"}>
                        Category
                    </NavLink>
                    <NavLink to="#" className="tab">Transactions</NavLink>
                    <NavLink to="#" className="tab">Reports</NavLink>
                </nav>

                {/* Cards */}
                <div className="cards">
                    <div className="finance-card">
                        <p>Total Expenses</p>
                        <h3>2,750</h3>
                    </div>
                    <div className="finance-card">
                        <p>Monthly Bills</p>
                        <h3>1,800</h3>
                    </div>
                    <div className="finance-card">
                        <p>Food & Dining</p>
                        <h3>950</h3>
                    </div>
                </div>

                {/* Recent Expense Table */}
                <div className="recent-expense">
                    <div className="recent-header">
                        <h2>Recent Expenses</h2>
                        <button className="add-btn">+ Add Expense</button>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Category</th>
                                <th>Amount</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Sep 28, 2025</td>
                                <td>Groceries</td>
                                <td className="amount">-$250.00</td>
                                <td>
                                    <button className="update-btn" title="Update">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5h2m-1-1v2m0 14a9 9 0 110-18 9 9 0 010 18z" />
                                        </svg>
                                    </button>
                                    <button className="delete-btn" title="Delete">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>Sep 22, 2025</td>
                                <td>Utilities</td>
                                <td className="amount">-$120.00</td>
                                <td>
                                    <button className="update-btn" title="Update">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5h2m-1-1v2m0 14a9 9 0 110-18 9 9 0 010 18z" />
                                        </svg>
                                    </button>
                                    <button className="delete-btn" title="Delete">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>Sep 18, 2025</td>
                                <td>Transport</td>
                                <td className="amount">-$80.00</td>
                                <td>
                                    <button className="update-btn" title="Update">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5h2m-1-1v2m0 14a9 9 0 110-18 9 9 0 010 18z" />
                                        </svg>
                                    </button>
                                    <button className="delete-btn" title="Delete">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <footer className="footer">
                    © 2025 FinanceTracker. All rights reserved.
                </footer>
            </div>
        </div>
    );
};

export default Expense;
