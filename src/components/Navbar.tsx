import React, { useState } from 'react';
import { Bell, HelpCircle, ChevronDown, Menu, Wallet, User, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="h-20 bg-white/40 backdrop-blur-xl border-b border-white/20 flex items-center justify-between px-8 sticky top-0 z-30 transition-all duration-300"
    >
      <div className="flex items-center gap-6 flex-1">


        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-black text-slate-900 tracking-tight hidden md:block"
        >
          Welcome back, Retner! 
        </motion.h1>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2.5 bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-100/50 px-4 py-2 rounded-2xl cursor-pointer hover:shadow-lg hover:shadow-emerald-100/20 transition-all duration-300"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <Wallet size={18} />
            </div>
            <div className="flex flex-col pr-1">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest leading-none mb-1">Balance</span>
              <span className="text-[13px] font-black text-slate-900 leading-none">₹124,50.00</span>
            </div>
          </motion.div>

          <div className="flex items-center gap-1.5 ml-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl relative smooth-transition group shadow-sm hover:shadow-md border border-transparent hover:border-white"
            >
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-white rounded-xl smooth-transition shadow-sm hover:shadow-md border border-transparent hover:border-white"
            >
              <HelpCircle size={20} />
            </motion.button>
          </div>
        </div>

        <div className="h-8 w-px bg-slate-200/60 mx-4"></div>

        <div className="relative">
          <motion.div
            whileHover={{ x: 2 }}
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 pl-1 pr-1.5 py-1 rounded-2xl cursor-pointer hover:bg-white smooth-transition border border-transparent hover:border-white hover:shadow-md"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px] shadow-sm">
              <div className="w-full h-full rounded-[10px] bg-white p-[1px] overflow-hidden">
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                  alt="User"
                  className="w-full h-full object-cover rounded-[8px]"
                />
              </div>
            </div>
            <div className="flex flex-col hidden sm:flex">
              <span className="text-xs font-black text-slate-900 leading-tight">Retner</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pro Account</span>
            </div>
            <ChevronDown size={14} className={`text-slate-400 ml-1 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
          </motion.div>

          {isProfileOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden z-50 p-2 space-y-1"
            >
              <button className="w-full flex items-center gap-3 text-left px-3 py-2.5 text-[13px] font-bold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-xl transition-colors">
                <User size={16} />
                View Profile
              </button>
              <button className="w-full flex items-center gap-3 text-left px-3 py-2.5 text-[13px] font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                <LogOut size={16} />
                Logout
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
