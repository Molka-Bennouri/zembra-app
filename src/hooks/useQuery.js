import { useState, useCallback } from "react";
import { getAuthHeaders } from "../utils/auth";

export const useQuery = ({ apiBase }) => {
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
            ...getAuthHeaders(),
          },
        });

        const json = await res.json();
        setResponseData(json);
      } catch (err) {
        setResponseData({ error: true, message: err.message });
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [buildUrl]
  );

  return { responseData, loading, error, executeQuery };
};