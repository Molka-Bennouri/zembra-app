import { useState, useEffect, useCallback } from "react";
const API = "http://127.0.0.1:8000/api";
const POLL_INTERVAL = 30000;

const EMPTY_STATS = {
  networks: { active: 0, total: 0, list: [] },
  requests_24h: {
    total: 0,
    success: 0,
    errors: 0,
  },
  success_rate: 0,
};

export default function useDashboard() {
  const [stats, setStats] = useState(EMPTY_STATS);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // ── API calls ─────────────────────────

  const fetchKpis = useCallback(async () => {
    const res = await fetch(`${API}/kpis`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
      },
    });
    if (!res.ok) throw new Error(`KPIs: ${res.status}`);
    return res.json();
  }, []);

  const fetchRequests = useCallback(async () => {
    const res = await fetch(`${API}/dashboard/requests`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
      },
    });
    if (!res.ok) throw new Error(`Requests: ${res.status}`);
    return res.json();
  }, []);

  // ── Refresh ───────────────────────────

  const refresh = useCallback(
    async (showSpinner = false) => {
      if (showSpinner) setRefreshing(true);
      setError(null);

      try {
        const [kpis, reqs] = await Promise.all([
          fetchKpis(),
          fetchRequests(),
        ]);

        setStats(kpis);
        setRequests(reqs);
        setLastUpdate(new Date());
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [fetchKpis, fetchRequests]
  );

  // ── Initial load + polling ────────────

  useEffect(() => {
    refresh();

    const timer = setInterval(() => {
      refresh();
    }, POLL_INTERVAL);

    return () => clearInterval(timer);
  }, [refresh]);

  return {
    stats,
    requests,
    loading,
    error,
    lastUpdate,
    refreshing,
    refresh,
  };
}