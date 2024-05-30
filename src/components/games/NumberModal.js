import React, {useEffect, useState } from "react";
import { useTimer } from "../TimerContext"; // Make sure to import TimerContext and useTimer


const NumberModal = ({ number }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(0);
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


  const handleModalToggle = () => {
    setShowModal(!showModal);
  };

  const handleAmountSelection = (amount) => {
    setSelectedAmount(amount);
  };

  const handleInputChange = (e) => {
    setSelectedAmount(Number(e.target.value));
  };

  return (
    <>
      <button
        type="button"
        className="btn btn-info"
        disabled={buttonsDisabled} // Pass disabled prop
        data-bs-toggle="modal"
        data-bs-target={`#numberModal-${number}`}
      >
        {number}
      </button>

      <div
        className="modal fade"
        id={`numberModal-${number}`}
        tabIndex="-1"
        aria-labelledby={`numberModalLabel-${number}`}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header bg-info">
              <h5 className="modal-title " id={`numberModalLabel-${number}`}>
                Select {number}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handleModalToggle}
              ></button>
            </div>
            <div className="modal-body">
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
                <p className="py-2 fs-3">or</p>
                <h3>Enter Amount</h3>
                <div className="col">
                  <input
                    type="number"
                    className="form-control"
                    aria-label="Amount"
                    value={selectedAmount}
                    onChange={handleInputChange}
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
                    checked
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
                onClick={handleModalToggle}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NumberModal;
