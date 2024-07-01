import React, { useEffect, useState } from "react";
import { useTimer } from "../context/TimerContext";

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
      const errorDetails = await response.text(); // Get the response body text
      console.error(`Error placing bet: ${response.status} ${response.statusText} - ${errorDetails}`);
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText} - ${errorDetails}`);
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
      setButtonsDisabled(true);
    }
    if (countdown.minutes === 0 && countdown.seconds === 59) {
      setButtonsDisabled(false);
    }
  }, [countdown, setButtonsDisabled]);

  const handleCheckboxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleModalToggle = () => {
    setShowModal(!showModal);
  };

  const handleConfirm = async () => {
    try {
      const result = await placeBetApiCall(`JOIN_${color.toUpperCase()}`, selectedAmount);
      console.log(`Bet placed: ${result}`);
    } catch (error) {
      console.error("Error placing bet:", error);
    }
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
          disabled={buttonsDisabled}
          data-bs-toggle="modal"
          data-bs-target={`#join${color.charAt(0).toUpperCase() + color.slice(1)}Modal`}
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
              <div className={`modal-header bg-${color === "green" ? "success" : color === "blue" ? "primary" : "danger"}`}>
                <h1 className="modal-title fs-2 text-light" id={`join${color.charAt(0).toUpperCase() + color.slice(1)}`}>
                  Join {color.charAt(0).toUpperCase() + color.slice(1)}
                </h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body text-dark" style={{ height: "400px", overflowY: "auto" }}>
                <div className="container-fluid">
                  <h3>Contract Money</h3>
                  <div className="btn-group me-2" role="group" aria-label="First group">
                    {[10, 100, 1000, 10000].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => handleAmountSelection(amount)}
                      >
                        {amount}
                      </button>
                    ))}
                  </div>
                  <p>or</p>
                  <h3>Enter Amount</h3>
                  <div className="col">
                    <input
                      type="number"
                      className="form-control"
                      aria-label="Amount"
                      value={selectedAmount}
                      onChange={(e) => setSelectedAmount(Number(e.target.value))}
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
                    <label className="form-check-label" htmlFor="flexCheckChecked">
                      Checked checkbox
                    </label>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button className="btn btn-primary" type="button" onClick={handleConfirm}>Confirm</button>
              </div>
            </div>
          </div>
        </div>
      </a>
    </>
  );
};

export default JoinModal;
