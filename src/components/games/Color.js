import React, { useState, useEffect } from "react";
import { useProfileData, ProfileContext } from "./CommonImports";
import Navbar_s from "./Navbar_s";
import "./color.css";

const Color = () => {
  const { userDetails, addUserPoints } = useProfileData();
  const [userProfile, setUserProfile] = useState(userDetails);
  const [selectedBox, setSelectedBox] = useState(null);
  const [betAmount, setBetAmount] = useState(10);
  const [isBetPlaced, setIsBetPlaced] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null); // State for alert message
  const [isCheckButtonEnabled, setIsCheckButtonEnabled] = useState(false);
  const [betRecords, setBetRecords] = useState([]); // State for bet records
  const [isPlaceBetButtonDisabled, setIsPlaceBetButtonDisabled] =
    useState(false); // State to manage "Place Bet" button disabled state

  const gameType = "colorGame"; // Set the game type

  // Effect to fetch bet records when userProfile or gameType changes
  useEffect(() => {
    console.log("userProfile:", userProfile);
    console.log("gameType:", gameType);

    const fetchBetRecords = async () => {
      if (!userProfile || !userProfile._id) return;

      try {
        const response = await fetch(
          `${process.env.REACT_APP_BETRECORDS_URL}/${userProfile._id}?gameType=${gameType}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch bet records");
        }
        const data = await response.json();
        console.log("Fetched bet records:", data);
        setBetRecords(data);
      } catch (error) {
        console.error("Error fetching bet records:", error);
      }
    };

    fetchBetRecords();
  }, [userProfile, gameType]);

  // Function to handle color change and bet outcome
  const changeColor = async () => {
    if (!isBetPlaced) {
      setAlertMessage("Please place a bet first!");
      setTimeout(() => {
        setAlertMessage(null);
      }, 4000);
      return;
    }

    // Reset background colors
    document.querySelectorAll(".feature").forEach((box) => {
      box.style.backgroundColor = "";
    });
    console.log("Colors reset");

    try {
      const response = await fetch(process.env.REACT_APP_COLOR_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const { randomNumber, color } = data;

      console.log("Random Number:", randomNumber);

      // Set background color based on random number
      document.getElementById(`color-${randomNumber}`).style.backgroundColor =
        color;

      // Check if the corresponding radio button is checked
      if (selectedBox === randomNumber) {
        setAlertMessage("You won!");
        const winningPoints = betAmount * 2;

        // Update user profile points
        setUserProfile((prevProfile) => ({
          ...prevProfile,
          points: prevProfile.points + winningPoints,
        }));
        await addUserPoints(winningPoints);

        // Prepare new bet record
        const newRecord = {
          user_id: userProfile._id,
          bet_amount: betAmount,
          box_number: selectedBox,
          cashout_amount: winningPoints,
          gameType,
          createdAt: new Date().toISOString(),
        };

        // Update betRecords state with new record
        setBetRecords((prevRecords) => [...prevRecords, newRecord]);

        // Save bet record
        await saveBetRecord(newRecord);
      } else {
        setAlertMessage("You lost!");

        // Prepare new bet record for loss
        const newRecord = {
          user_id: userProfile._id,
          bet_amount: betAmount,
          box_number: selectedBox,
          cashout_amount: 0,
          gameType,
          createdAt: new Date().toISOString(),
        };

        // Update betRecords state with new record
        setBetRecords((prevRecords) => [...prevRecords, newRecord]);

        // Save bet record
        await saveBetRecord(newRecord);
      }

      setIsBetPlaced(false);
      setIsPlaceBetButtonDisabled(false); // Re-enable "Place Bet" button
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      setAlertMessage("An error occurred. Please try again.");
    }

    setIsCheckButtonEnabled(false);
  };

  // Function to handle radio button change
  const handleRadioChange = (event) => {
    setSelectedBox(Number(event.target.value));
    setIsCheckButtonEnabled(true); // Enable check button after radio button selection
  };

  // Function to close alert message
  const closeAlert = () => {
    setAlertMessage(null); // Reset alert message
  };

  // Function to place a bet
  const placeBet = async () => {
    const initialBetAmount = parseFloat(betAmount);
    if (
      isNaN(initialBetAmount) ||
      initialBetAmount <= 9 ||
      initialBetAmount > userProfile.points
    ) {
      setAlertMessage("Invalid bet amount or insufficient points");
      setTimeout(() => {
        setAlertMessage(null);
      }, 4000);
      return;
    }

    // Update bet amount and user points
    setBetAmount(initialBetAmount);
    const updatedPoints = userProfile.points - initialBetAmount;
    setUserProfile({ ...userProfile, points: updatedPoints });
    setIsBetPlaced(true);
    setAlertMessage("Bet placed successfully!");
    await addUserPoints(-initialBetAmount);
    setTimeout(() => {
      setAlertMessage(null);
    }, 2000);
    setIsPlaceBetButtonDisabled(true); // Disable "Place Bet" button
  };

  // Function to save a bet record
  const saveBetRecord = async (newRecord) => {
    try {
      const response = await fetch(process.env.REACT_APP_BETRECORDS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRecord),
      });
      if (!response.ok) {
        throw new Error("Failed to save bet record");
      }
      await response.json();
    } catch (error) {
      console.error("Error saving bet record:", error);
    }
  };

  return (
    <ProfileContext.Provider value={{ userProfile, setUserProfile }}>
      <Navbar_s />
      <hr />
      <h5 className="d-flex justify-content-center">
        Which box will change its color...?
      </h5>
      <hr />
      <div className="container-lg">
        <div className="d-flex justify-content-center">
          {[...Array(5)].map((_, index) => (
            <div key={index}>
              <div id={`color-${index + 1}`} className="feature">
                {index + 1}
              </div>
              <input
                type="radio"
                name="box"
                value={index + 1}
                onChange={handleRadioChange}
              />
            </div>
          ))}
        </div>
        {alertMessage && (
          <div
            className="alert alert-warning alert-dismissible fade show mt-3"
            role="alert"
          >
            {alertMessage}
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="alert"
              aria-label="Close"
              onClick={closeAlert}
            ></button>
          </div>
        )}

        <div class="card-body mx-3 my-3 d-flex justify-content-center align-items-center">
          <div class="d-flex justify-content-center align-items-center">
            <div className="input-group px-1 py-1 my-1">
              <span className="input-group-text" id="basic-addon3">
                <h5> Enter Amount </h5>
              </span>
              <input
                type="number"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                placeholder="Enter bet amount"
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={placeBet}
                disabled={isPlaceBetButtonDisabled} // Disable button conditionally
              >
                Place Bet
              </button>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <div className="d-flex justify-content-center">
              <button
                type="button"
                className="btn btn-secondary my-3 mx-5"
                id="checkButton"
                onClick={changeColor}
                disabled={!isCheckButtonEnabled || !isBetPlaced}
              >
                Check
              </button>
            </div>{" "}
          </div>
        </div>

        <div class="card">
          <div class="card-header d-flex justify-content-center">
            <h5>My Record</h5>
          </div>
          <div class="card-body">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Period</th>
                  <th scope="col">Bet</th>
                  <th scope="col">Box.NO.</th>
                  <th scope="col">Cashout</th>
                </tr>
              </thead>
              <tbody>
                {betRecords.length > 0 ? (
                  betRecords.map((record, index) => {
                    const formatDate = (dateString) => {
                      const date = new Date(dateString);
                      const year = date.getFullYear();
                      const month = String(date.getMonth() + 1).padStart(
                        2,
                        "0"
                      );
                      const day = String(date.getDate()).padStart(2, "0");
                      const hours = String(date.getHours()).padStart(2, "0");
                      const minutes = String(date.getMinutes()).padStart(
                        2,
                        "0"
                      );
                      return `${year}${month}${day}${hours}${minutes}`;
                    };

                    const formattedDate = formatDate(record.createdAt);
                    return (
                      <tr key={index}>
                        <td>{formattedDate}</td>
                        <td>{record.bet_amount}</td>
                        <td>{record.box_number}</td>
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
        </div>
      </div>
    </ProfileContext.Provider>
  );
};

export default Color;
