import React, { useContext } from "react";
import { ProfileContext, HeaderColorContext, RulesContext } from "./CommonImports";
import "./Navbar_s.css"

const Navbar_s = () => {
  const { headerColor } = useContext(HeaderColorContext);
  const { userProfile } = useContext(ProfileContext);
  const { rulesContent } = useContext(RulesContext);

  return (
    <div className={`container-fluid py-3 ${headerColor} d-flex justify-content-between resp-container`}>
      <div className="container-fluid py-3 d-flex justify-content-between">
        <div className="container-sm d-flex justify-content-start navbar-logo">
          <a className="navbar-brand" href="#">
            Logo
          </a>
        </div>
        <div className="container-sm d-flex justify-content-around resp-container">
          <a className="navbar-brand" href="#">
            {userProfile && (
              <>
                <span className="fs-5 fw-semibold"> Available Points: {userProfile.points} </span>
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
                    style={{ height: "400px", overflowX: "auto" }}
                  >
                    <div className="container-fluid">
                      {rulesContent}
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
  );
};

export default Navbar_s;
