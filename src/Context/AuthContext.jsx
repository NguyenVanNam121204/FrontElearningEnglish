import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authService } from "../Services/authService";
import { tokenStorage } from "../Utils/tokenStorage";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  // ===== INIT =====
  useEffect(() => {
    const token = tokenStorage.getAccessToken();
    if (!token) {
      setIsGuest(true);
      setLoading(false);
      return;
    }

    authService
      .getProfile()
      .then((res) => {
        const userData = res.data.data;
        // Backend trả về displayName hoặc fullName
        userData.fullName = userData.displayName || userData.fullName || `${userData.firstName} ${userData.lastName}`.trim();
        // Lưu avatarUrl vào user object
        userData.avatarUrl = userData.avatarUrl || null;
        setUser(userData);
        setRoles(userData.roles?.map((r) => r.name) || []);
        setIsAuthenticated(true);
        setIsGuest(false);
      })
      .catch(() => {
        tokenStorage.clear();
        setIsGuest(true);
      })
      .finally(() => setLoading(false));
  }, []);

  // ===== LOGIN =====
  const login = useCallback(async (data, navigate) => {
    try {
      const res = await authService.login(data);
      
      if (!res.data?.success || !res.data?.data) {
        throw new Error(res.data?.message || "Đăng nhập thất bại");
      }

      const { accessToken, refreshToken, user } = res.data.data;

      if (!accessToken || !refreshToken || !user) {
        throw new Error("Dữ liệu đăng nhập không hợp lệ");
      }

      // Parse user data
      user.fullName = user.displayName || user.fullName || `${user.firstName} ${user.lastName}`.trim();
      user.avatarUrl = user.avatarUrl || null;

      tokenStorage.setTokens({ accessToken, refreshToken });
      setUser(user);
      setRoles(user.roles?.map((r) => r.name) || []);
      setIsAuthenticated(true);
      setIsGuest(false);

      if (user.roles?.some((r) => r.name === "Admin")) {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (error) {
      throw error; // Re-throw để component có thể catch
    }
  }, []);

  // ===== GOOGLE LOGIN =====
  const googleLogin = useCallback(async (data, navigate) => {
    try {
      const res = await authService.googleLogin(data);
      
      // Backend returns: { success, statusCode, message, data: { accessToken, refreshToken, user, expiresAt } }
      if (!res.data?.success || !res.data?.data) {
        throw new Error(res.data?.message || "Đăng nhập bằng Google thất bại");
      }

      const { accessToken, refreshToken, user } = res.data.data;

      if (!accessToken || !refreshToken || !user) {
        throw new Error("Dữ liệu đăng nhập không hợp lệ");
      }

      user.fullName = user.displayName || user.fullName || `${user.firstName} ${user.lastName}`.trim();
      user.avatarUrl = user.avatarUrl || null;

      tokenStorage.setTokens({ accessToken, refreshToken });
      setUser(user);
      setRoles(user.roles?.map((r) => r.name) || []);
      setIsAuthenticated(true);
      setIsGuest(false);

      if (user.roles?.some((r) => r.name === "Admin")) {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (error) {
      throw error; // Re-throw để component có thể catch
    }
  }, []);

  // ===== FACEBOOK LOGIN =====
  const facebookLogin = useCallback(async (data, navigate) => {
    try {
      // Log to terminal (console.log outputs to terminal in Node.js/React)
      console.log("=== AuthContext.facebookLogin START ===");
      console.log("Received data:", JSON.stringify({ ...data, AccessToken: data?.AccessToken ? "***" : undefined }, null, 2));
      
      console.log("Calling authService.facebookLogin...");
      const res = await authService.facebookLogin(data);
      console.log("Backend response received");
      console.log("Response status:", res.status);
      console.log("Response statusText:", res.statusText);
      console.log("Response data:", JSON.stringify(res.data, null, 2));
      
      // Backend returns: { success, statusCode, message, data: { accessToken, refreshToken, user, expiresAt } }
      if (!res.data?.success || !res.data?.data) {
        console.error("Backend returned error response");
        console.error("Success:", res.data?.success);
        console.error("StatusCode:", res.data?.statusCode);
        console.error("Message:", res.data?.message);
        console.error("Data:", JSON.stringify(res.data?.data, null, 2));
        throw new Error(res.data?.message || "Đăng nhập bằng Facebook thất bại");
      }

      const { accessToken, refreshToken, user } = res.data.data;
      console.log("Extracted data from response");
      console.log("Has accessToken:", !!accessToken);
      console.log("Has refreshToken:", !!refreshToken);
      console.log("Has user:", !!user);
      console.log("User data:", JSON.stringify(user ? { 
        userId: user.userId, 
        email: user.email, 
        fullName: user.fullName || user.displayName,
        hasRoles: !!user.roles 
      } : null, null, 2));

      if (!accessToken || !refreshToken || !user) {
        console.error("Missing required data in response");
        throw new Error("Dữ liệu đăng nhập không hợp lệ");
      }

      user.fullName = user.displayName || user.fullName || `${user.firstName} ${user.lastName}`.trim();
      user.avatarUrl = user.avatarUrl || null;

      console.log("Setting tokens and user state...");
      tokenStorage.setTokens({ accessToken, refreshToken });
      setUser(user);
      setRoles(user.roles?.map((r) => r.name) || []);
      setIsAuthenticated(true);
      setIsGuest(false);

      console.log("Navigating to home/admin...");
      if (user.roles?.some((r) => r.name === "Admin")) {
        navigate("/admin");
      } else {
        navigate("/home");
      }
      console.log("=== AuthContext.facebookLogin SUCCESS ===");
    } catch (error) {
      console.error("=== AuthContext.facebookLogin ERROR ===");
      console.error("Error object:", error);
      console.error("Error type:", typeof error);
      console.error("Error message:", error.message);
      console.error("Error name:", error.name);
      console.error("Error stack:", error.stack);
      
      if (error.response) {
        console.error("Error response status:", error.response.status);
        console.error("Error response data:", JSON.stringify(error.response.data, null, 2));
      }
      
      throw error; // Re-throw để component có thể catch
    }
  }, []);

  // ===== GUEST =====
  const loginAsGuest = useCallback((navigate) => {
    try {
      console.log("=== LOGIN AS GUEST START ===");
      
      // Clear all tokens and user data
      tokenStorage.clear();
      console.log("Tokens cleared");
      
      // Reset all auth state
      setUser(null);
      setRoles([]);
      setIsAuthenticated(false);
      setIsGuest(true);
      console.log("Auth state reset - isGuest: true");
      
      // Navigate to home
      console.log("Navigating to /home...");
      navigate("/home");
      console.log("=== LOGIN AS GUEST SUCCESS ===");
    } catch (error) {
      console.error("=== LOGIN AS GUEST ERROR ===");
      console.error("Error:", error);
      // Still try to navigate even if there's an error
      navigate("/home");
    }
  }, []);

  // ===== LOGOUT =====
  const logout = useCallback(async (navigate) => {
    try {
      const rt = tokenStorage.getRefreshToken();
      if (rt) {
        await authService.logout(rt);
      }
    } catch (_) {
      // ignore errors on logout
    } finally {
      tokenStorage.clear();
      setUser(null);
      setRoles([]);
      setIsAuthenticated(false);
      setIsGuest(true);
      navigate("/login");
    }
  }, []);

  // ===== REFRESH USER =====
  const refreshUser = useCallback(async () => {
    try {
      const response = await authService.getProfile();
      const userData = response.data.data;
      userData.fullName = userData.displayName || userData.fullName || `${userData.firstName} ${userData.lastName}`.trim();
      userData.avatarUrl = userData.avatarUrl || null;
      setUser(userData);
      setRoles(userData.roles?.map((r) => r.name) || []);
    } catch (error) {
      console.error("Error refreshing user:", error);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        roles,
        isAuthenticated,
        isGuest,
        loading,
        login,
        googleLogin,
        facebookLogin,
        loginAsGuest,
        logout,
        refreshUser,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
