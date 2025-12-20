import React from "react";
import "./Welcome.css";
import WelcomeHero from "../../Components/Welcome/WelcomeHero";
import WelcomeHabit from "../../Components/Welcome/WelcomeHabit";
import WelcomeIELTS from "../../Components/Welcome/WelcomeIELTS";
import WelcomePremium from "../../Components/Welcome/WelcomePremium";
import WelcomeFooter from "../../Components/Welcome/WelcomeFooter";
import { mochiWelcome } from "../../Assets";

export default function Welcome() {
  return (
    <div className="welcome-page">
      {/* Logo ở góc bên trái */}
      <div className="welcome-logo">
        <img src={mochiWelcome} alt="Catalunya English Logo" className="welcome-logo-img" />
        <span className="welcome-logo-text">Catalunya English</span>
      </div>

      {/* Hero Section */}
      <WelcomeHero />

      {/* Habit Section */}
      <WelcomeHabit />

      {/* IELTS Section */}
      <WelcomeIELTS />

      {/* Premium Section */}
      <WelcomePremium />

      {/* Footer */}
      <WelcomeFooter />
    </div>
  );
}
