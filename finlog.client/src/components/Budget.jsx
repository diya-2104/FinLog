import React from "react";
import "../styles/Budget.css";

const Budget = () => {
    return (
        <div className="budget">
            <h2>Budget Overview</h2>
            <div className="budget-categories">
                <div>
                    <div className="budget-label">
                        <span>Groceries</span>
                        <span>$210/$300</span>
                    </div>
                    <div className="progress-bar">
                        <span style={{ backgroundColor: "#3B82F6", width: "70%" }}></span>
                    </div>
                </div>

                <div>
                    <div className="budget-label">
                        <span>Entertainment</span>
                        <span>$90/$150</span>
                    </div>
                    <div className="progress-bar">
                        <span style={{ backgroundColor: "#8B5CF6", width: "60%" }}></span>
                    </div>
                </div>

                <div>
                    <div className="budget-label">
                        <span>Dining Out</span>
                        <span>$140/$200</span>
                    </div>
                    <div className="progress-bar">
                        <span style={{ backgroundColor: "#EF4444", width: "70%" }}></span>
                    </div>
                </div>

                <div>
                    <div className="budget-label">
                        <span>Transportation</span>
                        <span>$60/$100</span>
                    </div>
                    <div className="progress-bar">
                        <span style={{ backgroundColor: "#10B981", width: "60%" }}></span>
                    </div>
                </div>

                <div>
                    <div className="budget-label">
                        <span>Utilities</span>
                        <span>$180/$220</span>
                    </div>
                    <div className="progress-bar">
                        <span style={{ backgroundColor: "#FBBF24", width: "82%" }}></span>
                    </div>
                </div>
            </div>

            <button className="btn-manage">Manage Budgets</button>
        </div>
    );
};

export default Budget;
