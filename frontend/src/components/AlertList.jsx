import React from 'react'

const AlertList = ({ alerts = [] }) => {
  if (!alerts.length) return null
  return (
    <div className="glass rounded-2xl p-4 border border-slate-800">
      <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">Alerts</p>
      <div className="space-y-2">
        {alerts.map((alert, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm text-white">
            <span className="h-2 w-2 rounded-full bg-neon" />
            {alert}
          </div>
        ))}
      </div>
    </div>
  )
}

export default AlertList
