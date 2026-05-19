// hooks/usePlans.js
import { useState, useEffect } from "react";

export function usePlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchPlans = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("http://127.0.0.1:8000/api/plans");

        if (!res.ok) {
          throw new Error("Erreur API plans");
        }

        const data = await res.json();

        if (!cancelled) {
          setPlans(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Erreur chargement plans");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPlans();

    return () => {
      cancelled = true;
    };
  }, []);

  return { plans, loading, error };
}