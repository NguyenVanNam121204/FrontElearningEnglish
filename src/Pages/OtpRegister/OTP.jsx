import React, { useState, useRef, useEffect } from "react";
import "./OTP.css";
import { authService } from "../../Services/authService";
import { useNavigate, useLocation } from "react-router-dom";

export default function OTP() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const email = state?.email;

  useEffect(() => {
    if (!email) navigate("/register");
  }, [email, navigate]);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    
    // Chỉ cho phép số
    const numericValue = value.replace(/\D/g, "");
    
    // Nếu không có gì hoặc xóa
    if (numericValue === "") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    // Lấy ký tự cuối cùng (trường hợp paste nhiều số)
    const digit = numericValue.slice(-1);

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto focus sang ô tiếp theo
    if (digit && index < 5) {
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 0);
    }
  };

  const handleKeyDown = (e, index) => {
    // Backspace: nếu ô trống thì quay về ô trước
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    }
    
    // Arrow left
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Arrow right
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    
    if (pastedData.length === 6) {
      setOtp(pastedData.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join("");

    if (code.length < 6) {
      setErrorMessage("Vui lòng nhập đầy đủ mã OTP.");
      return;
    }

    try {
      const res = await authService.verifyEmail({ email, otpCode: code });

      if (res.data?.success) {
        alert("Xác thực email thành công! Vui lòng đăng nhập.");
        navigate("/login");
      } else {
        setErrorMessage(
          res.data?.message || "Mã OTP không đúng hoặc đã hết hạn."
        );
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || "Mã OTP không đúng hoặc đã hết hạn.";
      setErrorMessage(msg);
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-box">
        <h2>Xác minh OTP</h2>
        <p className="otp-desc">
          Mã xác minh đã được gửi đến email <strong>{email}</strong>
        </p>

        <div className="otp-input-group">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              value={digit}
              className="otp-input"
              maxLength={1}
              inputMode="numeric"
              type="text"
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              autoComplete="off"
            />
          ))}
        </div>

        {errorMessage && <p className="otp-error">{errorMessage}</p>}

        <button className="otp-btn" onClick={handleVerify}>
          Xác minh
        </button>
      </div>
    </div>
  );
}
