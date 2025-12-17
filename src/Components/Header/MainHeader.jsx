// src/Components/Header/MainHeader.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";
import logo from "../../Assets/Logo/mochi-welcome.jpg";
import ProfileDropdown from "./ProfileDropdown";
import { streakService } from "../../Services/streakService";
import { useAuth } from "../../Context/AuthContext";

// Import icons from Assets/Icons (SVG)
import iconHome from "../../Assets/Icons/icon_home.svg";
import iconCourse from "../../Assets/Icons/icon_course.svg";
import iconOntap from "../../Assets/Icons/icon_ontap.svg";
import iconSotay from "../../Assets/Icons/icon_sotay.svg";
import iconBell from "../../Assets/Icons/Icon.svg";
import iconFireStreak from "../../Assets/Icons/icon_streak_fire.svg";

export default function MainHeader() {
  const [streakDays, setStreakDays] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { isGuest } = useAuth();

  useEffect(() => {
    // Only fetch streak if user is authenticated (not guest)
    if (isGuest) {
      setStreakDays(0);
      return;
    }

    const fetchStreak = async () => {
      try {
        const response = await streakService.getMyStreak();
        const streakData = response.data.data;
        setStreakDays(streakData?.currentStreak || 0);
      } catch (error) {
        console.error("Error fetching streak:", error);
        setStreakDays(0);
      }
    };

    fetchStreak();
  }, [isGuest]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="main-header">
      {/* LEFT: logo + brand */}
      <div className="main-header__left" onClick={() => navigate("/home")} style={{ cursor: "pointer" }}>
        <img src={logo} alt="logo" className="main-header__logo" />
        <span className="main-header__brand">Catalunya English</span>
      </div>

      {/* CENTER: navigation */}
      <nav className="main-header__nav">
        <div
          onClick={() => navigate("/home")}
          className={`nav-item ${isActive("/home") ? "active" : ""}`}
        >
          <img src={iconHome} alt="Home" className="nav-icon" />
          <span>Trang chủ</span>
        </div>

        <div
          onClick={() => navigate("/my-courses")}
          className={`nav-item ${isActive("/my-courses") ? "active" : ""}`}
        >
          <img src={iconCourse} alt="Courses" className="nav-icon" />
          <span>Khóa học của tôi</span>
        </div>

        <div
          onClick={() => navigate("/vocabulary-review")}
          className={`nav-item ${isActive("/vocabulary-review") ? "active" : ""}`}
        >
          <img src={iconOntap} alt="Review" className="nav-icon" />
          <span>Ôn tập từ vựng</span>
        </div>

        <div
          onClick={() => navigate("#")}
          className="nav-item"
        >
          <img src={iconSotay} alt="Notebook" className="nav-icon" />
          <span>Sổ tay từ vựng</span>
        </div>
      </nav>

      {/* RIGHT: streak + notification + profile */}
      <div className="main-header__right">
        <div className="streak-badge">
          <img src={iconFireStreak} alt="Streak" className="streak-icon" />
          <span>{streakDays} ngày</span>
        </div>
        <button className="notification-button" onClick={() => navigate("/notifications")}>
          <img src={iconBell} alt="Notifications" className="notification-icon" />
        </button>
        <ProfileDropdown />
      </div>
    </header>
  );
}
