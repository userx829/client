// Import statements for components
import {
  React,
  useState,
  useEffect,
  useRef,
  ProfileContext,
  useProfileData,
  fighterJetImage,
  bladeImage,
  bganimation,
  countdownSound,
  takeoffSound,
} from "./CommonImports";

import "./Aviator.css";

function startMultiplying(newRandomTime, setCurrentValue, addResultToHistory) {
  let number = 1;
  let factor = 1.04; // Start with a small factor value

  function updateNumber() {
    number *= factor;
    setCurrentValue(parseFloat(number.toFixed(2)));
    // Increase the factor slowly
    // factor += 0.001; // Adjust this value to control the rate of increase
  }

  updateNumber();

  let seconds = newRandomTime;
  let numseconds = 0;
  const intervalId = setInterval(() => {
    if (numseconds < seconds) {
      updateNumber();
      numseconds++;
    } else {
      clearInterval(intervalId);
      const result = number.toFixed(2);
      console.log("Final Result:", result);
      addResultToHistory(result); // Call the callback to update history
    }
  }, 500);
  return { time: newRandomTime, value: number.toFixed(2) };
}

const Aviator = () => {
  const [countdown, setCountdown] = useState(10);
  const [showCountdown, setShowCountdown] = useState(true);
  const [randomTimes, setRandomTimes] = useState([]);
  const [randomTimeCountdown, setRandomTimeCountdown] = useState(null);
  const [planeTookOff, setPlaneTookOff] = useState(false);
  const [ws, setWs] = useState(null);
  const [alert, setAlert] = useState(null);
  const [currentValue, setCurrentValue] = useState(1);
  const [betAmount, setBetAmount] = useState(10);
  const [isCashOut, setIsCashOut] = useState(false);
  const [isBetPlaced, setIsBetPlaced] = useState(false);
  const { userDetails, addUserPoints } = useProfileData();
  const [userProfile, setUserProfile] = useState(userDetails);
  const [winningAmount, setWinningAmount] = useState(0);
  const [history, setHistory] = useState([]); // Add history state
  const [betRecords, setBetRecords] = useState([]); // Add betRecords state

  useEffect(() => {
    if (userDetails) {
      setUserProfile(userDetails);
    }
  }, [userDetails]);

  useEffect(() => {
    if (userProfile && userProfile._id) {
      fetchBetRecords(userProfile._id);
    }
  }, [userProfile]);
  const fetchBetRecords = async (userId) => {
    if (!userId) {
      console.error("User ID is undefined in fetchBetRecords");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:5000/api/bet-records/${userId}`
      );
      const data = await response.json();
      console.log("Fetched bet records:", data);
      setBetRecords(data);
    } catch (error) {
      console.error("Error fetching bet records:", error);
    }
  };
  // WebSocket connection setup
  useEffect(() => {
    const newWs = new WebSocket("ws://localhost:5000/");
    setWs(newWs);

    newWs.onmessage = (event) => {
      const message = event.data;
      handleMessage(message);
    };

    newWs.onclose = () => {
      console.log("WebSocket closed, attempting to reconnect...");
      // Attempt to reconnect
      setTimeout(() => {
        setWs(new WebSocket("ws://localhost:5000/"));
      }, 5000);
    };

    return () => {
      newWs.close();
    };
  }, []);

  useEffect(() => {
    if (randomTimes.length > 0) {
      const newRandomTime = randomTimes[randomTimes.length - 1].time;
      const newValue = startMultiplying(
        newRandomTime,
        setCurrentValue,
        addResultToHistory
      );
      setRandomTimes((prevRandomTimes) => [...prevRandomTimes, newValue]);
    }
  }, [randomTimes]);

  const handleMessage = (message) => {
    if (message.startsWith("{")) {
      try {
        const parsedMessage = JSON.parse(message);
        switch (parsedMessage.type) {
          case "plane-countdown-start":
            setRandomTimeCountdown(parsedMessage.time);
            startMultiplying(
              parsedMessage.time,
              setCurrentValue,
              addResultToHistory
            );
            break;
          case "countdown-nearing-end":
            break;
          case "countdown-end":
            setShowCountdown(false);
            setPlaneTookOff(true);
            document
              .getElementById("fighter-jet-image")
              .classList.remove("plane_flying");
            document
              .getElementById("fighter-jet-image")
              .classList.add("plane_take_off", "plane_visibility");

            setTimeout(() => {
              setPlaneTookOff(false);
              setShowCountdown(true);
              setIsBetPlaced(false);
              setIsCashOut(false);
              setCountdown(10);
            }, 3000);
            break;
          default:
            break;
        }
      } catch (error) {
        console.error("Error parsing JSON message:", error);
      }
    } else {
      console.log("Received message:", message);
    }
  };

  useEffect(() => {
    console.log("Initial userProfile state:", userProfile);
  }, [userProfile]);

  useEffect(() => {
    const countdownTimer = setInterval(() => {
      if (countdown > 0) {
        setCountdown((prevCountdown) => prevCountdown - 1);
      } else {
        setShowCountdown(false);
        clearInterval(countdownTimer);
      }
    }, 1000);

    return () => clearInterval(countdownTimer);
  }, [countdown]);

  const handleInputChange = (event) => {
    const inputBetAmount = parseFloat(event.target.value);
    setBetAmount(inputBetAmount);
  };

  useEffect(() => {
    if (isBetPlaced) {
      setWinningAmount(parseFloat(currentValue) * betAmount);
    }
  }, [currentValue, betAmount, isBetPlaced]);

  const placeBet = async () => {
    if (!showCountdown) {
      console.log("You cannot place a bet while the plane is flying.");
      return;
    }

    const initialBetAmount = parseFloat(betAmount);
    if (
      isNaN(initialBetAmount) ||
      initialBetAmount <= 9 ||
      initialBetAmount > userProfile.points
    ) {
      setAlert("Invalid bet amount or insufficient points");
      setTimeout(() => {
        setAlert(null);
      }, 4000);
      return;
    }

    setBetAmount(initialBetAmount);
    const updatedPoints = userProfile.points - initialBetAmount;
    setUserProfile({ ...userProfile, points: updatedPoints });
    setIsBetPlaced(true);
    setAlert("Bet placed successfully!");
    await addUserPoints(-initialBetAmount);
    setTimeout(() => {
      setAlert(null);
    }, 2000);
  };

  const cashOut = async () => {
    if (isBetPlaced && !planeTookOff) {
      const parsedCurrentValue = parseFloat(currentValue);
      const parsedBetAmount = parseFloat(betAmount);

      if (isNaN(parsedCurrentValue)) {
        console.error("Invalid multiplier");
        return;
      }

      if (isNaN(parsedBetAmount)) {
        console.error("Invalid bet amount");
        return;
      }

      let calculatedWinningAmount = parsedCurrentValue * parsedBetAmount;
      calculatedWinningAmount = parseFloat(calculatedWinningAmount.toFixed(2)); // Round to two decimal places

      setWinningAmount(calculatedWinningAmount);

      const updatedPoints = parseFloat(
        (userProfile.points + calculatedWinningAmount).toFixed(2)
      ); // Round to two decimal places
      setUserProfile({ ...userProfile, points: updatedPoints });

      await addUserPoints(calculatedWinningAmount);

      setBetAmount(10);
      setIsBetPlaced(false);
      setIsCashOut(true); // Set cash out state to true

      try {
        console.log("Cashing out for user:", userProfile._id);

        const response = await fetch("http://localhost:5000/api/bet-records", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: userProfile._id,
            bet_amount: parsedBetAmount,
            multiplier: parsedCurrentValue,
            cashout_amount: calculatedWinningAmount,
          }),
        });
        const data = await response.json();
        console.log("Cashout record added:", data); // Log response

        // Fetch updated bet records
        fetchBetRecords(userProfile._id);
      } catch (error) {
        console.error("Error cashing out:", error);
      }
    } else {
      setAlert("Cannot cash out after the plane has flown away");
      setTimeout(() => {
        setAlert(null);
      }, 2000);
    }
  };

  useEffect(() => {
    const addBetRecord = async () => {
      console.log(
        "Inside addBetRecord. isBetPlaced:",
        isBetPlaced,
        "planeTookOff:",
        planeTookOff,
        "isCashOut:",
        isCashOut
      );
      if (isBetPlaced && planeTookOff && !isCashOut) {
        try {
          const parsedCurrentValue = parseFloat(currentValue);
          const parsedBetAmount = parseFloat(betAmount);
          console.log("Cashing out for user:", userProfile._id);

          const response = await fetch(
            "http://localhost:5000/api/bet-records",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                user_id: userProfile._id,
                bet_amount: parsedBetAmount,
                multiplier: parsedCurrentValue,
                cashout_amount: 0,
              }),
            }
          );
          const data = await response.json();
          console.log("Cashout record added:", data); // Log response

          // Fetch updated bet records
          fetchBetRecords(userProfile._id);
        } catch (error) {
          console.error("Error cashing out:", error);
        }
      }
    };

    addBetRecord();
  }, [isBetPlaced, isCashOut, planeTookOff]);

  const isJetFlying = !showCountdown;
  const addResultToHistory = (result) => {
    setHistory((prevHistory) => {
      const newHistory = [...prevHistory, result];
      return newHistory.slice(-10); // Keep only the last 15 elements
    });
  };

  return (
    <ProfileContext.Provider value={{ userProfile, setUserProfile }}>
      <>
        <div className="container-fluid py-3 bg-info d-flex justify-content-between resp-container">
          <div className="container-fluid py-3 d-flex justify-content-between">
            <div className="container-sm d-flex justify-content-start">
              <a className="navbar-brand" href="#">
                Logo
              </a>
            </div>
            <div className="container-sm d-flex justify-content-around resp-container">
              <a className="navbar-brand" href="#">
                {userProfile && (
                  <>
                    <span className="fs-5 text fw-semibold">
                      Available Points: {userProfile.points}{" "}
                    </span>
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
                        style={{ height: "400px", overflowX: "auto" }} // Change overflowY to "auto"
                      >
                        <div className="container-fluid">
                          3 minutes 1 issue, 2 minutes and 30 <br /> seconds to
                          number <br /> you selected, you will get (98*9) 882
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
          <div className="card-header">
            <div className="accordion" id="accordionExample">
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo"
                    aria-expanded="false"
                    aria-controls="collapseTwo"
                  >
                    History
                  </button>
                </h2>
                <div
                  id="collapseTwo"
                  className="accordion-collapse collapse"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body d-flex flex-wrap">
                    {history.map((result, index) => (
                      <p key={index} className="me-3 random-time">
                        {result}x
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-header">Featured</div>
          <div
            className={`card-body bg-dark resp-aviator ${
              !showCountdown && !planeTookOff ? "bg-animation" : ""
            }`}
            style={{
              height: "500px",
              backgroundImage: `url(${bganimation})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="container-sm">
              {showCountdown && ( // Render the blade image and countdown only if showCountdown is true
                <>
                  <img
                    src={bladeImage}
                    alt="fanImage"
                    className="blade-image"
                    style={{
                      width: "100px",
                      height: "auto",
                      borderRadius: "10px",
                      color: "white",
                    }}
                  />
                  <h5 className="text-light my-3">Waiting for Next Fly</h5>
                  <span className={`my-3 text-warning countdown-animation`}>
                    Countdown: {countdown} seconds
                  </span>
                </>
              )}
              {planeTookOff && ( // Render the message when the plane takes off
                <span className="text-warning fs-1 text">Flew Away</span>
              )}
              {!showCountdown && (
                <div className="countdown-container">
                  <div className="random-countdown">
                    <span className="text-warning fs-1 text">
                      {currentValue !== null && currentValue}
                      {/* Display the current multiplication value */}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <img
              id="fighter-jet-image"
              src={fighterJetImage}
              alt="Fighter Jet"
              className={`fighter-jet-image   ${
                isJetFlying ? "plane_flying" : ""
              }`}
              style={{
                width: "200px",
                height: "auto",
                borderRadius: "10px",
              }}
            />
            {/* Cashout button (conditionally rendered) */}
            {isBetPlaced && !showCountdown && (
              <button
                className="btn btn-secondary cashout-btn"
                type="button"
                onClick={cashOut} // Add onClick event handler for cashing out
              >
                <div>
                  Cash Amount: <br />
                  {winningAmount.toFixed(2)}
                </div>
              </button>
            )}
          </div>
          {/* // JSX for rendering the alert */}
          {alert && (
            <div
              className="alert alert-warning alert-dismissible fade show"
              role="alert"
            >
              {alert}
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="alert"
                aria-label="Close"
              ></button>
            </div>
          )}
          <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center">
              <div className="  px-5 py-1 my-3">
                <div className="input-group px-5 py-1 my-3">
                  <span className="input-group-text  py-1 " id="basic-addon3">
                    <h4> Enter Amount </h4>
                  </span>
                  <input
                    type="number"
                    value={betAmount}
                    onChange={handleInputChange}
                    placeholder="Enter bet amount"
                    disabled={!showCountdown || isBetPlaced} // Disable input if countdown is not shown or bet is already placed
                  />
                </div>
              </div>
            </div>
            <div className="d-grid gap-1">
              <button
                type="button"
                className="btn btn-primary"
                onClick={placeBet}
                disabled={!showCountdown || isBetPlaced} // Disable button if countdown is not shown or bet is already placed
              >
                Place Bet
              </button>
            </div>
          </div>
          <div className="card-footer text-body-secondary my-3">My Record</div>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Period</th>
                <th scope="col">Bet</th>
                <th scope="col">Multi.</th>
                <th scope="col">Cashout</th>
              </tr>
            </thead>
            <tbody>
              {betRecords.length > 0 ? (
                betRecords.map((record, index) => {
                  function formatDate(date) {
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, "0");
                    const day = String(date.getDate()).padStart(2, "0");
                    const hours = String(date.getHours()).padStart(2, "0");
                    const minutes = String(date.getMinutes()).padStart(2, "0");
                    return `${year}${month}${day}${hours}${minutes}`;
                  }

                  const createdAtDate = new Date(record.createdAt);
                  const formattedDate = formatDate(createdAtDate);
                  return (
                    <tr key={index}>
                      <td>{formattedDate}</td>
                      <td>{record.bet_amount}</td>
                      <td>{record.multiplier}</td>
                      <td>{record.cashout_amount}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4">No bet records found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </>
    </ProfileContext.Provider>
  );
};

export default Aviator;
