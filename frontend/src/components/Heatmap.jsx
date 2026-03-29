import React, { useEffect, useState } from 'react';
import api from '../services/api';

const Heatmap = () => {
  const [heatmapData, setHeatmapData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHeatmap = async () => {
      try {
        const { data } = await api.get('/stocks/heatmap');
        setHeatmapData(data);
      } catch (err) {
        console.error("Failed to load heatmap:", err);
        setError("Failed to load market heatmap");
      } finally {
        setLoading(false);
      }
    };
    fetchHeatmap();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48 border border-slate-800 rounded-2xl bg-slate-900/40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-400 p-4 border border-red-900/50 rounded-2xl bg-red-950/20">{error}</div>;
  }

  return (
    <div className="glass rounded-2xl p-4 border border-slate-800">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-xl font-semibold mb-1">Market Heatmap</h3>
          <p className="text-sm text-slate-400">Live NSE Performance Tracker</p>
        </div>
        <div className="flex gap-2 text-xs">
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-green-500/80"></div> Rising</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-slate-600"></div> Neutral</div>
          <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-sm bg-red-500/80"></div> Falling</div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {heatmapData.map((stock) => {
          const isPositive = stock.change_percent > 0;
          const isNegative = stock.change_percent < 0;
          
          let bgColor = "bg-slate-800"; // Neutral
          if (isPositive) {
            // Darker green for smaller gains, brighter for larger gains
            bgColor = stock.change_percent > 2 ? "bg-green-500" : "bg-green-500/70";
          } else if (isNegative) {
             // Darker red for smaller losses, brighter for larger losses
            bgColor = stock.change_percent < -2 ? "bg-red-500" : "bg-red-500/70";
          }

          return (
            <div 
              key={stock.symbol}
              className={`${bgColor} rounded-xl p-3 flex flex-col justify-between h-20 transition-transform hover:scale-105 cursor-pointer shadow-lg`}
              title={`${stock.symbol}: ₹${stock.price}`}
            >
              <span className="text-white font-bold text-sm truncate drop-shadow-md">{stock.symbol}</span>
              <div className="flex justify-between items-end">
                <span className="text-white/90 text-xs font-mono drop-shadow-md">₹{stock.price || '--'}</span>
                <span className="text-white font-semibold text-sm drop-shadow-md shadow-black">
                  {stock.change_percent > 0 ? '+' : ''}{stock.change_percent}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Heatmap;