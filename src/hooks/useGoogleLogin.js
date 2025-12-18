import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

/**
 * Custom hook for Google Login
 * Handles all Google OAuth login logic
 */
export const useGoogleLogin = () => {
  const navigate = useNavigate();
  const { googleLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = useCallback(() => {
    setLoading(true);
    setError("");

    try {
      // Get Google Client ID from environment variables
      const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

      if (!googleClientId) {
        setError(
          "Google Login chưa được cấu hình. Vui lòng kiểm tra file .env và đảm bảo REACT_APP_GOOGLE_CLIENT_ID đã được thiết lập."
        );
        setLoading(false);
        return;
      }

      // Generate CSRF state token (backend requirement)
      const state =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

      // Store state in sessionStorage for verification after redirect
      sessionStorage.setItem("google_oauth_state", state);

      // Build Google OAuth 2.0 authorization URL
      const redirectUri = `${window.location.origin}/auth/google/callback`;
      const scope = "openid email profile";
      const responseType = "code";

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(googleClientId)}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=${responseType}&` +
        `scope=${encodeURIComponent(scope)}&` +
        `state=${encodeURIComponent(state)}&` +
        `access_type=offline&` +
        `prompt=consent`;

      // Redirect to Google OAuth consent screen
      window.location.href = authUrl;
    } catch (err) {
      console.error("Google login error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Đăng nhập bằng Google thất bại. Vui lòng thử lại.";
      setError(errorMessage);
      setLoading(false);
    }
  }, []);

  return {
    handleGoogleLogin,
    loading,
    error,
  };
};

