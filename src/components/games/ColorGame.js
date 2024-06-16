import React, { useState, useEffect, useContext } from "react";
import { useTimer } from "../TimerContext";
import JoinModal from "./JoinModal";
import NumberModal from "./NumberModal";
import "./Aviator.css";

import { ProfileContext, useProfileData } from "../ProfileContext";

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
        <div className="container-fluid py-2 bg-warning-subtle d-flex justify-content-between">
          <div className="container-fluid py-4 d-flex justify-content-between flex-column flex-sm-row align-items-start">
            <div className="container-sm d-flex justify-content-start">
              <h3>Win</h3>
            </div>
            <div className="container-sm d-flex justify-content-around">
              <a className="navbar-brand my-1" href="#">
                {userProfile && (
                  <>
                    <h5> Available Points: {userProfile.points} </h5>
                    {/* Display available points */}
                  </>
                )}
              </a>
              <a className="navbar-brand" href="/recharge">
                <button type="button" className="btn btn-outline-primary">
                  Add Points
                </button>
              </a>
              <a className="navbar-brand" href="#">
                <button
                  type="button"
                  className="btn btn-primary"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleModal"
                >
                  <i className="fa-solid fa-question"></i>
                </button>

                <div
                  className="modal fade"
                  id="exampleModal"
                  tabIndex="-1"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content" style={{ width: "auto" }}>
                      <div className="modal-header">
                        <h1 className="modal-title fs-2" id="exampleModalLabel">
                          Rules of Game
                        </h1>
                        <button
                          type="button"
                          className="btn-close"
                          data-bs-dismiss="modal"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div
                        className="modal-body"
                        style={{ maxHeight: "400px", overflowY: "auto" }}
                      ></div>

                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          data-bs-dismiss="modal"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
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
