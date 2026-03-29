import React, { useEffect, useState } from 'react'
import api from '../services/api'
import StatCard from '../components/StatCard'
import TrendChart from '../components/TrendChart'
import AlertList from '../components/AlertList'
import Heatmap from '../components/Heatmap'

const defaultSymbols = [
  'RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK', 'SBIN', 'AXISBANK',
  'KOTAKBANK', 'BAJFINANCE', 'BAJAJFINSV', 'WIPRO', 'HCLTECH', 'TECHM',
  'LTIM', 'MPHASIS', 'HINDUNILVR', 'ITC', 'NESTLEIND', 'BRITANNIA',
  'DABUR', 'ONGC', 'BPCL', 'IOC', 'ADANIGREEN', 'ADANIPORTS', 'TATAMOTORS',
  'MARUTI', 'M&M', 'HEROMOTOCO', 'EICHERMOT'
]

const Dashboard = () => {
  const [symbol, setSymbol] = useState('RELIANCE')
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')

  const fetchData = async (sym) => {
    setLoading(true)
    setError('')
    try {
      console.log(`Fetching dashboard data for ${sym}...`)
      const { data } = await api.get('/stocks/summary', { params: { symbol: sym } })
      console.log(`Data received:`, data)
      setSummary(data)
    } catch (err) {
      console.error(`Error fetching data for ${sym}:`, err)
      setError(err.response?.data?.detail || 'Could not load stock data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(symbol)
  }, [symbol])

  const totalInvestment = 150000
  const profitLoss = 12450

  const filteredAndSortedSymbols = [...defaultSymbols]
    .filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === 'asc') return a.localeCompare(b)
      if (sortOrder === 'desc') return b.localeCompare(a)
      return 0
    })

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-slate-400">AI-powered Indian equities</p>
          <h1 className="text-3xl font-semibold">Portfolio Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="input w-40"
          >
            {defaultSymbols.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <button className="btn-primary" onClick={() => fetchData(symbol)} disabled={loading}>
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Investment" value={`₹${totalInvestment.toLocaleString('en-IN')}`} sub="Dummy portfolio value" />
        <StatCard title="Profit / Loss" value={`₹${profitLoss.toLocaleString('en-IN')}`} accent="+9.2%" sub="Vs last month" />
        <StatCard title="Live Price" value={summary?.live?.last_price ? `₹${summary.live.last_price}` : 'Loading'} sub={summary?.live?.change_percent ? `${summary.live.change_percent}% today` : 'Awaiting market data'} />
      </div>

      <Heatmap />

      {error && <div className="text-red-400">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <TrendChart
            labels={summary?.dates || []}
            data={summary?.series || []}
            title={`${symbol} price trend`}
          />
          <div className="glass rounded-2xl p-4 border border-slate-800">
            <p className="text-sm text-slate-400">Historical analysis</p>
            <h3 className="text-xl font-semibold mb-2">{symbol} insights</h3>
            {summary && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-300">
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">Average price: ₹{summary.historical.average_price}</div>
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">Volatility (σ): {summary.historical.volatility}</div>
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">Trend: {summary.historical.trend}</div>
                <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800">Live change: {summary.live.change_percent ?? 'N/A'}%</div>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <div className="glass rounded-2xl p-4 border border-slate-800 flex flex-col max-h-[600px]">
            <p className="text-sm text-slate-400 mb-2">Stock short-list</p>
            <div className="flex gap-2 mb-4">
              <input 
                type="text" 
                placeholder="Search..." 
                className="input flex-1 text-sm p-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                className="btn-primary"
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                title="Sort"
              >
                {sortOrder === 'asc' ? '↓ A-Z' : '↑ Z-A'}
              </button>
            </div>
            <div className="space-y-3 overflow-y-auto pr-1">
              {filteredAndSortedSymbols.map((s) => (
                <div
                  key={s}
                  onClick={() => setSymbol(s)}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${symbol === s ? 'border-neon bg-slate-900/60' : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'}`}
                >
                  <div>
                    <p className="font-semibold">{s}</p>
                    <p className="text-xs text-slate-400">NSE</p>
                  </div>
                  <span className="text-neon text-sm">View</span>
                </div>
              ))}
            </div>
          </div>
          <AlertList alerts={summary?.historical?.alerts || []} />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
