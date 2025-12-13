import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Loading.css";
import mochiLoading from "../../Assets/Logo/mochi-loading.jpg";
import mochiWelcome from "../../Assets/Logo/mochi-welcome.jpg";

export default function Loading() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/welcome");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="loading-container">
      {/* Header */}
      <div className="loading-header">
        <img src={mochiWelcome} alt="logo" className="loading-logo" />
        <span className="loading-title">Catalunya English</span>
      </div>

      {/* Nội dung trung tâm */}
      <div className="loading-content">
        <img src={mochiLoading} alt="hello" className="loading-img" />

        <div className="loading-right">
          <h1 className="loading-text">
            Chào mừng bạn đến với <br /> Catalunya English
          </h1>

          {/* SPINNER XOAY XOAY */}
          <div className="loading-spinner"></div>
        </div>
      </div>
    </div>
  );
}
