import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Navbar from "./Navbar";
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
                <Navbar avatarLetter={avatarLetter} />

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
                    � 2025 FinanceTracker. All rights reserved.
                </footer>
            </div>
        </div>
    );
};

export default Transaction;
