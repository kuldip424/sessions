import React from 'react';
import { Info, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSessions } from '../hooks/useSessions';

const LEVEL_CONFIG: Record<string, { color: string; bg: string; barColor: string }> = {
  BOUNCING: { color: 'text-slate-500', bg: 'bg-slate-200',    barColor: 'bg-slate-300' },
  LOW:      { color: 'text-amber-600', bg: 'bg-amber-400',    barColor: 'bg-amber-400' },
  MEDIUM:   { color: 'text-orange-600', bg: 'bg-orange-500', barColor: 'bg-orange-500' },
  HIGH:     { color: 'text-rose-600',  bg: 'bg-rose-500',    barColor: 'bg-rose-500' },
};

const LEVEL_LABELS: Record<string, string> = {
  BOUNCING: 'No Intent',
  LOW:      'Low',
  MEDIUM:   'Medium',
  HIGH:     'High',
};

const IntentWidget = () => {
  const { data, loading } = useSessions();

  const sessions = data?.sessions ?? [];
  const total = sessions.length || 1;

  const counts: Record<string, number> = { BOUNCING: 0, LOW: 0, MEDIUM: 0, HIGH: 0 };
  sessions.forEach(s => {
    const lvl = s.scoring.final_level;
    if (counts[lvl] !== undefined) counts[lvl]++;
  });

  const segments = ['BOUNCING', 'LOW', 'MEDIUM', 'HIGH'].map(level => ({
    label: LEVEL_LABELS[level],
    value: Math.round((counts[level] / total) * 100),
    count: counts[level],
    color: LEVEL_CONFIG[level].barColor,
  }));

  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-sm relative overflow-hidden group cursor-default h-full flex flex-col justify-between">
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-2 tracking-tight">
              Visitor Intent
              <Info size={16} className="text-slate-300 cursor-help hover:text-indigo-500 smooth-transition" />
            </h3>
            <p className="text-[13px] text-slate-400 font-medium mt-0.5">
              {loading ? 'Loading…' : `${sessions.length} sessions · real-time audience segmentation`}
            </p>
          </div>
          <button className="bg-slate-50 hover:bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 smooth-transition border border-transparent hover:border-indigo-100">
            Run a campaign <ExternalLink size={14} />
          </button>
        </div>

        <div className="flex h-5 w-full rounded-2xl overflow-hidden mb-8 shadow-inner shadow-slate-900/5 p-1 bg-slate-50">
          {loading
            ? <div className="flex-1 bg-slate-100 rounded-xl animate-pulse" />
            : segments.map((s, idx) => (
              <motion.div
                key={idx}
                initial={{ width: 0 }}
                animate={{ width: `${s.value}%` }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: idx * 0.1 }}
                className={`${s.color} h-full first:rounded-l-xl last:rounded-r-xl relative group/bar`}
              >
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/bar:opacity-100 smooth-transition"></div>
              </motion.div>
            ))
          }
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {segments.map((s, idx) => (
            <div key={idx} className="flex flex-col gap-1 group/item">
              <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${s.color} shadow-sm group-hover/item:scale-125 smooth-transition`}></div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</span>
              </div>
              <span className="text-lg font-black text-slate-900 pl-4.5">
                {loading ? '—' : s.count}
              </span>
              <span className="text-[11px] text-slate-400 pl-4.5">{loading ? '' : `${s.value}%`}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative gradient corner */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl group-hover:scale-110 smooth-transition"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gradient-to-tr from-rose-500/5 via-orange-500/5 to-transparent rounded-full blur-3xl group-hover:scale-110 smooth-transition"></div>
    </div>
  );
};

export default IntentWidget;
