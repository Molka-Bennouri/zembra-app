import { useState } from "react";
import { createNetwork } from "../utils/networkService";

/**
 * Hook that wraps the createNetwork API call with loading / error / success state.
 *
 * Usage:
 *   const { submit, loading, error, success } = useCreateNetwork();
 *   await submit({ name, label, slug_pattern });
 */
export function useCreateNetwork() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const submit = async ({ name, label, slug_pattern }) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    const payload = {
      name,
      label,
      ...(slug_pattern ? { slug_pattern } : {}),
    };

    const { error: apiError } = await createNetwork(payload);

    setLoading(false);

    if (apiError) {
      setError(apiError);
      return false;
    }

    setSuccess(true);

    // Auto-reset success banner after 3.5 s
    setTimeout(() => setSuccess(false), 3500);

    return true;
  };

  return { submit, loading, error, success };
}