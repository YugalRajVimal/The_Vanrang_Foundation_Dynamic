import { useCallback, useEffect, useState } from "react";

// Generic fetch-on-mount hook with a retry() escape hatch, so every list/detail
// component gets the same skeleton -> data / empty / error lifecycle for free.
//
//   const { data, loading, error, retry } = useFetch(() => api.get("/team"), []);
//
// `deps` works like useEffect's dependency array — pass the values the fetcher
// closes over (e.g. category, page) so it re-runs when they change.
export function useFetch(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const retry = useCallback(() => setReloadKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetcher()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, reloadKey]);

  return { data, loading, error, retry };
}
