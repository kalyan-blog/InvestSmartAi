import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api, { setAuthToken } from '../services/api'

const Login = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/auth/login', form)
      setAuthToken(data.access_token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center">
      <div className="glass w-full max-w-md p-8 rounded-2xl border border-slate-800">
        <h1 className="text-2xl font-semibold mb-2">Welcome back</h1>
        <p className="text-slate-400 mb-6">Sign in to your InvestSmart dashboard.</p>
        {error && <div className="mb-4 text-sm text-red-400">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-300">Email</label>
            <input className="input" name="email" type="email" required onChange={onChange} value={form.email} />
          </div>
          <div>
            <label className="text-sm text-slate-300">Password</label>
            <input className="input" name="password" type="password" required onChange={onChange} value={form.password} />
          </div>
          <button className="btn-primary w-full" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>
        <p className="text-sm text-slate-400 mt-4">
          New here? <Link className="text-neon" to="/register">Create account</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
