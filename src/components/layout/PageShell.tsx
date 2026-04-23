import { Navbar } from './Navbar';

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10 fade-up">
        {children}
      </main>
    </div>
  );
}
