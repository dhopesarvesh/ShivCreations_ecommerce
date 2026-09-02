import { useState, useEffect } from 'react'
import { Search, User, ShoppingBag, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const { itemCount } = useCart()
  const { user } = useAuth()

  const navItems = user?.role === 'admin'
    ? [
        ['Dashboard', '/admin'],
        ['Products', '/admin/products'],
        ['Categories', '/admin/categories'],
        ['Users', '/admin/users'],
        ['Orders', '/admin/orders'],
      ]
    : [
        ['Home', '/'],
        ['Flowers', '/flowers'],
        ['Letters', '/letters'],
        ['Swastika', '/swastika'],
        ['About', '/about'],
      ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: scrolled ? 'rgba(250, 247, 242, 0.95)' : 'var(--ivory)',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        boxShadow: scrolled ? '0 1px 20px rgba(0,0,0,0.08)' : 'none',
        transition: 'all 250ms ease-in-out',
        borderBottom: `1px solid ${scrolled ? 'rgba(201,168,76,0.2)' : 'transparent'}`,
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          height: '68px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--saffron), var(--maroon))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
            }}
          >
            🪔
          </div>
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '20px',
              fontWeight: '700',
              color: 'var(--maroon)',
              letterSpacing: '-0.01em',
            }}
          >
            Shiv's Creations
          </span>
        </div>

        {/* Nav Links — desktop */}
        <div
          className="nav-links"
          style={{ display: 'flex', gap: '32px', alignItems: 'center' }}
        >
          {navItems.map(([label, path]) => (
            <Link
              key={label}
              to={path}
              style={{
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--charcoal)',
                textDecoration: 'none',
                letterSpacing: '0.02em',
                position: 'relative',
                paddingBottom: '2px',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget
                el.style.color = 'var(--saffron)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget
                el.style.color = 'var(--charcoal)'
              }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Right Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

          {/* Search */}
          {searchOpen ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#f0ebe3',
                borderRadius: '8px',
                padding: '6px 12px',
                animation: 'fadeIn 200ms ease',
              }}
            >
              <Search size={16} color="var(--charcoal)" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                style={{
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '14px',
                  width: '180px',
                  color: 'var(--charcoal)',
                }}
              />
              <button
                onClick={() => { setSearchOpen(false); setSearchQuery('') }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', display: 'flex' }}
              >
                <X size={16} color="var(--charcoal)" />
              </button>
            </div>
          ) : (
            <IconButton onClick={() => setSearchOpen(true)} label="Search">
              <Search size={20} />
            </IconButton>
          )}

          <IconButton label={user ? 'Profile' : 'Log in'} onClick={() => navigate(user ? '/profile' : '/account')}>
            <User size={20} />
          </IconButton>

          {/* Cart with badge */}
          <IconButton label="Cart" onClick={() => navigate('/cart')} style={{ position: 'relative' }}>
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: 'var(--saffron)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '18px',
                  height: '18px',
                  fontSize: '11px',
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {itemCount}
              </span>
            )}
          </IconButton>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scaleX(0.9); }
          to   { opacity: 1; transform: scaleX(1); }
        }
        @media (max-width: 768px) {
          .nav-links { display: none !important; }
        }
      `}</style>
    </nav>
  )
}

// Reusable icon button
function IconButton({
  children,
  onClick,
  label,
  style = {},
}: {
  children: React.ReactNode
  onClick?: () => void
  label: string
  style?: React.CSSProperties
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#f0ebe3' : 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '8px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--charcoal)',
        transition: 'all 200ms ease',
        position: 'relative',
        ...style,
      }}
    >
      {children}
    </button>
  )
}