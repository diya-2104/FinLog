import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../api/api";
import "../styles/Transaction.css";

const Transaction = () => {
    const [avatarLetter, setAvatarLetter] = useState("");
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [isLightMode, setIsLightMode] = useState(false);
    const navigate = useNavigate();

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Load user and transactions
    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            const user = JSON.parse(userData);
            const uid = user.uid;
            setAvatarLetter(user.fname ? user.fname[0].toUpperCase() : user.email[0].toUpperCase());

            // Load transactions if UID exists
            if (uid) {
                loadTransactions(uid);
            }
        }
    }, []);

    // Load transactions from API
    const loadTransactions = async (uid) => {
        try {
            const res = await api.get(`/api/Transactions/user/${uid}`);
            const data = res.data || [];
            setTransactions(data);
            setFilteredTransactions(data);
        } catch (err) {
            console.error("Error fetching transactions:", err);
        }
    };

    // Live search/filter by category or account
    useEffect(() => {
        if (!searchText.trim()) {
            setFilteredTransactions(transactions);
            return;
        }
        const filtered = transactions.filter(t =>
            ((t.cname || "").toLowerCase().includes(searchText.toLowerCase())) ||
            ((t.account_name || "").toLowerCase().includes(searchText.toLowerCase()))
        );
        setFilteredTransactions(filtered);
    }, [searchText, transactions]);

    // Toggle light/dark theme
    const toggleTheme = () => {
        const page = document.querySelector(".transaction-page");
        page.classList.toggle("light-mode");
        setIsLightMode(prev => !prev);
    };

    return (
        <div className="transaction-page">
            <div className="inner-container">
                {/* Header */}
                <header className="header">
                    <div className="logo"><i className="fas fa-chart-line"></i> FinLog</div>
                    <div className="header-actions">
                        <button className="theme-toggle-btn" onClick={toggleTheme}>
                            {isLightMode ? (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#facc15" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="5" />
                                    <line x1="12" y1="1" x2="12" y2="3" />
                                    <line x1="12" y1="21" x2="12" y2="23" />
                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                    <line x1="1" y1="12" x2="3" y2="12" />
                                    <line x1="21" y1="12" x2="23" y2="12" />
                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="#fef3c7" stroke="#fef3c7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                    <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
                                </svg>
                            )}
                        </button>
                        <div
                            className="avatar"
                            title="View Profile"
                            onClick={() => navigate("/profile")}
                            style={{ cursor: "pointer" }}
                        >
                            {avatarLetter}
                        </div>
                    </div>
                </header>

                {/* Tabs */}
                <nav className="tabs">
                    <NavLink to="/income" className={({ isActive }) => isActive ? "tab active-tab" : "tab"}>Income</NavLink>
                    <NavLink to="/expense" className={({ isActive }) => isActive ? "tab active-tab" : "tab"}>Expense</NavLink>
                    <NavLink to="/category" className={({ isActive }) => isActive ? "tab active-tab" : "tab"}>Category</NavLink>
                    <NavLink to="/account" className={({ isActive }) => isActive ? "tab active-tab" : "tab"}>Account</NavLink>
                    <NavLink to="/transaction" className={({ isActive }) => isActive ? "tab active-tab" : "tab"}>Transaction</NavLink>
                    <NavLink to="/report" className={({ isActive }) => isActive ? "tab active-tab" : "tab"}>Reports</NavLink>
                </nav>

                {/* Main Content */}
                <section className="main-content">
                    <div className="main-content-header">
                        <h2>Transactions</h2>
                    </div>

                    {/* Search Bar */}
                    <div className="filter-container">
                        <input
                            type="text"
                            placeholder="Search Category or Account..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="category-search-input"
                        />
                    </div>

                    {/* Transactions Table */}
                    <div className="transaction-table-container">
                        <table className="transaction-table">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Category</th>
                                    <th>Account</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.length === 0 ? (
                                    <tr><td colSpan="5">No transactions</td></tr>
                                ) : (
                                    filteredTransactions.map(t => (
                                        <tr key={t.tid}>
                                            <td>{t.ttype}</td>
                                            <td>{t.cname || "-"}</td>
                                            <td>{t.account_name || "-"}</td>
                                            <td className={`transaction-amount ${t.ttype}`}>{parseFloat(t.tamount).toFixed(2)}</td>
                                            <td>{formatDate(t.created_at)}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <footer className="footer">
                    © 2025 FinanceTracker. All rights reserved.
                </footer>
            </div>
        </div>
    );
};

export default Transaction;
