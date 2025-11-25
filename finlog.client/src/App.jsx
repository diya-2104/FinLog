    import React from 'react';
    import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
    import './App.css';
    import Dashboard from "./components/Dashboard";
    import Income from "./components/Income";
    import Expense from "./components/Expense";
    import Category from "./components/Category";
    import Transaction from "./components/Transaction";
    import Profile from './components/Profile';
    import Report from './components/Report';
   
    function App() {
        return (
            /*<div>
                <Dashboard />
            </div>*/
            <Router>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/income" element={<Income />} />
                    <Route path="/expense" element={<Expense />} />
                    <Route path="/category" element={<Category />} />
                    <Route path="/transaction" element={<Transaction />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/report" element={<Report />} />
                   


                </Routes>
            </Router>
        );
    }

    export default App;