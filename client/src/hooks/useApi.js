import { useState, useEffect } from 'react';
import api from '../services/api.js';

export function useApi(url, params = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const paramsString = JSON.stringify(params);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    setLoading(true);
    setError(null);

    api.get(url, { params: JSON.parse(paramsString) })
      .then((res) => {
        if (!cancelled) {
          setData(res.data);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.response?.data?.message || 'Errore di caricamento');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [url, paramsString]);

  function refetch() {
    if (!url) return;

    setLoading(true);
    setError(null);

    api.get(url, { params: JSON.parse(paramsString) })
      .then((res) => setData(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Errore'))
      .finally(() => setLoading(false));
  }

  return { data, loading, error, refetch };
}
