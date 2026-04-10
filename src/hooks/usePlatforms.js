import { useState, useEffect } from "react";

export function usePlatforms() {
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/networks")
      .then(res => {
        if (!res.ok) throw new Error("Erreur serveur");
        return res.json();
      })
      .then(data => {
        setPlatforms(data.networks); // 👈 on extrait le tableau "networks"
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return { platforms, loading, error };
}