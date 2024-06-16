import React, { useState } from "react";
import { Link } from "react-router-dom";

const Recharge = () => {
  const [rechargeAmount, setRechargeAmount] = useState(""); // State to store recharge amount

  // Function to handle button click and update recharge amount
  const handleRecharge = (amount) => {
    setRechargeAmount(amount);
  };

  return (
    <>
      <style>
        {`  
          @media (max-width: 576px) {
            body{
                height:800px;
            }
            .btn {
                margin: 3vw;
            }
           
          }`}
      </style>
      <nav className="navbar bg-body-tertiary bg-info-subtle">
        <div className="container-fluid">
         <a href="/"> <i class="fa-solid fa-arrow-left"></i></a>

          <span className="navbar-brand mb-0 h1">
            <h3>Recharge</h3>
          </span>
        </div>
      </nav>
      <div
        className="alert alert-warning alert-dismissible fade show"
        role="alert"
      >
        Note: If the recharge amount is deducted but the amount is not added to
        the account, please send a detailed screenshot of the payment and the
        game ID to the mailbox for processing.
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
        ></button>
      </div>
      <div className="container d-flex flex-column justify-content-center align-items-center">
        <span className="mb-3">
          Any problem? Contact 
        </span>
        <h3>Balance:</h3>
        <input
          className="form-control mb-3"
          type="number"
          placeholder="Please Select Recharge Amount"
          aria-label="Recharge amount input"
          value={rechargeAmount}
          onChange={(e) => setRechargeAmount(e.target.value)} // Update recharge amount on input change
        />
        <div
          className="btn-group flex-wrap"
          role="group"
          aria-label="Recharge amount buttons"
        >
          <button
            type="button"
            className="btn btn-light mx-2 px-3"
            onClick={() => handleRecharge(50)}
          >
            50
          </button>
          <button
            type="button"
            className="btn btn-light mx-2 px-3"
            onClick={() => handleRecharge(100)}
          >
            100
          </button>
          <button
            type="button"
            className="btn btn-light mx-2 px-3"
            onClick={() => handleRecharge(200)}
          >
            200
          </button>
          <button
            type="button"
            className="btn btn-light mx-2 px-3"
            onClick={() => handleRecharge(500)}
          >
            500
          </button>
          <button
            type="button"
            className="btn btn-light mx-2 px-3"
            onClick={() => handleRecharge(1000)}
          >
            1000
          </button>
          <button
            type="button"
            className="btn btn-light mx-2 px-3"
            onClick={() => handleRecharge(2000)}
          >
            2000
          </button>
          <button
            type="button"
            className="btn btn-light mx-2 px-3"
            onClick={() => handleRecharge(5000)}
          >
            5000
          </button>
          <button
            type="button"
            className="btn btn-light mx-2 px-3"
            onClick={() => handleRecharge(10000)}
          >
            10000
          </button>
        </div>
        <div className="container ">
          <span>Payment</span>
          <div class="container">
            <ul class="list-group">
              <li class="list-group-item">
                <input
                  class="form-check-input me-1"
                  type="radio"
                  name="options"
                  id="firstRadio"
                />
                <label class="form-check-label stretched-link" for="firstRadio">
                  First option
                </label>
              </li>
              <li class="list-group-item">
                <input
                  class="form-check-input me-1"
                  type="radio"
                  name="options"
                  id="secondRadio"
                />
                <label
                  class="form-check-label stretched-link"
                  for="secondRadio"
                >
                  Second option
                </label>
              </li>
              <li class="list-group-item">
                <input
                  class="form-check-input me-1"
                  type="radio"
                  name="options"
                  id="thirdRadio"
                />
                <label class="form-check-label stretched-link" for="thirdRadio">
                  Third option
                </label>
              </li>
            </ul>
          </div>
        </div>
        <button type="button" class="btn btn-primary my-2">
          Recharge
        </button>
      </div>
    </>
  );
};

export default Recharge;
