'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authApi, extractErrorMessage } from '@/src/lib/api';
import { useAuthStore } from '@/src/store/auth';
import { BarChart2 } from 'lucide-react';

const schema = z
  .object({
    email: z.string().email('Enter a valid email'),
    username: z
      .string()
      .min(3, 'At least 3 characters')
      .max(30)
      .regex(/^\w+$/, 'Letters, numbers, underscores only'),
    display_name: z.string().min(2, 'At least 2 characters').max(100),
    password: z.string().min(8, 'At least 8 characters'),
    password_confirm: z.string(),
  })
  .refine((d) => d.password === d.password_confirm, {
    message: 'Passwords do not match',
    path: ['password_confirm'],
  });
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setServerError('');
    setIsLoading(true);
    try {
      await authApi.register(data);
      await login(data.email, data.password);
      router.push('/dashboard');
    } catch (err) {
      setServerError(extractErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md fade-up">
        <div className="flex items-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-md bg-(--accent) flex items-center justify-center">
            <BarChart2 size={16} className="text-(--bg-base)" />
          </div>
          <span className="font-bold text-lg">
            Open<span className="text-(--accent)">Poll</span>
          </span>
        </div>

        <h1 className="text-3xl font-bold mb-1">Create your account</h1>
        <p className="text-(--text-secondary) mb-8 text-sm">
          Start building polls in seconds
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {[
            {
              name: 'email',
              label: 'Email',
              type: 'email',
              placeholder: 'you@example.com',
            },
            {
              name: 'username',
              label: 'Username',
              type: 'text',
              placeholder: 'yourhandle',
            },
            {
              name: 'display_name',
              label: 'Display Name',
              type: 'text',
              placeholder: 'Your Name',
            },
            {
              name: 'password',
              label: 'Password',
              type: 'password',
              placeholder: '8+ characters',
            },
            {
              name: 'password_confirm',
              label: 'Confirm Password',
              type: 'password',
              placeholder: 'Repeat password',
            },
          ].map((f) => (
            <div key={f.name}>
              <label className="block text-xs font-semibold text-(--text-secondary) uppercase tracking-wider mb-1.5">
                {f.label}
              </label>
              <input
                {...register(f.name as keyof FormData)}
                type={f.type}
                placeholder={f.placeholder}
                className="field"
              />
              {errors[f.name as keyof FormData] && (
                <p className="text-red-400 text-xs mt-1">
                  {errors[f.name as keyof FormData]?.message}
                </p>
              )}
            </div>
          ))}

          {serverError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 text-red-400 text-sm">
              {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg bg-(--accent) text-(--bg-base) font-bold text-sm hover:bg-(--accent-dim) transition-colors disabled:opacity-50 mt-2"
          >
            {isLoading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="text-center text-sm text-(--text-secondary) mt-6">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-(--accent) hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
