import React, { createContext, useState, useEffect, useRef } from 'react';

export const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const [ws, setWs] = useState(null);
  const [countdown, setCountdown] = useState(10);
  const [showCountdown, setShowCountdown] = useState(true);
  const [currentValue, setCurrentValue] = useState(1);
  const [planeTookOff, setPlaneTookOff] = useState(false);
  const countdownTimerRef = useRef(null);

  useEffect(() => {
    const newWs = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
    setWs(newWs);

    newWs.onmessage = (event) => {
      const message = event.data;
      console.log("WebSocket message received:", message);
    };

    newWs.onclose = () => {
      console.log("WebSocket closed, attempting to reconnect...");
      setTimeout(() => {
        setWs(new WebSocket(process.env.REACT_APP_WEBSOCKET_URL));
      }, 5000);
    };

    return () => {
      newWs.close();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ ws, setWs, countdown, setCountdown, showCountdown, setShowCountdown, currentValue, setCurrentValue, planeTookOff, setPlaneTookOff }}>
      {children}
    </WebSocketContext.Provider>
  );
};
