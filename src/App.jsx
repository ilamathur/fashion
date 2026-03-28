import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Flame, RefreshCw, Shirt, Star, TrendingUp } from 'lucide-react';
import TrendCard from './components/TrendCard';

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshTick, setRefreshTick] = useState(0);

  const loadTrends = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`/api/trends?refresh=${Date.now()}`);
      setData(response.data);
      setRefreshTick((value) => value + 1);
    } catch {
      setError('We could not load the latest trend pulse. Try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrends();
  }, []);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,214,204,0.9),_rgba(255,248,245,1)_45%,_rgba(255,255,255,1)_100%)] text-ink-900">
      <section className="px-4 pb-10 pt-6 sm:px-5">
        <div className="mx-auto max-w-6xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden rounded-[32px] bg-gradient-to-br from-runway-600 via-runway-500 to-blush-500 p-6 text-white shadow-[0_24px_80px_rgba(122,58,44,0.28)]"
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl space-y-4">
                <p className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold uppercase tracking-[0.2em]">
                  <Flame className="h-4 w-4" />
                  Mode Pulse
                </p>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">See the latest fashion trends at a glance.</h1>
                <p className="max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
                  A live runway-inspired dashboard with the silhouettes, colors, and styling cues shaping fashion right now.
                </p>
              </div>
              <button
                onClick={loadTrends}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-base font-semibold text-runway-700 transition-all hover:-translate-y-0.5 hover:brightness-105 active:scale-[0.98]"
              >
                <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                Refresh trends
              </button>
            </div>
          </motion.div>

          {loading ? (
            <div className="grid gap-4 md:grid-cols-3">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="h-72 animate-pulse rounded-[28px] bg-white/80 shadow-sm" />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-[28px] bg-white p-6 text-center shadow-sm">
              <p className="mb-4 text-lg font-semibold text-ink-900">{error}</p>
              <button
                onClick={loadTrends}
                className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-runway-600 px-6 py-3 text-base font-semibold text-white"
              >
                Retry
              </button>
            </div>
          ) : (
            data && (
              <>
                <section className="grid gap-4 md:grid-cols-3">
                  {[
                    { icon: TrendingUp, label: 'Trend velocity', value: data.summary.velocity },
                    { icon: Star, label: 'Most mentioned', value: data.summary.topTheme },
                    { icon: Shirt, label: 'Styling focus', value: data.summary.stylingFocus },
                  ].map((item, index) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08 }}
                      className="rounded-[28px] bg-white p-5 shadow-sm"
                    >
                      <item.icon className="mb-4 h-8 w-8 text-runway-600" />
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-ink-500">{item.label}</p>
                      <p className="mt-2 text-2xl font-bold tracking-tight text-ink-900">{item.value}</p>
                    </motion.div>
                  ))}
                </section>

                <section className="grid gap-5 lg:grid-cols-[1.4fr_0.9fr]">
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold tracking-tight">Trending now</h2>
                      <div className="text-right text-sm font-medium text-ink-500">
                        <p>Updated {data.updatedAt}</p>
                        <p className="mt-1 text-xs text-ink-400">
                          {data.sourceCount > 0
                            ? `Live check #${refreshTick} · ${data.sourceNames.join(', ')}`
                            : `Backup edit · refresh #${refreshTick}`}
                        </p>
                      </div>
                    </div>
                    <div className="grid gap-5 md:grid-cols-2">
                      {data.trends.map((trend, index) => (
                        <TrendCard key={trend.name} trend={trend} index={index} />
                      ))}
                    </div>
                  </div>

                  <aside className="space-y-5">
                    <div className="rounded-[28px] bg-ink-900 p-6 text-white shadow-[0_20px_60px_rgba(24,24,39,0.22)]">
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">Editor note</p>
                      <h2 className="mt-3 text-2xl font-bold tracking-tight">What to shop for this week</h2>
                      <p className="mt-3 text-base leading-relaxed text-white/75">{data.editorNote}</p>
                    </div>
                    <div className="rounded-[28px] bg-white p-6 shadow-sm">
                      <h3 className="text-xl font-bold tracking-tight text-ink-900">Color watch</h3>
                      <div className="mt-4 space-y-3">
                        {data.palette.map((color) => (
                          <div key={color.name} className="flex items-center gap-3">
                            <span className="h-11 w-11 rounded-2xl" style={{ backgroundColor: color.hex }} />
                            <div>
                              <p className="font-semibold text-ink-900">{color.name}</p>
                              <p className="text-sm text-ink-500">{color.note}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </aside>
                </section>
              </>
            )
          )}
        </div>
      </section>
    </main>
  );
}
