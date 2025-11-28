// src/components/Profile.jsx
import React, { useEffect, useState, useRef } from "react";
import feather from "feather-icons";
import api from "../api/api";
import "./../styles/Profile.css";

const Profile = () => {
    const [user, setUser] = useState({ fname: "", lname: "", email: "" });
    const [error, setError] = useState("");
    const [profileImage, setProfileImage] = useState(null); // no default image

    const fileInputRef = useRef();

    //  Open file dialog when clicking pencil or avatar
    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    //  Show selected image
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl);
        }
    };

    // Logout Function
    const handleLogout = () => {
        // Remove stored user data
        localStorage.removeItem("user");
        localStorage.removeItem("userId");

        alert("You have logged out.");

        // Redirect to login page
        window.location.href = "/Profile";
    };


    useEffect(() => {
        feather.replace();

        const uid = localStorage.getItem("userId");

        if (!uid) {
            setError("User not logged in (no userId in localStorage)");
            return;
        }

        api.get(`/api/Profile/${uid}`)
            .then(res => {
                setUser(res.data);
            })
            .catch(err => {
                console.error("Error loading user:", err);

                if (err.response) {
                    setError(`Failed to load user data (${err.response.status}): ${err.response.data?.message || "Server error"}`);
                } else if (err.request) {
                    setError("No response from server. Backend is not reachable.");
                } else {
                    setError("Request error: " + err.message);
                }
            });

    }, []);

    useEffect(() => {
        feather.replace();
    }, [user]);

    useEffect(() => {
        if (user.fname) {
            localStorage.setItem("user", JSON.stringify(user));
        }
    }, [user]);

    //  Generate first letter avatar
    const getInitialLetter = () => {
        return user.fname ? user.fname.charAt(0).toUpperCase() : "U";
    };

    return (
        <div className="profile-page">
            <div className="inner-container">

                <header className="header">
                    <div className="logo"><i className="fas fa-chart-line"></i>FinTrack</div>
                </header>

                <div className="profile-card">

                    
                    <div className="profile-header">
                        <div
                            className="profile-image-container"
                            style={{ cursor: "pointer" }}
                            onClick={handleImageClick}
                        >

                            
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    className="profile-image"
                                />
                            ) : (
                               
                                <div className="letter-avatar">
                                    {getInitialLetter()}
                                </div>
                            )}

                           
                            <div className="edit-icon">
                                <i data-feather="edit-2"></i>
                            </div>

                           
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                style={{ display: "none" }}
                            />
                        </div>

                        <div className="profile-info">
                            <h1>{`${user.fname} ${user.lname}`}</h1>
                            <p className="role">Financial Analyst</p>
                            <p className="location"><i data-feather="map-pin"></i> San Francisco, CA</p>
                        </div>
                    </div>

                   
                    <div className="info-grid">
                        <div className="info-box">
                            <h2><i data-feather="user"></i> Personal Information</h2>

                            <div className="info-item">
                                <p className="label">First Name</p>
                                <p>{user.fname}</p>
                            </div>
                            <div className="info-item">
                                <p className="label">Last Name</p>
                                <p>{user.lname}</p>
                            </div>
                            <div className="info-item">
                                <p className="label">Date of Birth</p>
                                <p>May 15, 2005</p>
                            </div>
                        </div>

                        <div className="info-box">
                            <h2><i data-feather="mail"></i> Contact Information</h2>

                            <div className="info-item">
                                <p className="label">Email Address</p>
                                <p>{user.email}</p>
                            </div>
                            <div className="info-item">
                                <p className="label">Phone Number</p>
                                <p>(+91) 901-6578-040</p>
                            </div>

                        </div>
                    </div>
                    <div className="action-buttons">
                        <button className="logout-btn" onClick={handleLogout}>Logout</button>
                    </div>


                    {error && <p className="error-text">{error}</p>}

                    <footer className="footer">
                        © 2025 FinanceTracker. All rights reserved.
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default Profile;
