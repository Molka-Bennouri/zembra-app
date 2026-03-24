import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

export const useProtectedRoute = (redirectTo = "/login") => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate(redirectTo, { replace: true });
    }
  }, [navigate, redirectTo]);

  return isAuthenticated();
};