'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authApi, extractErrorMessage } from '@/src/lib/api';
import { useAuthStore } from '@/src/store/auth';
import { BarChart2, ArrowLeft, Eye, EyeOff } from 'lucide-react';

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

const FIELDS = [
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
    label: 'Display name',
    type: 'text',
    placeholder: 'Enter your name',
  },
  {
    name: 'password',
    label: 'Password',
    type: 'password',
    placeholder: '8+ characters',
  },
  {
    name: 'password_confirm',
    label: 'Confirm password',
    type: 'password',
    placeholder: 'Repeat password',
  },
] as const;

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      {/* Back to home */}
      <div className="w-full max-w-md mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-(--text-muted) hover:text-(--text-primary) transition-colors"
        >
          <ArrowLeft size={13} /> Back to home
        </Link>
      </div>

      {/* Card */}
      <div className="w-full max-w-md card-glow p-8 fade-up group">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-md bg-(--accent) flex items-center justify-center">
            <BarChart2 size={16} className="text-(--bg-base)" />
          </div>
          <span className="font-bold text-lg">
            Open<span className="text-(--accent)">Poll</span>
          </span>
        </div>

        <h1 className="text-2xl font-bold mb-1">Create your account</h1>
        <p className="text-(--text-secondary) mb-8 text-sm">
          Start building polls in seconds. It&apos;s free
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {FIELDS.map((f) => {
            const isPassword = f.name === 'password';
            const isConfirm = f.name === 'password_confirm';
            const showToggle = isPassword || isConfirm;
            const show = isPassword ? showPass : showConfirm;
            const toggle = isPassword
              ? () => setShowPass((v) => !v)
              : () => setShowConfirm((v) => !v);

            return (
              <div key={f.name}>
                <label className="block text-xs font-semibold text-(--text-secondary) uppercase tracking-wider mb-1.5">
                  {f.label}
                </label>
                <div className="relative">
                  <input
                    {...register(f.name as keyof FormData)}
                    type={showToggle ? (show ? 'text' : 'password') : f.type}
                    placeholder={f.placeholder}
                    className={`field ${showToggle ? 'pr-10' : ''}`}
                  />
                  {showToggle && (
                    <button
                      type="button"
                      onClick={toggle}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-muted) hover:text-(--text-secondary) transition-colors"
                    >
                      {show ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  )}
                </div>
                {errors[f.name as keyof FormData] && (
                  <p className="text-red-400 text-xs mt-1.5">
                    {errors[f.name as keyof FormData]?.message}
                  </p>
                )}
              </div>
            );
          })}

          {serverError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
              {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-(--accent) text-(--bg-base) font-bold text-sm hover:bg-(--accent-dim) transition-colors disabled:opacity-50"
          >
            {isLoading ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 border-t border-(--border)" />
          <span className="text-xs text-(--text-muted)">or</span>
          <div className="flex-1 border-t border-(--border)" />
        </div>

        <p className="text-center text-sm text-(--text-secondary)">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-(--accent) hover:underline font-semibold"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
