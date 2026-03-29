import React, { useState } from 'react';

const stocksData = [
  { name: "Reliance Industries", symbol: "RELIANCE.NS", website: "https://www.ril.com", category: "Energy" },
  { name: "TCS", symbol: "TCS.NS", website: "https://www.tcs.com", category: "IT" },
  { name: "Infosys", symbol: "INFY.NS", website: "https://www.infosys.com", category: "IT" },
  { name: "HDFC Bank", symbol: "HDFCBANK.NS", website: "https://www.hdfcbank.com", category: "Banking" },
  { name: "ICICI Bank", symbol: "ICICIBANK.NS", website: "https://www.icicibank.com", category: "Banking" },
  { name: "State Bank of India", symbol: "SBIN.NS", website: "https://sbi.co.in", category: "Banking" },
  { name: "Wipro", symbol: "WIPRO.NS", website: "https://www.wipro.com", category: "IT" },
  { name: "HCL Technologies", symbol: "HCLTECH.NS", website: "https://www.hcltech.com", category: "IT" },
  { name: "Tech Mahindra", symbol: "TECHM.NS", website: "https://www.techmahindra.com", category: "IT" },
  { name: "ITC", symbol: "ITC.NS", website: "https://www.itcportal.com", category: "FMCG" },
  { name: "Hindustan Unilever", symbol: "HINDUNILVR.NS", website: "https://www.hul.co.in", category: "FMCG" },
  { name: "Nestle India", symbol: "NESTLEIND.NS", website: "https://www.nestle.in", category: "FMCG" },
  { name: "ONGC", symbol: "ONGC.NS", website: "https://www.ongcindia.com", category: "Energy" },
  { name: "NTPC", symbol: "NTPC.NS", website: "https://www.ntpc.co.in", category: "Energy" },
  { name: "Adani Ports", symbol: "ADANIPORTS.NS", website: "https://www.adaniports.com", category: "Infrastructure" },
  { name: "Tata Motors", symbol: "TATAMOTORS.NS", website: "https://www.tatamotors.com", category: "Automobiles" },
  { name: "Maruti Suzuki", symbol: "MARUTI.NS", website: "https://www.marutisuzuki.com", category: "Automobiles" },
  { name: "Mahindra & Mahindra", symbol: "M&M.NS", website: "https://www.mahindra.com", category: "Automobiles" },
  { name: "Hero MotoCorp", symbol: "HEROMOTOCO.NS", website: "https://www.heromotocorp.com", category: "Automobiles" },
  { name: "Tata Steel", symbol: "TATASTEEL.NS", website: "https://www.tatasteel.com", category: "Metals & Cement" },
  { name: "JSW Steel", symbol: "JSWSTEEL.NS", website: "https://www.jsw.in", category: "Metals & Cement" },
  { name: "UltraTech Cement", symbol: "ULTRACEMCO.NS", website: "https://www.ultratechcement.com", category: "Metals & Cement" },
  { name: "Axis Bank", symbol: "AXISBANK.NS", website: "https://www.axisbank.com", category: "Banking" },
  { name: "Kotak Mahindra Bank", symbol: "KOTAKBANK.NS", website: "https://www.kotak.com", category: "Banking" },
  { name: "Adani Enterprises", symbol: "ADANIENT.NS", website: "https://www.adanienterprises.com", category: "Conglomerate" },
  { name: "Adani Green Energy", symbol: "ADANIGREEN.NS", website: "https://www.adanigreenenergy.com", category: "Energy" },
  { name: "Adani Power", symbol: "ADANIPOWER.NS", website: "https://www.adanipower.com", category: "Energy" },
  { name: "Coal India", symbol: "COALINDIA.NS", website: "https://www.coalindia.in", category: "Energy" },
  { name: "GAIL India", symbol: "GAIL.NS", website: "https://www.gailonline.com", category: "Energy" },
  { name: "Dr Reddy's Laboratories", symbol: "DRREDDY.NS", website: "https://www.drreddys.com", category: "Pharma" },
  { name: "Sun Pharma", symbol: "SUNPHARMA.NS", website: "https://www.sunpharma.com", category: "Pharma" },
  { name: "Cipla", symbol: "CIPLA.NS", website: "https://www.cipla.com", category: "Pharma" },
  { name: "Divi's Laboratories", symbol: "DIVISLAB.NS", website: "https://www.divislabs.com", category: "Pharma" },
  { name: "Asian Paints", symbol: "ASIANPAINT.NS", website: "https://www.asianpaints.com", category: "Consumer Goods" },
  { name: "Pidilite Industries", symbol: "PIDILITIND.NS", website: "https://www.pidilite.com", category: "Consumer Goods" },
  { name: "Berger Paints", symbol: "BERGEPAINT.NS", website: "https://www.bergerpaints.com", category: "Consumer Goods" },
  { name: "Zomato", symbol: "ZOMATO.NS", website: "https://www.zomato.com", category: "Tech & Services" },
  { name: "Paytm", symbol: "PAYTM.NS", website: "https://www.paytm.com", category: "Tech & Services" },
  { name: "Nykaa", symbol: "NYKAA.NS", website: "https://www.nykaa.com", category: "Tech & Services" },
  { name: "IRCTC", symbol: "IRCTC.NS", website: "https://www.irctc.co.in", category: "Public Sector" },
  { name: "Indian Railway Finance Corporation", symbol: "IRFC.NS", website: "https://www.irfc.co.in", category: "Public Sector" },
  { name: "Havells India", symbol: "HAVELLS.NS", website: "https://www.havells.com", category: "Consumer Durables" },
  { name: "Voltas", symbol: "VOLTAS.NS", website: "https://www.voltas.com", category: "Consumer Durables" },
  { name: "Siemens India", symbol: "SIEMENS.NS", website: "https://www.siemens.co.in", category: "Capital Goods" },
  { name: "DLF", symbol: "DLF.NS", website: "https://www.dlf.in", category: "Real Estate" },
  { name: "Godrej Properties", symbol: "GODREJPROP.NS", website: "https://www.godrejproperties.com", category: "Real Estate" }
];

const categories = ["All", ...new Set(stocksData.map(s => s.category))];

const MarketDirectory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredStocks = stocksData.filter(stock => {
    const matchesSearch = stock.name.toLowerCase().includes(searchQuery.toLowerCase()) || stock.symbol.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || stock.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="mx-auto max-w-7xl space-y-8 animate-in fade-in duration-500">
      {/* Header section with gradient and glow */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 relative">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-neon/10 blur-3xl rounded-full"></div>
        <div className="relative z-10">
          <p className="text-sm text-neon font-mono mb-2 track-widest uppercase">InvestSmart AI</p>
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Market Directory
          </h1>
          <p className="text-slate-400 mt-2 max-w-lg">
            Explore the top companies tracking the Indian stock market. Stay updated with their official spaces.
          </p>
        </div>
        
        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto z-10">
          <input
            type="text"
            placeholder="Search company or symbol..."
            className="input w-full sm:w-64 bg-slate-900/50 border-slate-700 focus:border-neon focus:ring-1 focus:ring-neon transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className="input w-full sm:w-48 bg-slate-900/50 border-slate-700 text-slate-200"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Glassmorphism Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 relative">
        {filteredStocks.map(stock => (
          <div
            key={stock.symbol}
            className="glass rounded-2xl p-6 border border-slate-800/80 bg-slate-900/40 backdrop-blur-xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:border-slate-600 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-neon/10 group"
          >
            <div>
              <div className="flex justify-between items-start mb-5">
                <span className="text-[10px] uppercase tracking-wider font-semibold px-2.5 py-1 bg-slate-800/80 text-slate-300 rounded-md ring-1 ring-slate-700">
                  {stock.category}
                </span>
                <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                  NSE
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-neon transition-colors duration-300 line-clamp-1" title={stock.name}>
                {stock.name}
              </h3>
              <p className="text-neon/70 font-mono text-sm mb-6">{stock.symbol}</p>
            </div>
            
            <a
              href={stock.website}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl font-medium text-sm text-center border border-slate-700 bg-slate-800/40 hover:bg-neon hover:text-black hover:border-neon transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>Visit Website</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-70 group-hover:opacity-100">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </div>
        ))}

        {filteredStocks.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center glass rounded-2xl border border-slate-800">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-slate-600 mb-4">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <p className="text-xl text-slate-300 font-medium">No companies found</p>
            <p className="text-slate-500 mt-2">Adjust your filters or search query and try again.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketDirectory;