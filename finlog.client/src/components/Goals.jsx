import React from "react";
import "../styles/Goals.css";

const Goals = () => {
    return (
        <div className="goals">
            <div className="goals-header">
                <h2>Financial Goals</h2>
                <button className="add-goal">
                    <i className="fas fa-plus" style={{ marginRight: "6px" }}></i> Add Goal
                </button>
            </div>

            <div className="goals-grid">
                {/* Emergency Fund */}
                <div className="goal-card">
                    <div className="goal-card-header">
                        <h3>Emergency Fund</h3>
                        <i className="fas fa-shield-alt" style={{ color: "#60A5FA" }}></i>
                    </div>
                    <div className="goal-card-meta">
                        <span>Progress</span>
                        <span><strong>65%</strong></span>
                    </div>
                    <div className="goal-progress">
                        <span style={{ backgroundColor: "#3B82F6", width: "65%" }}></span>
                    </div>
                    <div className="goal-card-footer">
                        <span>$3,250/$5,000</span>
                        <span style={{ color: "#60A5FA" }}>3 months left</span>
                    </div>
                </div>

                {/* Vacation Fund */}
                <div className="goal-card">
                    <div className="goal-card-header">
                        <h3>Vacation Fund</h3>
                        <i className="fas fa-umbrella-beach" style={{ color: "#34D399" }}></i>
                    </div>
                    <div className="goal-card-meta">
                        <span>Progress</span>
                        <span><strong>30%</strong></span>
                    </div>
                    <div className="goal-progress">
                        <span style={{ backgroundColor: "#10B981", width: "30%" }}></span>
                    </div>
                    <div className="goal-card-footer">
                        <span>$600/$2,000</span>
                        <span style={{ color: "#34D399" }}>8 months left</span>
                    </div>
                </div>

                {/* New Car */}
                <div className="goal-card">
                    <div className="goal-card-header">
                        <h3>New Car</h3>
                        <i className="fas fa-car" style={{ color: "#C084FC" }}></i>
                    </div>
                    <div className="goal-card-meta">
                        <span>Progress</span>
                        <span><strong>12%</strong></span>
                    </div>
                    <div className="goal-progress">
                        <span style={{ backgroundColor: "#8B5CF6", width: "12%" }}></span>
                    </div>
                    <div className="goal-card-footer">
                        <span>$1,200/$10,000</span>
                        <span style={{ color: "#C084FC" }}>24 months left</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Goals;
