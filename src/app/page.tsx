import Link from 'next/link';
import { BarChart2, Zap, Globe, Shield, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-(--border) bg-(--bg-base)/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-(--accent) flex items-center justify-center">
              <BarChart2 size={14} className="text-(--bg-base)" />
            </div>
            <span className="font-bold text-base tracking-tight">
              Open<span className="text-(--accent)">Poll</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/polls"
              className="hidden sm:block text-sm text-(--text-secondary) hover:text-(--text-primary) transition-colors font-medium"
            >
              Explore
            </Link>
            <Link href="/login">
              <button className="px-4 py-1.5 rounded-lg text-sm font-semibold text-(--text-secondary) hover:text-(--text-primary) transition-colors">
                Sign in
              </button>
            </Link>
            <Link href="/register">
              <button className="px-4 py-1.5 rounded-lg bg-(--accent) text-(--bg-base) text-sm font-bold hover:bg-(--accent-dim) transition-colors">
                Get started
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1">
        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 pt-24 pb-20 text-center fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-(--accent-glow) border border-(--accent-dim) text-(--accent) text-xs font-semibold mb-8 tracking-wide uppercase">
            <div className="live-dot" />
            Real-time results via WebSockets
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-6">
            Polls that update
            <br />
            <span className="text-(--accent) serif italic">as you watch</span>
          </h1>

          <p className="text-(--text-secondary) text-lg sm:text-xl mb-10 max-w-lg mx-auto leading-relaxed">
            Build polls with single, multi, ranked-choice and open text
            questions. Share anywhere. See votes land in real time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register">
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-(--accent) text-(--bg-base) font-bold text-sm hover:bg-(--accent-dim) transition-colors">
                Start for free <ArrowRight size={15} />
              </button>
            </Link>
            <Link href="/polls">
              <button className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-(--border) text-(--text-secondary) font-semibold text-sm hover:border-(--border-bright) hover:text-(--text-primary) transition-colors">
                Explore polls
              </button>
            </Link>
          </div>

          <p className="text-xs text-(--text-muted) mt-6">
            No credit card required · Free to use
          </p>
        </section>

        <div className="max-w-6xl mx-auto px-6">
          <div className="border-t border-(--border)" />
        </div>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-(--accent) uppercase tracking-widest mb-3">
              Why OpenPoll
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Everything you need to run a poll
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: <Zap size={20} />,
                title: 'Live results',
                desc: 'Every vote instantly broadcasts to all viewers via WebSocket. No refresh. No polling. Pure real-time.',
              },
              {
                icon: <Globe size={20} />,
                title: 'Embeddable anywhere',
                desc: 'One iframe snippet drops your poll into any website, blog, or Notion page. Results stay live inside the embed.',
              },
              {
                icon: <Shield size={20} />,
                title: 'Fraud prevention',
                desc: 'IP address and browser fingerprint deduplication ensures one vote per person, per account.',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="card-glow p-6 flex flex-col gap-4 group"
              >
                <div className="w-10 h-10 rounded-xl bg-(--accent-glow) border border-(--accent-dim) flex items-center justify-center text-(--accent) group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <div>
                  <p className="font-bold text-base mb-1.5">{f.title}</p>
                  <p className="text-sm text-(--text-muted) leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="max-w-6xl mx-auto px-6">
          <div className="border-t border-(--border)" />
        </div>

        {/* Question types */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-(--accent) uppercase tracking-widest mb-3">
              Question types
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Built for every kind of question
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                type: 'Single choice',
                desc: 'One answer from a list. Fast and decisive.',
                example: '● Option A  ○ Option B  ○ Option C',
              },
              {
                type: 'Multi choice',
                desc: 'Pick several answers. Great for preferences.',
                example: '☑ Option A  ☑ Option B  ☐ Option C',
              },
              {
                type: 'Ranked choice',
                desc: 'Drag to rank. Winner decided by instant runoff voting.',
                example: '① Alpha  ② Beta  ③ Gamma',
              },
              {
                type: 'Open text',
                desc: 'Free-form responses. Collect opinions in their own words.',
                example: '"Great product, needs better docs..."',
              },
            ].map((q) => (
              <div key={q.type} className="card-glow p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <p className="font-bold text-sm">{q.type}</p>
                  <span className="pill bg-(--bg-overlay) text-(--text-muted) text-[10px]">
                    supported
                  </span>
                </div>
                <p className="text-xs text-(--text-muted) leading-relaxed mb-3">
                  {q.desc}
                </p>
                <p className="text-xs font-mono text-(--text-secondary) bg-(--bg-base) rounded-lg px-3 py-2 border border-(--border)">
                  {q.example}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA banner */}
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <div className="card-glow p-10 sm:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-96 h-96 rounded-full bg-(--accent-glow) blur-3xl opacity-40" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">
                Ready to run your first poll?
              </h2>
              <p className="text-(--text-secondary) mb-8 max-w-sm mx-auto text-sm leading-relaxed">
                Create an account in seconds. No credit card. No setup. Just
                build and share.
              </p>
              <Link href="/register">
                <button className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-(--accent) text-(--bg-base) font-bold text-sm hover:bg-(--accent-dim) transition-colors">
                  Create your first poll <ArrowRight size={15} />
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-(--border) bg-(--bg-surface)">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Brand */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-(--accent) flex items-center justify-center">
                <BarChart2 size={12} className="text-(--bg-base)" />
              </div>
              <span className="font-bold text-sm">
                Open<span className="text-(--accent)">Poll</span>
              </span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6 text-xs text-(--text-muted)">
              <Link
                href="/polls"
                className="hover:text-(--text-primary) transition-colors"
              >
                Explore
              </Link>
              <Link
                href="/register"
                className="hover:text-(--text-primary) transition-colors"
              >
                Get started
              </Link>
              <Link
                href="/login"
                className="hover:text-(--text-primary) transition-colors"
              >
                Sign in
              </Link>
            </div>

            {/* Social + copyright */}
            <div className="flex items-center gap-4">
              <span className="text-xs text-(--text-muted)">
                © {new Date().getFullYear()} OpenPoll
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
