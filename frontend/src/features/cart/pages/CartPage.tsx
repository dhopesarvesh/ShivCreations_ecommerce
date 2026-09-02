import { Link } from 'react-router-dom'
import { useCart } from '../../../context/CartContext'
import { fetchFromApi } from '../../../services/api'
import { useAuth } from '../../../context/AuthContext'
import { useState } from 'react'

export default function CartPage() {
  const { items, total, updateQuantity, removeFromCart, clearCart } = useCart()
  const { token } = useAuth()
  const [shippingAddress, setShippingAddress] = useState('')
  const [message, setMessage] = useState('')
  const [placingOrder, setPlacingOrder] = useState(false)

  const placeOrder = async () => {
    if (!shippingAddress.trim() || !token) {
      setMessage('Please enter a delivery address.')
      return
    }
    setPlacingOrder(true)
    try {
      await fetchFromApi('/orders/', {
        method: 'POST',
        body: JSON.stringify({
          shipping_address: shippingAddress,
          items: items.map(({ product, quantity }) => ({ product_id: product.id, quantity })),
        }),
      }, token)
      clearCart()
      setShippingAddress('')
      setMessage('Order placed successfully.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to place order.')
    } finally {
      setPlacingOrder(false)
    }
  }

  return (
    <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '56px 24px 80px' }}>
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
        Your basket
      </p>
      <h1
        style={{
          margin: '10px 0 30px',
          fontFamily: "'Playfair Display', serif",
          fontSize: 'clamp(32px, 5vw, 48px)',
          color: 'var(--charcoal)',
        }}
      >
        Shopping cart
      </h1>

      {items.length === 0 ? (
        <div style={{ background: '#fffdfb', borderRadius: '18px', padding: '48px 24px', textAlign: 'center' }}>
          <p style={{ fontSize: '18px', color: 'var(--charcoal)', margin: '0 0 22px' }}>
            Your cart is empty.
          </p>
          <Link
            to="/"
            style={{
              display: 'inline-block',
              background: 'var(--saffron)',
              color: '#fff',
              padding: '12px 20px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: 700,
            }}
          >
            Continue shopping
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '18px' }}>
          {items.map(({ product, quantity }) => (
            <article
              key={product.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '18px',
                background: '#fffdfb',
                border: '1px solid rgba(44, 31, 24, 0.08)',
                borderRadius: '14px',
                padding: '14px',
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                style={{ width: '88px', height: '88px', objectFit: 'cover', borderRadius: '10px' }}
              />
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: '0 0 6px', fontSize: '18px', color: 'var(--charcoal)' }}>
                  {product.name}
                </h2>
                <p style={{ margin: 0, color: 'var(--maroon)', fontWeight: 700 }}>₹{product.price}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  type="button"
                  aria-label={`Decrease ${product.name} quantity`}
                  onClick={() => updateQuantity(product.id, quantity - 1)}
                  style={{ width: '30px', height: '30px', cursor: 'pointer' }}
                >
                  -
                </button>
                <span aria-label={`${quantity} items`}>{quantity}</span>
                <button
                  type="button"
                  aria-label={`Increase ${product.name} quantity`}
                  onClick={() => updateQuantity(product.id, quantity + 1)}
                  style={{ width: '30px', height: '30px', cursor: 'pointer' }}
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={() => removeFromCart(product.id)}
                style={{ border: 'none', background: 'none', color: 'var(--maroon)', cursor: 'pointer' }}
              >
                Remove
              </button>
            </article>
          ))}

          <div style={{ textAlign: 'right', paddingTop: '12px' }}>
            <input value={shippingAddress} onChange={(event) => setShippingAddress(event.target.value)} placeholder="Delivery address" style={{ width: '100%', maxWidth: '420px', boxSizing: 'border-box', padding: '12px', borderRadius: '8px', border: '1px solid rgba(44,31,24,0.15)', marginBottom: '12px' }} />
            {message && <p role="alert" style={{ color: 'var(--maroon)' }}>{message}</p>}
            <p style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: 'var(--maroon)' }}>
              Total: ₹{total}
            </p>
            <button type="button" onClick={() => void placeOrder()} disabled={placingOrder} style={{ marginTop: '12px', border: 'none', borderRadius: '10px', padding: '12px 18px', background: 'var(--saffron)', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
              {placingOrder ? 'Placing order...' : 'Place order'}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
