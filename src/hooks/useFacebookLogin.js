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

    // Generate CSRF state token BEFORE calling Facebook login (backend requirement)
    const state =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    // Store state in sessionStorage for verification
    sessionStorage.setItem("facebook_login_state", state);

    console.log("=== FACEBOOK LOGIN START ===");
    console.log("Generated state token:", state);

    // Facebook App ID from environment variables
    const facebookAppId = process.env.REACT_APP_FACEBOOK_APP_ID;

    if (!facebookAppId) {
      setError(
        "Facebook Login chưa được cấu hình. Vui lòng kiểm tra file .env và đảm bảo REACT_APP_FACEBOOK_APP_ID đã được thiết lập."
      );
      setLoading(false);
      return;
    }

    console.log("Facebook App ID:", facebookAppId);

    // Function to initialize and call Facebook login
    const initAndLogin = async () => {
      try {
        // Wait for Facebook SDK to be available
        if (!window.FB) {
          console.log("Waiting for Facebook SDK to load...");
          let attempts = 0;
          while (!window.FB && attempts < 50) {
            await new Promise((resolve) => setTimeout(resolve, 200));
            attempts++;
          }

          if (!window.FB) {
            throw new Error(
              "Facebook SDK không thể tải được. Vui lòng kiểm tra kết nối internet."
            );
          }
        }

        console.log("Facebook SDK is available");

        // Initialize Facebook SDK
        try {
          window.FB.init({
            appId: facebookAppId,
            cookie: true,
            xfbml: true,
            version: "v18.0",
          });
          console.log("Facebook SDK initialized");

          // Wait for initialization
          await new Promise((resolve) => setTimeout(resolve, 300));
        } catch (initError) {
          console.error("Error initializing Facebook SDK:", initError);
          // Continue anyway, SDK might already be initialized
        }

        // Call Facebook login
        console.log("Calling FB.login...");
        // window.FB.login(
        //   async (response) => {
        //     console.log("Facebook login response:", response);

        //     if (response.authResponse && response.authResponse.accessToken) {
        //       const accessToken = response.authResponse.accessToken;
        //       console.log("Got Facebook access token");

        //       // Get stored state
        //       const storedState = sessionStorage.getItem("facebook_login_state");
        //       sessionStorage.removeItem("facebook_login_state");

        //       if (storedState !== state) {
        //         console.error("State mismatch - possible CSRF attack");
        //         setError("Lỗi bảo mật. Vui lòng thử lại.");
        //         setLoading(false);
        //         return;
        //       }

        //       // Prepare data for backend
        //       const loginData = {
        //         AccessToken: accessToken,
        //         State: state,
        //       };

        //       console.log("Sending to backend:", {
        //         ...loginData,
        //         AccessToken: "***",
        //       });

        //       try {
        //         await facebookLogin(loginData, navigate);
        //         console.log("Facebook login successful!");
        //       } catch (error) {
        //         console.error("Backend login error:", error);
        //         const errorMessage =
        //           error.response?.data?.message ||
        //           error.message ||
        //           "Đăng nhập bằng Facebook thất bại.";
        //         setError(errorMessage);
        //         setLoading(false);
        //       }
        //     } else {
        //       console.log(
        //         "Facebook login cancelled or failed:",
        //         response.status
        //       );
        //       let errorMsg = "Đăng nhập bằng Facebook đã bị hủy.";
        //       if (response.status === "not_authorized") {
        //         errorMsg = "Bạn đã từ chối quyền truy cập Facebook.";
        //       }
        //       setError(errorMsg);
        //       setLoading(false);
        //     }
        //   },
        //   {
        //     scope: "email,public_profile",
        //     return_scopes: true,
        //   }
        // );
        // Thay đổi phần window.FB.login trong hook của bạn
        window.FB.login(
          (response) => { // Không dùng async ở đây
            console.log("Facebook login response:", response);

            if (response.authResponse && response.authResponse.accessToken) {
              const accessToken = response.authResponse.accessToken;
              const storedState = sessionStorage.getItem("facebook_login_state");
              sessionStorage.removeItem("facebook_login_state");

              if (storedState !== state) {
                setError("Lỗi bảo mật. Vui lòng thử lại.");
                setLoading(false);
                return;
              }

              const loginData = {
                AccessToken: accessToken,
                State: state,
              };

              // Xử lý async bằng cách gọi một hàm riêng hoặc dùng .then()
              facebookLogin(loginData, navigate)
                .then(() => {
                  console.log("Facebook login successful!");
                })
                .catch((err) => {
                  console.error("Backend login error:", err);
                  setError(err.response?.data?.message || err.message || "Đăng nhập thất bại.");
                  setLoading(false);
                });

            } else {
              setError("Đăng nhập bằng Facebook đã bị hủy.");
              setLoading(false);
            }
          },
          { scope: "email,public_profile", return_scopes: true }
        );
      } catch (error) {
        console.error("Facebook login error:", error);
        setError(error.message || "Đăng nhập bằng Facebook thất bại.");
        setLoading(false);
      }
    };

    // Start the login process
    initAndLogin();
  }, [facebookLogin, navigate]);

  return {
    handleFacebookLogin,
    loading,
    error,
  };
};

