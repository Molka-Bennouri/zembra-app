import { useState, useEffect } from 'react';
import { fetchFields } from '../utils/fieldsApi';

export function useFields() {
  const [fields, setFields] = useState([]);
  const [selectedFields, setSelectedFields] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadFields = async () => {
      try {
        setLoading(true);
        const fields = await fetchFields();
        setFields(fields);
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

  return { fields, selectedFields, handleFieldChange, activeFields, loading, error };
}