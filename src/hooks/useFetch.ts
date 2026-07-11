// src/hooks/useFetch.ts
import { useState, useEffect, useCallback } from "react";

interface UseFetchOptions extends RequestInit {
  dependencies?: any[];
}

interface UseFetchResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  mutate: <R = unknown>(url: string, options?: RequestInit) => Promise<R | null>;
  mutateLoading: boolean; // NEW
}

export function useFetch<T = unknown>(
  url: string,
  options?: UseFetchOptions
): UseFetchResult<T> {
  const { dependencies = [], ...fetchOptions } = options || {};
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mutateLoading, setMutateLoading] = useState<boolean>(false); // NEW
  const [error, setError] = useState<string | null>(null);
  const [reloadFlag, setReloadFlag] = useState<number>(0);

  const refetch = useCallback(() => {
    setReloadFlag((prev) => prev + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(url, { ...fetchOptions, signal });
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const result: T = await response.json();
        setData(result);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message || "Something went wrong while fetching data.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    return () => controller.abort();
  }, [url, reloadFlag, ...dependencies]);

  // Mutation helper (POST/PUT/DELETE)
  const mutate = useCallback(
    async <R = unknown>(targetUrl: string, mutateOptions?: RequestInit): Promise<R | null> => {
      setMutateLoading(true); // NEW
      try {
        const response = await fetch(targetUrl, mutateOptions);
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }
        const result: R = await response.json();
        return result;
      } catch (err: any) {
        setError(err.message || "Something went wrong during mutation.");
        return null;
      } finally {
        setMutateLoading(false); // NEW
      }
    },
    []
  );

  return { data, isLoading, error, refetch, mutate, mutateLoading };
}
