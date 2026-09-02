import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, signup } = useAuth()
  const navigate = useNavigate()

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (mode === 'signup' && !name.trim()) {
      setError('Please enter your name.')
      return
    }

    const success = mode === 'login'
      ? await login(email, password)
      : await signup(name, email, password)

    if (!success) {
      setError(mode === 'login' ? 'Email or password is incorrect.' : 'Please use a valid name and a unique email address.')
      return
    }

    const storedUser = JSON.parse(localStorage.getItem('shiv-creations-user') || 'null') as { role?: 'admin' | 'user' } | null
    const role = storedUser?.role ?? 'user'
    navigate(role === 'admin' ? '/admin' : '/profile')
  }

  return (
    <main style={{ padding: '72px 24px 96px' }}>
      <section style={{ maxWidth: '460px', margin: '0 auto', background: '#fffdfb', border: '1px solid rgba(44,31,24,0.1)', borderRadius: '20px', padding: '32px', boxShadow: '0 14px 40px rgba(18,12,11,0.06)' }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '34px' }}>🪔</div>
          <p style={{ margin: '10px 0 0', color: 'var(--gold)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Welcome to Shiv's Creations</p>
          <h1 style={{ margin: '10px 0 0', fontFamily: "'Playfair Display', serif", color: 'var(--maroon)', fontSize: '34px' }}>
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: '#f4eee6', borderRadius: '10px', padding: '4px' }}>
          {(['login', 'signup'] as const).map((option) => (
            <button key={option} type="button" onClick={() => { setMode(option); setError('') }} style={{ flex: 1, border: 'none', borderRadius: '8px', padding: '10px', cursor: 'pointer', background: mode === option ? 'var(--maroon)' : 'transparent', color: mode === option ? '#fff' : 'var(--charcoal)', fontWeight: 700 }}>
              {option === 'login' ? 'Log in' : 'Sign up'}
            </button>
          ))}
        </div>

        <form onSubmit={submit} style={{ display: 'grid', gap: '14px' }}>
          {mode === 'signup' && <label style={{ display: 'grid', gap: '7px', fontSize: '13px', fontWeight: 600 }}>Full name<input required value={name} onChange={(event) => setName(event.target.value)} style={inputStyle} placeholder="Your name" /></label>}
          <label style={{ display: 'grid', gap: '7px', fontSize: '13px', fontWeight: 600 }}>Email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} style={inputStyle} placeholder="you@example.com" /></label>
          <label style={{ display: 'grid', gap: '7px', fontSize: '13px', fontWeight: 600 }}>Password<input required minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} style={inputStyle} placeholder="At least 6 characters" /></label>
          {error && <p role="alert" style={{ margin: 0, color: 'var(--maroon)', fontSize: '13px' }}>{error}</p>}
          <button type="submit" style={{ marginTop: '6px', border: 'none', borderRadius: '9px', padding: '13px', background: 'var(--saffron)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
            {mode === 'login' ? 'Log in' : 'Create account'}
          </button>
        </form>

        {mode === 'login' && (
          <p style={{ margin: '22px 0 0', textAlign: 'center', color: 'rgba(28,28,30,0.6)', fontSize: '12px', lineHeight: 1.6 }}>
            Admin: <strong>admin@shivcreations.com</strong> / <strong>admin123</strong><br />
            User: <strong>user@shivcreations.com</strong> / <strong>user123</strong>
          </p>
        )}
        <Link to="/" style={{ display: 'block', marginTop: '22px', textAlign: 'center', color: 'var(--maroon)', fontSize: '13px', textDecoration: 'none' }}>Continue shopping</Link>
      </section>
    </main>
  )
}

const inputStyle = { width: '100%', boxSizing: 'border-box' as const, border: '1px solid rgba(44,31,24,0.16)', borderRadius: '8px', padding: '11px 12px', background: '#fff', color: 'var(--charcoal)', outline: 'none' }
