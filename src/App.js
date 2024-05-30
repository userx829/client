import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { PrivateRoute } from "./components/PrivateRoute";
import ColorGame from "./components/games/ColorGame";
import Color from "./components/games/Color";
import Navbar from "./components/Navbar";
import Home from "./components/games/Home";
import { TimerProvider } from "./components/TimerContext";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Aviator from "./components/games/Aviator";
import Profile from "./components/Profile";
import { AuthProvider, useAuth } from "./components/AuthContext";
import { ProfileProvider } from "./components/ProfileContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Recharge from "./components/Recharge";

function App() {
  return (
    <Router>
      <ProfileProvider>
        <div className="App">
          <Navbar />
          <TimerProvider>
               <Routes>
                <Route path="/" element={<Home />} />
                <Route element={<PrivateRoute />}>
                  <Route path="/color-game" element={<ColorGame />} />
                  <Route path="/aviator" element={<Aviator />} />
                  <Route path="/profile" element={<Profile />} />
                </Route>
                <Route path="/color" element={<Color />} />

                <Route path="/login" element={<LoginRoute />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/recharge" element={<Recharge />} />
              </Routes>
           </TimerProvider>
        </div>
      </ProfileProvider>
    </Router>
  );
}
const LoginRoute = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate(); // Get navigate function from useNavigate

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/profile"); // Redirect to profile if logged in
    }
  }, [isLoggedIn, navigate]);

  // Render the login form if not logged in
  return !isLoggedIn && <Login />;
};

export default App;
