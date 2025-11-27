import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import api from "../api/api";
import "../styles/Account.css";

const Account = () => {
    const [avatarLetter, setAvatarLetter] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [accountName, setAccountName] = useState("");
    const [accountType, setAccountType] = useState("");
    const [balance, setBalance] = useState(0);
    const [accounts, setAccounts] = useState([]);
    const [userId, setUserId] = useState(null);

    const fetchAccounts = async (uid) => {
        try {
            const response = await api.get(`/api/account?uid=${uid}`);
            setAccounts(response.data);
        } catch (error) {
            console.error("Error fetching accounts:", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            const user = JSON.parse(userData);
            setUserId(user.uid);
            setAvatarLetter(user.fname ? user.fname[0].toUpperCase() : user.email[0].toUpperCase());
            if (user.uid) fetchAccounts(user.uid);
        }
    }, []);

    const handleSaveAccount = async () => {
        if (!accountName.trim() || !accountType.trim() || !userId) return;

        const newAccount = {
            account_name: accountName,
            account_type: accountType,
            balance: parseFloat(balance) || 0,
            uid: userId
        };

        try {
            await api.post("/api/account", newAccount);

            fetchAccounts(userId);

            setShowModal(false);
            setAccountName("");
            setAccountType("");
            setBalance(0);
        } catch (error) {
            console.error("Error adding account:", error.response?.data || error.message);
        }
    };

    const handleDeleteAccount = async (accountId) => {
        if (!window.confirm("Are you sure you want to delete this account?")) return;

        try {
            const response = await api.delete(`/api/account/${accountId}`);
            if (response.status === 200) {
                setAccounts(accounts.filter(acc => acc.account_id !== accountId));
            }
        } catch (error) {
            console.error("Error deleting account:", error.response?.data || error.message);
        }
    };

    return (
        <div className="account-page">
            <div className="inner-container">

                {/* ============ HEADER ============ */}
                <header className="header">
                    <div className="logo">
                        <i className="fas fa-chart-line"></i>FinTrack
                    </div>

                    <div className="header-actions">
                        <button className="icon-btn">
                            <svg className="notification-icon" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path d="M12 22c1.1 0 2-.9 2-2H10c0 1.1.9 2 2 2z" />
                                <path d="M18 16v-5c0-3.31-2.69-6-6-6s-6 2.69-6 6v5l-2 2v1h16v-1l-2-2z" />
                            </svg>
                        </button>

                        <div className="avatar" style={{ cursor: "pointer" }}>
                            {avatarLetter}
                        </div>
                    </div>
                </header>

                {/* ============ TABS ============ */}
                <nav className="tabs">
                    <NavLink to="/income" className={({ isActive }) => isActive ? "tab active-tab" : "tab"}>Income</NavLink>
                    <NavLink to="/expense" className={({ isActive }) => isActive ? "tab active-tab" : "tab"}>Expense</NavLink>
                    <NavLink to="/category" className={({ isActive }) => isActive ? "tab active-tab" : "tab"}>Category</NavLink>
                    <NavLink to="/account" className={({ isActive }) => isActive ? "tab active-tab" : "tab"}>Account</NavLink>
                    <NavLink to="/transaction" className={({ isActive }) => isActive ? "tab active-tab" : "tab"}>Transaction</NavLink>
                    <NavLink to="/report" className={({ isActive }) => isActive ? "tab active-tab" : "tab"}>Reports</NavLink>
                </nav>

                {/* ============ MAIN CONTENT ============ */}
                <section className="account-content">
                    <div className="main-content">
                        <div className="main-content-header">
                            <h2>Manage Accounts</h2>

                            <button className="add-account-btn" onClick={() => setShowModal(true)}>
                                + Add Account
                            </button>
                        </div>

                        <div className="account-row">
                            {accounts.length > 0 ? (
                                accounts.map((acc) => (
                                    <div key={acc.account_id} className="account-card">
                                        <div className="card-header">
                                            <div className="account-name">{acc.account_name}</div>
                                            <div className="account-type">{acc.account_type}</div>
                                        </div>

                                        <div className="account-balance">
                                            Balance: ?{acc.balance.toFixed(2)}
                                        </div>

                                        <div className="actions">
                                            <i className="fas fa-pencil-alt"></i>
                                            <i
                                                className="fas fa-trash-alt"
                                                onClick={() => handleDeleteAccount(acc.account_id)}
                                            ></i>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No accounts added yet.</p>
                            )}
                        </div>
                    </div>
                </section>

                {/* ============ MODAL ============ */}
                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h3>Add New Account</h3>

                            <input
                                type="text"
                                placeholder="Account Name"
                                value={accountName}
                                onChange={(e) => setAccountName(e.target.value)}
                            />

                            <input
                                type="text"
                                placeholder="Account Type"
                                value={accountType}
                                onChange={(e) => setAccountType(e.target.value)}
                            />

                            <input
                                type="number"
                                placeholder="Initial Balance"
                                value={balance}
                                onChange={(e) => setBalance(e.target.value)}
                            />

                            <div className="modal-actions">
                                <button onClick={handleSaveAccount}>Save</button>
                                <button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ============ FOOTER ============ */}
                <footer className="footer">
                    © 2025 FinanceTracker. All rights reserved.
                </footer>

            </div>
        </div>
    );
};

export default Account;
