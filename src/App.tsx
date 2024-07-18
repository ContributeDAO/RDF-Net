import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ConnectWallet from "./components/ConnectWallet";
import Home from "./components/Home";
import Profile from "./components/Profile";
import "./App.css";
import "./global.css";

const App: React.FC = () => {
  return (
    <Router>
      <div className="container">
        <header>
          <h1>Crowdfunding Platform</h1>
          <ConnectWallet />
        </header>
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
