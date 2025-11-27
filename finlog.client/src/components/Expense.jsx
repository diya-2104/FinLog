import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../api/api";
import "../styles/Expense.css";

const Expense = () => {
    const [avatarLetter, setAvatarLetter] = useState("");
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [accounts, setAccounts] = useState([]);
    const [loadingAccounts, setLoadingAccounts] = useState(true);
    const [expenses, setExpenses] = useState([]);
    const [loadingExpenses, setLoadingExpenses] = useState(true);
    const [userId, setUserId] = useState(null);
    const [formData, setFormData] = useState({ edate: "", cid: "", account_id: "", eamount: "" });

    // Totals
    const [totalExpenses, setTotalExpenses] = useState(0);
    const [monthlyBills, setMonthlyBills] = useState(0);

    // Last expense (for new card)
    const [lastExpense, setLastExpense] = useState(null);

    // On mount
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

    // Fetch expenses after categories and accounts are loaded
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

            // Set last expense for card
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

    const updateTotals = (expenseList) => {
        const total = expenseList.reduce((sum, e) => sum + (parseFloat(e.eamount) || 0), 0);
        setTotalExpenses(total);
    };

    const handleInputChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        const { edate, cid, account_id, eamount } = formData;
        if (!userId) return alert("User not found.");
        if (!edate || !cid || !account_id || !eamount) return alert("Please fill all required fields.");

        const cidNum = parseInt(cid);
        const accountNum = parseInt(account_id);
        const amountNum = parseFloat(eamount);

        if (isNaN(cidNum) || isNaN(accountNum) || isNaN(amountNum) || amountNum <= 0) {
            return alert("Please enter valid numbers for Amount, Category, and Account.");
        }

        const accountObj = accounts.find(a => a.account_id === accountNum);
        if (!accountObj) return alert("Selected account does not exist.");
        if (!editMode && amountNum > accountObj.balance) {
            return alert(`Insufficient balance. Current balance: ${accountObj.balance.toFixed(2)}`);
        }

        const payload = {
            edate: new Date(edate).toISOString(),
            eamount: amountNum,
            cid: cidNum,
            account_id: accountNum,
            uid: userId
        };

        try {
            if (editMode && editId) {
                // ? FIXED: Add eid to payload
                const res = await api.put(`/api/expense/${editId}`, { ...payload, eid: editId });

                const updatedList = expenses.map(e =>
                    e.eid === editId
                        ? {
                            ...e,
                            ...res.data,
                            eamount: amountNum,
                            cname: categories.find(c => c.cid === cidNum)?.cname || "-",
                            account_name: accounts.find(a => a.account_id === accountNum)?.account_name || "-"
                        }
                        : e
                );

                setExpenses(updatedList);
                updateTotals(updatedList);

                if (updatedList[0].eid === editId) setLastExpense(updatedList[0]);
            } else {
                const res = await api.post("/api/expense", payload);
                const categoryObj = categories.find(c => c.cid === cidNum);
                const newExpense = {
                    ...res.data,
                    eamount: amountNum,
                    cname: categoryObj?.cname || "-",
                    account_name: accountObj?.account_name || "-"
                };
                const updatedList = [newExpense, ...expenses];
                setExpenses(updatedList);
                updateTotals(updatedList);
                setLastExpense(newExpense);
            }

            fetchMonthlyBills(userId);
            closeModal();
        } catch (err) {
            console.error("Error saving expense:", err.response?.data || err.message);
            alert(err.response?.data?.message || "Error saving expense.");
        }
    };

    const handleEdit = (expense) => {
        setEditMode(true);
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
        if (!window.confirm("Are you sure you want to delete this expense?")) return;
        try {
            await api.delete(`/api/expense/${eid}`);
            const updated = expenses.filter(e => e.eid !== eid);
            setExpenses(updated);
            updateTotals(updated);
            fetchMonthlyBills(userId);

            // Update last expense card
            setLastExpense(updated[0] || null);
        } catch (err) {
            console.error("Error deleting expense:", err);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setEditMode(false);
        setEditId(null);
        setFormData({ edate: "", cid: "", account_id: "", eamount: "" });
    };

    return (
        <div className="expense-page">
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


                {/* Cards */}
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

                {/* Expenses Table */}
                <div className="recent-expense">
                    <div className="recent-header">
                        <h2>Recent Expenses</h2>
                        <button className="add-btn" onClick={() => { setEditMode(false); setShowModal(true); }}>+ Add Expense</button>
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
                                        <td>{new Date(expense.edate).toLocaleDateString()}</td>
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
                        <h2>{editMode ? "Update Expense" : "Add Expense"}</h2>

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
                            <button onClick={handleSave}>{editMode ? "Update" : "Save"}</button>
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
