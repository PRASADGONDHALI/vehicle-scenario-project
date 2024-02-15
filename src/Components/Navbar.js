import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css'; 

const Navbar = () => {
  return (
    <div className="navbar">
      <NavLink to="/" className="nav-link" activeClassName="active">
        Home
      </NavLink>
      <NavLink to="/Addscenario" className="nav-link" activeClassName="active">
        Add Scenario
      </NavLink>
      <NavLink to="/Allscenarios" className="nav-link" activeClassName="active">
        All Scenarios
      </NavLink>
      <NavLink to="/Addvehicle" className="nav-link" activeClassName="active">
        Add Vehicle
      </NavLink>
    </div>
  );
};

export default Navbar;
