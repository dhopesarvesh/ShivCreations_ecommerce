import { useCallback, useEffect, useState } from 'react'
import { fetchFromApi } from '../../../services/api'
import { useAuth } from '../../../context/AuthContext'

interface Order {
  id: number
  total_amount: number
  status: string
  payment_status: string
  shipping_address: string
  created_at?: string
  items: Array<{ product_name: string; quantity: number; price: number }>
}

export default function OrdersPage() {
  const { token } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [error, setError] = useState('')
  const load = useCallback(async () => {
    if (!token) return
    try { setOrders(await fetchFromApi<Order[]>('/orders/', {}, token)) }
    catch (requestError) { setError(requestError instanceof Error ? requestError.message : 'Unable to load orders') }
  }, [token])
  useEffect(() => {
    // Load only the signed-in customer's orders.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [load])

  return <main style={pageStyle}><p style={eyebrowStyle}>Your account</p><h1 style={headingStyle}>My orders</h1>
    {error && <p style={errorStyle}>{error}</p>}
    {!error && orders.length === 0 ? <p>You have not placed any orders yet.</p> : <div style={{ display: 'grid', gap: '18px' }}>{orders.map((order) => <article key={order.id} style={panelStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}><div><p style={eyebrowStyle}>Order #{order.id}</p><p style={{ margin: '8px 0 0', color: 'rgba(28,28,30,0.65)' }}>{order.created_at ? new Date(order.created_at).toLocaleDateString() : ''}</p></div><div style={{ textAlign: 'right' }}><strong style={{ color: 'var(--maroon)', fontSize: '20px' }}>₹{order.total_amount}</strong><p style={{ margin: '6px 0 0', textTransform: 'capitalize' }}>{order.status}</p></div></div>
      <p><strong>Items:</strong> {order.items.map((item) => `${item.product_name} x${item.quantity}`).join(', ')}</p><p style={{ marginBottom: 0 }}><strong>Delivering to:</strong> {order.shipping_address}</p>
    </article>)}</div>}
  </main>
}
const pageStyle = { maxWidth: '900px', margin: '0 auto', padding: '48px 24px 80px' }
const eyebrowStyle = { margin: 0, fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--gold)', fontWeight: 700 }
const headingStyle = { margin: '10px 0 24px', fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 4vw, 48px)', color: 'var(--charcoal)' }
const panelStyle = { background: '#fffdfb', border: '1px solid rgba(44,31,24,0.08)', borderRadius: '18px', padding: '22px', boxShadow: '0 10px 30px rgba(18,12,11,0.04)' }
const errorStyle = { color: '#991b1b', background: '#fee2e2', padding: '12px', borderRadius: '8px' }
