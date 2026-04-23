import { useState } from 'react';
import { pollsApi, extractErrorMessage } from '@/src/lib/api';
import { VotePayload } from '@/src/types';
import { notify } from '../lib/toast';

function getVoteKey(shortId: string): string {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) return `voted_${shortId}_anon`;

    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload?.user_id ?? payload?.id ?? payload?.sub ?? 'anon';
    return `voted_${shortId}_${userId}`;
  } catch {
    return `voted_${shortId}_anon`;
  }
}

export function useVote(shortId: string) {
  const voteKey = getVoteKey(shortId);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voterId, setVoterId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem(getVoteKey(shortId));
  });

  const submit = async (payload: VotePayload) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const { data } = await pollsApi.vote(shortId, payload);
      setVoterId(data.voter_id);
      setHasVoted(true);
      localStorage.setItem(getVoteKey(shortId), data.voter_id);
      notify.voteRecorded();
    } catch (err) {
      const msg = extractErrorMessage(err);
      setError(msg);
      notify.error('Vote failed', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submit, isSubmitting, hasVoted, voterId, error };
}
