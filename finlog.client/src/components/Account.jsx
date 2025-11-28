import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/Account.css";

const Account = () => {
    const [avatarLetter, setAvatarLetter] = useState("");
    const navigate = useNavigate();
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
            const response = await api.post("/api/account", newAccount);
            setAccounts([...accounts, response.data]);
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
                alert("Account deleted successfully!");
            }
        } catch (error) {
            console.error("Error deleting account:", error.response?.data || error.message);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
        setAccountName("");
        setAccountType("");
        setBalance(0);
    };

    return (
        <div className="account-page">
            <div className="inner-container">
                <Navbar avatarLetter={avatarLetter} />

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
                                        <div className="account-balance">Balance: ₹{acc.balance.toFixed(2)}</div>
                                        <div className="actions">
                                            <i className="fas fa-pencil-alt"></i>
                                            <i className="fas fa-trash-alt" style={{ cursor: "pointer" }} onClick={() => handleDeleteAccount(acc.account_id)}></i>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No accounts added yet.</p>
                            )}
                        </div>
                    </div>
                </section>

                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h3>Add New Account</h3>
                            <input type="text" placeholder="Account name (e.g., StateBank)" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
                            <input type="text" placeholder="Account type (e.g., Savings, Wallet)" value={accountType} onChange={(e) => setAccountType(e.target.value)} />
                            <input type="number" placeholder="Initial balance" value={balance} onChange={(e) => setBalance(e.target.value)} />
                            <div className="modal-actions">
                                <button onClick={handleSaveAccount}>Save</button>
                                <button onClick={handleCancel} className="cancel-btn">Cancel</button>
                            </div>
                        </div>
                    </div>
                )}

                <Footer />
            </div>
        </div>
    );
};

export default Account;