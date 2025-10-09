    import React from 'react';
    import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
    import './App.css';
    import Dashboard from "./components/Dashboard";
    import Income from "./components/Income";
    import Expense from "./components/Expense";
   import Category from "./components/Category";

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
                </Routes>
            </Router>
        );
    }

    export default App;