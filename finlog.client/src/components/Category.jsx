import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Navbar from "./Navbar";
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
                <Navbar avatarLetter={avatarLetter} />

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
                    � 2025 FinanceTracker. All rights reserved.
                </footer>
            </div>
        </div>
    );
};

export default Category;
