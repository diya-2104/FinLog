import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";
import api from "../api/api";
import "../styles/Report.css";

const Report = () => {
    const [avatarLetter, setAvatarLetter] = useState("");
    const [isLightMode, setIsLightMode] = useState(false);
    const [uid, setUid] = useState(null);

    const navigate = useNavigate();

    // Canvas Refs
    const spendingRef = useRef(null);
    const categoryRef = useRef(null);
    const incomeExpenseRef = useRef(null);
    const monthlyRef = useRef(null);

    // Chart storage
    const chartInstances = useRef([]);

    // Load user from localStorage
    useEffect(() => {
        const data = localStorage.getItem("user");
        if (!data) return;

        const u = JSON.parse(data);
        setAvatarLetter(u.fname ? u.fname[0].toUpperCase() : u.email[0].toUpperCase());
        setUid(u.uid);
    }, []);

    // Month names
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    // Destroy charts before creating new ones
    const destroyCharts = () => {
        chartInstances.current.forEach((chart) => chart.destroy());
        chartInstances.current = [];
    };

    // Theme toggle handler
    const toggleTheme = () => {
        const page = document.querySelector(".report-page");
        page.classList.toggle("light-mode");
        setIsLightMode((prev) => !prev);
    };

    // Load Charts
    useEffect(() => {
        if (!uid) return;

        destroyCharts();

        const textColor = isLightMode ? "#111" : "#fff";
        const gridColor = isLightMode ? "#bbb" : "#555";

        // 1. Daily Spending
        api.get(`/api/Report/daily-spending/${uid}`).then((res) => {
            const labels = res.data.map((d) => d.day);
            const totals = res.data.map((d) => d.total);

            chartInstances.current.push(
                new Chart(spendingRef.current, {
                    type: "line",
                    data: {
                        labels,
                        datasets: [
                            {
                                label: "Daily Spending",
                                data: totals,
                                borderColor: "#60A5FA",
                                backgroundColor: "rgba(96,165,250,0.25)",
                                fill: true,
                                tension: 0.4,
                            },
                        ],
                    },
                    options: {
                        plugins: { legend: { labels: { color: textColor } } },
                        scales: {
                            x: { ticks: { color: textColor }, grid: { color: gridColor } },
                            y: { ticks: { color: textColor }, grid: { color: gridColor } },
                        },
                    },
                })
            );
        });

        // 2. Category Summary
        api.get(`/api/Report/category-summary/${uid}`).then((res) => {
            chartInstances.current.push(
                new Chart(categoryRef.current, {
                    type: "pie",
                    data: {
                        labels: res.data.map((x) => x.category),
                        datasets: [
                            {
                                data: res.data.map((x) => x.total),
                                backgroundColor: [
                                    "#60A5FA",
                                    "#34D399",
                                    "#FBBF24",
                                    "#F472B6",
                                    "#A78BFA",
                                    "#F87171",
                                ],
                            },
                        ],
                    },
                    options: {
                        plugins: { legend: { labels: { color: textColor } } },
                    },
                })
            );
        });

        // 3. Income vs Expense
        api.get(`/api/Report/income-expense/${uid}`).then((res) => {
            const labels = res.data.map((x) => monthNames[x.month - 1]);
            const income = res.data.map((x) => x.income);
            const expense = res.data.map((x) => x.expense);

            chartInstances.current.push(
                new Chart(incomeExpenseRef.current, {
                    type: "bar",
                    data: {
                        labels,
                        datasets: [
                            { label: "Income", data: income, backgroundColor: "#34D399" },
                            { label: "Expense", data: expense, backgroundColor: "#F87171" },
                        ],
                    },
                    options: {
                        plugins: { legend: { labels: { color: textColor } } },
                        scales: {
                            x: { ticks: { color: textColor }, grid: { color: gridColor } },
                            y: { ticks: { color: textColor }, grid: { color: gridColor } },
                        },
                    },
                })
            );
        });

        // 4. Monthly Trend
        api.get(`/api/Report/monthly-trend/${uid}`).then((res) => {
            const labels = res.data.map((x) => monthNames[x.month - 1]);
            const totals = res.data.map((x) => x.total);

            chartInstances.current.push(
                new Chart(monthlyRef.current, {
                    type: "line",
                    data: {
                        labels,
                        datasets: [
                            {
                                label: "Monthly Trend",
                                data: totals,
                                borderColor: "#A78BFA",
                                backgroundColor: "rgba(167,139,250,0.3)",
                                tension: 0.4,
                            },
                        ],
                    },
                    options: {
                        plugins: { legend: { labels: { color: textColor } } },
                        scales: {
                            x: { ticks: { color: textColor }, grid: { color: gridColor } },
                            y: { ticks: { color: textColor }, grid: { color: gridColor } },
                        },
                    },
                })
            );
        });

        return () => destroyCharts();
    }, [uid, isLightMode]);

    return (
        <div className="report-page">
            <div className="inner-container">

                {/* Header */}
                <header className="header">
                    <div className="logo">
                        <i className="fas fa-chart-line"></i> FinLog
                    </div>

                    <div className="header-actions">
                        <button className="theme-toggle-btn" onClick={toggleTheme}>
                            {isLightMode ? (
                                <svg xmlns="http://www.w3.org/2000/svg" stroke="#facc15" fill="none" strokeWidth="2" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="5" />
                                    <line x1="12" y1="1" x2="12" y2="3" />
                                    <line x1="12" y1="21" x2="12" y2="23" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" fill="#fef3c7" stroke="#fef3c7" strokeWidth="2" viewBox="0 0 24 24">
                                    <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
                                </svg>
                            )}
                        </button>

                        <div className="avatar" onClick={() => navigate("/profile")}>
                            {avatarLetter}
                        </div>
                    </div>
                </header>

                {/* Tabs */}
                <nav className="tabs">
                    <NavLink to="/income" className={({ isActive }) => (isActive ? "tab active-tab" : "tab")}>Income</NavLink>
                    <NavLink to="/expense" className={({ isActive }) => (isActive ? "tab active-tab" : "tab")}>Expense</NavLink>
                    <NavLink to="/category" className={({ isActive }) => (isActive ? "tab active-tab" : "tab")}>Category</NavLink>
                    <NavLink to="/account" className={({ isActive }) => (isActive ? "tab active-tab" : "tab")}>Account</NavLink>
                    <NavLink to="/transaction" className={({ isActive }) => (isActive ? "tab active-tab" : "tab")}>Transaction</NavLink>
                    <NavLink to="/report" className={({ isActive }) => (isActive ? "tab active-tab" : "tab")}>Reports</NavLink>
                </nav>

                {/* Charts */}
                <div className="charts-wrapper">
                    <div className="chart-card">
                        <h2><i className="fas fa-chart-line"></i> Daily Spending</h2>
                        <canvas ref={spendingRef}></canvas>
                    </div>

                    <div className="chart-card">
                        <h2><i className="fas fa-wallet"></i> Expense Categories</h2>
                        <canvas ref={categoryRef}></canvas>
                    </div>

                    <div className="chart-card">
                        <h2><i className="fas fa-coins"></i> Income vs Expense</h2>
                        <canvas ref={incomeExpenseRef}></canvas>
                    </div>

                    <div className="chart-card">
                        <h2><i className="fas fa-calendar-alt"></i> Monthly Trend</h2>
                        <canvas ref={monthlyRef}></canvas>
                    </div>
                </div>

                <footer className="footer">
                    © 2025 FinanceTracker. All rights reserved.
                </footer>

            </div>
        </div>
    );
};

export default Report;
