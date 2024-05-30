// Header.js
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    // Clear the token from local storage
    localStorage.removeItem("token");
    // Redirect to the login page
    navigate("/login");
  };

  return (
    <nav className="navbar bg-body-tertiary">
      <div className="container-fluid">
        <span className="navbar-brand mb-0 h1">Header</span>
        {token ? (
          <button className="btn btn-outline-primary" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <Link to={{ pathname: "/login", state: { from: location.pathname } }}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Header;
