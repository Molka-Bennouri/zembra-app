import { useState } from "react";
import { updateNetwork } from "../utils/networkService";

export function useUpdateNetwork() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submit = async (id, { label, slug_pattern }) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const { error: apiError } = await updateNetwork(id, { label, slug_pattern });

    setLoading(false);

    if (apiError) {
      setError(apiError);
      return false;
    }

    setSuccess(true);
    setTimeout(() => setSuccess(false), 3500);
    return true;
  };

  return { submit, loading, error, success };
}