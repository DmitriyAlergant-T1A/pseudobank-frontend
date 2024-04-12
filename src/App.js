// Ensure all imports are at the top of the file
import React, { useEffect, useState } from "react";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import MainPage from "./components/MainPage";
import useStore from './store/store';

import './App.css';

function App() {

  const setConfig = useStore((state) => state.setConfig);

  useEffect(() => {

    console.log("Fetching /config")

    fetch('/config')
      .then((response) => response.json())
      .then((configData) => {
        setConfig(configData);
      });
  }, [setConfig]);
  
  return (
    <Router>
      <Routes>
        <Route path="/"    element={<MainPage />} />
      </Routes>
    </Router>
  );
}


export default App;