import React, { useState, useEffect, useRef,useContext } from "react";
import { ProfileContext, useProfileData } from "../context/ProfileContext";
import { HeaderColorContext, HeaderColorProvider } from "../context/HeaderColorContext";
import { RulesContext, RulesProvider } from "../context/RulesContext";
import fighterJetImage from "./pngtree-fighter-jet-military-plane-vector-png-image_6457507.png";
import bladeImage from "./images-removebg-preview.png";
import bganimation from "./HD-wallpaper-grid-yellow-grid-abstract-artist-artwork-digital-art-deviantart-dark-black-thumbnail.jpg";
import countdownSound from "./flyingsound.mp3";
import takeoffSound from "./takeoffsound.mp3";

export {
  React,
  useState,
  useEffect,
  useRef,
  useContext,
  ProfileContext,
  useProfileData,
  HeaderColorContext,
  HeaderColorProvider,
  RulesContext,
  RulesProvider,
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