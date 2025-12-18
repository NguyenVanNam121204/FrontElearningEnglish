// src/Components/Header/MainHeader.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";
import { mochiWelcome as logo, iconHome, iconCourse, iconOntap, iconSotay, iconBell, iconStreakFire as iconFireStreak } from "../../Assets";
import ProfileDropdown from "./ProfileDropdown";
import { streakService } from "../../Services/streakService";
import { useAuth } from "../../Context/AuthContext";

export default function MainHeader() {
  const [streakDays, setStreakDays] = useState(0);
  const [isActiveToday, setIsActiveToday] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isGuest } = useAuth();

  useEffect(() => {
    // Only fetch streak if user is authenticated (not guest)
    if (isGuest) {
      setStreakDays(0);
      setIsActiveToday(false);
      return;
    }

    const fetchAndCheckinStreak = async () => {
      try {
        // 1. Lấy streak hiện tại
        const response = await streakService.getMyStreak();
        const streakData = response.data.data;
        // Backend trả về PascalCase: CurrentStreak, IsActiveToday, LastActivityDate
        const currentStreak = streakData?.CurrentStreak || streakData?.currentStreak || 0;
        const activeToday = streakData?.IsActiveToday || streakData?.isActiveToday || false;
        
        setStreakDays(currentStreak);
        setIsActiveToday(activeToday);

        // 2. Nếu chưa check-in hôm nay, gọi check-in
        if (!activeToday) {
          try {
            const checkinResponse = await streakService.checkinStreak();
            const checkinResult = checkinResponse.data.data;
            if (checkinResult?.Success || checkinResult?.success) {
              // Cập nhật streak sau khi check-in
              const newStreak = checkinResult?.NewCurrentStreak || checkinResult?.newCurrentStreak || currentStreak;
              setStreakDays(newStreak);
              setIsActiveToday(true);
            }
          } catch (checkinError) {
            // Silently fail check-in - streak đã được fetch ở trên
          }
        }
      } catch (error) {
        setStreakDays(0);
        setIsActiveToday(false);
      }
    };

    // Delay một chút để đảm bảo user đã load xong trang
    const timer = setTimeout(() => {
      fetchAndCheckinStreak();
    }, 500);

    return () => clearTimeout(timer);
  }, [isGuest]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="main-header">
      {/* LEFT: logo + brand */}
      <div className="main-header__left" onClick={() => navigate("/my-courses")} style={{ cursor: "pointer" }}>
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
