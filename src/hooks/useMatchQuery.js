// /hooks/useMatchQuery.js
import { useState, useCallback } from "react";
import { api } from "../utils/api";

export const useMatchQuery = ({ onQueryExecuted } = {}) => {
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeQuery = useCallback(async ({ name, address, lat, lng, selectedNetworks, selectedFields, networks }) => {
    if (!name || !address) return;

    const params = new URLSearchParams();
    params.set("name", name);
    params.set("address", address);
    if (lat) params.set("lat", lat);
    if (lng) params.set("lng", lng);

    // 👇 envoie le slug/name du network, pas l'ID
    Object.keys(selectedNetworks)
      .filter((k) => selectedNetworks[k])
      .forEach((k) => {
        const net = networks.find((n) => String(n.id) === String(k));
        if (net?.name) params.append("networks[]", net.name);
      });

    Object.keys(selectedFields)
      .filter((k) => selectedFields[k])
      .forEach((f) => params.append("fields[]", f));

    setLoading(true);
    setError(null);
    setResponseData(null);

    try {
      const json = await api.get(`/listing/match?${params.toString()}`);
      setResponseData(json);
      onQueryExecuted?.();
    } catch (err) {
      setError(err.message);
      setResponseData({ error: true, message: err.message });
    } finally {
      setLoading(false);
    }
  }, [onQueryExecuted]);  ;

  return { responseData, loading, error, executeQuery };
};