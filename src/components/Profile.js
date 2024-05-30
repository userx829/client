import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // Import useAuth hook

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth(); // Use useAuth hook to get isLoggedIn state and logout function

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": localStorage.getItem("token"),
          },
        });
        if (response.ok) {
          const userData = await response.json();
          setUserDetails(userData);
        } else {
          // Handle error response
          if (response.status === 401) {
            logout(); // Logout if unauthorized
            navigate("/login");
          }
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        // Handle fetch error
      }
    };

    if (isLoggedIn) {
      fetchUserDetails();
    }
  }, [isLoggedIn, logout, navigate]);

  const handleLogout = () => {
    logout(); // Clear token from localStorage and logout
    navigate("/login"); // Redirect user to login page
  };

  if (!isLoggedIn) {
    // If user is not logged in, no need to render the profile page
    return null;
  }

  return (
    <>
      <nav className="navbar bg-body-tertiary">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">
            <h3>Profile</h3>
          </span>
          <button className="btn btn-primary" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
      <div className="card  ">
        <div className="card-header bg-info-subtle">
          <h5>User Details</h5>
        </div>
        <div className="card-body d-flex flex-column justify-content-start">
          <h5 className="card-title">Name: {userDetails?.name}</h5>
          <p className="card-text">Email Id: {userDetails?.email}</p>
          <p className="card-text">Phone: </p>
          <p className="card-text">
            {userDetails && (
              <>
                Available Points: {userDetails.points}
                {/* Display available points */}
              </>
            )}{" "}
          </p>
        </div>
      </div>
      <div className="accordion accordion-flush" id="accordionFlushExample">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#flush-collapseOne"
              aria-expanded="false"
              aria-controls="flush-collapseOne"
            >
              Wallet
            </button>
          </h2>
          <div
            id="flush-collapseOne"
            className="accordion-collapse collapse"
            data-bs-parent="#accordionFlushExample"
          >
            <div className="accordion-body">
              <div className="list-group">
                <a
                  href="#"
                  className="list-group-item list-group-item-action"
                  aria-current="true"
                >
                  Recharge
                </a>
                <a href="#" className="list-group-item list-group-item-action">
                  Withdrawal
                </a>
                <a href="#" className="list-group-item list-group-item-action">
                  Transactions
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#flush-collapseTwo"
              aria-expanded="false"
              aria-controls="flush-collapseTwo"
            >
              Support & Contact{" "}
            </button>
          </h2>
          <div
            id="flush-collapseTwo"
            className="accordion-collapse collapse"
            data-bs-parent="#accordionFlushExample"
          >
            <div className="accordion-body">
              Placeholder content for this accordion, which is intended to
              demonstrate the <code>.accordion-flush</code> class. This is the
              second item's accordion body. Let's imagine this being filled with
              some actual content.
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#flush-collapseThree"
              aria-expanded="false"
              aria-controls="flush-collapseThree"
            >
              About
            </button>
          </h2>
          <div
            id="flush-collapseThree"
            className="accordion-collapse collapse"
            data-bs-parent="#accordionFlushExample"
          >
            <div className="accordion-body">
              Placeholder content for this accordion, which is intended to
              demonstrate the <code>.accordion-flush</code> class. This is the
              third item's accordion body. Nothing more exciting happening here
              in terms of content, but just filling up the space to make it
              look, at least at first glance, a bit more representative of how
              this would look in a real-world application.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
