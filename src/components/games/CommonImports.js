 
import React from "react";
import { useState, useEffect, useRef } from "react"; // Example React hooks
import { ProfileContext, useProfileData } from "../ProfileContext"; // Example context and custom hook
import fighterJetImage from "./pngtree-fighter-jet-military-plane-vector-png-image_6457507.png"; // Example image import
import bladeImage from "./images-removebg-preview.png"; // Another example image import
import bganimation from "./HD-wallpaper-grid-yellow-grid-abstract-artist-artwork-digital-art-deviantart-dark-black-thumbnail.jpg"; // Another example image import
import countdownSound from "./flyingsound.mp3"; // Example audio import
import takeoffSound from "./takeoffsound.mp3"; // Another example audio import

export {
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
};

  // const countdownAudioRef = useRef(null);
  // const takeoffAudioRef = useRef(null);
  // // const showcountdownAudioRef = useRef(null);
      {/* <audio ref={showcountdownAudioRef} src={showcountdownSound} loop ></audio>
            <audio ref={countdownAudioRef} src={countdownSound} loop></audio>
            <audio ref={takeoffAudioRef} src={takeoffSound}></audio> */}

  

// useEffect(() => {
//   // if (showCountdown && !planeTookOff) {
//   //   showcountdownAudioRef.current.play();
//   // } else {
//   //   showcountdownAudioRef.current.pause();
//   //   showcountdownAudioRef.current.currentTime = 0; // Reset to start
//   // }
//   if (!showCountdown && !planeTookOff) {
//     countdownAudioRef.current.play();
//   } else {
//     countdownAudioRef.current.pause();
//     countdownAudioRef.current.currentTime = 0; // Reset to start
//   }

//   if (planeTookOff) {
//     takeoffAudioRef.current.play();
//   } else {
//     takeoffAudioRef.current.pause();
//     takeoffAudioRef.current.currentTime = 0; // Reset to start
//   }
// }, [showCountdown, planeTookOff]);