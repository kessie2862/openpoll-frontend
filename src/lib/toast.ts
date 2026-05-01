import { toast } from 'sonner';

export const notify = {
  success: (msg: string, description?: string) =>
    toast.success(msg, { description }),

  error: (msg: string, description?: string) =>
    toast.error(msg, { description }),

  info: (msg: string, description?: string) => toast(msg, { description }),

  promise: <T>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string },
  ) => toast.promise(promise, messages),

  copied: () => toast.success('Copied to clipboard', { duration: 1800 }),

  exportDone: (format: 'CSV' | 'PNG') =>
    toast.success(`${format} downloaded`, {
      description: 'Check your downloads folder',
      duration: 2500,
    }),

  voteRecorded: () =>
    toast.success('Vote recorded!', {
      description: 'Results are updating live',
      duration: 3000,
    }),
};
