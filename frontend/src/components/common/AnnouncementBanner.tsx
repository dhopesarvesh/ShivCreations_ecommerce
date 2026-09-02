const messages = [
  '🎉 Free shipping on orders above ₹499',
  '✨ Use code RANGOLI20 for 20% off your first order',
  '🪔 New Diwali collection is live — Shop now',
  '🌸 Handcrafted with love, delivered to your door',
]

export default function AnnouncementBanner() {
  const text = messages.join('   ·   ')

  return (
    <div
      style={{
        backgroundColor: 'var(--maroon)',
        color: 'var(--ivory)',
        height: '36px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          white-space: nowrap;
          animation: marquee 28s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="marquee-track">
        <span style={{ fontSize: '12px', letterSpacing: '0.04em', paddingRight: '4rem' }}>
          {text}
        </span>
        {/* Duplicate for seamless loop */}
        <span style={{ fontSize: '12px', letterSpacing: '0.04em', paddingRight: '4rem' }}>
          {text}
        </span>
      </div>
    </div>
  )
}
