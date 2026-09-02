import { useEffect, useState } from 'react'
import HeroCarousel from '../../../components/common/HeroCarousel'
import { useCart } from '../../../context/CartContext'
import type { Product } from '../../../types'
import { fetchFromApi } from '../../../services/api'

export default function HomePage() {
  const { addToCart } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFromApi<Product[]>('/products/')
      .then((data) => {
        setProducts(data)
      })
      .catch((error) => {
        console.error('Failed to load products:', error)
        setProducts([])
      })
      .finally(() => setLoading(false))
  }, [])

  const featuredProducts = products.slice(0, 4)

  return (
    <main>
      <HeroCarousel />

      <section style={{ padding: '56px 24px 80px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              marginBottom: '28px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: '12px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'var(--gold)',
                  fontWeight: 700,
                }}
              >
                Featured picks
              </p>
              <h2
                style={{
                  margin: '10px 0 0',
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(28px, 4vw, 42px)',
                  color: 'var(--charcoal)',
                }}
              >
                Handpicked for your celebrations
              </h2>
            </div>
          </div>

          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--charcoal)' }}>Loading products...</p>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '24px',
              }}
            >
              {featuredProducts.map((product) => (
                <article
                  key={product.id}
                  style={{
                    background: '#fffdfb',
                    border: '1px solid rgba(44, 31, 24, 0.08)',
                    borderRadius: '18px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(18, 12, 11, 0.04)',
                  }}
                >
                  <div style={{ position: 'relative' }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '290px',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                    {product.badge && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '14px',
                          left: '14px',
                          backgroundColor: 'var(--saffron)',
                          color: '#fff',
                          padding: '6px 10px',
                          borderRadius: '999px',
                          fontSize: '10px',
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                        }}
                      >
                        {product.badge}
                      </span>
                    )}
                  </div>

                  <div style={{ padding: '18px 18px 20px' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        marginBottom: '10px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color: 'var(--gold)',
                        }}
                      >
                        {product.category}
                      </span>
                    </div>

                    <h3
                      style={{
                        margin: '0 0 12px',
                        fontSize: '20px',
                        lineHeight: 1.3,
                        color: 'var(--charcoal)',
                      }}
                    >
                      {product.name}
                    </h3>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        marginBottom: '18px',
                      }}
                    >
                      <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--maroon)' }}>
                        ₹{product.price}
                      </span>
                      {product.originalPrice && (
                        <span
                          style={{
                            fontSize: '14px',
                            color: 'rgba(34,25,22,0.5)',
                            textDecoration: 'line-through',
                          }}
                        >
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => addToCart(product)}
                      style={{
                        width: '100%',
                        border: 'none',
                        borderRadius: '10px',
                        backgroundColor: 'var(--saffron)',
                        color: '#fff',
                        fontWeight: 700,
                        padding: '12px 16px',
                        fontSize: '14px',
                        letterSpacing: '0.04em',
                        cursor: 'pointer',
                        transition: 'all 200ms ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--maroon)'
                        e.currentTarget.style.transform = 'translateY(-1px)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--saffron)'
                        e.currentTarget.style.transform = 'translateY(0)'
                      }}
                    >
                      Add to cart
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  )
}