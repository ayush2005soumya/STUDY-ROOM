import Link from 'next/link';
import { Metadata } from 'next';

// Add this right at the top of your page.tsx!
export const metadata: Metadata = {
  title: 'Home',
};

export default function HomePage() {
  return (
    <div className="p-8 md:p-12 max-w-6xl mx-auto space-y-12">
      
      {/* Header */}
      <header className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
          Welcome Home
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl">
          Your centralized hub for deep work. Connect with peers, sync your sessions, and maintain total focus.
        </p>
      </header>

      {/* Feature Banners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Banner 1 */}
        <div className="group relative p-8 border border-zinc-800 rounded-3xl bg-zinc-950/50 hover:bg-zinc-900/80 transition-all duration-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <h3 className="relative z-10 text-2xl font-bold text-white mb-3">Synchronized Focus.</h3>
          <p className="relative z-10 text-zinc-400 mb-6">Server-side Pomodoro timers ensure you and your study partners are always on the exact same schedule, down to the second.</p>
          <Link href="/dashboard" className="relative z-10 inline-flex items-center text-sm font-semibold text-white bg-zinc-800 px-4 py-2 rounded-full hover:bg-zinc-700 transition-colors">
            Launch Dashboard <span className="ml-2">→</span>
          </Link>
        </div>

        {/* Banner 2 */}
        <div className="group relative p-8 border border-zinc-800 rounded-3xl bg-zinc-950/50 hover:bg-zinc-900/80 transition-all duration-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <h3 className="relative z-10 text-2xl font-bold text-white mb-3">Live Roster.</h3>
          <p className="relative z-10 text-zinc-400 mb-6">See exactly who is in the room with you using our real-time Google Meet-style participant grid.</p>
        </div>

        {/* Banner 3 (Full Width) */}
        <div className="md:col-span-2 group relative p-8 border border-zinc-800 rounded-3xl bg-zinc-950/50 hover:bg-zinc-900/80 transition-all duration-500 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-rose-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <h3 className="relative z-10 text-2xl font-bold text-white mb-3">Instant WebSockets.</h3>
          <p className="relative z-10 text-zinc-400 max-w-3xl">Powered by Socket.io, experience zero-latency messaging. Chat, coordinate breaks, and share resources without ever reloading the page.</p>
        </div>

      </div>
    </div>
  );
}