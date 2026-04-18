import Link from 'next/link';
import { Zap, Globe, Shield } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="fade-up max-w-2xl">
        <div className="inline-flex items-center gap-2 pill bg-(--accent-glow) text-(--accent) border border-(--accent-dim) mb-8">
          <div className="live-dot" />
          Real-time results via WebSockets
        </div>

        <h1 className="text-6xl font-black tracking-tight mb-4">
          Polls that update
          <br />
          <span className="text-(--accent) serif italic">as you watch</span>
        </h1>

        <p className="text-(--text-secondary) text-lg mb-10 max-w-md mx-auto leading-relaxed">
          Build polls with single, multi, ranked-choice and open text questions.
          Share anywhere. See votes land in real time.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link href="/register">
            <button className="px-6 py-3 rounded-lg bg-(--accent) text-(--bg-base) font-bold hover:bg-(--accent-dim) transition-colors">
              Start for free
            </button>
          </Link>
          <Link href="/polls">
            <button className="px-6 py-3 rounded-lg border border-(--border) text-(--text-secondary) font-semibold hover:border-(--border-bright) hover:text-(--text-primary) transition-colors">
              Explore polls
            </button>
          </Link>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-16 text-left">
          {[
            {
              icon: <Zap size={18} />,
              title: 'Live results',
              desc: 'WebSocket broadcast — every vote updates all viewers instantly.',
            },
            {
              icon: <Globe size={18} />,
              title: 'Embeddable',
              desc: 'One-line iframe snippet. Drop your poll on any site.',
            },
            {
              icon: <Shield size={18} />,
              title: 'Fraud prevention',
              desc: 'IP + browser fingerprint deduplication on every vote.',
            },
          ].map((f) => (
            <div key={f.title} className="card-glow p-4">
              <span className="text-(--accent) mb-3 block">{f.icon}</span>
              <p className="font-semibold text-sm mb-1">{f.title}</p>
              <p className="text-xs text-(--text-muted) leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
