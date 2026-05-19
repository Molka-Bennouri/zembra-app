import { useState, useEffect, useCallback } from "react";
import { fetchNetworks } from "../utils/networkService";

/**
 * Hook that fetches the list of networks on mount and exposes a refetch function.
 *
 * Usage:
 *   const { networks, loading, error, refetch } = useNetworks();
 */
export function useNetworksList() {
  const [networks, setNetworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { data, error: apiError } = await fetchNetworks();

    setLoading(false);

    if (apiError) {
      setError(apiError);
      return;
    }

    setNetworks(data.networks ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { networks, loading, error, refetch: load };
}