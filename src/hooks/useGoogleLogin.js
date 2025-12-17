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
    (async () => {
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

        // Get current origin for debugging
        const currentOrigin = window.location.origin;
        console.log("Current origin:", currentOrigin);
        console.log("Google Client ID:", googleClientId);

        // Generate CSRF state token BEFORE calling Google login (backend requirement)
        const state =
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15);

        // Use Google Identity Services with button flow
        if (window.google && window.google.accounts) {
          // Create a hidden button and trigger it
          const buttonContainer = document.createElement("div");
          buttonContainer.style.display = "none";
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
                await googleLogin(
                  {
                    IdToken: response.credential, // Use PascalCase to match backend exactly
                    State: state, // Use PascalCase to match backend exactly
                  },
                  navigate
                );
              } catch (err) {
                document.body.removeChild(buttonContainer);
                const errorMessage =
                  err.response?.data?.message ||
                  err.message ||
                  "Đăng nhập bằng Google thất bại. Vui lòng thử lại.";
                setError(errorMessage);
                setLoading(false);
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
                errorMsg +=
                  "Không thể mở cửa sổ đăng nhập. Vui lòng kiểm tra cài đặt trình chặn popup.";
              } else if (error.type === "unknown") {
                errorMsg += `Lỗi: ${
                  error.message ||
                  "Vui lòng kiểm tra cấu hình Google OAuth trong Google Cloud Console."
                }`;
              }

              // Check for origin errors
              if (error.message && error.message.includes("origin")) {
                errorMsg += `\n\nLỗi cấu hình: Origin "${window.location.origin}" chưa được đăng ký trong Google Cloud Console.`;
                errorMsg += `\nVui lòng thêm "${window.location.origin}" vào "Authorized JavaScript origins" trong Google Cloud Console.`;
              }

              setError(errorMsg);
              setLoading(false);
            },
          });

          // Render button and click it programmatically
          window.google.accounts.id.renderButton(buttonContainer, {
            type: "standard",
            theme: "outline",
            size: "large",
          });

          // Trigger click after a short delay to ensure button is rendered
          setTimeout(() => {
            const button = buttonContainer.querySelector('div[role="button"]');
            if (button) {
              button.click();
            } else {
              document.body.removeChild(buttonContainer);
              setError("Không thể khởi tạo đăng nhập Google. Vui lòng thử lại.");
              setLoading(false);
            }
          }, 100);
        } else {
          setError(
            "Đang tải Google Identity Services... Vui lòng đợi vài giây rồi thử lại."
          );
          setLoading(false);
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Đăng nhập bằng Google thất bại. Vui lòng thử lại.";
        setError(errorMessage);
        setLoading(false);
      }
    })().catch((err) => {
      console.error("Unhandled error in handleGoogleLogin:", err);
      setError("Đăng nhập bằng Google thất bại. Vui lòng thử lại.");
      setLoading(false);
    });
  }, [googleLogin, navigate]);

  return {
    handleGoogleLogin,
    loading,
    error,
  };
};

