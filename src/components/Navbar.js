// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <>
      <style>
        {`
          .nav-link:hover .fa-solid {
            color: black; /* Change color on hover */
          }
          .nav-link:hover div {
            color: black; /* Change color on hover */
          }
          @media (max-width: 576px) {
            .nav-link {
              font-size: 0.75rem; /* Decrease font size for small devices */
            }
            .nav-item {
              text-align: center; /* Center text for small devices */
            }
            .nav-item i {
              font-size: 1rem; /* Decrease icon size for small devices */
            }
          }
        `}
      </style>
      <div className="fixed-bottom p-3 text-primary-emphasis bg-white border border-secondary-subtle rounded-3">
        <ul className="nav justify-content-between">
          <li className="nav-item">
            <Link className="nav-link" aria-current="page" to="/">
              <i className="fa-solid fa-house" style={{ fontSize: "20px" }}></i>
              <div>Home</div>
            </Link>
          </li>
          <li className="nav-item icon-link icon-link-hover">
            <Link className="nav-link" to="/color-game">
              <i
                className="fa-solid fa-gamepad"
                style={{ fontSize: "20px" }}
              ></i>
              <div>Win</div>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/aviator">
              <i
                className="fa-solid fa-jet-fighter"
                style={{ fontSize: "20px" }}
              ></i>
              <div>Aviator</div>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/sports">
              <i
                className="fa-solid fa-baseball-bat-ball"
                style={{ fontSize: "20px" }}
              ></i>
              <div>Sports</div>
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/Login">
              <i className="fa-solid fa-user" style={{ fontSize: "20px" }}></i>
              <div>Login</div>
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Navbar;
