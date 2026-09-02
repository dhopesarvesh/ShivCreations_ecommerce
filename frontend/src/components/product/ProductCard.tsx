import { useCart } from '../../context/CartContext'
import type { Product } from '../../types'

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()

  return (
    <article
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
          style={{ width: '100%', height: '280px', objectFit: 'cover', display: 'block' }}
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
        <h2 style={{ margin: '10px 0 12px', fontSize: '20px', lineHeight: 1.3, color: 'var(--charcoal)' }}>
          {product.name}
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
          <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--maroon)' }}>₹{product.price}</span>
          {product.originalPrice && (
            <span style={{ fontSize: '14px', color: 'rgba(34,25,22,0.5)', textDecoration: 'line-through' }}>
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
            cursor: 'pointer',
          }}
        >
          Add to cart
        </button>
      </div>
    </article>
  )
}
