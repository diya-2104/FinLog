import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../api/api";
import "../styles/Income.css";

const Income = () => {
    const [avatarLetter, setAvatarLetter] = useState("");
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [accounts, setAccounts] = useState([]);
    const [loadingAccounts, setLoadingAccounts] = useState(true);
    const [incomes, setIncomes] = useState([]);
    const [loadingIncomes, setLoadingIncomes] = useState(true);
    const [userId, setUserId] = useState(null);
    const [formData, setFormData] = useState({ date: "", cid: "", account_id: "", amount: "", Budget: 0 });

    const [totalIncome, setTotalIncome] = useState(0);
    const [monthlyBudget, setMonthlyBudget] = useState(0);
    const [savings, setSavings] = useState(0);
    const [isLightMode, setIsLightMode] = useState(false);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (!userData) return;
        const user = JSON.parse(userData);
        setUserId(user.uid);
        setAvatarLetter(user.fname ? user.fname[0].toUpperCase() : user.email[0].toUpperCase());
        if (user.uid) {
            fetchCategories(user.uid);
            fetchAccounts(user.uid);
        }
    }, []);

    useEffect(() => {
        if (!loadingCategories && !loadingAccounts && userId) {
            fetchIncomes(userId);
        }
    }, [loadingCategories, loadingAccounts, userId]);

    const fetchCategories = async (uid) => {
        setLoadingCategories(true);
        try {
            const res = await api.get(`/api/income/categories/user/${uid}`);
            setCategories(res.data || []);
        } catch (err) {
            console.error("Error fetching categories:", err);
        } finally {
            setLoadingCategories(false);
        }
    };

    const fetchAccounts = async (uid) => {
        setLoadingAccounts(true);
        try {
            const res = await api.get(`/api/income/accounts/user/${uid}`);
            setAccounts(res.data || []);
        } catch (err) {
            console.error("Error fetching accounts:", err);
        } finally {
            setLoadingAccounts(false);
        }
    };

    const fetchIncomes = async (uid) => {
        setLoadingIncomes(true);
        try {
            const res = await api.get(`/api/income/user/${uid}`);
            const formatted = (res.data || []).map(i => ({
                ...i,
                amount: parseFloat(i.amount ?? 0),
                Budget: parseFloat(i.Budget ?? 0),
                cname: i.cname || categories.find(c => c.cid === i.cid)?.cname || "-"
            }));
            setIncomes(formatted);
            updateTotals(formatted);
        } catch (err) {
            console.error("Error fetching incomes:", err);
        } finally {
            setLoadingIncomes(false);
        }
    };

    const updateTotals = (incomeList) => {
        const totalInc = incomeList.reduce((sum, i) => sum + (parseFloat(i.amount) || 0), 0);
        const totalBud = incomeList.reduce((sum, i) => sum + (parseFloat(i.Budget) || 0), 0);
        setTotalIncome(totalInc);
        setMonthlyBudget(totalBud);
        setSavings(totalInc - totalBud);
    };

    const handleInputChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        const { date, cid, account_id, amount, Budget } = formData;
        if (!userId) return alert("User not found.");
        if (!date || !cid || !amount || !account_id) return alert("Fill all required fields.");

        const payload = {
            date: new Date(date).toISOString(),
            amount: parseFloat(amount),
            Budget: parseFloat(Budget),
            cid: parseInt(cid),
            account_id: parseInt(account_id),
            uid: userId
        };

        try {
            const res = await api.post("/api/income", payload);
            const categoryObj = categories.find(c => c.cid === parseInt(cid));
            const accountObj = accounts.find(a => a.account_id === parseInt(account_id));
            const newIncome = {
                ...res.data,
                amount: payload.amount,
                Budget: payload.Budget,
                cname: categoryObj?.cname || "-",
                account_name: accountObj?.account_name || "-"
            };
            const updated = [newIncome, ...incomes];
            setIncomes(updated);
            updateTotals(updated);

            alert("Income added successfully!");  
            closeModal();
        } catch (err) {
            console.error("Error saving income:", err.response?.data || err.message);
        }
    };

    const handleEdit = (income) => {
        setIsEditing(true);
        setEditId(income.iid);
        setFormData({
            date: new Date(income.date).toISOString().split("T")[0],
            cid: income.cid,
            account_id: income.account_id,
            amount: income.amount,
            Budget: income.Budget
        });
        setShowModal(true);
    };

    const handleUpdate = async () => {
        if (!editId) return;
        const { date, cid, account_id, amount, Budget } = formData;
        if (!date || !cid || !amount || !account_id) return alert("Fill all required fields.");

        const payload = {
            date: new Date(date).toISOString(),
            amount: parseFloat(amount),
            Budget: parseFloat(Budget),
            cid: parseInt(cid),
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
                        Budget: payload.Budget,
                        cname: categories.find(c => c.cid === payload.cid)?.cname || "-",
                        account_name: accounts.find(a => a.account_id === payload.account_id)?.account_name || "-"
                    }
                    : i
            );
            setIncomes(updatedList);
            updateTotals(updatedList);

            alert("Income updated successfully!"); 
            closeModal();
        } catch (err) {
            console.error("Error updating income:", err.response?.data || err.message);
        }
    };

    const handleDelete = async (iid) => {
        if (!window.confirm("Are you sure you want to delete this income?")) return;

        try {
            await api.delete(`/api/income/${iid}`);
            const updated = incomes.filter(i => String(i.iid ?? "") !== String(iid));
            setIncomes(updated);
            updateTotals(updated);

            alert("Income deleted successfully!"); 
        } catch (err) {
            console.error("Error deleting income:", err.response?.data || err.message);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setEditId(null);
        setFormData({ date: "", cid: "", account_id: "", amount: "", Budget: 0 });
    };

    const toggleTheme = () => {
        const page = document.querySelector(".income-page");
        page.classList.toggle("light-mode");
        setIsLightMode(prev => !prev);
    };

    return (
        <div className="income-page">
            <div className="inner-container">

                <header className="header">
                    <div className="logo">
                        <i className="fas fa-chart-line"></i>
                        <span>FinLog</span>
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

                        <div className="avatar" title="View Profile" onClick={() => navigate("/profile")}>
                            {avatarLetter}
                        </div>
                    </div>
                </header>

                <nav className="tabs">
                    <NavLink to="/income" className={({ isActive }) => isActive ? "tab active-tab" : "tab"}>Income</NavLink>
                    <NavLink to="/expense" className={({ isActive }) => isActive ? "tab active-tab" : "tab"}>Expense</NavLink>
                    <NavLink to="/category" className={({ isActive }) => isActive ? "tab active-tab" : "tab"}>Category</NavLink>
                    <NavLink to="/account" className={({ isActive }) => isActive ? "tab active-tab" : "tab"}>Account</NavLink>
                    <NavLink to="/transaction" className={({ isActive }) => isActive ? "tab active-tab" : "tab"}>Transaction</NavLink>
                    <NavLink to="/report" className={({ isActive }) => isActive ? "tab active-tab" : "tab"}>Reports</NavLink>
                </nav>

                <div className="cards">
                    <div className="finance-card">
                        <p>Total Income</p>
                        <h3>{totalIncome.toFixed(2)}</h3>
                    </div>
                    <div className="finance-card">
                        <p>Monthly Budget</p>
                        <h3>{monthlyBudget.toFixed(2)}</h3>
                    </div>
                    <div className="finance-card">
                        <p>Savings</p>
                        <h3>{savings.toFixed(2)}</h3>
                        <small>{totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(1) + "%" : "0%"}</small>
                    </div>
                </div>

                <div className="recent-income">
                    <div className="recent-header">
                        <h2>Recent Income</h2>
                        <button className="add-btn" onClick={() => { setIsEditing(false); setShowModal(true); }}>+ Add Income</button>
                    </div>
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Category</th>
                                <th>Account</th>
                                <th>Amount</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loadingIncomes ? (
                                <tr><td colSpan="5">Loading incomes...</td></tr>
                            ) : incomes.length === 0 ? (
                                <tr><td colSpan="5">No incomes found.</td></tr>
                            ) : (
                                incomes.map(income => (
                                    <tr key={income.iid}>
                                        <td>
                                            {(() => {
                                                const d = new Date(income.date);
                                                const day = String(d.getDate()).padStart(2, '0');
                                                const month = String(d.getMonth() + 1).padStart(2, '0');
                                                const year = d.getFullYear();
                                                return `${day}/${month}/${year}`;
                                            })()}
                                        </td>

                                        <td>{income.cname}</td>
                                        <td>{income.account_name}</td>
                                        <td>{income.amount.toFixed(2)}</td>
                                        <td>
                                            <button className="update-btn" onClick={() => handleEdit(income)}>Edit</button>
                                            <button className="delete-btn" onClick={() => handleDelete(income.iid)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

            </div>

            {showModal && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <h2>{isEditing ? "Update Income" : "Add Income"}</h2>

                        <label>Amount</label>
                        <input type="number" name="amount" value={formData.amount} onChange={handleInputChange} />

                        <label>Category</label>
                        <select name="cid" value={formData.cid} onChange={handleInputChange}>
                            {loadingCategories ? <option>Loading...</option> :
                                <>
                                    <option value="">Select Category</option>
                                    {categories.map(cat => <option key={cat.cid} value={cat.cid}>{cat.cname}</option>)}
                                </>
                            }
                        </select>

                        <label>Account</label>
                        <select name="account_id" value={formData.account_id} onChange={handleInputChange}>
                            {loadingAccounts ? <option>Loading...</option> :
                                <>
                                    <option value="">Select Account</option>
                                    {accounts.map(acc => <option key={acc.account_id} value={acc.account_id}>{acc.account_name}</option>)}
                                </>
                            }
                        </select>

                        <label>Date</label>
                        <input type="date" name="date" value={formData.date} onChange={handleInputChange} />

                        <label>Budget</label>
                        <input type="number" name="Budget" value={formData.Budget} onChange={handleInputChange} />

                        <div className="modal-actions">
                            {isEditing ? (
                                <button onClick={handleUpdate}>Update</button>
                            ) : (
                                <button onClick={handleSave}>Save</button>
                            )}
                            <button onClick={closeModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <footer className="footer">© 2025 FinanceTracker. All rights reserved.</footer>
        </div>
    );
};

export default Income;
