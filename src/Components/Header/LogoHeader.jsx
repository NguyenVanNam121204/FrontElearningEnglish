import React from "react";
import "./LogoHeader.css";
import mochiWelcome from "../../Assets/Logo/mochi-welcome.jpg";

export default function Header() {
  return (
    <div className="header">
      <img src={mochiWelcome} alt="logo" className="header-logo" />
      <span className="header-title">Catalunya English</span>
    </div>
  );
}