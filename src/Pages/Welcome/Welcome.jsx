import React from "react";
import "./Welcome.css";
import Header from "../../Components/Header/LogoHeader";
import mochiWelcome from "../../Assets/Logo/mochi-welcome.jpg";
import { useNavigate } from "react-router-dom";


export default function Welcome() {
  const navigate = useNavigate();
  return (
    <div className="welcome-container">
      {/* Header */}
      <Header />

      {/* Content */}
      <div className="welcome-content">
        <img src={mochiWelcome} alt="welcome" className="welcome-img" />

        <div className="welcome-right">
          <h1 className="welcome-text">Ghi nhớ 1000 từ vựng trong 1 tháng</h1>

          <button className="welcome-btn" onClick={() => navigate("/login")}>Đăng nhập</button>
          <button className="welcome-btn" onClick={() => navigate("/register")}>Đăng ký</button>
        </div>
      </div>
    </div>
  );
}
