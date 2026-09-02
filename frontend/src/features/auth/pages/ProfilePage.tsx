import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  if (!user) {
    return <Navigate to="/account" replace />
  }

  return (
    <main style={{ padding: '72px 24px 96px' }}>
      <section style={{ maxWidth: '560px', margin: '0 auto', textAlign: 'center', background: '#fffdfb', border: '1px solid rgba(44,31,24,0.1)', borderRadius: '20px', padding: '42px 32px', boxShadow: '0 14px 40px rgba(18,12,11,0.06)' }}>
        <div style={{ width: '76px', height: '76px', margin: '0 auto 18px', display: 'grid', placeItems: 'center', borderRadius: '50%', background: 'linear-gradient(135deg, var(--saffron), var(--maroon))', color: '#fff', fontSize: '30px', fontWeight: 700 }}>{user.name.charAt(0).toUpperCase()}</div>
        <p style={{ margin: 0, color: 'var(--gold)', fontSize: '12px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Your profile</p>
        <h1 style={{ margin: '10px 0 8px', fontFamily: "'Playfair Display', serif", color: 'var(--maroon)', fontSize: '36px' }}>{user.name}</h1>
        <p style={{ margin: 0, color: 'rgba(28,28,30,0.65)' }}>{user.email}</p>
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
