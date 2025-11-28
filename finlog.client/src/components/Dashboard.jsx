import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Banner from "./Banner";
import DashboardWidgets from "./DashboardWidgets";
import api from "../api/api"; 
//import Transactions from "./Transactions";
//import Budget from "./Budget";
//import Goals from "./Goals";
import "../styles/Dashboard.css";

const Dashboard = () => {

    const [income, setIncome] = useState(0);
    const [expense, setExpense] = useState(0);
    const [categories, setCategories] = useState(0);
    const [accountBalance, setAccounts] = useState(0);

   useEffect(() => {
        // ? Load saved values from localStorage FIRST (prevents flashing 0)
        const localUser = localStorage.getItem("user");

        if (localUser) {
            const u = JSON.parse(localUser);

            setIncome(u.totalIncome || 0);
            setExpense(u.totalExpense || 0);
            setCategories(u.totalCategory || 0);
            setAccounts(u.balance || 0);
        }

        // Then call API for latest values
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const incomeRes = await api.get("/income/total");
            const expenseRes = await api.get("/expense/total");
            const catRes = await api.get("/category/count");
            const accRes = await api.get("/account/balance"); 

            setIncome(incomeRes.data.totalIncome || 0);
            setExpense(expenseRes.data.totalExpense || 0);
            setCategories(catRes.data.totalCategories || 0);
            setAccounts(accRes.data.totalAccounts || 0);

        } catch (error) {
            console.log("Dashboard fetch error:", error);
        }
    };

    return (
        <div className="dashboard">
            <Header />

            <main className="dashboard-main">
                <Banner />

                {/* ?? Pass dynamic data here */}

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