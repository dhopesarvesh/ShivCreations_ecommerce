import { Link } from 'react-router-dom'

export default function AboutPage() {
  return (
    <main>
      <section
        style={{
          padding: '72px 24px 84px',
          background: 'linear-gradient(135deg, rgba(249,115,22,0.08), rgba(201,168,76,0.14))',
        }}
      >
        <div style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center' }}>
          <p style={eyebrowStyle}>Our story</p>
          <h1 style={heroHeadingStyle}>Celebrations made more colourful</h1>
          <p style={heroTextStyle}>
            Shiv&apos;s Creations brings beautiful, meaningful rangoli designs to homes,
            festivals, and special occasions with thoughtfully crafted products for every
            celebration.
          </p>
        </div>
      </section>

      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '64px 24px 90px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}
        >
          <article style={cardStyle}>
            <div style={iconStyle}>🎨</div>
            <h2 style={cardHeadingStyle}>Made with creativity</h2>
            <p style={cardTextStyle}>
              From floral motifs to personalised letters and auspicious symbols, every
              design is selected to help you create a welcoming space.
            </p>
          </article>
          <article style={cardStyle}>
            <div style={iconStyle}>🪔</div>
            <h2 style={cardHeadingStyle}>Rooted in tradition</h2>
            <p style={cardTextStyle}>
              We celebrate the timeless art of rangoli while making it simple to explore
              fresh patterns and festive ideas.
            </p>
          </article>
          <article style={cardStyle}>
            <div style={iconStyle}>💛</div>
            <h2 style={cardHeadingStyle}>For every celebration</h2>
            <p style={cardTextStyle}>
              Whether you are preparing for Diwali, welcoming guests, or adding colour to
              an everyday moment, our collection is made for you.
            </p>
          </article>
        </div>

        <div
          style={{
            marginTop: '56px',
            padding: '34px',
            borderRadius: '18px',
            background: '#fffdfb',
            border: '1px solid rgba(44,31,24,0.08)',
            textAlign: 'center',
          }}
        >
          <p style={eyebrowStyle}>Start creating</p>
          <h2 style={{ margin: '10px 0 18px', fontFamily: "'Playfair Display', serif", fontSize: '32px', color: 'var(--charcoal)' }}>
            Find a design for your next celebration
          </h2>
          <Link to="/flowers" style={buttonStyle}>Explore our collection</Link>
        </div>
      </section>
    </main>
  )
}

const eyebrowStyle = {
  margin: 0,
  color: 'var(--gold)',
  fontSize: '12px',
  fontWeight: 700,
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
}

const heroHeadingStyle = {
  margin: '12px 0 16px',
  color: 'var(--maroon)',
  fontFamily: "'Playfair Display', serif",
  fontSize: 'clamp(36px, 6vw, 58px)',
  lineHeight: 1.1,
}

const heroTextStyle = {
  maxWidth: '680px',
  margin: '0 auto',
  color: 'rgba(28,28,30,0.7)',
  fontSize: '18px',
  lineHeight: 1.7,
}

const cardStyle = {
  padding: '28px 24px',
  borderRadius: '18px',
  background: '#fffdfb',
  border: '1px solid rgba(44,31,24,0.08)',
  boxShadow: '0 10px 30px rgba(18,12,11,0.04)',
}

const iconStyle = {
  width: '48px',
  height: '48px',
  display: 'grid',
  placeItems: 'center',
  borderRadius: '14px',
  background: 'rgba(201,168,76,0.18)',
  fontSize: '24px',
}

const cardHeadingStyle = {
  margin: '20px 0 10px',
  color: 'var(--charcoal)',
  fontSize: '22px',
}

const cardTextStyle = {
  margin: 0,
  color: 'rgba(28,28,30,0.68)',
  lineHeight: 1.7,
}

const buttonStyle = {
  display: 'inline-block',
  padding: '12px 20px',
  borderRadius: '10px',
  background: 'var(--saffron)',
  color: '#fff',
  fontWeight: 700,
  textDecoration: 'none',
}
