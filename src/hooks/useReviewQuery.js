import { useState, useCallback, useRef } from "react";
import { getAuthHeaders } from "../utils/auth";

const POLL_INTERVAL = 3000;
const MAX_ATTEMPTS  = 20;

export const useReviewQuery = ({ apiBase }) => {
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);
  const [status, setStatus]             = useState(null);
  const pollRef = useRef(null);

  const stopPolling = () => {
    if (pollRef.current) clearInterval(pollRef.current);
  };

  const executeQuery = useCallback(
    async ({ network, slug, selectedFields }) => {
      if (!network || !slug) return;

      const params = `?network=${encodeURIComponent(network.toLowerCase())}&slug=${encodeURIComponent(slug)}`;
      const fields = Object.keys(selectedFields).filter((k) => selectedFields[k]);
      const fieldsParam = fields.length ? '&' + fields.map(f => `fields[]=${encodeURIComponent(f)}`).join('&') : '';

      setLoading(true);
      setError(null);
      setStatus('pending');
      setResponseData(null);
      stopPolling();

      try {
        // Step 1 — POST to create the job
        const postRes = await fetch(`${apiBase}/reviews${params}${fieldsParam}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(), // ← auth token
          },
        });

        // Stop immediately if POST fails (402 balance, 401 unauth, etc.)
        if (!postRes.ok) {
          const errData = await postRes.json();
          setStatus('error');
          setResponseData(errData);
          setError(errData?.message ?? 'Request failed');
          setLoading(false);
          return; // ← don't start polling
        }

        // Step 2 — Poll GET until completed
        let attempts = 0;

        pollRef.current = setInterval(async () => {
          attempts++;

          try {
            const res = await fetch(`${apiBase}/reviews${params}`, {
              headers: { ...getAuthHeaders() },
            });

            // Stop polling on any HTTP error
            if (!res.ok) {
              const errData = await res.json().catch(() => ({}));
              setStatus('error');
              setError(errData?.message ?? `HTTP ${res.status}`);
              setResponseData({ error: true, message: errData?.message ?? `HTTP ${res.status}` });
              setLoading(false);
              stopPolling();
              return;
            }

            const data = await res.json();

            if (data?.status === 'SUCCESS' || data?.data) {
              setResponseData(data);
              setStatus('completed');
              setLoading(false);
              stopPolling();
            } else if (attempts >= MAX_ATTEMPTS) {
              setStatus('error');
              setError('Timed out waiting for results.');
              setResponseData({ error: true, message: 'Timed out waiting for results.' });
              setLoading(false);
              stopPolling();
            }
          } catch (err) {
            setStatus('error');
            setError(err.message);
            setResponseData({ error: true, message: err.message });
            setLoading(false);
            stopPolling();
          }
        }, POLL_INTERVAL);

      } catch (err) {
        setStatus('error');
        setError(err.message);
        setResponseData({ error: true, message: err.message });
        setLoading(false);
      }
    },
    [apiBase]
  );

  return { responseData, loading, error, status, executeQuery };
};