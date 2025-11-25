import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../api/api";
import "../styles/Transaction.css";

const Transaction = () => {
    const [avatarLetter, setAvatarLetter] = useState("");
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [searchText, setSearchText] = useState("");
    const navigate = useNavigate();

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

    // Live search/filter
    useEffect(() => {
        if (!searchText.trim()) {
            setFilteredTransactions(transactions);
            return;
        }
        const filtered = transactions.filter(t =>
            (t.cname || "").toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredTransactions(filtered);
    }, [searchText, transactions]);

    return (
        <div className="transaction-page">
            <div className="inner-container">
                {/* Header */}
                <header className="header">
                    <div className="logo"><i className="fas fa-chart-line"></i> FinTrack</div>
                    <div className="header-actions">
                        <button className="icon-btn" title="Notifications">
                            <svg className="notification-icon" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22c1.1 0 2-.9 2-2H10c0 1.1.9 2 2 2z" />
                                <path d="M18 16v-5c0-3.31-2.69-6-6-6s-6 2.69-6 6v5l-2 2v1h16v-1l-2-2z" />
                            </svg>
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
                            placeholder="Search Category..."
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
                                    <th>Amount</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTransactions.length === 0 ? (
                                    <tr><td colSpan="4">No transactions</td></tr>
                                ) : (
                                    filteredTransactions.map(t => (
                                        <tr key={t.tid}>
                                            <td>{t.ttype}</td>
                                            <td>{t.cname || "-"}</td>
                                            <td className={`transaction-amount ${t.ttype}`}>{parseFloat(t.tamount).toFixed(2)}</td>
                                            <td>{new Date(t.created_at).toLocaleDateString()}</td>
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
