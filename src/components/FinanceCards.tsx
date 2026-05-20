import React from 'react';
import { IndianRupee, Percent, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const RevenueCard = () => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col justify-between h-full relative group cursor-default overflow-hidden"
  >
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[13px] font-bold text-slate-400 uppercase tracking-[0.1em]">Total Revenue</p>
        <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600 shadow-sm shadow-emerald-100/50 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
          <IndianRupee size={20} strokeWidth={2.5} />
        </div>
      </div>
      <h3 className="text-4xl font-black text-slate-900 tracking-tight">₹48,290</h3>
    </div>
    
    <div className="relative z-10 mt-8">
      <button className="text-emerald-600 text-[13px] font-bold flex items-center gap-2 group/btn">
        <span>View Reports</span>
        <ArrowUpRight size={16} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
      </button>
    </div>

    {/* Decorative background element */}
    <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full group-hover:bg-emerald-500/10 transition-colors"></div>
  </motion.div>
);

export const ROICard = () => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-8 rounded-[2.5rem] border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between h-full relative group cursor-default overflow-hidden"
  >
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <p className="text-[13px] font-bold text-slate-400 uppercase tracking-[0.1em]">Monthly ROI</p>
        <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600 shadow-sm shadow-indigo-100/50 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
          <Percent size={20} strokeWidth={2.5} />
        </div>
      </div>
      <h3 className="text-4xl font-black text-slate-900 tracking-tight">23.5x</h3>
    </div>

    <div className="relative z-10 mt-8">
       <span className="text-[11px] bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-xl font-bold">
         Top 5% industry
       </span>
    </div>

    {/* Decorative background element */}
    <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full group-hover:bg-indigo-500/10 transition-colors"></div>
  </motion.div>
);
