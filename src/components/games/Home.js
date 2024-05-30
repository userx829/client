import React, { useState, useEffect } from "react";
import { useTimer } from "../TimerContext"; // Make sure to import TimerContext and useTimer
import JoinModal from "./JoinModal";
import NumberModal from "./NumberModal";
import { ProfileContext, useProfileData } from "../ProfileContext"; // Import ProfileContext and useProfileData

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
                      >
                        <div className="container-fluid">
                          <p>
                            3 minutes 1 issue, 2 minutes and 30 seconds to
                            order,
                            <br />
                            30 seconds to show the lottery result. It opens all
                            day. <br /> The total number of trade is 480 issues{" "}
                          </p>{" "}
                          <p>
                            If you spend 100 to trade, after deducting 2 service
                            fee,
                            <br /> your contract amount is 98:{" "}
                          </p>
                          <p>
                            {" "}
                            1. JOIN GREEN: if the result shows 1,3,7,9,
                            <br /> you will get (98*2) 196 . <br />
                            If the result shows 5, you will get (98*1.5) 147{" "}
                          </p>
                          <p>
                            {" "}
                            2. JOIN RED: if the result shows 2,4,6,8,
                            <br /> you will get (98*2) 196;
                            <br /> If the result shows 0, you will get (98*1.5)
                            147{" "}
                          </p>
                          <p>
                            {" "}
                            3. JOIN VIOLET: if the result shows 0 or 5, <br />
                            you will get (98*4.5) 441{" "}
                          </p>
                          <p>
                            {" "}
                            4. SELECT NUMBER: if the result is the same as the
                            <br />
                            number you selected, you will get (98*9) 882{" "}
                          </p>
                        </div>
                      </div>

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
