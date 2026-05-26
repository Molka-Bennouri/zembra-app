import { useCallback, useEffect, useState } from "react";

const API = "http://localhost:8000/api/admin/dashboard";

export function useAdminDashboard() {
  const [stats, setStats] = useState({
    requests: 0,
    successRate: 0,
    users: 0,
    errors: 0,
  });

  const [chartData, setChartData] = useState([]);
  const [errors, setErrors] = useState([]);
  const [networksData, setNetworksData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
    Accept: "application/json",
  });

  const getJson = useCallback(async (url) => {
    const res = await fetch(url, {
      headers: authHeader(),
    });

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    return res.json();
  }, []);

  const fetchAll = useCallback(async () => {
    const [dashboard, chart, errors, networks] =
      await Promise.all([
        getJson(`${API}/dashboard`),
        getJson(`${API}/chart?days=7`),
        getJson(`${API}/errors`),
        getJson(`${API}/networks`),
      ]);

    setStats(dashboard.stats);
    setChartData(chart);
    setErrors(errors);
    setNetworksData(networks);

    setLastUpdate(new Date());
  }, [getJson]);

  const refresh = useCallback(async (showSpinner = false) => {
    if (showSpinner) setRefreshing(true);

    setError(null);

    try {
      await fetchAll();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchAll]);

  useEffect(() => {
    refresh();

    const interval = setInterval(() => {
      refresh();
    }, 30000); // refresh auto 30s

    return () => clearInterval(interval);
  }, [refresh]);

  return {
    stats,
    chartData,
    errors,
    networksData,
    loading,
    refreshing,
    error,
    lastUpdate,
    refresh,
  };
}