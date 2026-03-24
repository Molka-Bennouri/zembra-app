import { useState, useEffect } from 'react';
import { fetchReviewFields } from '../utils/reviewFieldsApi';

export function useReviewFields() {
  const [reviewFields, setReviewFields] = useState([]);
  const [selectedFields, setSelectedFields] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFields = async () => {
      try {
        setLoading(true);
        const fields = await fetchReviewFields();
        setReviewFields(fields);
        const initial = Object.fromEntries(fields.map(f => [f.name, false]));
        setSelectedFields(initial);
      } catch (err) {
        setError(err.message || 'Error fetching review fields.');
      } finally {
        setLoading(false);
      }
    };

    loadFields();
  }, []);

  const handleFieldChange = (fieldName) => {
    setSelectedFields(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  const activeFields = Object.keys(selectedFields).filter(k => selectedFields[k]);

  return { reviewFields, selectedFields, handleFieldChange, activeFields, loading, error };
}