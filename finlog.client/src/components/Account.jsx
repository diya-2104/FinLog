import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../api/api";
import "../styles/Account.css";

const Account = () => {
    const [avatarLetter, setAvatarLetter] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [loadingAccounts, setLoadingAccounts] = useState(true);
    const [formData, setFormData] = useState({ accountName: "", accountType: "", balance: 0 });
    const [userId, setUserId] = useState(null);
    const [isLightMode, setIsLightMode] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (!userData) return;

        const user = JSON.parse(userData);

        setUserId(user.uid);
        setAvatarLetter(user.fname ? user.fname[0].toUpperCase() : user.email[0].toUpperCase());

        if (user.uid) fetchAccounts(user.uid);
    }, []);

    const fetchAccounts = async (uid) => {
        setLoadingAccounts(true);
        try {
            const res = await api.get(`/api/account?uid=${uid}`);
            setAccounts(res.data || []);
        } catch (err) {
            console.error("Error fetching accounts:", err);
        } finally {
            setLoadingAccounts(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSaveAccount = async () => {
        const { accountName, accountType, balance } = formData;
        if (!accountName || !accountType || !userId) return alert("Fill all fields.");

        const payload = {
            account_name: accountName,
            account_type: accountType,
            balance: parseFloat(balance),
            uid: userId
        };

        try {
            if (isEditing && editId) {
                await api.put(`/api/account/${editId}`, payload);
                alert("Account updated successfully!");
            } else {
                await api.post("/api/account", payload);
                alert("Account added successfully!");
            }

            fetchAccounts(userId);
            closeModal();
        } catch (err) {
            console.error("Error saving account:", err.response?.data || err.message);
            alert("Failed to save account. Please try again.");
        }
    };

    const handleEdit = (acc) => {
        setIsEditing(true);
        setEditId(acc.account_id);
        setFormData({
            accountName: acc.account_name,
            accountType: acc.account_type,
            balance: acc.balance
        });
        setShowModal(true);
    };

    const handleDelete = async (accountId) => {
        if (!window.confirm("Are you sure you want to delete this account?")) return;

        try {
            await api.delete(`/api/account/${accountId}`);
            setAccounts(accounts.filter(a => a.account_id !== accountId));
            alert("Account deleted successfully!");
        } catch (err) {
            console.error("Error deleting account:", err.response?.data || err.message);
            alert("Failed to delete account. Please try again.");
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setEditId(null);
        setFormData({ accountName: "", accountType: "", balance: 0 });
    };

    const toggleTheme = () => {
        const page = document.querySelector(".account-page");
        page.classList.toggle("light-mode");
        setIsLightMode(prev => !prev);
    };

    return (
        <div className="account-page">
            <div className="inner-container">

                {/* HEADER */}
                <header className="header">
                    <div className="logo">
                        <i className="fas fa-chart-line"></i>FinLog
                    </div>

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

                        <div className="avatar" onClick={() => navigate("/profile")}>
                            {avatarLetter}
                        </div>
                    </div>
                </header>

                {/* TABS */}
                <nav className="tabs">
                    <NavLink to="/income" className={({ isActive }) => isActive ? "tab active-tab" : "tab"}>Income</NavLink>
                    <NavLink to="/expense" className={({ isActive }) => isActive ? "tab active-tab" : "tab"}>Expense</NavLink>
                    <NavLink to="/category" className={({ isActive }) => isActive ? "tab active-tab" : "tab"}>Category</NavLink>
                    <NavLink to="/account" className={({ isActive }) => isActive ? "tab active-tab" : "tab"}>Account</NavLink>
                    <NavLink to="/transaction" className={({ isActive }) => isActive ? "tab active-tab" : "tab"}>Transaction</NavLink>
                    <NavLink to="/report" className={({ isActive }) => isActive ? "tab active-tab" : "tab"}>Reports</NavLink>
                </nav>

                {/* MAIN TITLE + ADD ACCOUNT BUTTON */}
                <div className="account-content">
                    <div className="main-content-header">
                        <h2>Your Accounts</h2>

                        <button className="add-account-btn" onClick={() => setShowModal(true)}>
                            + Add Account
                        </button>
                    </div>
                </div>

                {/* ACCOUNTS GRID */}
                <div className="account-row">
                    {loadingAccounts ? (
                        <p>Loading accounts...</p>
                    ) : accounts.length === 0 ? (
                        <p>No accounts found.</p>
                    ) : (
                        accounts.map(acc => (
                            <div key={acc.account_id} className="account-card">
                                <div className="card-header">
                                    <div className="account-name">{acc.account_name}</div>
                                    <div className="account-type">{acc.account_type}</div>
                                </div>

                                <div className="account-balance">
                                    Balance: {acc.balance.toFixed(2)}
                                </div>

                                <div className="actions">
                                    <i className="fas fa-pencil-alt" onClick={() => handleEdit(acc)}></i>
                                    <i className="fas fa-trash-alt" onClick={() => handleDelete(acc.account_id)}></i>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>

            {/* MODAL */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>{isEditing ? "Update Account" : "Add Account"}</h2>

                        <label>Account Name</label>
                        <input type="text" name="accountName" value={formData.accountName} onChange={handleInputChange} />

                        <label>Account Type</label>
                        <input type="text" name="accountType" value={formData.accountType} onChange={handleInputChange} />

                        <label>Balance</label>
                        <input type="number" name="balance" value={formData.balance} onChange={handleInputChange} />

                        <div className="modal-actions">
                            <button onClick={handleSaveAccount}>
                                {isEditing ? "Update" : "Save"}
                            </button>

                            <button onClick={closeModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <footer className="footer">© 2025 FinanceTracker. All rights reserved.</footer>
        </div>
    );
};

export default Account;
