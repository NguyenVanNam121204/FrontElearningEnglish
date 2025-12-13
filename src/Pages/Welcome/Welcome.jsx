import React from "react";
import "./Welcome.css";
import mochiWelcome from "../../Assets/Logo/mochi-welcome.jpg";

export default function Welcome() {
  return (
    <div className="welcome-container">
      {/* Header */}
      <div className="welcome-header">
        <img src={mochiWelcome} alt="logo" className="welcome-logo" />
        <span className="welcome-title">Catalunya English</span>
      </div>

      {/* Content */}
      <div className="welcome-content">
        <img src={mochiWelcome} alt="welcome" className="welcome-img" />

        <div className="welcome-right">
          <h1 className="welcome-text">Ghi nhớ 1000 từ vựng trong 1 tháng</h1>

          <button className="welcome-btn">Đăng nhập</button>
          <button className="welcome-btn">Đăng ký</button>
        </div>
      </div>
    </div>
  );
}
