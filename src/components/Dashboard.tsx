import React from 'react';
import Navbar from './Navbar';
import IntentWidget from './IntentWidget';
import { RevenueCard, ROICard } from './FinanceCards';
import StatCard from './StatCard';
import { motion } from 'framer-motion';
import {
  Users,
  Eye,
  MousePointerClick,
  CreditCard,
  ShoppingCart,
  RefreshCcw,
  Trash2,
  Zap
} from 'lucide-react';
import CampaignsChart from './CampaignsChart';
import SessionsTable from './SessionsTable';
import { useSessions } from '../hooks/useSessions';

const Dashboard = () => {
  const { data, loading } = useSessions();
  // Sort sessions newest-first, split into current (first half) vs previous (second half)
  const sessions = React.useMemo(() => {
    return [...(data?.sessions ?? [])].sort(
      (a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
    );
  }, [data]);

  const half = Math.floor(sessions.length / 2) || 1;
  const curr = sessions.slice(0, half);       // newer sessions = current period
  const prev = sessions.slice(half);          // older sessions = previous period

  const pct = (c: number, p: number) => {
    if (p === 0 && c === 0) return 0;
    if (p === 0) return 100;
    return parseFloat(((c - p) / p * 100).toFixed(1));
  };

  const total = sessions.length || 1;
  const currTotal = curr.length || 1;
  const prevTotal = prev.length || 1;

  // Current period values
  const uniqueVisitors = new Set(curr.map(s => s.visitor_id)).size;
  const prevUniqueVisitors = new Set(prev.map(s => s.visitor_id)).size;

  const totalPageViews = curr.reduce((a, s) => a + s.metrics.page_count, 0);
  const prevPageViews = prev.reduce((a, s) => a + s.metrics.page_count, 0);

  const totalCartAdds = curr.reduce((a, s) => a + s.metrics.cart_adds, 0);
  const prevCartAdds = prev.reduce((a, s) => a + s.metrics.cart_adds, 0);

  const totalCartValue = curr.reduce((a, s) => a + s.metrics.cart_value, 0);
  const prevCartValue = prev.reduce((a, s) => a + s.metrics.cart_value, 0);

  const totalProductViews = curr.reduce((a, s) => a + s.metrics.product_views, 0);
  const prevProductViews = prev.reduce((a, s) => a + s.metrics.product_views, 0);

  const bouncingCount = curr.filter(s => s.scoring.final_level === 'BOUNCING').length;
  const prevBouncing = prev.filter(s => s.scoring.final_level === 'BOUNCING').length;
  const bounceRate = ((bouncingCount / currTotal) * 100).toFixed(1);
  const prevBounceRate = (prevBouncing / prevTotal) * 100;

  const clickSessions = curr.filter(s => s.metrics.product_views > 0).length;
  const prevClickSess = prev.filter(s => s.metrics.product_views > 0).length;
  const clickRate = ((clickSessions / currTotal) * 100).toFixed(1);
  const prevClickRate = (prevClickSess / prevTotal) * 100;

  const avgDurationVal = curr.reduce((a, s) => a + s.duration_seconds, 0) / currTotal;
  const prevAvgDuration = prev.reduce((a, s) => a + s.duration_seconds, 0) / prevTotal;
  const avgDuration = avgDurationVal.toFixed(1);

  const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}K` : `${n}`;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <main className="flex-1 min-h-screen flex flex-col transition-all duration-300">
        <Navbar />

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="p-8 space-y-8 max-w-7xl mx-auto w-full"
        >
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-slate-400 font-medium mt-1.5"
              >
                {loading
                  ? 'Fetching live session data…'
                  : `${data?.total ?? 0} sessions loaded · real-time intent platform data`}
              </motion.p>
            </div>
          </div>

          {/* Top Row: Intent and Finance */}
          <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            <div className="lg:col-span-7">
              <IntentWidget />
            </div>
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-8">
              <RevenueCard />
              <ROICard />
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div variants={item} className="space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">Weekly Overview</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Key Performance Indicators · Live Data</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
              <StatCard
                title="Total Visitors"
                value={loading ? '—' : fmt(uniqueVisitors)}
                change={loading ? 0 : pct(uniqueVisitors, prevUniqueVisitors)}
                isPositive={pct(uniqueVisitors, prevUniqueVisitors) >= 0}
                icon={Users}
              />
              <StatCard
                title="Page Views"
                value={loading ? '—' : fmt(totalPageViews)}
                change={loading ? 0 : pct(totalPageViews, prevPageViews)}
                isPositive={pct(totalPageViews, prevPageViews) >= 0}
                icon={Eye}
              />
              <StatCard
                title="Product Click Rate"
                value={loading ? '—' : `${clickRate}%`}
                change={loading ? 0 : pct(Number(clickRate), prevClickRate)}
                isPositive={pct(Number(clickRate), prevClickRate) >= 0}
                icon={MousePointerClick}
              />
              <StatCard
                title="Cart Value"
                value={loading ? '—' : `₹${fmt(totalCartValue)}`}
                change={loading ? 0 : pct(totalCartValue, prevCartValue)}
                isPositive={pct(totalCartValue, prevCartValue) >= 0}
                icon={CreditCard}
              />
              <StatCard
                title="Cart Adds"
                value={loading ? '—' : fmt(totalCartAdds)}
                change={loading ? 0 : pct(totalCartAdds, prevCartAdds)}
                isPositive={pct(totalCartAdds, prevCartAdds) >= 0}
                icon={ShoppingCart}
              />
              <StatCard
                title="Avg Session (s)"
                value={loading ? '—' : avgDuration}
                change={loading ? 0 : pct(avgDurationVal, prevAvgDuration)}
                isPositive={pct(avgDurationVal, prevAvgDuration) >= 0}
                icon={RefreshCcw}
              />
              <StatCard
                title="Bounce Rate"
                value={loading ? '—' : `${bounceRate}%`}
                change={loading ? 0 : pct(Number(bounceRate), prevBounceRate)}
                isPositive={pct(Number(bounceRate), prevBounceRate) < 0}
                icon={Trash2}
              />
              <StatCard
                title="Product Views"
                value={loading ? '—' : fmt(totalProductViews)}
                change={loading ? 0 : pct(totalProductViews, prevProductViews)}
                isPositive={pct(totalProductViews, prevProductViews) >= 0}
                icon={Zap}
              />
            </div>
          </motion.div>

          {/* Sessions Table */}
          <motion.div variants={item}>
            <SessionsTable />
          </motion.div>

          {/* Campaigns Chart */}
          <motion.div variants={item}>
            <CampaignsChart />
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
