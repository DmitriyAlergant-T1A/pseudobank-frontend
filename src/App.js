// Ensure all imports are at the top of the file
import React, { useEffect, useState } from "react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import MainPage from "./components/MainPage";

import './App.css';

function App() {

  const [config, setConfig] = useState({});

  useEffect(() => {
    fetch('/config')
      .then((response) => response.json())
      .then((configData) => {
        setConfig(configData);
      });
  }, []);
  
  return (
    <Router>
      <Routes>
        <Route path="/"     element={<LoginPage />} />
        <Route path="/main" element={<MainPage />} />
      </Routes>
    </Router>
  );
}


export default App;