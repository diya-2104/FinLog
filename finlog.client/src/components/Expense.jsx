import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../styles/Expense.css";
import api from "../api/api"; // axios instance

const Expense = () => {
    const [avatarLetter, setAvatarLetter] = useState("");
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({ edate: "", cid: "", eamount: "" });
    const [categories, setCategories] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [userId, setUserId] = useState(null);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingExpenses, setLoadingExpenses] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [editId, setEditId] = useState(null);

    // ADDED: Monthly backend bills
    const [backendMonthlyBills, setBackendMonthlyBills] = useState(0);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (!userData) return;
        const user = JSON.parse(userData);
        setUserId(user.uid);
        setAvatarLetter(user.fname ? user.fname[0].toUpperCase() : user.email[0].toUpperCase());

        if (user.uid) {
            fetchCategories(user.uid);
            fetchMonthlyBills(user.uid);   // ? ADDED
        }
    }, []);

    // Load categories
    const fetchCategories = async (uid) => {
        setLoadingCategories(true);
        try {
            const res = await api.get(`/api/expense/categories/user/${uid}`);
            setCategories(res.data || []);
        } catch (err) {
            console.error("Error fetching categories:", err);
        } finally {
            setLoadingCategories(false);
            fetchExpenses(uid);
        }
    };

    // Load all expenses
    const fetchExpenses = async (uid) => {
        setLoadingExpenses(true);
        try {
            const res = await api.get(`/api/expense/user/${uid}`);
            setExpenses(res.data || []);
        } catch (err) {
            console.error("Error fetching expenses:", err);
        } finally {
            setLoadingExpenses(false);
        }
    };

    // ADDED FUNCTION: Fetch monthly bills
    const fetchMonthlyBills = async (uid) => {
        try {
            const res = await api.get(`/api/expense/monthly-bills/${uid}`);
            setBackendMonthlyBills(res.data.total || 0);
        } catch (err) {
            console.error("Error fetching monthly bills:", err);
        }
    };

    const handleInputChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSave = async () => {
        const { edate, cid, eamount } = formData;
        if (!edate || !cid || !eamount) return alert("Please fill all fields.");

        const payload = {
            uid: userId,
            cid: parseInt(cid),
            edate: new Date(edate).toISOString(),
            eamount: parseFloat(eamount),
        };

        try {
            if (editMode) {
                const res = await api.put(`/api/expense/${editId}`, { ...payload, eid: editId });
                setExpenses(expenses.map((e) => (e.eid === editId ? res.data : e)));
                alert("Expense updated successfully!");
            } else {
                const res = await api.post("/api/expense", payload);
                setExpenses([res.data, ...expenses]);
                alert("Expense added successfully!");
            }

            // Reload monthly bills after save
            fetchMonthlyBills(userId);

            setFormData({ edate: "", cid: "", eamount: "" });
            setEditMode(false);
            setEditId(null);
            setShowModal(false);
        } catch (err) {
            console.error("Error saving expense:", err);
            alert("Failed to save expense. Check console for details.");
        }
    };

    const handleEdit = (expense) => {
        setFormData({
            edate: expense.edate.split("T")[0],
            cid: expense.cid,
            eamount: expense.eamount,
        });
        setEditId(expense.eid);
        setEditMode(true);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this expense?")) return;
        try {
            await api.delete(`/api/expense/${id}`);
            setExpenses(expenses.filter((e) => e.eid !== id));
            alert("Expense deleted successfully!");

            // Reload monthly bills after delete
            fetchMonthlyBills(userId);

        } catch (err) {
            console.error("Error deleting expense:", err);
            alert("Failed to delete expense. Check console for details.");
        }
    };

    const handleCancel = () => {
        setShowModal(false);
        setFormData({ edate: "", cid: "", eamount: "" });
        setEditMode(false);
        setEditId(null);
    };

    const totalExpenses = expenses.reduce((sum, e) => sum + parseFloat(e.eamount || 0), 0);

    const latestExpense = expenses.length > 0 ? expenses[0] : null;
    const latestExpenseCategory = latestExpense
        ? categories.find((c) => c.cid === latestExpense.cid)?.cname || "-"
        : null;
    const latestExpenseAmount = latestExpense ? parseFloat(latestExpense.eamount || 0) : 0;

    return (
        <div className="expense-page">
            <div className="inner-container">
                <header className="header">
                    <div className="logo">
                        <i className="fas fa-chart-line"></i>FinTrack
                    </div>
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

                {/* NAVIGATION */}
                <nav className="tabs">
                    <NavLink to="/income" className={({ isActive }) => (isActive ? "tab active-tab" : "tab")}>Income</NavLink>
                    <NavLink to="/expense" className={({ isActive }) => (isActive ? "tab active-tab" : "tab")}>Expense</NavLink>
                    <NavLink to="/category" className={({ isActive }) => (isActive ? "tab active-tab" : "tab")}>Category</NavLink>
                    <NavLink to="/transaction" className={({ isActive }) => (isActive ? "tab active-tab" : "tab")}>Transaction</NavLink>
                    <NavLink to="/report" className={({ isActive }) => (isActive ? "tab active-tab" : "tab")}>Reports</NavLink>
                </nav>

                {/* FINANCIAL CARDS */}
                <div className="cards">
                    <div className="finance-card">
                        <p>Total Expenses</p>
                        <h3>{totalExpenses.toFixed(2)}</h3>
                    </div>

                    {/* MONTHLY BILLS CARD — UPDATED */}
                    <div className="finance-card">
                        <p>Monthly Bills</p>
                        <h3>{backendMonthlyBills.toFixed(2)}</h3>
                    </div>

                    {latestExpenseCategory && (
                        <div className="finance-card">
                            <p>Last Expense: {latestExpenseCategory}</p>
                            <h3>{latestExpenseAmount.toFixed(2)}</h3>
                        </div>
                    )}
                </div>

                {/* Recent Expenses Table */}
                <div className="recent-expense">
                    <div className="recent-header">
                        <h2>Recent Expenses</h2>
                        <button className="add-btn" onClick={() => { setShowModal(true); setEditMode(false); }}>
                            + Add Expense
                        </button>
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
                            {loadingExpenses ? (
                                <tr><td colSpan="4">Loading...</td></tr>
                            ) : expenses.length === 0 ? (
                                <tr><td colSpan="4">No expenses found.</td></tr>
                            ) : (
                                expenses.map((e) => (
                                    <tr key={e.eid}>
                                        <td>{new Date(e.edate).toLocaleDateString()}</td>
                                        <td>{categories.find((c) => c.cid === e.cid)?.cname || "-"}</td>
                                        <td>{parseFloat(e.eamount).toFixed(2)}</td>
                                        <td>
                                            <button className="update-btn" title="Edit Expense" onClick={() => handleEdit(e)}>
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20h9" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.5 3.5a2.121 2.121 0 113 3L7 19l-4 1 1-4L16.5 3.5z" />
                                                </svg>
                                            </button>
                                            <button className="delete-btn" title="Delete" onClick={() => handleDelete(e.eid)}>
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

            {/* Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={handleCancel}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2>{editMode ? "Edit Expense" : "Add Expense"}</h2>

                        <label>Amount</label>
                        <input type="number" name="eamount" value={formData.eamount} onChange={handleInputChange} />

                        <label>Category</label>
                        <select name="cid" value={formData.cid} onChange={handleInputChange}>
                            {loadingCategories ? (
                                <option disabled>Loading...</option>
                            ) : (
                                <>
                                    <option value="">Select Category</option>
                                    {categories.map((c) => (
                                        <option key={c.cid} value={c.cid}>{c.cname}</option>
                                    ))}
                                </>
                            )}
                        </select>

                        <label>Date</label>
                        <input type="date" name="edate" value={formData.edate} onChange={handleInputChange} />

                        <div className="modal-actions">
                            <button className="save-btn" onClick={handleSave}>{editMode ? "Update" : "Save"}</button>
                            <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            <footer className="footer">
                © 2025 FinanceTracker. All rights reserved.
            </footer>
        </div>
    );
};

export default Expense;
