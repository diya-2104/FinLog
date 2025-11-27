import React, { useEffect, useState } from "react";
import { NavLink,useNavigate } from "react-router-dom";
import api from "../api/api"; // backend API connection
import "../styles/Category.css";

const pastelColors = ["#FFD1DC", "#AEC6CF", "#77DD77", "#FFF5BA", "#CBAACB"];
const getRandomPastel = () => pastelColors[Math.floor(Math.random() * pastelColors.length)];

const Category = () => {
    const [avatarLetter, setAvatarLetter] = useState("");
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const [categoryColor, setCategoryColor] = useState(getRandomPastel());
    const [categories, setCategories] = useState([]);
    const [userId, setUserId] = useState(null);

    // Fetch categories from backend
    const fetchCategories = async (uid) => {
        try {
            const response = await api.get(`/api/category?uid=${uid}`);
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        const userData = localStorage.getItem("user");
        if (userData) {
            const user = JSON.parse(userData);

            console.log("User object from localStorage:", user);
            console.log("User ID:", user.uid);

            setUserId(user.uid);

            if (user.fname && user.fname.length > 0) {
                setAvatarLetter(user.fname[0].toUpperCase());
            } else if (user.email && user.email.length > 0) {
                setAvatarLetter(user.email[0].toUpperCase());
            }

            if (user.uid) fetchCategories(user.uid);
        }
    }, []);

    // Add new category
    const handleSaveCategory = async () => {
        if (!categoryName.trim() || !userId) return;

        const newCategory = {
            cname: categoryName,
            uid: userId,
            color: categoryColor,
            incomes: [],
            expenses:[]
        };

        try {
            console.log("Sending new category:", newCategory);
            const response = await api.post("/api/category", newCategory);
            setCategories([...categories, response.data]);
            setShowModal(false);
            setCategoryName("");
            setCategoryColor(getRandomPastel());
        } catch (error) {
            console.error("Error adding category:", error.response?.data || error.message);
        }
    };

    // Delete category
    const handleDeleteCategory = async (cid) => {
        if (!window.confirm("Are you sure you want to delete this category?")) return;

        try {
            const response = await api.delete(`/api/category/${cid}`);

            if (response.status === 200) {
                setCategories(categories.filter(cat => cat.cid !== cid));
                alert("Category deleted successfully!");
            } else {
                console.error("Failed to delete category:", response);
            }
        } catch (error) {
            console.error("Error deleting category:", error.response?.data || error.message);
        }
    };

    // Cancel modal
    const handleCancel = () => {
        setShowModal(false);
        setCategoryName("");
        setCategoryColor(getRandomPastel());
    };

    return (
        <div className="category-page">
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
                    <NavLink to="/report" className={({ isActive }) => (isActive ? "tab active-tab" : "tab")}>Reports</NavLink>
                </nav>

                {/* Main Content */}
                <section className="category-content">
                    <div className="main-content">
                        <div className="main-content-header">
                            <h2>Manage Categories</h2>
                            <button className="add-category-btn" onClick={() => setShowModal(true)}>
                                + Add Category
                            </button>
                        </div>

                        {/* Category list */}
                        <div className="category-row">
                            {categories.length > 0 ? (
                                categories.map((cat) => (
                                    <div key={cat.cid} className="category-card">
                                        <div className="card-header" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <div
                                                style={{
                                                    width: "20px",
                                                    height: "20px",
                                                    backgroundColor: cat.color,
                                                    borderRadius: "4px",
                                                }}
                                            ></div>
                                            <div className="category-name">{cat.cname}</div>
                                        </div>
                                        <div className="actions">
                                            <i className="fas fa-pencil-alt"></i>
                                            <i
                                                className="fas fa-trash-alt"
                                                style={{ cursor: "pointer" }}
                                                onClick={() => handleDeleteCategory(cat.cid)}
                                            ></i>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No categories added yet.</p>
                            )}
                        </div>
                    </div>
                </section>

               

                {/* Add Category Modal */}
                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h3>Add New Category</h3>
                            <input
                                type="text"
                                placeholder="Enter category name"
                                value={categoryName}
                                onChange={(e) => setCategoryName(e.target.value)}
                            />
                            <div className="modal-actions">
                                <button onClick={handleSaveCategory}>Save</button>
                                <button onClick={handleCancel} className="cancel-btn">Cancel</button>
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
