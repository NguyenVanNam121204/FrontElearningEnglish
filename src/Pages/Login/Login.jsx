import React, { useState } from "react";
import "./Login.css";
import Header from "../../Components/Header/LogoHeader";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaUser } from "react-icons/fa";
import { useAuth } from "../../Context/AuthContext";
import { InputField, SocialLoginButton } from "../../Components/Auth";

export default function Login() {
  const navigate = useNavigate();
  const { login, googleLogin, facebookLogin, loginAsGuest } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState({
    google: false,
    facebook: false,
    guest: false,
  });


  // Validate email format
  const validateEmail = (email) => {
    if (!email) {
      return "Vui lòng nhập email";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Email không hợp lệ, email phải có định dạng example@example.com";
    }
    return "";
  };

  // Validate password
  const validatePassword = (password) => {
    if (!password) {
      return "Vui lòng nhập mật khẩu";
    }
    if (password.length < 6) {
      return "Mật khẩu phải có ít nhất 6 ký tự";
    }
    return "";
  };

  // Handle input change with validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Real-time validation
    setGeneralError("");
    if (name === "email") {
      setErrors((prev) => ({
        ...prev,
        email: validateEmail(value),
      }));
    } else if (name === "password") {
      setErrors((prev) => ({
        ...prev,
        password: validatePassword(value),
      }));
    }
  };

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setGeneralError("");

    // Validate all fields
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    setErrors({
      email: emailError,
      password: passwordError,
    });

    if (emailError || passwordError) {
      return;
    }

    setLoading(true);
    try {
      await login({ email: formData.email, password: formData.password }, navigate);
    } catch (err) {
      setGeneralError(
        err.response?.data?.message ||
        "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Login
  const handleGoogleLogin = async () => {
    setSocialLoading((prev) => ({ ...prev, google: true }));
    setGeneralError("");

    try {
      // Use default client ID if env variable is not set
      const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID ||
        "872783330590-gc3t4a8rf2dve8s87qu2dte766k6f44p.apps.googleusercontent.com";

      if (!googleClientId) {
        setGeneralError(
          "Google Login chưa được cấu hình. Vui lòng liên hệ quản trị viên."
        );
        setSocialLoading((prev) => ({ ...prev, google: false }));
        return;
      }

      // Use Google Identity Services with button flow
      if (window.google && window.google.accounts) {
        // Create a hidden button and trigger it
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'none';
        document.body.appendChild(buttonContainer);

        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: async (response) => {
            try {
              const state = Math.random().toString(36).substring(2, 15);
              document.body.removeChild(buttonContainer);
              await googleLogin(
                {
                  idToken: response.credential,
                  state: state,
                },
                navigate
              );
            } catch (err) {
              document.body.removeChild(buttonContainer);
              setGeneralError(
                err.response?.data?.message ||
                "Đăng nhập bằng Google thất bại. Vui lòng thử lại."
              );
              setSocialLoading((prev) => ({ ...prev, google: false }));
            }
          },
        });

        // Render button and click it programmatically
        window.google.accounts.id.renderButton(buttonContainer, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
        });

        // Trigger click after a short delay to ensure button is rendered
        setTimeout(() => {
          const button = buttonContainer.querySelector('div[role="button"]');
          if (button) {
            button.click();
          } else {
            document.body.removeChild(buttonContainer);
            setGeneralError("Không thể khởi tạo đăng nhập Google. Vui lòng thử lại.");
            setSocialLoading((prev) => ({ ...prev, google: false }));
          }
        }, 100);
      } else {
        setGeneralError(
          "Đang tải Google Identity Services... Vui lòng đợi vài giây rồi thử lại."
        );
        setSocialLoading((prev) => ({ ...prev, google: false }));
      }
    } catch (err) {
      setGeneralError("Đăng nhập bằng Google thất bại. Vui lòng thử lại.");
      setSocialLoading((prev) => ({ ...prev, google: false }));
    }
  };

  // Handle Facebook Login
  const handleFacebookLogin = async () => {
    setSocialLoading((prev) => ({ ...prev, facebook: true }));
    setGeneralError("");

    try {
      // Use default app ID if env variable is not set
      const facebookAppId = process.env.REACT_APP_FACEBOOK_APP_ID || "1387702409762481";

      if (!facebookAppId) {
        setGeneralError(
          "Facebook Login chưa được cấu hình. Vui lòng liên hệ quản trị viên."
        );
        setSocialLoading((prev) => ({ ...prev, facebook: false }));
        return;
      }

      // Check if Facebook SDK is loaded
      if (window.FB) {
        window.FB.login(
          async (response) => {
            if (response.authResponse) {
              try {
                const state = Math.random().toString(36).substring(2, 15);
                await facebookLogin(
                  {
                    accessToken: response.authResponse.accessToken,
                    state: state,
                  },
                  navigate
                );
              } catch (err) {
                setGeneralError(
                  err.response?.data?.message ||
                  "Đăng nhập bằng Facebook thất bại. Vui lòng thử lại."
                );
                setSocialLoading((prev) => ({ ...prev, facebook: false }));
              }
            } else {
              setGeneralError("Đăng nhập bằng Facebook đã bị hủy.");
              setSocialLoading((prev) => ({ ...prev, facebook: false }));
            }
          },
          { scope: "email,public_profile" }
        );
      } else {
        setGeneralError(
          "Đang tải Facebook SDK... Vui lòng đợi vài giây rồi thử lại."
        );
        setSocialLoading((prev) => ({ ...prev, facebook: false }));
      }
    } catch (err) {
      setGeneralError("Đăng nhập bằng Facebook thất bại. Vui lòng thử lại.");
      setSocialLoading((prev) => ({ ...prev, facebook: false }));
    }
  };

  // Handle Guest Login
  const handleGuestLogin = () => {
    setSocialLoading((prev) => ({ ...prev, guest: true }));
    loginAsGuest(navigate);
  };

  return (
    <div className="auth-container">
      <Header />

      <div className="auth-card">
        <h1 className="auth-title">Chào mừng trở lại!</h1>
        <p className="auth-subtitle">Đăng nhập để tiếp tục hành trình của bạn.</p>

        {/* General error message */}
        {generalError && (
          <div className="auth-error-message">{generalError}</div>
        )}

        <form onSubmit={handleLogin}>
          {/* Email Input */}
          <InputField
            type="email"
            name="email"
            placeholder="email@gmail.com"
            value={formData.email}
            onChange={handleInputChange}
            error={errors.email}
            disabled={loading}
          />

          {/* Password Input */}
          <InputField
            type="password"
            name="password"
            placeholder="Nhập mật khẩu của bạn"
            value={formData.password}
            onChange={handleInputChange}
            error={errors.password}
            disabled={loading}
            showPasswordToggle={true}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
          />

          {/* Options */}
          <div className="auth-options">
            <label>
              <input type="checkbox" /> Remember me
            </label>
            <span
              className="auth-link"
              onClick={() => navigate("/forgot-password")}
              style={{ cursor: "pointer" }}
            >
              Quên mật khẩu?
            </span>
          </div>

          {/* Login button */}
          <button
            className="auth-btn primary"
            type="submit"
            disabled={loading}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        {/* Register */}
        <p className="auth-footer">
          Chưa có tài khoản?{" "}
          <span className="auth-link" onClick={() => navigate("/register")}>
            Đăng ký
          </span>
        </p>

        <div className="divider">HOẶC</div>

        {/* Social login buttons */}
        <SocialLoginButton
          type="google"
          icon={FcGoogle}
          text="Đăng nhập bằng Google"
          onClick={handleGoogleLogin}
          disabled={loading}
          loading={socialLoading.google}
        />

        <SocialLoginButton
          type="facebook"
          icon={FaFacebookF}
          text="Đăng nhập bằng Facebook"
          onClick={handleFacebookLogin}
          disabled={loading}
          loading={socialLoading.facebook}
        />

        <SocialLoginButton
          type="guest"
          icon={FaUser}
          text="Đăng nhập bằng khách"
          onClick={handleGuestLogin}
          disabled={loading}
          loading={socialLoading.guest}
        />
      </div>
    </div>
  );
}
