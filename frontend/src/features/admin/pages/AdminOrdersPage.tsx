import { useCallback, useEffect, useState } from 'react'
import { fetchFromApi } from '../../../services/api'
import { useAuth } from '../../../context/AuthContext'

interface Order {
  id: number
  customer_name: string
  customer_email: string
  total_amount: number
  status: string
  payment_status: string
  shipping_address: string
  created_at?: string
  items: Array<{ product_name: string; quantity: number }>
}

const statuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']

export default function AdminOrdersPage() {
  const { token } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      setOrders(await fetchFromApi<Order[]>('/admin/orders', {}, token))
      setError('')
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load orders')
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => {
    // Synchronize order management with the authenticated admin session.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load()
  }, [load])

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetchFromApi(`/admin/orders/${id}/status?status_value=${encodeURIComponent(status)}`, { method: 'PATCH' }, token)
      await load()
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to update order')
    }
  }

  return (
    <main style={pageStyle}>
      <p style={eyebrowStyle}>Admin</p>
      <h1 style={headingStyle}>Orders</h1>
      {error && <p style={errorStyle}>{error}</p>}
      {loading ? <p>Loading orders...</p> : orders.length === 0 ? <p>No orders have been placed yet.</p> : (
        <div style={{ display: 'grid', gap: '18px' }}>
          {orders.map((order) => (
            <article key={order.id} style={panelStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '18px', flexWrap: 'wrap' }}>
                <div>
                  <p style={eyebrowStyle}>Order #{order.id}</p>
                  <h2 style={{ margin: '8px 0 4px', fontSize: '20px' }}>{order.customer_name}</h2>
                  <p style={{ margin: 0, color: 'rgba(28,28,30,0.65)' }}>{order.customer_email}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: 'var(--maroon)' }}>₹{order.total_amount}</p>
                  <select value={order.status} onChange={(event) => void updateStatus(order.id, event.target.value)} style={selectStyle}>
                    {statuses.map((status) => <option key={status} value={status}>{status[0].toUpperCase() + status.slice(1)}</option>)}
                  </select>
                </div>
              </div>
              <p style={{ margin: '16px 0 8px' }}><strong>Shipping:</strong> {order.shipping_address}</p>
              <p style={{ margin: 0 }}><strong>Items:</strong> {order.items.map((item) => `${item.product_name} x${item.quantity}`).join(', ')}</p>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}

const pageStyle = { maxWidth: '1200px', margin: '0 auto', padding: '48px 24px 80px' }
const eyebrowStyle = { margin: 0, fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--gold)', fontWeight: 700 }
const headingStyle = { margin: '10px 0 24px', fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 4vw, 48px)', color: 'var(--charcoal)' }
const panelStyle = { background: '#fffdfb', border: '1px solid rgba(44,31,24,0.08)', borderRadius: '18px', padding: '22px', boxShadow: '0 10px 30px rgba(18,12,11,0.04)' }
const selectStyle = { marginTop: '10px', padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(44,31,24,0.15)' }
const errorStyle = { color: '#991b1b', background: '#fee2e2', padding: '12px', borderRadius: '8px' }
