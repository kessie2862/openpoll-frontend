import { useState } from 'react';
import { pollsApi, extractErrorMessage } from '@/src/lib/api';
import { VotePayload } from '@/src/types';

export function useVote(shortId: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voterId, setVoterId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem(`voted_${shortId}`);
  });

  const submit = async (payload: VotePayload) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const { data } = await pollsApi.vote(shortId, payload);
      setVoterId(data.voter_id);
      setHasVoted(true);
      localStorage.setItem(`voted_${shortId}`, data.voter_id);
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submit, isSubmitting, hasVoted, voterId, error };
}
