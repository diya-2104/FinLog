import React from "react";
import { Link } from "react-router-dom";
import "../styles/Banner.css";

const Banner = () => {
    return (
        <div className="banner">
            <div className="banner-container">
                {/* Repeat finance cards here */}
                <div className="finance-card">
                    <div className="card-content">
                        <div className="card-header">
                            <h3 className="card-title">Total Balance</h3>
                            <i className="fas fa-coins text-yellow-400"></i>
                        </div>
                        <p className="card-value">$5,430.00</p>
                        <p className="card-change">+2.5% from last month</p>
                    </div>
                </div>
                <div className="finance-card">
                    <div className="card-content">
                        <div className="card-header">
                            <h3 className="card-title">Monthly Spending</h3>
                            <i className="fas fa-chart-line text-blue-400"></i>
                        </div>
                        <p className="card-value">$850.50</p>
                        <p className="card-change text-red-400">-5.1% from last month</p>
                    </div>
                </div>
                <div className="finance-card">
                    <div className="card-content">
                        <div className="card-header">
                            <h3 className="card-title">Savings Goal</h3>
                            <i className="fas fa-piggy-bank text-green-400"></i>
                        </div>
                        <p className="card-value">$1,200.00</p>
                        <p className="card-change">+10% of target</p>
                    </div>
                </div>
                <Link to="/income" className="finance-card">
                    <div className="card-content">
                        <div className="card-header">
                            <h3 className="card-title">Investments</h3>
                            <i className="fas fa-chart-pie text-purple-400"></i>
                        </div>
                        <p className="card-value">$12,345.00</p>
                        <p className="card-change text-green-400">+7.8% YTD</p>
                    </div>
                </Link>
                <div className="finance-card">
                    <div className="card-content">
                        <div className="card-header">
                            <h3 className="card-title">Credit Score</h3>
                            <i className="fas fa-star text-orange-400"></i>
                        </div>
                        <p className="card-value">785</p>
                        <p className="card-change">+15 points</p>
                    </div>
                </div>
                {/* Duplicate these cards as needed for the continuous scroll effect */}
            </div>
        </div>
    );
};

export default Banner;