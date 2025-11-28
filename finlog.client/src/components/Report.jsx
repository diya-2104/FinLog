import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "chart.js/auto";
import api from "../api/api";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "../styles/Report.css";

const Report = () => {
    const [avatarLetter, setAvatarLetter] = useState("");
    const navigate = useNavigate();

    // Canvas Refs
    const spendingRef = useRef(null);
    const categoryRef = useRef(null);
    const incomeExpenseRef = useRef(null);
    const monthlyRef = useRef(null);

    // Chart instances storage
    const chartInstances = useRef([]);

    const [uid, setUid] = useState(null);

    // Fetch User ID
    useEffect(() => {
        const data = localStorage.getItem("user");
        if (!data) return;
        const u = JSON.parse(data);
        setAvatarLetter(u.fname ? u.fname[0].toUpperCase() : u.email[0].toUpperCase());
        setUid(u.uid);
    }, []);

    // Convert month number ? name
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    useEffect(() => {
        if (!uid) return;

        // DESTROY OLD CHARTS
        chartInstances.current.forEach((chart) => chart.destroy());
        chartInstances.current = [];

        // -----------------------------
        // 1. DAILY SPENDING API
        // -----------------------------
        api.get(`/api/Report/daily-spending/${uid}`).then((res) => {
            const labels = [];
            const totals = [];

            res.data.forEach((d) => {
                labels.push(d.day);
                totals.push(d.total);
            });

            chartInstances.current.push(
                new Chart(spendingRef.current, {
                    type: "line",
                    data: {
                        labels,
                        datasets: [
                            {
                                label: "Daily Spending",
                                data: totals,
                                fill: true,
                                borderColor: "#60A5FA",
                                backgroundColor: "rgba(96,165,250,0.25)",
                                tension: 0.4,
                            },
                        ],
                    },
                    options: {
                        plugins: { legend: { labels: { color: "#fff" } } },
                        scales: {
                            x: { ticks: { color: "#ccc" } },
                            y: { ticks: { color: "#ccc" } },
                        },
                    },
                })
            );
        });

        // -----------------------------
        // 2. CATEGORY SUMMARY API
        // -----------------------------
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
                        plugins: { legend: { labels: { color: "#fff" } } },
                    },
                })
            );
        });

        // -----------------------------
        // 3. INCOME VS EXPENSE API
        // -----------------------------
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
                            {
                                label: "Income",
                                data: income,
                                backgroundColor: "#34D399",
                            },
                            {
                                label: "Expense",
                                data: expense,
                                backgroundColor: "#F87171",
                            },
                        ],
                    },
                    options: {
                        plugins: { legend: { labels: { color: "#fff" } } },
                        scales: {
                            x: { ticks: { color: "#ccc" } },
                            y: { ticks: { color: "#ccc" } },
                        },
                    },
                })
            );
        });

        // -----------------------------
        // 4. MONTHLY TREND API
        // -----------------------------
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
                        plugins: { legend: { labels: { color: "#fff" } } },
                        scales: {
                            x: { ticks: { color: "#ccc" } },
                            y: { ticks: { color: "#ccc" } },
                        },
                    },
                })
            );
        });

        return () => {
            chartInstances.current.forEach((chart) => chart.destroy());
        };
    }, [uid]);

    return (
        <div className="report-page">
            <div className="inner-container">
                <Navbar avatarLetter={avatarLetter} />

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

                <Footer />
            </div>
        </div>
    );
};

export default Report;
