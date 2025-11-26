import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Dashboard from "./components/Dashboard";
import Income from "./components/Income";
import Expense from "./components/Expense";
import Category from "./components/Category";
import Account from "./components/Account";
import Transaction from "./components/Transaction";
import Report from "./components/Report";
import FinanceTracker from "./components/FinanceTracker";
import Profile from "./components/Profile";
import "./styles/FinanceTracker.css";

// Admin pages
import AdminLogin from "./admin/pages/AdminLogin";
import AdminDashboard from "./admin/pages/Dashboard";
import RequireAdmin from "./admin/pages/RequireAdmin";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/income" element={<Income />} />
                <Route path="/expense" element={<Expense />} />
                <Route path="/category" element={<Category />} />
                <Route path="/account" element={<Account />} />
                <Route path="/transaction" element={<Transaction />} />
                <Route path="/report" element={<Report />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/finance-tracker" element={<FinanceTracker userId={1} />} />

                {/* Admin routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={
                    <RequireAdmin>
                        <AdminDashboard />
                    </RequireAdmin>
                } />
            </Routes>
        </Router>
    );
}

export default App;