import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "../styles/Category.css";

const Category = () => {
    const [avatarLetter, setAvatarLetter] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const [categories, setCategories] = useState([
        {
            id: 1,
            name: "Shopping",
            amount: "$1,234",
            transactions: 12,
            icon: "???",
            color: "#bfdbfe"
        },
        {
            id: 2,
            name: "Housing",
            amount: "$2,500",
            transactions: 5,
            icon: "??",
            color: "#bbf7d0"
        },
        {
            id: 3,
            name: "Food & Dining",
            amount: "$650",
            transactions: 18,
            icon: "??",
            color: "#fde68a"
        },
        {
            id: 4,
            name: "Transportation",
            amount: "$320",
            transactions: 7,
            icon: "??",
            color: "#e9d5ff"
        }
    ]);

    useEffect(() => {
        const container = document.querySelector(".category-page");
        if (container) container.scrollLeft = 0;

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

    const handleSaveCategory = () => {
        if (categoryName.trim() === "") return;

        const newCategory = {
            id: Date.now(),
            name: categoryName,
            amount: "$0",
            transactions: 0,
            icon: "??",
            color: "#d1d5db"
        };

        setCategories([...categories, newCategory]);
        setShowModal(false);
        setCategoryName("");
    };

    const handleCancel = () => {
        setShowModal(false);
        setCategoryName("");
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

                {/* Main Content */}
                <section className="category-content">
                    <div className="category-header">
                        <h2>Manage Categories</h2>
                        <button className="add-btn" onClick={() => setShowModal(true)}>
                            + Add Category
                        </button>
                    </div>

                    <div className="main-content">
                        {/* First Row: ID 1 & 2 */}
                        <div className="category-row">
                            {categories.filter(cat => cat.id === 1 || cat.id === 2).map(cat => (
                                <div key={cat.id} className="category-card">
                                    <div className="card-header">
                                        <div className="icon" style={{ backgroundColor: cat.color }}>{cat.icon}</div>
                                        <div className="category-name">{cat.name}</div>
                                    </div>
                                    <div className="amount">{cat.amount}</div>
                                    <div className="transactions">{cat.transactions} transactions</div>
                                    <div className="actions">
                                        <a href="#" className="view-details">View Details</a>
                                        <div className="action-icons">
                                            <i className="fas fa-pencil-alt"></i>
                                            <i className="fas fa-trash-alt"></i>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Second Row: ID 3 & 4 */}
                        <div className="category-row">
                            {categories.filter(cat => cat.id === 3 || cat.id === 4).map(cat => (
                                <div key={cat.id} className="category-card">
                                    <div className="card-header">
                                        <div className="icon" style={{ backgroundColor: cat.color }}>{cat.icon}</div>
                                        <div className="category-name">{cat.name}</div>
                                    </div>
                                    <div className="amount">{cat.amount}</div>
                                    <div className="transactions">{cat.transactions} transactions</div>
                                    <div className="actions">
                                        <a href="#" className="view-details">View Details</a>
                                        <div className="action-icons">
                                            <i className="fas fa-pencil-alt"></i>
                                            <i className="fas fa-trash-alt"></i>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Modal */}
                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal">
                            <h3>Add New Category</h3>
                            <input
                                type="text"
                                name="categoryName"
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
            </div>
        </div>
    );
};

export default Category;
