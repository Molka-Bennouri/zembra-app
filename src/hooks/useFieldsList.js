import { useState, useEffect, useCallback } from "react";
import { getFields } from "../utils/fieldService";

export const useFieldsList = () => {
  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFields = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { fields, error } = await getFields();
    if (error) {
      setError(error);
    } else {
      setFields(fields);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  return { fields, loading, error, refetch: fetchFields };
};