import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { api } from '../../../services/api';

interface DashboardStats {
  total_users: number;
  total_products: number;
  total_categories: number;
  total_orders: number;
  total_revenue: number;
}

interface ProductRow {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock_quantity: number;
  image_url?: string;
  
  category_id: number;
  is_active: boolean;
}

interface CategoryRow {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  is_active: boolean;
}

interface UserRow {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
  status?: string;
}

interface OrderRow {
  id: number;
  user_id: number;
  total_amount: number;
  status: string;
  payment_status: string;
  shipping_address: string;
}

const initialProductForm = {
  name: '',
  description: '',
  price: '0',
  stock_quantity: '0',
  category_id: '1',
  image_url: '',
};

const initialCategoryForm = {
  name: '',
  description: '',
  image_url: '',
};

const fallbackStats: DashboardStats = {
  total_users: 4,
  total_products: 8,
  total_categories: 4,
  total_orders: 6,
  total_revenue: 12450,
};

const fallbackProducts: ProductRow[] = [
  { id: 1, name: 'Diwali Festival Kit', description: 'Festive rangoli starter pack', price: 349, stock_quantity: 28, image_url: '', category_id: 1, is_active: true },
  { id: 2, name: 'Floral Wall Rangoli', description: 'Elegant floral border design', price: 599, stock_quantity: 16, image_url: '', category_id: 2, is_active: true },
  { id: 3, name: '48-Shade Colour Set', description: 'Premium powder collection', price: 799, stock_quantity: 24, image_url: '', category_id: 3, is_active: true },
  { id: 4, name: 'Mandala Stencil Pack', description: 'Reusable stencil design pack', price: 249, stock_quantity: 35, image_url: '', category_id: 4, is_active: true },
];

const fallbackCategories: CategoryRow[] = [
  { id: 1, name: 'Flowers', description: 'Floral-inspired motifs', image_url: '', is_active: true },
  { id: 2, name: 'Letters', description: 'Custom name and message designs', image_url: '', is_active: true },
  { id: 3, name: 'Swastika', description: 'Auspicious symbol patterns', image_url: '', is_active: true },
  { id: 4, name: 'Festivals', description: 'Celebration-ready kits', image_url: '', is_active: true },
];

const fallbackUsers: UserRow[] = [
  { id: 1, name: 'Admin User', email: 'admin@shivcreations.com', role: 'admin', is_active: true },
  { id: 2, name: 'Demo User', email: 'user@shivcreations.com', role: 'user', is_active: true },
  { id: 3, name: 'Aisha Sharma', email: 'aisha@example.com', role: 'user', is_active: true },
  { id: 4, name: 'Rohit Verma', email: 'rohit@example.com', role: 'user', is_active: true },
];

function readStoredAdminUsers(): UserRow[] {
  if (typeof window === 'undefined') return fallbackUsers;

  const storedUsers = localStorage.getItem('shiv-creations-admin-users');
  if (!storedUsers) return fallbackUsers;

  try {
    const parsedUsers = JSON.parse(storedUsers);
    if (!Array.isArray(parsedUsers) || parsedUsers.length === 0) return fallbackUsers;

    return parsedUsers.map((user: Partial<UserRow>, index: number) => ({
      id: Number(user.id ?? index + 1),
      name: String(user.name ?? 'User'),
      email: String(user.email ?? `user${index + 1}@example.com`),
      role: String(user.role ?? 'user'),
      is_active: user.status === 'Pending' ? false : true,
    }));
  } catch {
    return fallbackUsers;
  }
}

const fallbackOrders: OrderRow[] = [
  { id: 1001, user_id: 3, total_amount: 1299, status: 'processing', payment_status: 'paid', shipping_address: 'Bengaluru, India' },
  { id: 1002, user_id: 4, total_amount: 899, status: 'shipped', payment_status: 'paid', shipping_address: 'Pune, India' },
  { id: 1003, user_id: 2, total_amount: 2450, status: 'delivered', payment_status: 'paid', shipping_address: 'Hyderabad, India' },
  { id: 1004, user_id: 3, total_amount: 1760, status: 'pending', payment_status: 'pending', shipping_address: 'Delhi, India' },
];

export default function AdminDashboardPage() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [productForm, setProductForm] = useState(initialProductForm);
  const [categoryForm, setCategoryForm] = useState(initialCategoryForm);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    const storedUsers = readStoredAdminUsers();

    if (!token) {
      setStats(fallbackStats);
      setProducts(fallbackProducts);
      setCategories(fallbackCategories);
      setUsers(storedUsers);
      setOrders(fallbackOrders);
      setLoading(false);
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    };

    try {
      const [dashboardRes, productsRes, categoriesRes, usersRes, ordersRes] = await Promise.all([
        fetch(`${api.baseURL}/admin/dashboard`, { headers }),
        fetch(`${api.baseURL}/admin/products`, { headers }),
        fetch(`${api.baseURL}/admin/categories`, { headers }),
        fetch(`${api.baseURL}/admin/users`, { headers }),
        fetch(`${api.baseURL}/admin/orders`, { headers }),
      ]);

      if (dashboardRes.ok) {
        const dashboard = await dashboardRes.json();
        setStats(dashboard.stats ?? fallbackStats);
      } else {
        setStats(fallbackStats);
      }

      if (productsRes.ok) {
        const nextProducts = await productsRes.json();
        setProducts(nextProducts.length ? nextProducts : fallbackProducts);
      } else {
        setProducts(fallbackProducts);
      }

      if (categoriesRes.ok) {
        const nextCategories = await categoriesRes.json();
        setCategories(nextCategories.length ? nextCategories : fallbackCategories);
      } else {
        setCategories(fallbackCategories);
      }

      if (usersRes.ok) {
        const nextUsers = await usersRes.json();
        setUsers(nextUsers.length ? nextUsers : storedUsers);
      } else {
        setUsers(storedUsers);
      }

      if (ordersRes.ok) {
        const nextOrders = await ordersRes.json();
        setOrders(nextOrders.length ? nextOrders : fallbackOrders);
      } else {
        setOrders(fallbackOrders);
      }
    } catch {
      setStats(fallbackStats);
      setProducts(fallbackProducts);
      setCategories(fallbackCategories);
      setUsers(storedUsers);
      setOrders(fallbackOrders);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    // Synchronize the dashboard with the authenticated admin session.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchDashboardData();
  }, [fetchDashboardData]);
  const canManage = useMemo(() => user?.role === 'admin', [user]);

  const handleCreateProduct = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) return;

    const payload = {
      name: productForm.name,
      description: productForm.description,
      price: Number(productForm.price),
      stock_quantity: Number(productForm.stock_quantity),
      category_id: Number(productForm.category_id),
      image_url: productForm.image_url,
    };

    const response = await fetch(`${api.baseURL}/admin/products`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setProductForm(initialProductForm);
      await fetchDashboardData();
    }
  };

  const handleCreateCategory = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token) return;

    const response = await fetch(`${api.baseURL}/admin/categories`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: categoryForm.name,
        description: categoryForm.description,
        image_url: categoryForm.image_url,
      }),
    });

    if (response.ok) {
      setCategoryForm(initialCategoryForm);
      await fetchDashboardData();
    }
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    if (!token) return;

    await fetch(`${api.baseURL}/admin/orders/${orderId}/status?status_value=${encodeURIComponent(status)}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    await fetchDashboardData();
  };

  if (!canManage) {
    return <div style={{ padding: '48px 24px', textAlign: 'center' }}>Admin access required.</div>;
  }

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px 80px' }}>
      <p style={{ margin: 0, fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 700 }}>
        Admin panel
      </p>
      <h1 style={{ margin: '10px 0 24px', fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 4vw, 48px)', color: 'var(--charcoal)' }}>
        Dashboard overview
      </h1>

      {loading ? (
        <p>Loading dashboard...</p>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '18px', marginBottom: '30px' }}>
            <StatCard label="Users" value={String(stats?.total_users ?? 0)} />
            <StatCard label="Products" value={String(stats?.total_products ?? 0)} />
            <StatCard label="Categories" value={String(stats?.total_categories ?? 0)} />
            <StatCard label="Orders" value={String(stats?.total_orders ?? 0)} />
            <StatCard label="Revenue" value={`₹${stats?.total_revenue ?? 0}`} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', marginBottom: '30px' }}>
            <Panel title="Add product">
              <form onSubmit={handleCreateProduct} style={{ display: 'grid', gap: '12px' }}>
                <input value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} placeholder="Product name" style={inputStyle} />
                <textarea value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} placeholder="Description" rows={3} style={inputStyle} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} placeholder="Price" style={inputStyle} />
                  <input type="number" value={productForm.stock_quantity} onChange={(e) => setProductForm({ ...productForm, stock_quantity: e.target.value })} placeholder="Stock" style={inputStyle} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <input type="number" value={productForm.category_id} onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })} placeholder="Category ID" style={inputStyle} />
                  <input value={productForm.image_url} onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })} placeholder="Image URL" style={inputStyle} />
                </div>
                <button type="submit" style={primaryButtonStyle}>Create product</button>
              </form>
            </Panel>

            <Panel title="Add category">
              <form onSubmit={handleCreateCategory} style={{ display: 'grid', gap: '12px' }}>
                <input value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} placeholder="Category name" style={inputStyle} />
                <textarea value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} placeholder="Category description" rows={3} style={inputStyle} />
                <input value={categoryForm.image_url} onChange={(e) => setCategoryForm({ ...categoryForm, image_url: e.target.value })} placeholder="Category image URL" style={inputStyle} />
                <button type="submit" style={primaryButtonStyle}>Create category</button>
              </form>
            </Panel>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
            <Panel title="Products">
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Name</th>
                      <th style={thStyle}>Price</th>
                      <th style={thStyle}>Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td style={tdStyle}>{product.name}</td>
                        <td style={tdStyle}>₹{product.price}</td>
                        <td style={tdStyle}>{product.stock_quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>

            <Panel title="Users">
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Name</th>
                      <th style={thStyle}>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((item) => (
                      <tr key={item.id}>
                        <td style={tdStyle}>{item.name}</td>
                        <td style={tdStyle}>{item.role}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>

          <div style={{ marginTop: '30px' }}>
            <Panel title="Categories">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {categories.map((category) => (
                  <span key={category.id} style={{ background: '#f4eee6', borderRadius: '999px', padding: '8px 12px', fontSize: '13px', color: 'var(--charcoal)' }}>
                    {category.name}
                  </span>
                ))}
              </div>
            </Panel>
          </div>

          <div style={{ marginTop: '30px' }}>
            <Panel title="Orders management">
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Order ID</th>
                      <th style={thStyle}>User</th>
                      <th style={thStyle}>Amount</th>
                      <th style={thStyle}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id}>
                        <td style={tdStyle}>#{order.id}</td>
                        <td style={tdStyle}>{order.user_id}</td>
                        <td style={tdStyle}>₹{order.total_amount}</td>
                        <td style={tdStyle}>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            style={{ padding: '8px 10px', borderRadius: '8px', border: '1px solid rgba(44,31,24,0.1)' }}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: '#fffdfb', border: '1px solid rgba(44,31,24,0.08)', borderRadius: '18px', padding: '20px 18px' }}>
      <p style={{ margin: 0, color: 'var(--gold)', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{label}</p>
      <h3 style={{ margin: '12px 0 0', fontSize: '30px', color: 'var(--charcoal)' }}>{value}</h3>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ background: '#fffdfb', border: '1px solid rgba(44,31,24,0.08)', borderRadius: '18px', padding: '20px' }}>
      <h2 style={{ margin: '0 0 16px', fontSize: '20px', color: 'var(--charcoal)' }}>{title}</h2>
      {children}
    </section>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%', boxSizing: 'border-box', border: '1px solid rgba(44,31,24,0.14)', borderRadius: '10px', padding: '11px 12px', background: '#fff', color: 'var(--charcoal)', resize: 'vertical', font: 'inherit',
};

const primaryButtonStyle: React.CSSProperties = {
  border: 'none', borderRadius: '10px', background: 'var(--saffron)', color: '#fff', padding: '12px 18px', fontWeight: 700, cursor: 'pointer',
};

const thStyle: React.CSSProperties = {
  textAlign: 'left', padding: '10px 8px', borderBottom: '1px solid rgba(44,31,24,0.08)', color: 'var(--charcoal)', fontSize: '12px', letterSpacing: '0.08em', textTransform: 'uppercase',
};

const tdStyle: React.CSSProperties = {
  padding: '12px 8px', borderBottom: '1px solid rgba(44,31,24,0.06)', color: 'var(--charcoal)', fontSize: '14px',
};
