// /hooks/useQuery.js
import { useState, useCallback } from "react";

export const useQuery = ({ apiBase, apiKey }) => {
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const buildUrl = useCallback(({ networkName, slug, activeFields }) => {
    if (!networkName || !slug) return null;

    let url = `${apiBase}/${networkName}?slug=${encodeURIComponent(slug)}`;

    if (activeFields?.length) {
      url += `&fields=${activeFields.join(",")}`;
    }

    return url;
  }, [apiBase]);

  const executeQuery = useCallback(
    async ({ networkName, slug, activeFields }) => {
      const url = buildUrl({ networkName, slug, activeFields });
      if (!url) return;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(url, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        });

        const json = await res.json();
        setResponseData(json);
      } catch (err) {
        setResponseData({
          error: true,
          message: err.message,
        });
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [apiKey, buildUrl]
  );

  return { responseData, loading, error, executeQuery };
};