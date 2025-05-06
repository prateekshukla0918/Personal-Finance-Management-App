import React from "react";
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import { FinanceProvider } from './context/FinanceContext';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budget from './pages/Budget';
import SavingsGoals from './pages/SavingsGoals';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import Navbar from "./components/layout/Navbar";
import Layout from './components/layout/Layout';

function App() {
  return (
    <FinanceProvider>
      <Router>
        {/* Render Navbar once, it will always be visible */}
        <Navbar />

        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Nested routes will render inside Layout component */}
            <Route index element={<Dashboard />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="budget" element={<Budget />} />
            <Route path="savings" element={<SavingsGoals />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </FinanceProvider>
  );
}

export default App;
