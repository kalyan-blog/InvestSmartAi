import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api, { setAuthToken } from '../services/api'

const Register = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', full_name: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const payload = { email: form.email, password: form.password, full_name: form.full_name }
      const { data } = await api.post('/auth/register', payload)
      setAuthToken(data.access_token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center">
      <div className="glass w-full max-w-md p-8 rounded-2xl border border-slate-800">
        <h1 className="text-2xl font-semibold mb-2">Create account</h1>
        <p className="text-slate-400 mb-6">Start using AI-powered investment insights.</p>
        {error && <div className="mb-4 text-sm text-red-400">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-300">Full name</label>
            <input className="input" name="full_name" onChange={onChange} value={form.full_name} placeholder="Optional" />
          </div>
          <div>
            <label className="text-sm text-slate-300">Email</label>
            <input className="input" name="email" type="email" required onChange={onChange} value={form.email} />
          </div>
          <div>
            <label className="text-sm text-slate-300">Password</label>
            <input className="input" name="password" type="password" required onChange={onChange} value={form.password} />
          </div>
          <button className="btn-primary w-full" type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Register'}
          </button>
        </form>
        <p className="text-sm text-slate-400 mt-4">
          Already have an account? <Link className="text-neon" to="/login">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
