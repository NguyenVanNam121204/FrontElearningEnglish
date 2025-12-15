import React, { useState } from "react";
import "./ResetPassword.css";
import { authService } from "../../Services/authService";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email;
  const otpCode = state?.otpCode;

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!email || !otpCode) {
    navigate("/forgot-password");
    return null;
  }

  const handleReset = async () => {
    setError("");
    setSuccess("");

    if (!password || !confirm) {
      setError("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    if (password !== confirm) {
      setError("Mật khẩu nhập lại không khớp.");
      return;
    }

    try {
      const res = await authService.resetPassword({
        email,
        otpCode,
        newPassword: password,
        confirmPassword: confirm,
      });

      if (res.data?.success) {
        setSuccess("Đặt lại mật khẩu thành công!");
        setTimeout(() => navigate("/login"), 1200);
      } else {
        setError(res.data?.message || "Yêu cầu có chữ Hoa, kí tự đặc biệt và số.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Yêu cầu có chữ Hoa, kí tự đặc biệt và số.");
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-card">
        <h2 className="reset-title">Tạo mật khẩu mới</h2>
        <p className="reset-desc">Đặt lại mật khẩu cho email <strong>{email}</strong></p>

        {error && <p className="reset-error">{error}</p>}
        {success && <p className="reset-success">{success}</p>}

        {/* Password */}
        <div className="input-wrapper">
          <input
            type={showPwd ? "text" : "password"}
            className="reset-input"
            placeholder="Nhập mật khẩu mới"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="toggle-icon"
            onClick={() => setShowPwd(!showPwd)}
          >
            {showPwd ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Confirm password */}
        <div className="input-wrapper">
          <input
            type={showConfirm ? "text" : "password"}
            className="reset-input"
            placeholder="Nhập lại mật khẩu mới"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <span
            className="toggle-icon"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button className="reset-btn" onClick={handleReset}>
          Đặt lại mật khẩu
        </button>

        <p className="reset-back" onClick={() => navigate("/login")}>
          Quay lại đăng nhập
        </p>
      </div>
    </div>
  );
}
