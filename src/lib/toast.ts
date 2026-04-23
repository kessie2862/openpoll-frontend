import { toast } from 'sonner';

export const notify = {
  voteRecorded: () => {
    toast.success('Vote recorded!', {
      description: 'Your selection has been submitted successfully.',
    });
  },

  error: (title: string, message: string) => {
    toast.error(title, {
      description: message,
    });
  },
};
