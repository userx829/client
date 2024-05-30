import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

// Create a new context for profile data
const ProfileContext = createContext();

// Custom hook to use the ProfileContext
export const useProfileData = () => {
  return useContext(ProfileContext);
};

// ProfileProvider component to wrap your application and provide profile data
export const ProfileProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(() => {
    const storedUserDetails = localStorage.getItem("userDetails");
    return storedUserDetails ? JSON.parse(storedUserDetails) : null;
  });
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

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
          localStorage.setItem("userDetails", JSON.stringify(userData));
          if (userData.points) {
            localStorage.setItem("userPoints", userData.points);
          }
        } else {
          if (response.status === 401) {
            logout();
            navigate("/login");
          }
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    if (isLoggedIn) {
      fetchUserDetails();
    }
  }, [isLoggedIn, logout, navigate]);

  const updateUserDetails = (data) => {
    setUserDetails(data);
    localStorage.setItem("userDetails", JSON.stringify(data));
    if (data.points !== undefined) {
      localStorage.setItem("userPoints", data.points);
    }
  };

  const addUserPoints = async (pointsToAdd) => {
    try {
      const response = await fetch("http://localhost:5000/api/update-points", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ pointsToAdd }),
      });

      if (response.ok) {
        const result = await response.json();
        const updatedDetails = { ...userDetails, points: result.points };
        updateUserDetails(updatedDetails);
      } else {
        console.error("Failed to add points");
      }
    } catch (error) {
      console.error("Error adding points:", error);
    }
  };

  return (
    <ProfileContext.Provider
      value={{ userDetails, updateUserDetails, addUserPoints }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export { ProfileContext };