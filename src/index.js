import React from 'react';
import { createRoot } from 'react-dom'; // Import createRoot
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './components/AuthContext'; // Import AuthProvider
import { HistoryProvider } from './components/HistoryContext';

const root = createRoot(document.getElementById('root')); // Use createRoot instead of ReactDOM.render
root.render(
  <React.StrictMode>
    <AuthProvider> {/* Wrap your App component with AuthProvider */}
    <HistoryProvider>

      <App />
      </HistoryProvider>

    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
