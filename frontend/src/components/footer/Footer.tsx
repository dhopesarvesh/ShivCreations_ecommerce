const footerLinks = {
  'Quick Links': [
    ['Home', '/'],
    ['Shop All', '/'],
    ['Festivals', '/flowers'],
    ['New Arrivals', '/'],
    ['Sale', '/'],
  ],
  'Support': [
    ['FAQ', '/#faq'],
    ['Contact Us', 'mailto:hello@shivcreations.com'],
  ],
  'Company': [
    ['About Us', '/#about'],
  ],
}

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--charcoal)',
        color: 'var(--ivory)',
        paddingTop: 'clamp(48px, 7vw, 80px)',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 clamp(16px, 4vw, 48px)',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '40px',
            paddingBottom: '48px',
          }}
        >
          {/* Brand column */}
          <div style={{ gridColumn: 'span 1' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <span style={{ fontSize: '22px' }}>🪔</span>
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '18px',
                  fontWeight: '700',
                  color: 'var(--gold)',
                }}
              >
                Shiv's Creations
              </span>
            </div>
            <p
              style={{
                fontSize: '13px',
                lineHeight: '1.7',
                color: 'rgba(250,247,242,0.6)',
                maxWidth: '220px',
              }}
            >
              Bringing the art of rangoli to every doorstep. Handcrafted with love, made for celebration.
            </p>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              {['📘', '📸', '🐦', '▶️'].map((icon, i) => (
                <button
                  key={i}
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: 'none',
                    borderRadius: '8px',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '16px',
                    transition: 'background 200ms ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(201,168,76,0.25)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4
                style={{
                  fontSize: '11px',
                  fontWeight: '700',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--gold)',
                  marginBottom: '18px',
                }}
              >
                {heading}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {links.map(([label, href]) => (
                  <li key={label}>
                    <a
                      href={href}
                      style={{
                        fontSize: '13px',
                        color: 'rgba(250,247,242,0.6)',
                        textDecoration: 'none',
                        transition: 'color 200ms ease',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--ivory)' }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(250,247,242,0.6)' }}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <h4
              style={{
                fontSize: '11px',
                fontWeight: '700',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                marginBottom: '18px',
              }}
            >
              Stay Updated
            </h4>
            <p style={{ fontSize: '13px', color: 'rgba(250,247,242,0.6)', marginBottom: '16px', lineHeight: '1.6' }}>
              Festival deals & new drops, straight to your inbox.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input
                type="email"
                placeholder="your@email.com"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(201,168,76,0.25)',
                  borderRadius: '6px',
                  padding: '10px 14px',
                  fontSize: '13px',
                  color: 'var(--ivory)',
                  outline: 'none',
                  transition: 'border-color 200ms ease',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--gold)' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(201,168,76,0.25)' }}
              />
              <button
                style={{
                  backgroundColor: 'var(--saffron)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '10px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background 200ms ease',
                  letterSpacing: '0.04em',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--maroon)' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--saffron)' }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom strip */}
        <div
          style={{
            borderTop: '1px solid rgba(201,168,76,0.15)',
            padding: '20px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <p style={{ fontSize: '12px', color: 'rgba(250,247,242,0.4)' }}>
            © {new Date().getFullYear()} Shiv's Creations. All rights reserved.
          </p>
          <p style={{ fontSize: '12px', color: 'rgba(250,247,242,0.4)' }}>
            Made with 🧡 in India
          </p>
        </div>
      </div>
    </footer>
  )
}