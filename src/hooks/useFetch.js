import { useCallback, useEffect, useState } from "react";

// Runs an async fetcher and tracks its loading/error/data state.
const useFetch = (fetcher) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
// Tracks how many times a refetch has been requested. Incrementing this triggers the effect to run again.
  const [refetchIndex, setRefetchIndex] = useState(0);

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
    // Dependency array ensures the effect runs on mount and whenever
    // the fetcher or refetchIndex changes.
  }, [fetcher, refetchIndex]);

// Provides a stable function to trigger a refetch of the data.
  const refetch = useCallback(() => setRefetchIndex((index) => index + 1), []);

  return { data, loading, error, refetch };
};

export default useFetch;
