import axiosClient from "./axiosClient";

export const authService = {
  login: (data) => axiosClient.post("/auth/login", data),

  register: (data) => axiosClient.post("/auth/register", data),

  getProfile: () => axiosClient.get("/auth/profile"),

  logout: (refreshToken) =>
    axiosClient.post("/auth/logout", { refreshToken }),

  googleLogin: (data) =>
    axiosClient.post("/auth/google-login", data),

  facebookLogin: (data) =>
    axiosClient.post("/auth/facebook-login", data),
  
  verifyEmail: (data) =>
    axiosClient.post("/auth/verify-email", data),

   forgotPassword: (data) =>
    axiosClient.post("/auth/forgot-password", data),

   verifyResetOtp: (data) =>
    axiosClient.post("/auth/verify-otp", data),

   resetPassword: (data) =>
    axiosClient.post("/auth/set-new-password", data),


};
