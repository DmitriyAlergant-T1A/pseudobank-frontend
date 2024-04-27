// Ensure all imports are at the top of the file
import React, { useEffect, useState } from "react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import WelcomePage from "./components/WelcomePage";
import AuthenticatedAccountPage from "./components/AuthenticatedAccountPage";
import PaydayLoanApplication  from  "./components/PaydayLoanApplication";

import ProtectedRoute from "./components/ProtectedRoute";

import useStore from './store/store';

import './App.css';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/"    element={<WelcomePage />} />
        <Route path="/AuthenticatedAccountPage" element={
          <ProtectedRoute>
            <AuthenticatedAccountPage />
          </ProtectedRoute>
        } />
        <Route path="/PaydayLoanApplication"    element={<PaydayLoanApplication />} />
      </Routes>
    </Router>
  );
}


export default App;