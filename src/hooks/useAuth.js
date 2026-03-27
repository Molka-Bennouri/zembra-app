import { useState } from "react";
import { api } from "../utils/api";
import { saveToken, removeToken, isAuthenticated } from "../utils/auth";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Register
  const register = async ({ full_name, email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.post("/clients/register", {
        full_name,
        email,
        password,
      });

      const token = data.token ?? data.access_token ?? data;
      if (typeof token === "string") saveToken(token);

      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.post("/clients/login", { email, password });

      const token = data.token ?? data.access_token ?? data;
      if (typeof token === "string") saveToken(token);

      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    removeToken();
    api.post("/clients/logout", {}, true).catch(() => {});
  };

  // ==================== SSO AUTHENTICATION ====================

  // Redirect to Google OAuth
  const loginWithGoogle = () => {
    const redirectUrl = `${api.getBaseUrl()}/auth/google/redirect`;
    window.location.href = redirectUrl;
  };

  // Redirect to GitHub OAuth
  const loginWithGithub = () => {
    const redirectUrl = `${api.getBaseUrl()}/auth/github/redirect`;
    window.location.href = redirectUrl;
  };

  // Handle SSO callback (call this from your callback page)
  const handleSSOCallback = async (provider) => {
    setLoading(true);
    setError(null);
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");
      const state = urlParams.get("state");

      if (!code) {
        throw new Error("Authorization code not found");
      }

      const data = await api.post(`/auth/${provider}/callback`, {
        code,
        state,
      });

      const token = data.token ?? data.access_token ?? data;
      if (typeof token === "string") saveToken(token);

      return { success: true, data };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleCallback = () => handleSSOCallback("google");
  const handleGithubCallback = () => handleSSOCallback("github");
  
  const forgotPassword = async (email) => {
  setLoading(true);
  setError(null);
  try {
    const data = await api.post("/password/forgot", { email });
    return { success: true, message: data.message };
  } catch (err) {
    setError(err.message);
    return { success: false, error: err.message };
  } finally {
    setLoading(false);
  }
};

  // ==================== END SSO AUTHENTICATION ====================

  return {
    register,
    login,
    logout,
    isAuthenticated,
    loading,
    error,
    clearError: () => setError(null),
    // SSO methods
    loginWithGoogle,
    loginWithGithub,
    handleGoogleCallback,
    handleGithubCallback,
    // forgotPassword 
    forgotPassword ,
  };
};