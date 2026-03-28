import { useState, useCallback, useRef } from "react";

const POLL_INTERVAL = 3000; // 3 seconds
const MAX_ATTEMPTS  = 20;   // 1 minute max

export const useReviewQuery = ({ apiBase }) => {
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);
  const [status, setStatus]             = useState(null); // 'pending' | 'completed' | 'error'
  const pollRef = useRef(null);

  const stopPolling = () => {
    if (pollRef.current) clearInterval(pollRef.current);
  };

  const executeQuery = useCallback(
    async ({ network, slug, selectedFields }) => {
      if (!network || !slug) return;

      const params = `?network=${encodeURIComponent(network.toLowerCase())}&slug=${encodeURIComponent(slug)}`;
      const fields = Object.keys(selectedFields).filter((k) => selectedFields[k]);

      setLoading(true);
      setError(null);
      setStatus('pending');
      setResponseData(null);
      stopPolling();

      try {
        // Step 1 — POST to create the job
const fieldsParam = fields.length ? '&' + fields.map(f => `fields[]=${encodeURIComponent(f)}`).join('&') : '';

await fetch(`${apiBase}/reviews${params}${fieldsParam}`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
});

        // Step 2 — Poll GET until completed
        let attempts = 0;

        pollRef.current = setInterval(async () => {
          attempts++;

          try {
            const res  = await fetch(`${apiBase}/reviews${params}`);
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