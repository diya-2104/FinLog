import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../api/api";
import "../styles/Category.css";

const pastelColors = ["#FFD1DC", "#AEC6CF", "#77DD77", "#FFF5BA", "#CBAACB"];
const getRandomPastel = () => pastelColors[Math.floor(Math.random() * pastelColors.length)];

const Category = () => {
    const [avatarLetter, setAvatarLetter] = useState("");
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [categories, setCategories] = useState([]);
    const [userId, setUserId] = useState(null);
    const [categoryName, setCategoryName] = useState("");
    const [categoryColor, setCategoryColor] = useState(getRandomPastel());
    const [isLightMode, setIsLightMode] = useState(false);

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (!userData) return;

        const user = JSON.parse(userData);
        setUserId(user.uid);
        setAvatarLetter(user.fname ? user.fname[0].toUpperCase() : user.email[0].toUpperCase());

        if (user.uid) fetchCategories(user.uid);
    }, []);

    const fetchCategories = async (uid) => {
        try {
            const res = await api.get(`/api/category?uid=${uid}`);
            setCategories(res.data || []);
        } catch (err) {
            console.error("Error fetching categories:", err.response?.data || err.message);
        }
    };

    const handleSaveCategory = async () => {
        if (!categoryName.trim() || !userId) return;

        const newCategory = {
            cname: categoryName,
            uid: userId,
            color: categoryColor,
            incomes: [],
            expenses: []
        };

        try {
            const res = await api.post("/api/category", newCategory);
            setCategories([...categories, res.data]);
            alert("Category added successfully!"); 
            closeModal();
        } catch (err) {
            console.error("Error adding category:", err.response?.data || err.message);
            alert("Failed to add category!");  
        }
    };

    const handleEditCategory = (cat) => {
        setIsEditing(true);
        setEditId(cat.cid);
        setCategoryName(cat.cname);
        setCategoryColor(cat.color);
        setShowModal(true);
    };

    const handleUpdateCategory = async () => {
        if (!editId || !categoryName.trim()) return;

        try {
            const payload = { cname: categoryName, color: categoryColor, uid: userId };
            const res = await api.put(`/api/category/${editId}`, payload);
            setCategories(categories.map(c => c.cid === editId ? res.data : c));
            alert("Category updated successfully!"); 
            closeModal();
        } catch (err) {
            console.error("Error updating category:", err.response?.data || err.message);
        }
    };

    const handleDeleteCategory = async (cid) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;

        try {
            await api.delete(`/api/category/${cid}`);
            setCategories(categories.filter(c => c.cid !== cid));
            alert("Category deleted successfully!"); 
        } catch (err) {
            console.error("Error deleting category:", err.response?.data || err.message);
            alert("Failed to delete category!");
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setIsEditing(false);
        setEditId(null);
        setCategoryName("");
        setCategoryColor(getRandomPastel());
    };

    const toggleTheme = () => {
        const page = document.querySelector(".category-page");
        page.classList.toggle("light-mode");
        setIsLightMode(prev => !prev);
    };

    return (
        <div className="category-page">
            <div className="inner-container">

                {/* Header */}
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

                {/* Tabs */}
                <nav className="tabs">
                    <NavLink to="/income" className={({ isActive }) => isActive ? "tab active-tab" : "tab"}>Income</NavLink>
                    <NavLink to="/expense" className={({ isActive }) => isActive ? "tab active-tab" : "tab"}>Expense</NavLink>
                    <NavLink to="/category" className={({ isActive }) => isActive ? "tab active-tab" : "tab"}>Category</NavLink>
                    <NavLink to="/account" className={({ isActive }) => isActive ? "tab active-tab" : "tab"}>Account</NavLink>
                    <NavLink to="/transaction" className={({ isActive }) => isActive ? "tab active-tab" : "tab"}>Transaction</NavLink>
                    <NavLink to="/report" className={({ isActive }) => isActive ? "tab active-tab" : "tab"}>Reports</NavLink>
                </nav>

                {/* Main Content */}
                <section className="category-content">
                    <div className="main-content">
                        <div className="main-content-header">
                            <h2>Manage Categories</h2>
                            <button className="add-category-btn" onClick={() => { setIsEditing(false); setShowModal(true); }}>
                                + Add Category
                            </button>
                        </div>

                        <div className="category-row">
                            {categories.length > 0 ? (
                                categories.map(cat => (
                                    <div key={cat.cid} className="category-card">
                                        <div className="card-header">
                                            <div style={{
                                                width: "20px",
                                                height: "20px",
                                                backgroundColor: cat.color,
                                                borderRadius: "4px"
                                            }}></div>
                                            <div className="category-name">{cat.cname}</div>
                                        </div>
                                        <div className="actions">
                                            <i className="fas fa-pencil-alt" onClick={() => handleEditCategory(cat)}></i>
                                            <i className="fas fa-trash-alt" onClick={() => handleDeleteCategory(cat.cid)}></i>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No categories added yet.</p>
                            )}
                        </div>
                    </div>
                </section>

                {/* Modal */}
                {showModal && (
                    <div className="modal-overlay" onClick={closeModal}>
                        <div className="modal" onClick={e => e.stopPropagation()}>
                            <h3>{isEditing ? "Update Category" : "Add New Category"}</h3>
                            <input
                                type="text"
                                placeholder="Category Name"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                            />
                            <div className="modal-actions">
                                {isEditing ? (
                                    <button onClick={handleUpdateCategory}>Update</button>
                                ) : (
                                    <button onClick={handleSaveCategory}>Save</button>
                                )}
                                <button className="cancel-btn" onClick={closeModal}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}

                <footer className="footer">
                    © 2025 FinanceTracker. All rights reserved.
                </footer>

            </div>
        </div>
    );
};

export default Category;
