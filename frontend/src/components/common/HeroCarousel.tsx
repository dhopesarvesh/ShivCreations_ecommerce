import { useState, useEffect, useCallback } from 'react'
import { heroSlides } from '../../../data/mockData'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const [animating, setAnimating] = useState(false)

  const goTo = useCallback((index: number) => {
    if (animating) return
    setAnimating(true)
    setCurrent(index)
    setTimeout(() => setAnimating(false), 600)
  }, [animating])

  const next = useCallback(() => {
    goTo((current + 1) % heroSlides.length)
  }, [current, goTo])

  const prev = () => {
    goTo((current - 1 + heroSlides.length) % heroSlides.length)
  }

  useEffect(() => {
    const timer = setInterval(next, 4500)
    return () => clearInterval(timer)
  }, [next])

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: 'clamp(420px, 70vh, 680px)',
        overflow: 'hidden',
        backgroundColor: '#1a0a0e',
      }}
    >
      {/* Slides */}
      {heroSlides.map((slide, i) => (
        <div
          key={slide.id}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: i === current ? 1 : 0,
            transition: 'opacity 700ms ease-in-out',
            pointerEvents: i === current ? 'auto' : 'none',
          }}
        >
          {/* Image */}
          <img
            src={slide.image}
            alt={slide.headline}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: i === current ? 'scale(1.03)' : 'scale(1)',
              transition: 'transform 5000ms ease-out',
            }}
          />

          {/* Overlay gradient */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to right, rgba(20,4,8,0.72) 0%, rgba(20,4,8,0.3) 60%, transparent 100%)',
            }}
          />

          {/* Content */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: 'clamp(24px, 6vw, 96px)',
              maxWidth: '640px',
            }}
          >
            {/* Category eyebrow */}
            <span
              style={{
                display: 'inline-block',
                fontSize: '11px',
                fontWeight: '600',
                letterSpacing: '0.14em',
                color: 'var(--gold)',
                textTransform: 'uppercase',
                marginBottom: '16px',
                opacity: i === current ? 1 : 0,
                transform: i === current ? 'translateY(0)' : 'translateY(12px)',
                transition: 'opacity 600ms ease 200ms, transform 600ms ease 200ms',
              }}
            >
              Shiv's Creations
            </span>

            {/* Headline */}
            <h1
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(36px, 5.5vw, 68px)',
                fontWeight: '700',
                color: 'var(--ivory)',
                lineHeight: '1.1',
                whiteSpace: 'pre-line',
                marginBottom: '20px',
                opacity: i === current ? 1 : 0,
                transform: i === current ? 'translateY(0)' : 'translateY(16px)',
                transition: 'opacity 600ms ease 350ms, transform 600ms ease 350ms',
              }}
            >
              {slide.headline}
            </h1>

            {/* Subtext */}
            <p
              style={{
                fontSize: 'clamp(14px, 1.8vw, 17px)',
                color: 'rgba(250,247,242,0.8)',
                marginBottom: '36px',
                lineHeight: '1.6',
                opacity: i === current ? 1 : 0,
                transform: i === current ? 'translateY(0)' : 'translateY(12px)',
                transition: 'opacity 600ms ease 480ms, transform 600ms ease 480ms',
              }}
            >
              {slide.subtext}
            </p>

            {/* CTA Button */}
            <div
              style={{
                opacity: i === current ? 1 : 0,
                transform: i === current ? 'translateY(0)' : 'translateY(12px)',
                transition: 'opacity 600ms ease 580ms, transform 600ms ease 580ms',
              }}
            >
              <button
                style={{
                  backgroundColor: 'var(--saffron)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '14px 32px',
                  fontSize: '14px',
                  fontWeight: '600',
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--maroon)'
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(124,29,46,0.4)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--saffron)'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                {slide.cta}
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Prev / Next arrows */}
      <ArrowButton direction="left" onClick={prev} />
      <ArrowButton direction="right" onClick={next} />

      {/* Dot indicators */}
      <div
        style={{
          position: 'absolute',
          bottom: '28px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '10px',
        }}
      >
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              width: i === current ? '28px' : '8px',
              height: '8px',
              borderRadius: '4px',
              backgroundColor: i === current ? 'var(--gold)' : 'rgba(250,247,242,0.45)',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 350ms ease',
            }}
          />
        ))}
      </div>
    </div>
  )
}

function ArrowButton({ direction, onClick }: { direction: 'left' | 'right'; onClick: () => void }) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute',
        top: '50%',
        [direction]: '20px',
        transform: 'translateY(-50%)',
        background: hovered ? 'rgba(250,247,242,0.95)' : 'rgba(250,247,242,0.18)',
        border: 'none',
        borderRadius: '50%',
        width: '44px',
        height: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: hovered ? 'var(--maroon)' : 'var(--ivory)',
        transition: 'all 220ms ease',
        backdropFilter: 'blur(4px)',
        zIndex: 10,
      }}
    >
      {direction === 'left' ? <ChevronLeft size={22} /> : <ChevronRight size={22} />}
    </button>
  )
}