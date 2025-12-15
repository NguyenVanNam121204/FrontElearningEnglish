import React, { useState } from "react";
import "../Register/Register.css";
import Header from "../../Components/Header/LogoHeader";
import { useNavigate } from "react-router-dom";
import { authService } from "../../Services/authService";

export default function Register() {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getDaysInMonth = (m, y) => {
    if (!m) return 31;
    return new Date(y || 2000, m, 0).getDate();
  };

  const calculateAge = (d, m, y) => {
    if (!d || !m || !y) return null;
    const today = new Date();
    const birth = new Date(y, m - 1, d);
    let age = today.getFullYear() - birth.getFullYear();
    const diff =
      today.getMonth() - birth.getMonth() ||
      today.getDate() - birth.getDate();
    if (diff < 0) age--;
    return age;
  };

  const handleRegister = async () => {
    setError("");
    
    // Validation
    if (!firstName || !lastName || !email || !password || !confirmPassword || !phoneNumber) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    const age = calculateAge(day, month, year);
    if (age === null) {
      setError("Vui lòng chọn đầy đủ ngày sinh");
      return;
    }

    if (age < 5) {
      setError("Ứng dụng dành cho trẻ từ 5 tuổi trở lên");
      return;
    }

    // Call API
    setLoading(true);
    try {
      const dateOfBirth = new Date(year, month - 1, day);
      const isMale = gender === "male";

      await authService.register({
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        dateOfBirth,
        isMale,
      });

      alert("Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Header />

      <div className="auth-card">
        <h1 className="auth-title">Tạo tài khoản của bạn</h1>

        {/* Error message */}
        {error && (
          <div style={{ color: "red", marginBottom: "15px", fontSize: "14px" }}>
            {error}
          </div>
        )}

        {/* NAME */}
        <div className="row">
          <input 
            className="auth-input" 
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={loading}
          />
          <input 
            className="auth-input" 
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* BASIC INFO */}
        <input 
          className="auth-input" 
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <input 
          className="auth-input" 
          placeholder="Tạo mật khẩu"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        <input 
          className="auth-input" 
          placeholder="Xác nhận mật khẩu"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
        />
        <input 
          className="auth-input" 
          placeholder="Số điện thoại"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          disabled={loading}
        />

        {/* DOB + GENDER */}
        <div className="row">
          <div className="select-wrapper">
            <select
              className="auth-input"
              value={day}
              onChange={(e) => setDay(e.target.value)}
            >
              <option value="">Date</option>
              {Array.from(
                { length: getDaysInMonth(month, year) },
                (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                )
              )}
            </select>
            <span className="select-arrow">▼</span>
          </div>

          <div className="select-wrapper">
            <select
              className="auth-input"
              value={month}
              onChange={(e) => {
                setMonth(e.target.value);
                setDay("");
              }}
            >
              <option value="">Month</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            <span className="select-arrow">▼</span>
          </div>

          <div className="select-wrapper">
            <select
              className="auth-input"
              value={year}
              onChange={(e) => {
                setYear(e.target.value);
                setDay("");
              }}
            >
              <option value="">Year</option>
              {Array.from({ length: 100 }, (_, i) => {
                const y = new Date().getFullYear() - i;
                return (
                  <option key={y} value={y}>
                    {y}
                  </option>
                );
              })}
            </select>
            <span className="select-arrow">▼</span>
          </div>

          <div className="select-wrapper">
            <select
              className="auth-input"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Gender</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
           
            </select>
            <span className="select-arrow">▼</span>
          </div>
        </div>

        <button 
          className="auth-btn primary" 
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? "Đang đăng ký..." : "Đăng ký"}
        </button>

        <p className="auth-footer">
          Đã có tài khoản?{" "}
          <span className="auth-link" onClick={() => navigate("/login")}>
            Đăng nhập ngay
          </span>
        </p>
      </div>
    </div>
  );
}

