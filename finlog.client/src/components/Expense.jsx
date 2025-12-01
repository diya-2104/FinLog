import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../api/api";
import "../styles/Expense.css";

const Expense = () => {
    const [avatarLetter, setAvatarLetter] = useState("");
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [accounts, setAccounts] = useState([]);
    const [loadingAccounts, setLoadingAccounts] = useState(true);
    const [expenses, setExpenses] = useState([]);
    const [loadingExpenses, setLoadingExpenses] = useState(true);
    const [userId, setUserId] = useState(null);
    const [formData, setFormData] = useState({ edate: "", cid: "", account_id: "", eamount: "" });

    const [totalExpenses, setTotalExpenses] = useState(0);
    const [monthlyBills, setMonthlyBills] = useState(0);
    const [lastExpense, setLastExpense] = useState(null);
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
            fetchExpenses(userId);
            fetchMonthlyBills(userId);
        }
    }, [loadingCategories, loadingAccounts, userId]);

    const fetchCategories = async (uid) => {
        setLoadingCategories(true);
        try {
            const res = await api.get(`/api/expense/categories/user/${uid}`);
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
            const res = await api.get(`/api/expense/accounts/user/${uid}`);
            setAccounts(res.data || []);
        } catch (err) {
            console.error("Error fetching accounts:", err);
        } finally {
            setLoadingAccounts(false);
        }
    };

    const fetchExpenses = async (uid) => {
        setLoadingExpenses(true);
        try {
            const res = await api.get(`/api/expense/user/${uid}`);
            const formatted = (res.data || []).map(e => ({
                ...e,
                eamount: parseFloat(e.eamount ?? 0),
                cname: e.cname || categories.find(c => c.cid === e.cid)?.cname || "-",
                account_name: accounts.find(a => a.account_id === e.account_id)?.account_name || "-"
            }));
            setExpenses(formatted);
            updateTotals(formatted);
            setLastExpense(formatted[0] || null);
        } catch (err) {
            console.error("Error fetching expenses:", err);
        } finally {
            setLoadingExpenses(false);
        }
    };

    const fetchMonthlyBills = async (uid) => {
        try {
            const res = await api.get(`/api/expense/monthly-bills/${uid}`);
            setMonthlyBills(res.data.total || 0);
        } catch (err) {
            console.error("Error fetching monthly bills:", err);
        }
    };

    const updateTotals = (list) => {
        const total = list.reduce((sum, e) => sum + (parseFloat(e.eamount) || 0), 0);
        setTotalExpenses(total);
    };

    const handleInputChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        const { edate, cid, account_id, eamount } = formData;
        if (!userId) return alert("User not found.");
        if (!edate || !cid || !account_id || !eamount) return alert("Fill all fields.");

        const payload = {
            edate: new Date(edate).toISOString(),
            eamount: parseFloat(eamount),
            cid: parseInt(cid),
            account_id: parseInt(account_id),
            uid: userId
        };

        try {
            if (isEditing && editId) {
                const res = await api.put(`/api/expense/${editId}`, { ...payload, eid: editId });
                const updated = expenses.map(e => e.eid === editId ? { ...e, ...res.data, eamount: payload.eamount } : e);
                setExpenses(updated);
                updateTotals(updated); 
                setLastExpense(updated[0] || null);
                alert("Expense updated successfully!");
            } else {
                const res = await api.post("/api/expense", payload);
                const newExpense = { ...res.data, eamount: payload.eamount, cname: categories.find(c => c.cid === payload.cid)?.cname || "-", account_name: accounts.find(a => a.account_id === payload.account_id)?.account_name || "-" };
                const updated = [newExpense, ...expenses];
                setExpenses(updated);
                updateTotals(updated);

                setLastExpense(newExpense);
                alert("Expense added successfully!");
            }
            fetchMonthlyBills(userId);
            closeModal();
        } catch (err) {
            console.error("Error saving expense:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Error saving expense.");
        }
    };

    const handleEdit = (expense) => {
        setIsEditing(true);
        setEditId(expense.eid);
        setFormData({
            edate: new Date(expense.edate).toISOString().split("T")[0],
            cid: expense.cid,
            account_id: expense.account_id,
            eamount: expense.eamount
        });
        setShowModal(true);
    };

    const handleDelete = async (eid) => {
        if (!window.confirm("Delete this expense?")) return;
        try {
            await api.delete(`/api/expense/${eid}`);
            const updated = expenses.filter(e => e.eid !== eid);
            setExpenses(updated);
            updateTotals(updated);
            setLastExpense(updated[0] || null);
            fetchMonthlyBills(userId);
            alert("Expense deleted successfully!"); 
        } catch (err) {
            console.error("Error deleting expense:", err);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setEditId(null);
        setFormData({ edate: "", cid: "", account_id: "", eamount: "" });
    };

    const toggleTheme = () => {
        const page = document.querySelector(".expense-page");
        page.classList.toggle("light-mode");
        setIsLightMode(prev => !prev);
    };

    return (
        <div className="expense-page">
            <div className="inner-container">
                <header className="header">
                    <div className="logo"><i className="fas fa-chart-line"></i> <span>FinLog</span></div>
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
                        <p>Total Expenses</p>
                        <h3>{totalExpenses.toFixed(2)}</h3>
                    </div>
                    <div className="finance-card">
                        <p>Monthly Bills</p>
                        <h3>{monthlyBills.toFixed(2)}</h3>
                    </div>
                    <div className="finance-card">
                        <p>Latest Expense</p>
                        <h3>{lastExpense ? lastExpense.eamount.toFixed(2) : "0.00"}</h3>
                        <span style={{ fontSize: "14px", opacity: 0.7 }}>
                            {lastExpense ? lastExpense.cname : "No recent expense"}
                        </span>
                    </div>
                </div>

                <div className="recent-expense">
                    <div className="recent-header">
                        <h2>Recent Expenses</h2>
                        <button className="add-btn" onClick={() => { setIsEditing(false); setShowModal(true); }}>+ Add Expense</button>
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
                            {loadingExpenses ? (
                                <tr><td colSpan="5">Loading expenses...</td></tr>
                            ) : expenses.length === 0 ? (
                                <tr><td colSpan="5">No expenses found.</td></tr>
                            ) : (
                                expenses.map(expense => (
                                    <tr key={expense.eid}>
                                        <td>
                                            {(() => {
                                                const d = new Date(expense.edate);
                                                const day = String(d.getDate()).padStart(2, '0');
                                                const month = String(d.getMonth() + 1).padStart(2, '0');
                                                const year = d.getFullYear();
                                                return `${day}/${month}/${year}`;
                                            })()}
                                        </td>
                                        <td>{expense.cname}</td>
                                        <td>{expense.account_name}</td>
                                        <td>{expense.eamount.toFixed(2)}</td>
                                        <td>
                                            <button className="update-btn" onClick={() => handleEdit(expense)}>Edit</button>
                                            <button className="delete-btn" onClick={() => handleDelete(expense.eid)}>Delete</button>
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
                        <h2>{isEditing ? "Update Expense" : "Add Expense"}</h2>

                        <label>Amount</label>
                        <input type="number" name="eamount" value={formData.eamount} onChange={handleInputChange} />

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
                        <input type="date" name="edate" value={formData.edate} onChange={handleInputChange} />

                        <div className="modal-actions">
                            {isEditing ? (
                                <button onClick={handleSave}>Update</button>
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

export default Expense;
