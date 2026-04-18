import { useState } from 'react';
import { pollsApi, downloadBlob, extractErrorMessage } from '../lib/api';

export function useExport(shortId: string) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportCSV = async () => {
    setIsExporting(true);
    setError(null);
    try {
      const { data } = await pollsApi.exportCSV(shortId);
      downloadBlob(data, `poll-${shortId}-results.csv`);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsExporting(false);
    }
  };

  const exportPNG = async () => {
    setIsExporting(true);
    setError(null);
    try {
      const { data } = await pollsApi.exportPNG(shortId);
      downloadBlob(data, `poll-${shortId}-chart.png`);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsExporting(false);
    }
  };

  return { exportCSV, exportPNG, isExporting, error };
}
