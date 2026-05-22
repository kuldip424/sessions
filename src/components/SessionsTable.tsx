import React from 'react';
import { motion } from 'framer-motion';
import { useSessions } from '../hooks/useSessions';

const levelStyle: Record<string, string> = {
  BOUNCING: 'bg-red-100 text-red-600',
  LOW: 'bg-amber-100 text-amber-600',
  MEDIUM: 'bg-orange-100 text-orange-600',
  HIGH: 'bg-emerald-100 text-emerald-600',
};

const SessionsTable = () => {
  const { data, loading } = useSessions();
  const [currentPage, setCurrentPage] = React.useState(1);
  const recordsPerPage = 10;

  const getDuration = (s: any) => {
    if (typeof s.duration_seconds === 'number') return s.duration_seconds;
    if (s.started_at && s.ended_at) {
      return Math.max(0, Math.round((new Date(s.ended_at).getTime() - new Date(s.started_at).getTime()) / 1000));
    }
    return 0;
  };

  const sessions = React.useMemo(() => {
    return [...(data?.sessions ?? [])].sort(
      (a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime()
    );
  }, [data]);

  const totalPages = Math.ceil(sessions.length / recordsPerPage);
  
  // Safe page index check
  const activePage = Math.min(Math.max(1, currentPage), totalPages || 1);
  
  const startIndex = (activePage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentSessions = sessions.slice(startIndex, endIndex);

  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [sessions.length, totalPages, currentPage]);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      
      let start = Math.max(2, activePage - 1);
      let end = Math.min(totalPages - 1, activePage + 1);
      
      if (activePage <= 2) {
        end = 4;
      } else if (activePage >= totalPages - 1) {
        start = totalPages - 3;
      }
      
      if (start > 2) {
        pages.push('...');
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (end < totalPages - 1) {
        pages.push('...');
      }
      
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-200/60 shadow-sm overflow-hidden p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Sessions</h3>
          <p className="text-[13px] text-slate-400 font-medium mt-0.5">
            {loading
              ? 'Loading…'
              : sessions.length === 0
              ? 'No sessions found'
              : `Showing ${startIndex + 1}–${Math.min(endIndex, sessions.length)} of ${sessions.length} sessions`}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-3 px-4">Session ID</th>
              <th className="py-3 px-4">Visitor</th>
              <th className="py-3 px-4">Duration</th>
              <th className="py-3 px-4">Intent Level</th>
              <th className="py-3 px-4">Device</th>
              <th className="py-3 px-4">Source</th>
              <th className="py-3 px-4">Cart Adds</th>
              <th className="py-3 px-4">Pages</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-slate-50">
                  {Array.from({ length: 8 }).map((_, j) => (
                    <td key={j} className="py-4 px-4">
                      <div className="h-4 bg-slate-100 rounded-lg animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
                    </td>
                  ))}
                </tr>
              ))
              : currentSessions.map((session, i) => (
                <motion.tr
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  key={session.session_id}
                  className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors"
                >
                  <td className="py-4 px-4 text-sm font-mono font-semibold text-indigo-600">
                    {session.session_id.substring(0, 12)}…
                  </td>
                  <td className="py-4 px-4 text-sm font-mono text-slate-500">
                    {session.visitor_id.substring(0, 10)}…
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-600">
                    {getDuration(session)}s
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${levelStyle[session.scoring.final_level] ?? 'bg-slate-100 text-slate-500'}`}>
                      {session.scoring.final_level}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-500 capitalize">
                    {session.device.type} · {session.device.browser}
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-500 capitalize">
                    {session.referrer?.source ?? 'direct'}
                  </td>
                  <td className="py-4 px-4 text-sm font-semibold text-slate-700">
                    {session.metrics.cart_adds}
                  </td>
                  <td className="py-4 px-4 text-sm text-slate-600">
                    {session.metrics.page_count}
                  </td>
                </motion.tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {!loading && sessions.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="text-sm font-medium text-slate-500">
            Showing <span className="font-semibold text-slate-800">{startIndex + 1}</span> to{' '}
            <span className="font-semibold text-slate-800">{Math.min(endIndex, sessions.length)}</span> of{' '}
            <span className="font-semibold text-slate-800">{sessions.length}</span> sessions
          </div>
          
          <div className="flex items-center gap-2">
            {/* Previous Button */}
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={activePage === 1}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            
            {/* Page Numbers */}
            <div className="hidden sm:flex items-center gap-1.5">
              {getPageNumbers().map((pageNum, idx) => {
                if (pageNum === '...') {
                  return (
                    <span
                      key={`dots-${idx}`}
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-slate-400 select-none"
                    >
                      …
                    </span>
                  );
                }
                
                const isCurrent = pageNum === activePage;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum as number)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200/50'
                        : 'text-slate-600 hover:bg-slate-50 border border-transparent hover:border-slate-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            {/* Next Button */}
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={activePage === totalPages}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              Next
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionsTable;
