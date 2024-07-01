import React, { useState, useEffect } from "react";
import { useTimer } from "../context/TimerContext"; // Make sure to import TimerContext and useTimer
import JoinModal from "./JoinModal";
import NumberModal from "./NumberModal";
import { ProfileContext, useProfileData } from "../context/ProfileContext"; // Import ProfileContext and useProfileData
import Navbar_s from "./Navbar_s";


function ColorGame(color) {
  const {
    countdown,
    updateCountdown,
    results,
    setResults,
    setButtonsDisabled,
  } = useTimer();

  const { userDetails } = useProfileData(); // Access profile data from the context

  const [userProfile, setUserProfile] = useState(userDetails); // Update userProfile state with userDetails

  useEffect(() => {
    // Update countdown every second
    const timer = setInterval(() => {
      updateCountdown({
        minutes: countdown.minutes,
        seconds: countdown.seconds === 0 ? 59 : countdown.seconds - 1,
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, updateCountdown]);

  useEffect(() => {
    if (countdown.minutes === 0 && countdown.seconds === 30) {
      // Disable all buttons when countdown reaches 30 seconds
      setButtonsDisabled(true);
    }
    if (countdown.minutes === 0 && countdown.seconds === 60) {
      // Enable buttons when countdown resets to 60 seconds
      setButtonsDisabled(false);
    }
  }, [countdown, setButtonsDisabled]);

  const updateTableWithResults = () => {
    const randomNumber = Math.floor(Math.random() * 10); // Generate number which occurs every time

    let result;
    if (randomNumber < 3) {
      result = "green";
    } else if (randomNumber >= 3 && randomNumber < 6) {
      result = "blue";
    } else {
      result = "red";
    }

    // Update the result for the current period
    setResults((prevResults) => [
      ...prevResults,
      {
        period: prevResults.length + 1,
        price: "",
        number: randomNumber,
        result: result,
      },
    ]);
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
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Period </th>
                <th scope="col">Price</th>
                <th scope="col">Number</th>
                <th scope="col">Result</th>
              </tr>
            </thead>
            <tbody className="table-group-divider">
              {results.map((result) => (
                <tr key={result.period}>
                  <th scope="row">{result.period}</th>
                  <td>{result.price}</td>
                  <td>{result.number}</td>
                  <td>{result.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card text-center">
          <div className="card-footer text-body-secondary my-3">My Record</div>
        </div>
      </>
    </ProfileContext.Provider>
  );
}

export default ColorGame;
