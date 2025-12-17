import React from "react";
import "./WelcomePremium.css";
import { useNavigate } from "react-router-dom";

export default function WelcomePremium() {
  const navigate = useNavigate();

  return (
    <section className="welcome-premium">
      <div className="premium-content">
        <div className="premium-header">
          <h2 className="premium-title">Nâng cấp tài khoản</h2>
          <h3 className="premium-subtitle">Catalunya English Premium</h3>
          <div className="premium-badge">
            <span>Ưu đãi 30% cho học viên Việt Nam</span>
          </div>
        </div>

        <div className="premium-plans">
          <div className="plan-card">
            <div className="plan-header">
              <span className="plan-label">Gói 1 năm</span>
              <div className="plan-price">
                <span className="price-old">1.049.000</span>
                <span className="price-new">749.000</span>
                <span className="price-currency">đ</span>
              </div>
            </div>
            <ul className="plan-features">
              <li>✓ Truy cập không giới hạn</li>
              <li>✓ Học mọi lúc mọi nơi</li>
              <li>✓ Hỗ trợ 24/7</li>
            </ul>
          </div>

          <div className="plan-card featured">
            <div className="plan-badge-hot">HOT!</div>
            <div className="plan-header">
              <span className="plan-label">Gói 3 năm</span>
              <div className="plan-price">
                <span className="price-old">2.099.000</span>
                <span className="price-new">1.499.000</span>
                <span className="price-currency">đ</span>
              </div>
            </div>
            <ul className="plan-features">
              <li>✓ Tiết kiệm hơn 30%</li>
              <li>✓ Truy cập không giới hạn</li>
              <li>✓ Học mọi lúc mọi nơi</li>
              <li>✓ Hỗ trợ 24/7</li>
              <li>✓ Ưu đãi đặc biệt</li>
            </ul>
          </div>
        </div>

        <div className="premium-actions">
          <button 
            className="premium-btn login-btn"
            onClick={() => navigate("/login")}
          >
            Đăng nhập ngay
          </button>
          <button 
            className="premium-btn register-btn"
            onClick={() => navigate("/register")}
          >
            Đăng ký ngay
          </button>
        </div>
      </div>
    </section>
  );
}

