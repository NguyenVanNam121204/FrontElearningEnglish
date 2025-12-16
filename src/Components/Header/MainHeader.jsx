// src/Components/Header/MainHeader.jsx
import React from "react";
import "./Header.css";
import logo from "../../Assets/Logo/mochi-welcome.jpg";
import ProfileDropdown from "./ProfileDropdown";

import {
  FaHome,
  FaBook,
  FaListAlt,
  FaStickyNote,
} from "react-icons/fa";

export default function MainHeader() {
  return (
    <header className="main-header">
      {/* LEFT: logo + brand */}
      <div className="main-header__left">
        <img src={logo} alt="logo" className="main-header__logo" />
        <span className="main-header__brand">Catalunya English</span>
      </div>

      {/* CENTER: navigation */}
      <nav className="main-header__nav">
        <a className="nav-item active">
          <FaHome />
          <span>Trang chủ</span>
        </a>

        <a className="nav-item">
          <FaBook />
          <span>Khóa học của tôi</span>
        </a>

        <a className="nav-item">
          <FaListAlt />
          <span>Ôn tập từ vựng</span>
        </a>

        <a className="nav-item">
          <FaStickyNote />
          <span>Sổ tay từ vựng</span>
        </a>
      </nav>

      {/* RIGHT: streak + profile */}
      <div className="main-header__right">
        <div className="streak-badge">🔥 15 ngày</div>
        <ProfileDropdown />
      </div>
    </header>
  );
}
