import React, { useEffect, useState } from "react";
import { useTimer } from "../TimerContext"; // Make sure to import TimerContext and useTimer

const placeBetApiCall = async (betType, betNumber) => {
  try {
    const response = await fetch("http://localhost:5000/api/trade", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: betType,
        number: betNumber,
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error placing bet:", error);
    throw error;
  }
};

const JoinModal = ({ color, className }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [isChecked, setIsChecked] = useState(true);
  const { buttonsDisabled, countdown, setButtonsDisabled, updateCountdown } = useTimer();

  useEffect(() => {
    if (countdown.minutes === 0 && countdown.seconds === 30) {
      console.log("Disabling buttons...");

      // Disable all buttons when countdown reaches 30 seconds
      setButtonsDisabled(true);
    }
    if (countdown.minutes === 0 && countdown.seconds === 59) {
      // Enable buttons when countdown resets to 60 seconds
      setButtonsDisabled(false);
    }
  }, [countdown, setButtonsDisabled]);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleModalToggle = () => {
    setShowModal(!showModal);
  };

  const handleConfirm = () => {
    // Here, you can write code to handle the bet placement
    console.log(`Placing a bet of ${selectedAmount} on ${color} color`);
    // Add logic to place the bet, e.g., sending a request to the server
  };

  const handleAmountSelection = (amount) => {
    setSelectedAmount(amount);
  };

  return (
    <>
      <a className="navbar-brand" href="#">
        <button
          type="button"
          className={`btn btn-${color} ${className}`}
          disabled={buttonsDisabled} // Pass disabled prop
          data-bs-toggle="modal"
          data-bs-target={`#join${
            color.charAt(0).toUpperCase() + color.slice(1)
          }Modal`}
        >
          Join {color.charAt(0).toUpperCase() + color.slice(1)}
        </button>

        <div
          className="modal fade"
          id={`join${color.charAt(0).toUpperCase() + color.slice(1)}Modal`}
          tabIndex="-1"
          aria-labelledby={`exampleModalLabel${color}`}
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-scrollable">
            <div className="modal-content" style={{ width: "auto" }}>
              <div
                className={`modal-header bg-${
                  color === "green"
                    ? "success"
                    : color === "blue"
                    ? "primary"
                    : "danger"
                }`}
              >
                <h1
                  className="modal-title fs-2 text-light"
                  id={`join${color.charAt(0).toUpperCase() + color.slice(1)}`}
                >
                  Join {color.charAt(0).toUpperCase() + color.slice(1)}
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div
                className="modal-body text-dark" // Adjust text color here
                style={{ height: "400px", overflowX: "auto" }} // Change overflowY to "auto"
              >
                <div className="container-fluid">
                  <h3>Contract Money</h3>
                  <div
                    className="btn-group me-2"
                    role="group"
                    aria-label="First group"
                  >
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => handleAmountSelection(10)}
                    >
                      10
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => handleAmountSelection(100)}
                    >
                      100
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => handleAmountSelection(1000)}
                    >
                      1000
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => handleAmountSelection(10000)}
                    >
                      10000
                    </button>
                  </div>
                  <p>or</p>
                  <h3>Enter Amount</h3>
                  <div className="col">
                    <input
                      type="number"
                      className="form-control"
                      aria-label="Amount"
                      value={selectedAmount}
                      onChange={(e) => setSelectedAmount(e.target.value)}
                    />
                  </div>
                </div>
                <p>Total Amount of Joining is {selectedAmount}</p>
                <div className="container-sm d-flex justify-content-start">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id="flexCheckChecked"
                      checked={isChecked}
                      onChange={handleCheckboxChange}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexCheckChecked"
                    >
                      Checked checkbox
                    </label>
                  </div>
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
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={handleConfirm}
                >
                  {" "}
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      </a>
    </>
  );
};

export default JoinModal;
