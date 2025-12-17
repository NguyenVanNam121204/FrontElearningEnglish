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
      // login returns a promise, so we can use .then() or await
      await login({ email: formData.email, password: formData.password }, navigate);
    } catch (err) {
      setGeneralError(
        err.response?.data?.message ||
        err.message ||
        "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Login - Wrap in regular function to avoid async function type error
  const handleGoogleLogin = () => {
    (async () => {
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

      // Get current origin for debugging
      const currentOrigin = window.location.origin;
      console.log("Current origin:", currentOrigin);
      console.log("Google Client ID:", googleClientId);

      // Generate CSRF state token BEFORE calling Google login (backend requirement)
      const state = Math.random().toString(36).substring(2, 15) + 
                    Math.random().toString(36).substring(2, 15);

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
              document.body.removeChild(buttonContainer);
              
              if (!response || !response.credential) {
                throw new Error("Không nhận được token từ Google");
              }
              
              // Backend expects: IdToken (PascalCase) and State (PascalCase)
              // ASP.NET Core will automatically map camelCase to PascalCase
              // googleLogin returns a promise, so we can use await
              await googleLogin(
                {
                  IdToken: response.credential, // Use PascalCase to match backend exactly
                  State: state, // Use PascalCase to match backend exactly
                },
                navigate
              );
            } catch (err) {
              document.body.removeChild(buttonContainer);
              const errorMessage = err.response?.data?.message || 
                                 err.message ||
                                 "Đăng nhập bằng Google thất bại. Vui lòng thử lại.";
              setGeneralError(errorMessage);
              setSocialLoading((prev) => ({ ...prev, google: false }));
            }
          },
          error_callback: (error) => {
            // Handle Google Identity Services errors
            document.body.removeChild(buttonContainer);
            console.error("Google Identity Services error:", error);
            
            let errorMsg = "Đăng nhập bằng Google thất bại. ";
            if (error.type === "popup_closed_by_user") {
              errorMsg += "Bạn đã đóng cửa sổ đăng nhập.";
            } else if (error.type === "popup_failed_to_open") {
              errorMsg += "Không thể mở cửa sổ đăng nhập. Vui lòng kiểm tra cài đặt trình chặn popup.";
            } else if (error.type === "unknown") {
              errorMsg += `Lỗi: ${error.message || "Vui lòng kiểm tra cấu hình Google OAuth trong Google Cloud Console."}`;
            }
            
            // Check for origin errors
            if (error.message && error.message.includes("origin")) {
              errorMsg += `\n\nLỗi cấu hình: Origin "${window.location.origin}" chưa được đăng ký trong Google Cloud Console.`;
              errorMsg += `\nVui lòng thêm "${window.location.origin}" vào "Authorized JavaScript origins" trong Google Cloud Console.`;
            }
            
            setGeneralError(errorMsg);
            setSocialLoading((prev) => ({ ...prev, google: false }));
          }
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
      const errorMessage = err.response?.data?.message || 
                         err.message ||
                         "Đăng nhập bằng Google thất bại. Vui lòng thử lại.";
      setGeneralError(errorMessage);
      setSocialLoading((prev) => ({ ...prev, google: false }));
    }
    })().catch((err) => {
      console.error("Unhandled error in handleGoogleLogin:", err);
      setGeneralError("Đăng nhập bằng Google thất bại. Vui lòng thử lại.");
      setSocialLoading((prev) => ({ ...prev, google: false }));
    });
  };

  // Handle Facebook Login - Simplified approach
  const handleFacebookLogin = () => {
    setSocialLoading((prev) => ({ ...prev, facebook: true }));
    setGeneralError("");

    // Generate CSRF state token BEFORE calling Facebook login (backend requirement)
    const state = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15);
    
    // Store state in sessionStorage for verification
    sessionStorage.setItem('facebook_login_state', state);

    console.log("=== FACEBOOK LOGIN START ===");
    console.log("Generated state token:", state);

    // Facebook App ID
    const facebookAppId = process.env.REACT_APP_FACEBOOK_APP_ID || "1387702409762481";
    console.log("Facebook App ID:", facebookAppId);

    // Function to initialize and call Facebook login
    const initAndLogin = async () => {
      try {
        // Wait for Facebook SDK to be available
        if (!window.FB) {
          console.log("Waiting for Facebook SDK to load...");
          let attempts = 0;
          while (!window.FB && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 200));
            attempts++;
          }
          
          if (!window.FB) {
            throw new Error("Facebook SDK không thể tải được. Vui lòng kiểm tra kết nối internet.");
          }
        }

        console.log("Facebook SDK is available");

        // Initialize Facebook SDK
        try {
          window.FB.init({
            appId: facebookAppId,
            cookie: true,
            xfbml: true,
            version: 'v18.0'
          });
          console.log("Facebook SDK initialized");
          
          // Wait for initialization
          await new Promise(resolve => setTimeout(resolve, 300));
        } catch (initError) {
          console.error("Error initializing Facebook SDK:", initError);
          // Continue anyway, SDK might already be initialized
        }

        // Call Facebook login
        console.log("Calling FB.login...");
        window.FB.login(
          async (response) => {
            console.log("Facebook login response:", response);
            
            if (response.authResponse && response.authResponse.accessToken) {
              const accessToken = response.authResponse.accessToken;
              console.log("Got Facebook access token");
              
              // Get stored state
              const storedState = sessionStorage.getItem('facebook_login_state');
              sessionStorage.removeItem('facebook_login_state');
              
              if (storedState !== state) {
                console.error("State mismatch - possible CSRF attack");
                setGeneralError("Lỗi bảo mật. Vui lòng thử lại.");
                setSocialLoading((prev) => ({ ...prev, facebook: false }));
                return;
              }

              // Prepare data for backend
              const loginData = {
                AccessToken: accessToken,
                State: state
              };

              console.log("Sending to backend:", { ...loginData, AccessToken: "***" });
              
              try {
                await facebookLogin(loginData, navigate);
                console.log("Facebook login successful!");
              } catch (error) {
                console.error("Backend login error:", error);
                const errorMessage = error.response?.data?.message || 
                                   error.message ||
                                   "Đăng nhập bằng Facebook thất bại.";
                setGeneralError(errorMessage);
                setSocialLoading((prev) => ({ ...prev, facebook: false }));
              }
            } else {
              console.log("Facebook login cancelled or failed:", response.status);
              let errorMsg = "Đăng nhập bằng Facebook đã bị hủy.";
              if (response.status === "not_authorized") {
                errorMsg = "Bạn đã từ chối quyền truy cập Facebook.";
              }
              setGeneralError(errorMsg);
              setSocialLoading((prev) => ({ ...prev, facebook: false }));
            }
          },
          { 
            scope: "email,public_profile",
            return_scopes: true
          }
        );
      } catch (error) {
        console.error("Facebook login error:", error);
        setGeneralError(error.message || "Đăng nhập bằng Facebook thất bại.");
        setSocialLoading((prev) => ({ ...prev, facebook: false }));
      }
    };

    // Start the login process
    initAndLogin();
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
