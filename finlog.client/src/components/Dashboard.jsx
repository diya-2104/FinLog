import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Banner from "./Banner";
import DashboardWidgets from "./DashboardWidgets";
import api from "../api/api";
import "../styles/Dashboard.css";

const Dashboard = () => {
    const [income, setIncome] = useState(0);
    const [expense, setExpense] = useState(0);
    const [categories, setCategories] = useState(0);
    const [accountBalance, setAccountBalance] = useState(0);

    useEffect(() => {
        // 1?? Check localStorage
        const localUser = localStorage.getItem("user");
        console.log("Local User from localStorage:", localUser);

        if (!localUser) {
            console.warn("No user found in localStorage. Please log in.");
            return;
        }

        const user = JSON.parse(localUser);
        console.log("Parsed user object:", user);

        const uid = user.uid || user.id;
        console.log("Using UID:", uid);

        if (!uid) {
            console.warn("UID not found for logged-in user.");
            return;
        }

        const fetchDashboardData = async () => {
            try {
                // 2?? Fetch all data with /api prefix
                const [incomeRes, expenseRes, catRes, accRes] = await Promise.all([
                    api.get(`/api/income/user/${uid}`),
                    api.get(`/api/expense/user/${uid}`),
                    api.get(`/api/category?uid=${uid}`),
                    api.get(`/api/account?uid=${uid}`),
                ]);

                // 3?? Log payloads
                console.log("Income payload:", incomeRes.data);
                console.log("Expense payload:", expenseRes.data);
                console.log("Categories payload:", catRes.data);
                console.log("Accounts payload:", accRes.data);

                // 4?? Calculate totals
                const totalIncome = (incomeRes.data || []).reduce(
                    (sum, i) => sum + parseFloat(i.amount || 0),
                    0
                );

                const totalExpense = (expenseRes.data || []).reduce(
                    (sum, e) => sum + parseFloat(e.eamount || 0),
                    0
                );

                const totalCategories = (catRes.data || []).length;

                const totalAccountBalance = (accRes.data || []).map(account => {
                    const incomeSum = (incomeRes.data || [])
                        .filter(i => i.account_id === account.id || i.account_id === account.account_id)
                        .reduce((sum, i) => sum + parseFloat(i.amount || 0), 0);

                    const expenseSum = (expenseRes.data || [])
                        .filter(e => e.account_id === account.id || e.account_id === account.account_id)
                        .reduce((sum, e) => sum + parseFloat(e.eamount || 0), 0);

                    return incomeSum - expenseSum;
                }).reduce((sum, b) => sum + b, 0);


                // 5?? Set state
                setIncome(totalIncome);
                setExpense(totalExpense);
                setCategories(totalCategories);
                setAccountBalance(totalAccountBalance);

            } catch (error) {
                console.error("Error fetching dashboard data:", error.response || error.message || error);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="dashboard">
            <Header />
            <main className="dashboard-main">
                <Banner />
                <DashboardWidgets
                    income={income}
                    expense={expense}
                    categories={categories}
                    accountBalance={accountBalance}
                />
            </main>
            <Footer />
        </div>
    );
};

export default Dashboard;
