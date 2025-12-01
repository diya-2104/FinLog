import React from "react";
import "../styles/DashboardWidgets.css";

const DashboardWidgets = ({ income, expense, categories, accountBalance }) => {

    const balance = accountBalance || (income - expense);

    // Currency formatter
    const formatCurrency = (amount) => {
        return `\u20B9${amount.toLocaleString("en-IN")}`;
    };

    return (
        <div className="dashboard-widgets">

            <div className="summary-container">

                <div className="summary-card income-card">
                    <h3>Total Income</h3>
                    <div className="amount">{formatCurrency(income)}</div>
                    <span className="tag positive">Income</span>
                </div>

                <div className="summary-card expense-card">
                    <h3>Total Expense</h3>
                    <div className="amount">{formatCurrency(expense)}</div>
                    <span className="tag negative">Expense</span>
                </div>

                <div className="summary-card balance-card">
                    <h3>Balance</h3>
                    <div className="amount">{formatCurrency(balance)}</div>
                    <span className="tag stable">Balance</span>
                </div>

                <div className="summary-card categories-card">
                    <h3>Total Categories</h3>
                    <div className="amount">{categories}</div>
                    <span className="tag stable">Categories</span>
                </div>

            </div>

            <div className="savings-card">
                <h2>You saved {formatCurrency(balance)} this month!</h2>
                <p>You are doing better than last month. Keep it up!</p>
            </div>

        </div>
    );
};

export default DashboardWidgets;
