import React, { useState } from "react";
import "../Login/Login.css";
import Header from "../../Components/Header/LogoHeader";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from "../../Context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, loginAsGuest } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!email || !password) {
      setError("Vui lòng nhập email và mật khẩu");
      return;
    }

    setLoading(true);
    try {
      await login({ email, password }, navigate);
    } catch (err) {
      setError(err.response?.data?.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    loginAsGuest(navigate);
  };

  return (
    <div className="auth-container">
      <Header />

      <div className="auth-card">
        <h1 className="auth-title">Chào mừng trở lại!</h1>
        <p className="auth-subtitle">
          Đăng nhập để tiếp tục hành trình của bạn.
        </p>

        {/* Error message */}
        {error && (
          <div style={{ color: "red", marginBottom: "15px", fontSize: "14px" }}>
            {error}
          </div>
        )}

        {/* Email (BỌC WRAPPER để bằng password) */}
        <div className="password-wrapper">
          <input
            type="email"
            placeholder="email@gmail.com"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Password */}
        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Nhập mật khẩu của bạn"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Options */}
        <div className="auth-options">
          <label>
            <input type="checkbox" /> Remember me
          </label>
          <span className="auth-link">Quên mật khẩu?</span>
        </div>

        {/* Login button */}
        <button 
          className="auth-btn primary" 
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        {/* Register link */}
        <p className="auth-footer">
          Chưa có tài khoản?{" "}
          <span
            className="auth-link"
            onClick={() => navigate("/register")}
          >
            Đăng ký
          </span>
        </p>

        <div className="divider">HOẶC</div>

        {/* Social login */}
        <button className="auth-btn google social-btn">
          <FcGoogle className="social-icon" />
          <span>Đăng nhập bằng Google</span>
        </button>

        <button className="auth-btn facebook social-btn">
          <FaFacebookF className="social-icon" />
          <span>Đăng nhập bằng Facebook</span>
        </button>

        <button 
          className="auth-btn guest social-btn"
          onClick={handleGuestLogin}
          disabled={loading}
        >
          <FaUser className="social-icon" />
          <span>Đăng nhập bằng khách</span>
        </button>
      </div>
    </div>
  );
}
