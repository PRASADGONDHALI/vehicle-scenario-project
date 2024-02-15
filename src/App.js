import React from "react";
import "./App.css";
import Navbar from "./Components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import Addscenario from "./Components/Addscenario";
import Allscenarios from "./Components/Allscenarios";
import Addvehicle from "./Components/Addvehicle";

function App() {
  return (
    <div className="app_container">
      <Router>
        <div className="sidebar">
        <Navbar />
        </div>
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/addscenario" element={<Addscenario />} />
            <Route path="/allscenarios" element={<Allscenarios />} />
            <Route path="/addvehicle" element={<Addvehicle />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
