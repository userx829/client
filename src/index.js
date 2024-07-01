import React from "react";
import { createRoot } from "react-dom"; // Import createRoot
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./components/context/AuthContext"; // Import AuthProvider
import { HistoryProvider } from "./components/context/HistoryContext";

const root = createRoot(document.getElementById("root")); // Use createRoot instead of ReactDOM.render
root.render(
  <React.StrictMode>
    <AuthProvider>
      <HistoryProvider>
        <App />
      </HistoryProvider>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
