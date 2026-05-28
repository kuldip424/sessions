import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { HelpCircle, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSessions } from '../hooks/useSessions';

const EXIT_INTENT_MEANING =
  'Exit Intent — indicates a visitor action suggesting they are about to leave the page before converting, such as moving toward the close button or switching tabs.';

const ExitIntentTooltip = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-flex items-center gap-1">
      <span
        className="inline-flex items-center gap-1 cursor-help"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <span className="font-semibold text-slate-600">exit intents</span>
        <HelpCircle
          size={14}
          className="text-slate-400 hover:text-indigo-500 transition-colors duration-200"
        />
      </span>
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-72 px-5 py-4 bg-gradient-to-br from-slate-900 to-slate-800 text-white text-xs leading-relaxed rounded-2xl pointer-events-none z-[9999] shadow-2xl border border-white/10">
          <p className="font-bold text-indigo-300 mb-1 text-[11px] uppercase tracking-wider">
            Exit Intent
          </p>
          <p className="text-slate-300 leading-5">
            Indicates a visitor action suggesting they are about to leave the
            page before converting, such as moving toward the close button or
            switching tabs.
          </p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-800 rotate-45 -mt-1.5"></div>
        </div>
      )}
    </div>
  );
};

/* ---------- Custom Tooltip for chart bars ---------- */
const getDotColor = (key: string) => {
  switch (key) {
    case 'page_views': return '#6366f1';
    case 'cart_adds': return '#0f766e';
    case 'product_views': return '#f59e0b';
    case 'exit_intents': return '#f43f5e';
    default: return '#94a3b8';
  }
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/95 backdrop-blur-xl rounded-2xl px-5 py-4 shadow-2xl border border-slate-100"
    >
      <p className="text-sm font-black text-slate-900 mb-2 capitalize">{label}</p>
      <div className="space-y-1.5">
        {payload.map((p: any, i: number) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <span
              className="w-2.5 h-2.5 rounded-full shadow-sm"
              style={{ backgroundColor: getDotColor(p.dataKey) }}
            />
            <span className="text-slate-500 font-medium capitalize">
              {String(p.dataKey).replace(/_/g, ' ')}
            </span>
            <span className="ml-auto font-black text-slate-800">{p.value}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

/* ---------- Custom Legend ---------- */
const CustomLegend = ({ payload }: any) => {
  if (!payload?.length) return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
      {payload.map((entry: any, i: number) => {
        const key = String(entry.dataKey || entry.value || '');
        const isExit = key === 'exit_intents';
        return (
          <div
            key={i}
            className="flex items-center gap-2 rounded-full bg-slate-50 border border-slate-200/60 px-3.5 py-2 text-xs shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200"
          >
            <span
              className="w-2.5 h-2.5 rounded-full shadow-sm"
              style={{ backgroundColor: getDotColor(key) }}
            />
            {isExit ? (
              <ExitIntentTooltip />
            ) : (
              <span className="font-semibold text-slate-600 capitalize">
                {key.replace(/_/g, ' ')}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

/* ---------- Main Component ---------- */
const CampaignsChart = () => {
  const { data, loading } = useSessions();

  const normalizeSource = (source?: string) => {
    const normalized = source?.toString().trim().toLowerCase();
    if (!normalized || normalized === 'direct') return 'direct';
    if (normalized === 'referral') return 'referral';
    return normalized;
  };

  const chartData = React.useMemo(() => {
    if (!data?.sessions) return [];

    const groups: Record<
      string,
      { page_views: number; cart_adds: number; exit_intents: number; product_views: number; count: number }
    > = {
      direct: { page_views: 0, cart_adds: 0, exit_intents: 0, product_views: 0, count: 0 },
      referral: { page_views: 0, cart_adds: 0, exit_intents: 0, product_views: 0, count: 0 }
    };

    data.sessions.forEach((s) => {
      const source = normalizeSource(s.referrer?.source);
      if (!groups[source]) {
        groups[source] = { page_views: 0, cart_adds: 0, exit_intents: 0, product_views: 0, count: 0 };
      }
      groups[source].page_views += s.metrics.page_count;
      groups[source].cart_adds += s.metrics.cart_adds;
      groups[source].exit_intents += s.metrics.exit_intents;
      groups[source].product_views += s.metrics.product_views;
      groups[source].count += 1;
    });

    let result = Object.entries(groups)
      .map(([name, vals]) => ({ name, ...vals }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    if (groups.referral?.count > 0 && !result.some((entry) => entry.name === 'referral')) {
      const referralEntry = { name: 'referral', ...groups.referral };
      if (result.length >= 6) {
        result[result.length - 1] = referralEntry;
      } else {
        result.push(referralEntry);
      }
      result = result.sort((a, b) => b.count - a.count);
    }

    return result;
  }, [data]);

  const topSource = chartData[0]?.name ?? '—';
  const topViews = chartData[0]?.page_views ?? 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[2rem] border border-slate-200/80 bg-gradient-to-br from-white via-slate-50/50 to-slate-50/20 p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 group"
    >
      {/* Decorative blurs */}
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-indigo-100/70 blur-3xl pointer-events-none group-hover:bg-indigo-200/70 transition-colors duration-700" />
      <div className="absolute left-1/3 -top-10 h-28 w-28 rounded-full bg-rose-100/60 blur-3xl pointer-events-none group-hover:bg-rose-200/60 transition-colors duration-700" />
      <div className="absolute -bottom-12 left-0 h-32 w-32 rounded-full bg-emerald-100/50 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              Top Campaigns
              <motion.span
                animate={{ rotate: [0, 8, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              >
                📊
              </motion.span>
            </h3>
            <p className="text-[13px] text-slate-400 font-medium mt-1">
              {loading
                ? 'Loading...'
                : `Sessions grouped by referrer source · ${data?.total ?? 0} total`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Top source badge */}
            {!loading && (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100/60 rounded-2xl px-4 py-2"
              >
                <TrendingUp size={14} className="text-indigo-500" />
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                  Top: {topSource}
                </span>
              </motion.div>
            )}
            <span className="rounded-full bg-indigo-100 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-indigo-700">
              Live data
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[420px] w-full relative bg-gradient-to-b from-slate-50/30 to-slate-100/10 rounded-xl p-4 border border-slate-100/40">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-indigo-100 rounded-full" />
                <div className="w-12 h-12 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin absolute inset-0" />
              </div>
              <span className="text-sm text-slate-400 font-medium">
                Fetching campaign data…
              </span>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              barGap={50}
              barCategoryGap="45%"
            >
              <defs>
                <linearGradient id="gradPV" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
                <linearGradient id="gradCA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2dd4bf" />
                  <stop offset="100%" stopColor="#0f766e" />
                </linearGradient>
                <linearGradient id="gradProd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="100%" stopColor="#f59e0b" />
                </linearGradient>
                <linearGradient id="gradExit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#fb7185" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="4 4"
                vertical={false}
                stroke="#e2e8f0"
                strokeOpacity={0.5}
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 13, fontWeight: 600 }}
                dy={12}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                width={50}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(99,102,241,0.04)', radius: 8 }}
              />
              <Legend
                verticalAlign="bottom"
                align="center"
                content={<CustomLegend />}
              />
              <Bar
                dataKey="page_views"
                name="page_views"
                fill="url(#gradPV)"
                radius={[6, 6, 0, 0]}
                barSize={20}
                animationDuration={1200}
                animationEasing="ease-out"
              />
              <Bar
                dataKey="cart_adds"
                name="cart_adds"
                fill="url(#gradCA)"
                radius={[6, 6, 0, 0]}
                barSize={20}
                animationDuration={1200}
                animationEasing="ease-out"
              />
              <Bar
                dataKey="product_views"
                name="product_views"
                fill="url(#gradProd)"
                radius={[6, 6, 0, 0]}
                barSize={20}
                animationDuration={1200}
                animationEasing="ease-out"
              />
              <Bar
                dataKey="exit_intents"
                name="exit_intents"
                fill="url(#gradExit)"
                radius={[6, 6, 0, 0]}
                barSize={20}
                animationDuration={1200}
                animationEasing="ease-out"
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
};

export default CampaignsChart;
