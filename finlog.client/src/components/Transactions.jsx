import React from "react";
import "../styles/Transactions.css";

const Transactions = () => {
    return (
        <div className="transactions">
            <div className="transactions-header">
                <h2>Recent Transactions</h2>
                <button className="add-transaction">
                    <i className="fas fa-plus" style={{ marginRight: "6px" }}></i> Add Transaction
                </button>
            </div>

            <div className="transaction-list">
                {/* Grocery Shopping */}
                <div className="transaction-item">
                    <div className="transaction-left">
                        <div className="icon" style={{ backgroundColor: "#3B82F6" }}>
                            <i className="fas fa-shopping-bag"></i>
                        </div>
                        <div>
                            <h3>Grocery Shopping</h3>
                            <p>Supermarket</p>
                        </div>
                    </div>
                    <div className="transaction-right">
                        <p className="amount expense">-$85.30</p>
                        <p>Today, 10:45 AM</p>
                    </div>
                </div>

                {/* Salary */}
                <div className="transaction-item">
                    <div className="transaction-left">
                        <div className="icon" style={{ backgroundColor: "#10B981" }}>
                            <i className="fas fa-money-bill-wave"></i>
                        </div>
                        <div>
                            <h3>Salary</h3>
                            <p>Company Inc.</p>
                        </div>
                    </div>
                    <div className="transaction-right">
                        <p className="amount income">+$3,200.00</p>
                        <p>Yesterday</p>
                    </div>
                </div>

                {/* Clothing */}
                <div className="transaction-item">
                    <div className="transaction-left">
                        <div className="icon" style={{ backgroundColor: "#8B5CF6" }}>
                            <i className="fas fa-tshirt"></i>
                        </div>
                        <div>
                            <h3>Clothing</h3>
                            <p>Fashion Store</p>
                        </div>
                    </div>
                    <div className="transaction-right">
                        <p className="amount expense">-$120.50</p>
                        <p>Mar 15, 2:30 PM</p>
                    </div>
                </div>

                {/* Dinner */}
                <div className="transaction-item">
                    <div className="transaction-left">
                        <div className="icon" style={{ backgroundColor: "#FBBF24" }}>
                            <i className="fas fa-utensils"></i>
                        </div>
                        <div>
                            <h3>Dinner</h3>
                            <p>Italian Restaurant</p>
                        </div>
                    </div>
                    <div className="transaction-right">
                        <p className="amount expense">-$45.20</p>
                        <p>Mar 14, 7:15 PM</p>
                    </div>
                </div>
            </div>

            <button className="view-all">View All Transactions</button>
        </div>
    );
};

export default Transactions;
