import { useState, useEffect, useCallback } from "react";

/**
 * usePlansList
 * Fetches the list of payment plans from the API.
 * Mirrors the shape of useNetworksList: { plans, loading, error, refetch }
 */
export function usePlansList() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8000/api/plans", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to load plans");
        return;
      }
      setPlans(data.plans ?? data);
    } catch (err) {
      setError("Network error: " + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return { plans, loading, error, refetch: fetchPlans };
}