import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'

export default function ProfilePage() {
  const { user, logout, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: user?.name ?? '', email: user?.email ?? '', currentPassword: '', newPassword: '', confirmPassword: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  if (!user) {
    return <Navigate to="/account" replace />
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setMessage('')
    setError('')
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match.')
      return
    }
    const result = await updateProfile(form.name, form.email, form.currentPassword, form.newPassword)
    if (!result.success) {
      setError(result.error ?? 'Unable to update profile.')
      return
    }
    setForm({ ...form, currentPassword: '', newPassword: '', confirmPassword: '' })
    setMessage('Profile updated successfully.')
  }

  return (
    <main style={{ padding: '56px 24px 96px' }}>
      <section style={{ maxWidth: '720px', margin: '0 auto', textAlign: 'center', background: '#fffdfb', border: '1px solid rgba(44,31,24,0.1)', borderRadius: '20px', padding: '42px 32px', boxShadow: '0 14px 40px rgba(18,12,11,0.06)' }}>
        <div style={{ width: '76px', height: '76px', margin: '0 auto 18px', display: 'grid', placeItems: 'center', borderRadius: '50%', background: 'linear-gradient(135deg, var(--saffron), var(--maroon))', color: '#fff', fontSize: '30px', fontWeight: 700 }}>{user.name.charAt(0).toUpperCase()}</div>
        <p style={{ margin: 0, color: 'var(--gold)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Your profile</p>
        <h1 style={{ margin: '10px 0 8px', fontFamily: "'Playfair Display', serif", color: 'var(--maroon)', fontSize: '36px' }}>{user.name}</h1>
        <p style={{ margin: 0, color: 'rgba(28,28,30,0.65)' }}>{user.email} · {user.role === 'admin' ? 'Administrator' : 'Customer'}</p>
        <form onSubmit={handleSubmit} style={{ maxWidth: '480px', margin: '32px auto 0', textAlign: 'left', display: 'grid', gap: '12px' }}>
          <h2 style={{ margin: 0, color: 'var(--charcoal)', fontSize: '22px' }}>Account settings</h2>
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Full name" required style={inputStyle} />
          <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="Email address" required style={inputStyle} />
          <p style={{ margin: '12px 0 0', color: 'var(--charcoal)', fontWeight: 700 }}>Change password</p>
          <input type="password" value={form.currentPassword} onChange={(event) => setForm({ ...form, currentPassword: event.target.value })} placeholder="Current password (required to change it)" style={inputStyle} />
          <input type="password" value={form.newPassword} onChange={(event) => setForm({ ...form, newPassword: event.target.value })} placeholder="New password" style={inputStyle} />
          <input type="password" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} placeholder="Confirm new password" style={inputStyle} />
          {error && <p style={{ margin: 0, color: '#991b1b', fontSize: '14px' }}>{error}</p>}
          {message && <p style={{ margin: 0, color: '#166534', fontSize: '14px' }}>{message}</p>}
          <button type="submit" style={{ ...buttonStyle, marginTop: '8px' }}>Save profile</button>
        </form>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '28px', flexWrap: 'wrap' }}>
          <Link to="/" style={buttonStyle}>Continue shopping</Link>
          {user.role === 'admin' ? (
            <Link to="/admin/orders" style={{ ...buttonStyle, background: 'var(--maroon)' }}>Manage all orders</Link>
          ) : (
            <Link to="/orders" style={{ ...buttonStyle, background: 'var(--maroon)' }}>My orders</Link>
          )}
          <button onClick={() => { logout(); navigate('/') }} style={{ ...buttonStyle, background: 'transparent', color: 'var(--maroon)', border: '1px solid var(--maroon)' }}>Log out</button>
        </div>
      </section>
    </main>
  )
}

const buttonStyle = { display: 'inline-block', border: 'none', borderRadius: '9px', padding: '12px 18px', background: 'var(--saffron)', color: '#fff', fontWeight: 700, textDecoration: 'none', cursor: 'pointer' }
const inputStyle = { width: '100%', boxSizing: 'border-box' as const, border: '1px solid rgba(44,31,24,0.14)', borderRadius: '9px', padding: '12px 14px', fontSize: '14px', color: 'var(--charcoal)', background: '#fff' }
