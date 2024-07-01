import React, { useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { PrivateRoute } from "./components/PrivateRoute";
import ColorGame from "./components/games/ColorGame";
import Color from "./components/games/Color";
import Navbar from "./components/Navbar";
import Navbar_s from "./components/games/Navbar_s";
import Home from "./components/games/Home";
import { TimerProvider } from "./components/context/TimerContext";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Aviator from "./components/games/Aviator";
import Profile from "./components/Profile";
import Recharge from "./components/Recharge";
import { AuthProvider, useAuth } from "./components/context/AuthContext";
import { ProfileProvider } from "./components/context/ProfileContext";
import {
  HeaderColorProvider,
  HeaderColorContext,
} from "./components/context/HeaderColorContext";
import { WebSocketProvider } from './components/context/WebSocketContext';

import { RulesProvider, RulesContext } from "./components/context/RulesContext";

const LoginRoute = () => {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/profile");
    }
  }, [isLoggedIn, navigate]);

  return !isLoggedIn && <Login />;
};

const Main = () => {
  const location = useLocation();
  const { setHeaderColor } = useContext(HeaderColorContext);
  const { setRulesContent } = useContext(RulesContext);

  useEffect(() => {
    switch (location.pathname) {
      case "/aviator":
        setHeaderColor("bg-info-subtle");
        setRulesContent("Rules for Aviator game: ...");
        break;
      case "/color-game":
        setHeaderColor("bg-danger-subtle");
        setRulesContent("Rules for Color Game: ...");
        break;
      case "/sports":
        setHeaderColor("bg-warning-subtle");
        setRulesContent("Sports rules: ...");
        break;
      default:
        setHeaderColor("bg-dark-subtle");
        setRulesContent("General rules: ...");
        break;
    }
  }, [location.pathname, setHeaderColor, setRulesContent]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route element={<PrivateRoute />}>
        <Route path="/color-game" element={<ColorGame />} />
        <Route path="/aviator" element={<Aviator />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/sports" element={<Color />} />
      </Route>
      <Route path="/login" element={<LoginRoute />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/recharge" element={<Recharge />} />
    </Routes>
  );
};

const Layout = () => {
  const location = useLocation();

  return (
    <div className="App">
      <Navbar />
      {location.pathname.includes("games") && <Navbar_s />}
      <Main />
    </div>
  );
};

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <AuthProvider>
        <WebSocketProvider>
          <HeaderColorProvider>
            <ProfileProvider>
              <RulesProvider>
                <TimerProvider>
                  <Layout />
                </TimerProvider>
              </RulesProvider>
            </ProfileProvider>
          </HeaderColorProvider>
        </WebSocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
