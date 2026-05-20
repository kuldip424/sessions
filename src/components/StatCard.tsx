import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, MoreHorizontal } from 'lucide-react';
import { ElementType } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  change: string | number;
  isPositive: boolean;
  icon: ElementType;
}

const StatCard = ({ title, value, change, isPositive, icon: Icon }: StatCardProps) => {
  const isNumericChange = typeof change === 'number' && isFinite(change);
  const changeLabel = typeof change === 'string' ? change : `${change}%`;

  return (
    <motion.div 
      whileHover={{ y: -6, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
      className="bg-white p-6 rounded-3xl border border-slate-200/60 shadow-sm smooth-transition group cursor-default"
    >
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-2xl ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'} smooth-transition group-hover:scale-110`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
        <button className="text-slate-300 hover:text-slate-600 p-1 hover:bg-slate-50 rounded-lg smooth-transition">
          <MoreHorizontal size={18} />
        </button>
      </div>
      
      <div className="space-y-1">
        <p className="text-[13px] font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
        <div className="flex items-end justify-between">
          <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
          <div className={`flex items-center px-2 py-1 rounded-lg text-xs font-bold ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
            {isPositive ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
            {isNumericChange ? `${change}%` : changeLabel}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;
