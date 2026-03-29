import React, { useEffect, useState } from 'react'
import api from '../services/api'

const Profile = () => {
  const [profile, setProfile] = useState({ name: '', age: '', monthly_income: '', risk_level: '', investment_goal: '' })
  const [status, setStatus] = useState('')

  const loadProfile = async () => {
    try {
      const { data } = await api.get('/profile/me')
      setProfile({
        name: data.name || '',
        age: data.age || '',
        monthly_income: data.monthly_income || '',
        risk_level: data.risk_level || '',
        investment_goal: data.investment_goal || '',
      })
    } catch (err) {
      setStatus('Could not load profile')
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  const onChange = (e) => setProfile({ ...profile, [e.target.name]: e.target.value })

  const onSave = async (e) => {
    e.preventDefault()
    setStatus('')
    try {
      await api.put('/profile/me', profile)
      setStatus('Profile saved')
    } catch (err) {
      setStatus(err.response?.data?.detail || 'Save failed')
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="glass rounded-2xl p-6 border border-slate-800">
        <h1 className="text-2xl font-semibold mb-2">Investor Profile</h1>
        <p className="text-slate-400 mb-4">Personalize recommendations with your risk preferences.</p>
        {status && <div className="mb-3 text-sm text-neon">{status}</div>}
        <form onSubmit={onSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-slate-300">Name</label>
            <input className="input" name="name" value={profile.name} onChange={onChange} />
          </div>
          <div>
            <label className="text-sm text-slate-300">Age</label>
            <input className="input" name="age" type="number" value={profile.age} onChange={onChange} />
          </div>
          <div>
            <label className="text-sm text-slate-300">Monthly Income (₹)</label>
            <input className="input" name="monthly_income" type="number" value={profile.monthly_income} onChange={onChange} />
          </div>
          <div>
            <label className="text-sm text-slate-300">Risk Level</label>
            <select className="input" name="risk_level" value={profile.risk_level} onChange={onChange}>
              <option value="">Select</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm text-slate-300">Investment Goal</label>
            <textarea className="input min-h-[100px]" name="investment_goal" value={profile.investment_goal} onChange={onChange} />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button className="btn-primary" type="submit">Save Profile</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Profile
