import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

// ✅ FIX: Added 'export' here (Named Export)
export const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get(url);
            setData(response.data.data || response.data);
            setError(null);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    }, [url]);

    useEffect(() => {
        if (url) fetchData();
    }, [fetchData]);

    return { data, loading, error, fetchData };
};

// Default export (optional, but good for backup)
export default useFetch;