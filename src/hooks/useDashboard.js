function useDashboard() {
  const [stats, setStats] = useState(EMPTY_STATS);
  const [requests, setRequests] = useState([]);
  const [chartData, setChartData] = useState([]); // ajouté
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
  });

  const getJson = useCallback(async (url) => {
    const res = await fetch(url, {
      headers: authHeader(),
    });

    if (!res.ok) {
      throw new Error(`${res.status}`);
    }

    return res.json();
  }, []);

  const fetchKpis = useCallback(
    () => getJson(`${API}/kpis`),
    [getJson]
  );

  const fetchRequests = useCallback(
    () => getJson(`${API}/dashboard/requests`),
    [getJson]
  );

  const fetchChart = useCallback(
    () => getJson(`${API}/dashboard/chart?days=7`),
    [getJson]
  );

  const refresh = useCallback(async (showSpinner = false) => {
    if (showSpinner) setRefreshing(true);

    setError(null);

    try {
      const [kpis, reqs, chart] =
        await Promise.all([
          fetchKpis(),
          fetchRequests(),
          fetchChart(),
        ]);

      setStats(kpis);
      setRequests(reqs);
      setChartData(chart);
      setLastUpdate(new Date());

    } catch (e) {
      setError(e.message);

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [fetchKpis, fetchRequests, fetchChart]);

  useEffect(() => {
    refresh();

    const timer = setInterval(
      () => refresh(),
      POLL_INTERVAL
    );

    return () => clearInterval(timer);

  }, [refresh]);

  return {
    stats,
    requests,
    chartData, // ajouté
    loading,
    error,
    lastUpdate,
    refreshing,
    refresh,
  };
}