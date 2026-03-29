import React from 'react'

const StatCard = ({ title, value, sub, accent }) => {
  return (
    <div className="glass rounded-2xl p-4 border border-slate-800">
      <p className="text-xs uppercase tracking-wide text-slate-400">{title}</p>
      <div className="flex items-end gap-2 mt-2">
        <p className="text-2xl font-semibold text-white">{value}</p>
        {accent && <span className="text-sm text-neon">{accent}</span>}
      </div>
      {sub && <p className="text-sm text-slate-400 mt-1">{sub}</p>}
    </div>
  )}

export default StatCard
