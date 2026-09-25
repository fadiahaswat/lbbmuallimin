import React from 'react';

export default function StageSummaryCards({ stages, stageCounts }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
      {stages.map(st => {
        const count = stageCounts[st.id] || 0;
        return (
          <div
            key={st.id}
            className="bg-white border border-slate-200 p-3 rounded-2xl shadow-xs text-center space-y-1"
          >
            <span className="text-[9px] uppercase font-bold text-slate-500 block truncate">
              {st.shortLabel}
            </span>
            <div className="text-xl font-black font-mono text-slate-900">
              {count} <span className="text-[10px] text-slate-400 font-normal">Tim</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
