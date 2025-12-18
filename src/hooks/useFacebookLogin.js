import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

/**
 * Custom hook for Facebook Login
 * Handles all Facebook OAuth login logic
 */
export const useFacebookLogin = () => {
  const navigate = useNavigate();
  const { facebookLogin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFacebookLogin = useCallback(() => {
    setLoading(true);
    setError("");

    try {
      // Facebook App ID from environment variables
      const facebookAppId = process.env.REACT_APP_FACEBOOK_APP_ID;

      if (!facebookAppId) {
        setError(
          "Facebook Login chưa được cấu hình. Vui lòng kiểm tra file .env và đảm bảo REACT_APP_FACEBOOK_APP_ID đã được thiết lập."
        );
        setLoading(false);
        return;
      }

      // Generate CSRF state token (backend requirement)
      const state =
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15);

      // Store state in sessionStorage for verification after redirect
      sessionStorage.setItem("facebook_oauth_state", state);

      // Build Facebook OAuth 2.0 authorization URL
      const redirectUri = `${window.location.origin}/auth/facebook/callback`;
      const scope = "email,public_profile";
      const responseType = "code";

      const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
        `client_id=${encodeURIComponent(facebookAppId)}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=${responseType}&` +
        `scope=${encodeURIComponent(scope)}&` +
        `state=${encodeURIComponent(state)}`;

      // Redirect to Facebook OAuth consent screen
      window.location.href = authUrl;
    } catch (err) {
      console.error("Facebook login error:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Đăng nhập bằng Facebook thất bại. Vui lòng thử lại.";
      setError(errorMessage);
      setLoading(false);
    }
  }, []);

  return {
    handleFacebookLogin,
    loading,
    error,
  };
};

