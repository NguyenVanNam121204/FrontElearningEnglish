import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { authService } from "../Services/authService";

/**
 * Custom hook for Google Login
 * Handles all Google OAuth login logic
 * OAuth URL is fetched from backend to avoid exposing keys in frontend
 */
export const useGoogleLogin = () => {
  const navigate = useNavigate();
  const { googleLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      // Generate CSRF state token (backend requirement)
      const state =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

      // Store state in sessionStorage for verification after redirect
      sessionStorage.setItem("google_oauth_state", state);

      // Get OAuth URL from backend (backend will build URL with its own keys)
      const response = await authService.getGoogleAuthUrl();
      
      if (response.data?.success && response.data?.data?.authUrl) {
        // Append state to the URL from backend
        const authUrl = response.data.data.authUrl;
        const separator = authUrl.includes('?') ? '&' : '?';
        const finalAuthUrl = `${authUrl}${separator}state=${encodeURIComponent(state)}`;
        
        // Redirect to Google OAuth consent screen
        window.location.href = finalAuthUrl;
      } else {
        throw new Error(response.data?.message || "Không thể lấy Google OAuth URL từ server");
      }
    } catch (err) {
      console.error("Google login error:", err);
      
      // Handle 404 error specifically (endpoint not found)
      if (err.response?.status === 404) {
        setError("Backend chưa có endpoint để lấy Google OAuth URL. Vui lòng liên hệ quản trị viên.");
      } else {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Đăng nhập bằng Google thất bại. Vui lòng thử lại.";
        setError(errorMessage);
      }
      setLoading(false);
    }
  }, []);

  return {
    handleGoogleLogin,
    loading,
    error,
  };
};

