import React from "react";
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budget from './pages/Budget';
import SavingsGoals from './pages/SavingsGoals';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div>
      <h1>ihhihihtrrhrth</h1>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="budget" element={<Budget />} />
        <Route path="savings" element={<SavingsGoals />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
    </div>
  );
}

export default App;
