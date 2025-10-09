import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Banner from "./Banner";
import Transactions from "./Transactions";
import Budget from "./Budget";
import Goals from "./Goals";
import "../styles/Dashboard.css";

const Dashboard = () => {
    return (
        <div className="dashboard">
            <Header />

            <main className="dashboard-main">
                <Banner />
                <div className="dashboard-grid">
                    <Transactions/>
                    <Budget />
                </div>
                <Goals />
            </main>

            <Footer />
        </div>
    );
};

export default Dashboard;
