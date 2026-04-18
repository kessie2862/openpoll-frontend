import { useEffect, useRef, useState, useCallback } from 'react';
import { PollWebSocket } from '../lib/websocket';
import { PollResults } from '../types';
import { pollsApi } from '../lib/api';

interface UseLiveResultsOptions {
  shortId: string;
  enabled?: boolean;
}

export function useLiveResults({
  shortId,
  enabled = true,
}: UseLiveResultsOptions) {
  const [results, setResults] = useState<PollResults | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<PollWebSocket | null>(null);

  const handleResults = useCallback((data: PollResults) => {
    setResults(data);
    setIsLoading(false);
  }, []);

  const handleStatus = useCallback((connected: boolean) => {
    setIsConnected(connected);
  }, []);

  useEffect(() => {
    if (!enabled || !shortId) return;

    // Initial HTTP fetch for immediate render
    pollsApi
      .results(shortId)
      .then(({ data }) => {
        setResults(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.detail || 'Failed to load results');
        setIsLoading(false);
      });

    // WebSocket for live updates
    wsRef.current = new PollWebSocket(shortId, handleResults, handleStatus);

    return () => {
      wsRef.current?.destroy();
      wsRef.current = null;
    };
  }, [shortId, enabled, handleResults, handleStatus]);

  return { results, isConnected, isLoading, error };
}
