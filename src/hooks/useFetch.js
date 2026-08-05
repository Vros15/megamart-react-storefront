import { useEffect, useState } from "react";

// Runs an async fetcher and tracks its loading/error/data state.
 
const useFetch = (fetcher) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Prevents stale responses from updating state after cleanup.
    let cancelled = false;

    // Start the fetch process.
    setLoading(true);
    setError(null);

    // Invoke the fetcher function.
    fetcher()
      // Handle the fetcher's promise.
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      // Finalize the fetch process regardless of outcome.
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    
  }, [fetcher]);

  return { data, loading, error };
};

export default useFetch;
