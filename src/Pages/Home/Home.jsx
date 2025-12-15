import React from "react";
import "./Home.css";
import MainHeader from "../../Components/Header/MainHeader";
import { useAuth } from "../../Context/AuthContext";

export default function Home() {
  const { user, isGuest } = useAuth();

  const displayName = isGuest ? "bạn" : user?.fullName || "bạn";

  return (
    <>
      <MainHeader />

      <div className="home-container">
        {/* ===== WELCOME ===== */}
        <section className="home-welcome">
          <h1>Chào mừng trở lại, {displayName}</h1>
          <p>Hãy tiếp tục hành trình học tiếng Anh nào.</p>
        </section>

        {/* ===== MY COURSES ===== */}
        <section className="home-section">
          <h2>Khoá học của tôi</h2>

          <div className="course-grid">
            {[1, 2, 3, 4].map((i) => (
              <div className="course-card" key={i}>
                <img
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                  alt="course"
                />
                <div className="course-info">
                  <h3>IELTS 6.5</h3>

                  <div className="progress">
                    <div className="progress-bar" style={{ width: "40%" }} />
                  </div>

                  <span className="progress-text">40%</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===== SUGGEST + UPGRADE ===== */}
        <section className="home-bottom">
          {/* LEFT */}
          <div className="suggest-box">
            <h2>Khoá học gợi ý</h2>

            {[1, 2, 3].map((i) => (
              <div className="suggest-item" key={i}>
                <div className="suggest-icon">🎤</div>

                <div className="suggest-text">
                  <h4>Khoá học: luyện phát âm</h4>
                  <span>Kỹ năng: Speaking</span>
                </div>

                <button className="play-btn">▶</button>
              </div>
            ))}
          </div>

          {/* RIGHT */}
          <div className="upgrade-box">
            <h2>Nâng cấp tài khoản</h2>
            <p>
              Mở khoá toàn bộ tính năng, tham gia lớp học và đồng hành cùng học
              sinh tốt hơn
            </p>

            <div className="package-grid">
              <div className="package-card">
                <h3>VIP</h3>
                <p>Tham gia vào bài học cao cấp</p>
                <strong>299.000đ / tháng</strong>
                <button className="upgrade-btn blue">Nâng cấp</button>
              </div>

              <div className="package-card highlight">
                <h3>Premium</h3>
                <p>Trở thành giáo viên</p>
                <strong>399.000đ / tháng</strong>
                <button className="upgrade-btn pink">Nâng cấp</button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
