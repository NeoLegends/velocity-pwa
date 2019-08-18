import { useEffect } from 'react';

const DEFAULT_INTERVAL = 1000 * 60; // 1min

export const useInterval = (
  callback: () => void,
  { intervalMs = DEFAULT_INTERVAL, executeImmediately = true } = {},
) => {
  useEffect(() => {
    if (executeImmediately) {
      callback();
    }

    const interval = setInterval(callback, intervalMs);
    return () => clearInterval(interval);
  }, [callback, executeImmediately, intervalMs]);
};
