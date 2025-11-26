import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Navbar from "./Navbar";
import "../styles/Income.css";

const Income = () => {
    const [avatarLetter, setAvatarLetter] = useState("");
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [incomes, setIncomes] = useState([]);
    const [loadingIncomes, setLoadingIncomes] = useState(true);
    const [userId, setUserId] = useState(null);
    const [formData, setFormData] = useState({ date: "", account_id: "", amount: "", description: "", budget: 0 });

    // Totals
    const [totalIncome, setTotalIncome] = useState(0);
    // const [monthlyBudget, setMonthlyBudget] = useState(0);
    // const [savings, setSavings] = useState(0);

    // On mount
    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (!userData) return;
        const user = JSON.parse(userData);
        setUserId(user.uid);
        setAvatarLetter(user.fname ? user.fname[0].toUpperCase() : user.email[0].toUpperCase());
        if (user.uid) fetchCategories(user.uid);
    }, []);

    // Fetch incomes after categories are loaded
    useEffect(() => {
        if (!loadingCategories && categories.length > 0 && userId) {
            fetchIncomes(userId);
        }
    }, [loadingCategories, categories, userId]);

    // Fetch accounts
    const fetchCategories = async (uid) => {
        setLoadingCategories(true);
        try {
            const res = await api.get(`/api/income/accounts/user/${uid}`);
            setCategories(res.data || []);
        } catch (err) {
            console.error("Error fetching accounts:", err);
        } finally {
            setLoadingCategories(false);
        }
    };

    // Fetch incomes
    const fetchIncomes = async (uid) => {
        setLoadingIncomes(true);
        try {
            const res = await api.get(`/api/income/user/${uid}`);
            const formatted = (res.data || []).map(i => ({
                ...i,
                amount: parseFloat(i.amount || 0),
                description: i.description || "",
                account_name: i.account_name || categories.find(c => c.account_id === i.account_id)?.account_name || "-"
            }));
            setIncomes(formatted);
            updateTotals(formatted);
        } catch (err) {
            console.error("Error fetching incomes:", err);
        } finally {
            setLoadingIncomes(false);
        }
    };

    // Update totals (with NaN safety)
    const updateTotals = (incomeList) => {
        const totalInc = incomeList.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0);
        setTotalIncome(totalInc);
        // setMonthlyBudget(0); // Remove budget calculation
        // setSavings(totalInc);
    };

    // Handle form changes
    const handleInputChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    // Save new income
    const handleSave = async () => {
        if (!userId) return alert("User not found.");
        const { date, account_id, amount, description, budget } = formData;
        if (!date || !account_id || !amount) return alert("Fill all required fields.");

        const payload = {
            date: new Date(date).toISOString(),
            amount: parseFloat(amount) || 0,
            description: description || "",
            budget: parseFloat(budget) || 0,
            account_id: parseInt(account_id),
            uid: userId
        };

        try {
            const res = await api.post("/api/income", payload);
            const accountObj = categories.find(c => c.account_id === parseInt(account_id));
            const newIncome = {
                ...res.data,
                amount: payload.amount,
                description: payload.description,
                account_name: accountObj?.account_name || "-"
            };
            const updated = [newIncome, ...incomes];
            setIncomes(updated);
            updateTotals(updated);
            closeModal();
        } catch (err) {
            console.error("Error saving income:", err.response?.data || err.message);
        }
    };

    // Open modal for editing
    const handleEdit = (income) => {
        setIsEditing(true);
        setEditId(income.iid);
        setFormData({
            date: new Date(income.date).toISOString().split("T")[0],
            account_id: income.account_id,
            amount: income.amount,
            description: income.description || "",
            budget: income.budget || 0
        });
        setShowModal(true);
    };

    // Update existing income
    const handleUpdate = async () => {
        if (!editId) return;
        const { date, account_id, amount, description, budget } = formData;
        if (!date || !account_id || !amount) return alert("Fill all required fields.");

        const payload = {
            iid: editId,
            date: new Date(date).toISOString(),
            amount: parseFloat(amount) || 0,
            description: description || "",
            budget: parseFloat(budget) || 0,
            account_id: parseInt(account_id),
            uid: userId
        };

        try {
            const res = await api.put(`/api/income/${editId}`, payload);
            const updatedList = incomes.map(i =>
                i.iid === editId
                    ? {
                        ...i,
                        ...res.data,
                        amount: payload.amount,
                        description: payload.description,
                        account_name: categories.find(c => c.account_id === parseInt(payload.account_id))?.account_name || "-"
                    }
                    : i
            );

            setIncomes(updatedList);
            updateTotals(updatedList);
            closeModal();
        } catch (err) {
            console.error("Error updating income:", err.response?.data || err.message);
        }
    };

    // Delete income
    const handleDelete = async (iid) => {
        if (!window.confirm("Are you sure you want to delete this income?")) return;
        try {
            await api.delete(`/api/income/${iid}`);
            const updated = incomes.filter(i => i.iid !== iid);
            setIncomes(updated);
            updateTotals(updated);
        } catch (err) {
            console.error("Error deleting income:", err.response?.data || err.message);
        }
    };

    // Close modal and reset
    const closeModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setEditId(null);
        setFormData({ date: "", account_id: "", amount: "", description: "", budget: 0 });
    };

    return (
        <div className="income-page">
            <div className="inner-container">
                <Navbar avatarLetter={avatarLetter} />

                {/* Cards */}
                <div className="cards">
                    <div className="finance-card">
                        <p>Total Income</p>
                        <h3>₹{isNaN(totalIncome) ? "0.00" : totalIncome.toFixed(2)}</h3>
                    </div>
                    <div className="finance-card">
                        <p>Income Entries</p>
                        <h3>{incomes.length}</h3>
                    </div>
                    <div className="finance-card">
                        <p>Average Income</p>
                        <h3>₹{incomes.length > 0 ? (totalIncome / incomes.length).toFixed(2) : "0.00"}</h3>
                    </div>
                    {/* <div className="finance-card">
                        <p>Monthly Budget</p>
                        <h3>₹{isNaN(monthlyBudget) ? "0.00" : monthlyBudget.toFixed(2)}</h3>
                    </div>
                    <div className="finance-card">
                        <p>Savings</p>
                        <h3>₹{isNaN(savings) ? "0.00" : savings.toFixed(2)}</h3>
                        <small>
                            {totalIncome > 0 && !isNaN(savings)
                                ? ((savings / totalIncome) * 100).toFixed(1) + "%"
                                : "0%"}
                        </small>
                    </div> */}
                </div>

                {/* Table */}
                <div className="recent-income">
                    <div className="recent-header">
                        <h2>Recent Income</h2>
                        <button className="add-btn" onClick={() => { setIsEditing(false); setShowModal(true); }}>+ Add Income</button>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Account</th>
                                <th>Amount</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingIncomes ? (
                                <tr><td colSpan="4">Loading incomes...</td></tr>
                            ) : incomes.length === 0 ? (
                                <tr><td colSpan="4">No incomes found.</td></tr>
                            ) : (
                                incomes.map(income => (
                                    <tr key={income.iid}>
                                        <td>{new Date(income.date).toLocaleDateString()}</td>
                                        <td>{income.account_name}</td>
                                        <td className="amount">₹{(income.amount || 0).toFixed(2)}</td>
                                        <td>
                                            <button
                                                className="update-btn"
                                                title="Edit Income"
                                                onClick={() => handleEdit(income)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20h9" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z" />
                                                </svg>
                                            </button>
                                            <button
                                                className="delete-btn"
                                                title="Delete"
                                                onClick={() => handleDelete(income.iid)}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

            </div>

            {/* Modal for Add/Edit */}
            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>{isEditing ? "Update Income" : "Add Income"}</h2>

                        <label>Amount</label>
                        <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} />

                        <label>Account</label>
                        <select name="account_id" value={formData.account_id} onChange={handleInputChange}>
                            {loadingCategories ? (
                                <option disabled>Loading accounts...</option>
                            ) : (
                                <>
                                    <option value="">Select Account</option>
                                    {categories.map(acc => (
                                        <option key={acc.account_id} value={acc.account_id}>{acc.account_name}</option>
                                    ))}
                                </>
                            )}
                        </select>

                        <label>Date</label>
                        <input type="date" name="date" value={formData.date} onChange={handleInputChange} />

                        <label>Description</label>
                        <input type="text" name="description" value={formData.description} onChange={handleInputChange} placeholder="Income description" />

                        <label>Budget</label>
                        <input type="number" name="budget" value={formData.budget} onChange={handleInputChange} step="0.01" />

                        <div className="modal-actions">
                            {isEditing ? (
                                <button className="save-btn" onClick={handleUpdate}>Update</button>
                            ) : (
                                <button className="save-btn" onClick={handleSave}>Save</button>
                            )}
                            <button className="cancel-btn" onClick={closeModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            <footer className="footer">
                � 2025 FinanceTracker. All rights reserved.
            </footer>
        </div>
    );
};

export default Income;
