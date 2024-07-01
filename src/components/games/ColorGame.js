import React, { useState, useEffect, useContext } from "react";
import { useTimer } from "../context/TimerContext";
import JoinModal from "./JoinModal";
import NumberModal from "./NumberModal";
import Navbar_s from "./Navbar_s";

import "./Aviator.css";

import { ProfileContext, useProfileData } from "../context/ProfileContext";

function ColorGame() {
  const { countdown, updateCountdown, results, setResults } = useTimer();
  const { userDetails } = useProfileData();
  const [userProfile, setUserProfile] = useState(userDetails);

  useEffect(() => {
    const timer = setInterval(() => {
      updateCountdown((prevCountdown) => {
        const newSeconds = prevCountdown.seconds === 0 ? 59 : prevCountdown.seconds - 1;
        const newMinutes = newSeconds === 59 ? prevCountdown.minutes - 1 : prevCountdown.minutes;
        
        return { minutes: newMinutes, seconds: newSeconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [updateCountdown]);

  useEffect(() => {
    if (countdown.minutes === 0 && countdown.seconds === 0) {
      fetchResults();
    }
  }, [countdown]);

  const fetchResults = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/trade/results");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching results:", error);
    }
  };

  return (
    <ProfileContext.Provider value={{ userProfile, setUserProfile }}>
      <>
        <style>
          {` .Modal-btn{
           height: 4vw;
           width: 9vw;
           margin: 1vw;
        }
        
        .btn-info {
            height: 4vw;
            width: 9vw;
            margin: 1vw;
          }
          
          @media (max-width: 576px) {
            .btn-info {
              height: 5vh;
              width: 11vw;
              margin: 3vw;
            }
            .Modal-btn{
              height: 10vw;
              width: 26vw;
            }
            .modal-body{
                font-size:13px;
             }
          }`}
        </style>
        <Navbar_s/>
        <div className="card text-center">
          <div className="card-header">Emerd</div>
          <div className="card-body d-flex justify-content-between">
            <h5>
              <i className="fa-solid fa-trophy"></i>Period <br />
              {results.length + 1}
            </h5>
            <h5>
              Count Down <br />
              {countdown.minutes < 10
                ? "0" + countdown.minutes
                : countdown.minutes}
              :
              {countdown.seconds < 10
                ? "0" + countdown.seconds
                : countdown.seconds}
            </h5>{" "}
          </div>
        </div>
        <div className="card text-center">
          <div className="card-body d-flex justify-content-between">
            <div className="card-body d-flex justify-content-between">
              <JoinModal color="green" className="Modal-btn btn btn-success" />

              <JoinModal color="blue" className="Modal-btn btn btn-primary" />

              <JoinModal color="red" className="Modal-btn btn btn-danger" />
            </div>
          </div>
          <div className="card-body d-flex justify-content-center flex-wrap">
            {/* NumberModals */}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <NumberModal key={num} number={num} />
            ))}
          </div>
        </div>
        <div className="card text-center">
          <div className="card-footer text-body-secondary my-3">My Record</div>
        </div>
      </>
    </ProfileContext.Provider>
  );
}

export default ColorGame;
