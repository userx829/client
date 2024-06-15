import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Login from './Login';

export const PrivateRoute = () => {
    const navigate = useNavigate();
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token"); // Retrieve JWT token from localStorage
        if (!token) {
            navigate('/login'); // Redirect to login page if token is not found
            return;
        }

        fetch(`${process.env.REACT_APP_PROFILE_URL}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token // Include JWT token in the request headers
            },
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Authentication failed');
            }
        })
        .then(jsonData => {
            setAuthenticated(true); // Set authenticated state to true if profile request succeeds
        })
        .catch(error => {
            console.error('Error during authentication:', error);
            setAuthenticated(false);
            navigate('/login'); // Redirect to login page if there's an error or token is invalid
        });
    }, [navigate]);

    return (
        <div>
            {authenticated ? (
                <Outlet /> // Render child routes
            ) : (
                <Login />
            )}
        </div>
    );
};
