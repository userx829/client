// TimerContext.js
import React, { createContext, useState, useContext, useEffect } from "react";

const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const [countdown, setCountdown] = useState({ minutes: 1, seconds: 0 });
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [results, setResults] = useState([]);

  // Function to update countdown state
  const updateCountdown = (newCountdown) => {
    setCountdown(newCountdown);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (countdown.seconds === 0) {
        if (countdown.minutes === 0) {
          clearInterval(timer);
          return;
        }
        setCountdown({ minutes: countdown.minutes - 1, seconds: 59 });
      } else {
        setCountdown({ ...countdown, seconds: countdown.seconds - 1 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  return (
    <TimerContext.Provider
      value={{
        countdown,
        updateCountdown,
        buttonsDisabled,
        setButtonsDisabled,
        results,
        setResults,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => useContext(TimerContext);
