'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart2, Plus, LogOut } from 'lucide-react';
import { useAuthStore } from '@/src/store/auth';
import { Button } from '../ui/button';

export function Navbar() {
  const { isAuthenticated, logout } = useAuthStore();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-(--border) bg-(--bg-base)/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-md bg-(--accent) flex items-center justify-center">
            <BarChart2 size={14} className="text-(--bg-base)" />
          </div>
          <span className="font-bold text-base tracking-tight">
            Open<span className="text-(--accent)">Poll</span>
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink href="/polls" active={pathname.startsWith('/polls')}>
            Explore
          </NavLink>
          {isAuthenticated && (
            <NavLink href="/dashboard" active={pathname === '/dashboard'}>
              Dashboard
            </NavLink>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link href="/polls/new">
                <Button
                  size="sm"
                  className="bg-(--accent) text-(--bg-base) hover:bg-(--accent-dim) font-bold gap-1.5"
                >
                  <Plus size={14} /> New Poll
                </Button>
              </Link>
              <button
                onClick={logout}
                className="text-(--text-secondary) hover:text-(--text-primary) transition-colors"
                title="Sign out"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-(--text-secondary)"
                >
                  Sign in
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="sm"
                  className="bg-(--accent) text-(--bg-base) hover:bg-(--accent-dim) font-bold"
                >
                  Get started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
        active
          ? 'bg-(--bg-elevated) text-(--text-primary)'
          : 'text-(--text-secondary) hover:text-(--text-primary)'
      }`}
    >
      {children}
    </Link>
  );
}
