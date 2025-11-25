import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/Income.css";

const Income = () => {
    const [avatarLetter, setAvatarLetter] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        date: "",
        category: "",
        amount: "",
    });

    useEffect(() => {
        // Reset scroll position
        const container = document.querySelector(".income-page");
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
    const handleInputChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = () => {
        console.log("Income saved:", formData);
        setShowModal(false);
        setFormData({ date: "", category: "", amount: "" });
    };

    const handleCancel = () => {
        setShowModal(false);
        setFormData({ date: "", category: "", amount: "" });
    };

    return (
        <div className="income-page">
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
                        <p>Total Income</p>
                        <h3>4,250</h3>
                    </div>
                    <div className="finance-card">
                        <p>Monthly Budget</p>
                        <h3>3,500</h3>
                    </div>
                    <div className="finance-card">
                        <p>Savings</p>
                        <h3>1,200</h3>
                    </div>
                </div>

                {/* Recent Income Table */}
                <div className="recent-income">
                    <div className="recent-header">
                        <h2>Recent Income</h2>
                        <button className="add-btn" onClick={() => setShowModal(true)}>+ Add Income</button>
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
                                <td>Sep 25, 2025</td>
                                <td>Employment</td>
                                <td className="amount">$3,500.00</td>
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
                                <td>Sep 20, 2025</td>
                                <td>Side Hustle</td>
                                <td className="amount">$450.00</td>
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
                                <td>Sep 15, 2025</td>
                                <td>Investments</td>
                                <td className="amount">$300.00</td>
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
            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={handleCancel}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Add Income</h2>

                        <label>Amount</label>
                        <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} />
                       
                        <label>Category</label>
                        <input type="text" name="category" value={formData.category} onChange={handleInputChange} />

                        <label>Date</label>
                        <input type="date" name="date" value={formData.date} onChange={handleInputChange} />

                        <div className="modal-actions">
                            <button className="save-btn" onClick={handleSave}>Save</button>
                            <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Income;
