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

      // Your Laravel API returns the token directly
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

  return {
    register,
    login,
    logout,
    isAuthenticated,
    loading,
    error,
    clearError: () => setError(null),
  };
};