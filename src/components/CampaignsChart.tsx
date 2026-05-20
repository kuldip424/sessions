import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { HelpCircle } from 'lucide-react';
import { useSessions } from '../hooks/useSessions';

const ExitIntentTooltip = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-flex items-center gap-1 group">
      <span 
        className="inline-flex items-center gap-1 cursor-help"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <span>exit intents</span>
        <HelpCircle size={14} className="text-slate-400 hover:text-indigo-500 transition-colors" />
      </span>
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg whitespace-nowrap pointer-events-none z-50 shadow-lg">
          Sessions where users showed intent to leave without completing a purchase
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
        </div>
      )}
    </div>
  );
};

const CampaignsChart = () => {
  const { data, loading } = useSessions();

  // Group sessions by referrer source and aggregate metrics
  const chartData = React.useMemo(() => {
    if (!data?.sessions) return [];

    const groups: Record<string, { page_views: number; cart_adds: number; exit_intents: number; product_views: number; count: number }> = {};

    data.sessions.forEach(s => {
      const source = s.referrer?.source || 'direct';
      if (!groups[source]) {
        groups[source] = { page_views: 0, cart_adds: 0, exit_intents: 0, product_views: 0, count: 0 };
      }
      groups[source].page_views    += s.metrics.page_count;
      groups[source].cart_adds     += s.metrics.cart_adds;
      groups[source].exit_intents  += s.metrics.exit_intents;
      groups[source].product_views += s.metrics.product_views;
      groups[source].count         += 1;
    });

    return Object.entries(groups)
      .map(([name, vals]) => ({ name, ...vals }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [data]);

  return (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-200/60 shadow-sm smooth-transition">
      <div className="mb-8">
        <h3 className="text-xl font-black text-slate-900 tracking-tight">Top Campaigns</h3>
        <p className="text-[13px] text-slate-400 font-medium mt-0.5">
          {loading ? 'Loading...' : `Sessions grouped by referrer source · ${data?.total ?? 0} total`}
        </p>
      </div>

      <div className="h-[350px] w-full">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"></div>
              <span className="text-sm text-slate-400 font-medium">Fetching data…</span>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
              />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{
                  borderRadius: '16px',
                  border: 'none',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  padding: '12px',
                }}
              />
              <Legend
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                wrapperStyle={{ paddingTop: '30px' }}
                formatter={(value) => {
                  if (value === 'exit_intents') {
                    return <ExitIntentTooltip />;
                  }
                  return <span className="text-[13px] font-bold text-slate-600 capitalize px-2">{value.replace('_', ' ')}</span>;
                }}
              />
              <Bar dataKey="page_views"    name="page_views"    fill="#6366f1" radius={[4, 4, 0, 0]} barSize={24} />
              <Bar dataKey="cart_adds"     name="cart_adds"     fill="#0f766e" radius={[4, 4, 0, 0]} barSize={24} />
              <Bar dataKey="product_views" name="product_views" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={24} />
              <Bar dataKey="exit_intents"  name="exit_intents"  fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};

export default CampaignsChart;
