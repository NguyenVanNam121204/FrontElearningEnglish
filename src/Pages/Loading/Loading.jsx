import React from "react";
import "./Loading.css";
import mochiLoading from "../../Assets/Logo/mochi-loading.jpg";
import mochiWelcome from "../../Assets/Logo/mochi-welcome.jpg";

export default function Loading() {
  return (
    <div className="loading-container">
      {/* Header nhỏ góc trái */}
      <div className="loading-header">
        <img src={mochiWelcome} alt="logo" className="loading-logo" />
        <span className="loading-title">Catalunya English</span>
      </div>

      {/* Nội dung trung tâm */}
      <div className="loading-content">
        <img src={mochiLoading} alt="hello" className="loading-img" />

        <h1 className="loading-text">
          Chào mừng bạn đến với <br /> Catalunya English
        </h1>
      </div>
    </div>
  );
}
