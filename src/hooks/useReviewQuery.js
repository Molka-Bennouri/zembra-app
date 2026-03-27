// /hooks/useReviewQuery.js
import { useState, useCallback } from "react";

export const useReviewQuery = ({ apiUrl }) => {
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeQuery = useCallback(
    async ({ network, slug, includeRaw, selectedFields }) => {
      if (!network || !slug) return;

      const payload = {
        network,
        slug,
        includeRaw,
        fields: Object.keys(selectedFields).filter((k) => selectedFields[k]),
      };

      setLoading(true);
      setError(null);
      setResponseData(null);

      try {
        const res = await fetch(apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

        const json = await res.json();
        setResponseData(json);
      } catch (err) {
        setError(err.message);
        setResponseData({ error: true, message: err.message });
      } finally {
        setLoading(false);
      }
    },
    [apiUrl]
  );

  return { responseData, loading, error, executeQuery };
};