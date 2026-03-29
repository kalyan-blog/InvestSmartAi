import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const token = localStorage.getItem('token')

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="fixed top-0 left-0 right-0 z-30 bg-slate-950/80 backdrop-blur-lg border-b border-slate-800">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="InvestSmart AI Logo" className="h-10 w-auto rounded-xl shadow-lg border border-slate-700/50" />
          <div className="hidden sm:block">
            <p className="text-white font-semibold leading-tight">InvestSmart AI</p>
            <p className="text-[11px] text-slate-400">Indian Market Intelligence</p>
          </div>
        </div>
        {token && (
          <div className="flex items-center gap-4 text-sm text-slate-300">
            <Link className={isActive('/dashboard') ? 'text-neon' : 'hover:text-white'} to="/dashboard">Dashboard</Link>
            <Link className={isActive('/directory') ? 'text-neon' : 'hover:text-white'} to="/directory">Directory</Link>
            <Link className={isActive('/profile') ? 'text-neon' : 'hover:text-white'} to="/profile">Profile</Link>
            <button onClick={logout} className="ml-3 rounded-full border border-slate-700 px-3 py-1 hover:border-neon hover:text-neon">Logout</button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
