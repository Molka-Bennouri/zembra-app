import { useState, useEffect, useCallback } from "react";
import { getClients } from "../utils/clientService";

export const useClientsList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);

    const { clients: data, error: err } = await getClients();

    setClients(data ?? []);
    setError(err);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return { clients, loading, error, refetch: fetchClients };
};