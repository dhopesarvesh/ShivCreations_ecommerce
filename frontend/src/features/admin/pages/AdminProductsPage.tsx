import { useCallback, useEffect, useState } from 'react';
import { fetchFromApi, uploadImage } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

interface Product {
  id: number; name: string; description?: string; price: number; stock_quantity: number;
  image_url?: string; category_id: number; is_active: boolean;
}
interface Category { id: number; name: string; }
interface Form { name: string; description: string; price: string; stock_quantity: string; category_id: string; image_url: string; is_active: boolean; }
const emptyForm: Form = { name: '', description: '', price: '', stock_quantity: '0', category_id: '', image_url: '', is_active: true };

export default function AdminProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<Form>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const [nextProducts, nextCategories] = await Promise.all([
        fetchFromApi<Product[]>('/admin/products', {}, token),
        fetchFromApi<Category[]>('/admin/categories', {}, token),
      ]);
      setProducts(nextProducts); setCategories(nextCategories); setError('');
      setForm((current) => current.category_id || !nextCategories[0] ? current : { ...current, category_id: String(nextCategories[0].id) });
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load catalog');
    } finally { setLoading(false); }
  }, [token]);

  // Refresh the list after authentication and after each catalog mutation.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, [load]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setError('');
    const endpoint = editingId ? `/admin/products/${editingId}` : '/admin/products';
    try {
      const imageUrl = imageFile ? await uploadImage(imageFile, token) : form.image_url.trim() || null;
      await fetchFromApi(endpoint, {
        method: editingId ? 'PUT' : 'POST',
        body: JSON.stringify({
          name: form.name.trim(), description: form.description.trim() || null,
          price: Number(form.price), stock_quantity: Number(form.stock_quantity),
          category_id: Number(form.category_id), image_url: imageUrl, is_active: form.is_active,
        }),
      }, token);
      setForm({ ...emptyForm, category_id: categories[0] ? String(categories[0].id) : '' }); setImageFile(null); setEditingId(null); await load();
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : 'Unable to save product'); }
  };

  const edit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name, description: product.description || '', price: String(product.price),
      stock_quantity: String(product.stock_quantity), category_id: String(product.category_id),
      image_url: product.image_url || '', is_active: product.is_active,
    });
  };

  const remove = async (product: Product) => {
    if (!window.confirm(`Delete ${product.name}?`)) return;
    try { await fetchFromApi(`/admin/products/${product.id}`, { method: 'DELETE' }, token); await load(); }
    catch (requestError) { setError(requestError instanceof Error ? requestError.message : 'Unable to delete product'); }
  };

  return <main style={pageStyle}>
    <p style={eyebrowStyle}>Admin</p><h1 style={headingStyle}>Products</h1>
    {error && <p style={errorStyle}>{error}</p>}
    <div style={layoutStyle}>
      <section style={panelStyle}><h2 style={{ marginTop: 0 }}>{editingId ? 'Edit product' : 'Add product'}</h2>
        <form onSubmit={submit} style={formStyle}>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Product name" style={inputStyle} />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={3} style={inputStyle} />
          <input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Price" style={inputStyle} />
          <input required type="number" min="0" step="1" value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} placeholder="Stock quantity" style={inputStyle} />
          <select required value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })} style={inputStyle}><option value="">Select category</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select>
          <label style={fileLabelStyle}>Upload image from device<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => setImageFile(e.target.files?.[0] || null)} /></label>
          <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="Or paste a Drive/public image URL" style={inputStyle} />
          <label><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Active</label>
          <button type="submit" style={primaryButtonStyle}>{editingId ? 'Save changes' : 'Add product'}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setImageFile(null); setForm(emptyForm); }} style={secondaryButtonStyle}>Cancel</button>}
        </form>
      </section>
      <section style={{ ...panelStyle, overflowX: 'auto' }}>{loading ? <p>Loading products...</p> :
        <table style={{ width: '100%', borderCollapse: 'collapse' }}><thead><tr><th style={thStyle}>Product</th><th style={thStyle}>Price</th><th style={thStyle}>Stock</th><th style={thStyle}>Status</th><th style={thStyle}>Actions</th></tr></thead>
          <tbody>{products.map((product) => <tr key={product.id} style={{ borderTop: '1px solid rgba(44,31,24,0.08)' }}>
            <td style={tdStyle}><strong>{product.name}</strong><br /><small>{categories.find((category) => category.id === product.category_id)?.name || 'Unknown category'}</small></td><td style={tdStyle}>₹{product.price}</td><td style={tdStyle}>{product.stock_quantity}</td><td style={tdStyle}>{product.is_active ? 'Active' : 'Inactive'}</td><td style={tdStyle}><button type="button" onClick={() => edit(product)} style={linkButtonStyle}>Edit</button>{' '}<button type="button" onClick={() => void remove(product)} style={{ ...linkButtonStyle, color: '#991b1b' }}>Delete</button></td>
          </tr>)}</tbody></table>}
      </section>
    </div>
  </main>;
}

const pageStyle = { maxWidth: '1200px', margin: '0 auto', padding: '48px 24px 80px' };
const eyebrowStyle = { margin: 0, fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--gold)', fontWeight: 700 };
const headingStyle = { margin: '10px 0 24px', fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 4vw, 48px)', color: 'var(--charcoal)' };
const layoutStyle = { display: 'grid', gridTemplateColumns: 'minmax(280px, 360px) 1fr', gap: '24px' };
const panelStyle = { background: '#fffdfb', border: '1px solid rgba(44,31,24,0.08)', borderRadius: '18px', padding: '24px', boxShadow: '0 10px 30px rgba(18,12,11,0.04)' };
const formStyle = { display: 'grid', gap: '12px' };
const inputStyle = { width: '100%', boxSizing: 'border-box' as const, padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(44,31,24,0.12)', background: '#fff', fontSize: '14px' };
const primaryButtonStyle = { border: 'none', borderRadius: '12px', padding: '12px 18px', fontWeight: 700, color: '#fff', background: 'linear-gradient(135deg,var(--maroon),var(--gold))', cursor: 'pointer' };
const secondaryButtonStyle = { ...primaryButtonStyle, color: 'var(--charcoal)', background: '#fff', border: '1px solid rgba(44,31,24,0.2)' };
const linkButtonStyle = { border: 'none', background: 'transparent', padding: 0, fontWeight: 700, color: 'var(--maroon)', cursor: 'pointer' };
const thStyle = { padding: '12px 10px', textAlign: 'left' as const, fontSize: '12px', color: 'var(--maroon)' };
const tdStyle = { padding: '14px 10px', fontSize: '14px', color: 'var(--charcoal)' };
const errorStyle = { color: '#991b1b', background: '#fee2e2', padding: '12px', borderRadius: '8px' };
const fileLabelStyle = { display: 'grid', gap: '7px', fontSize: '13px', fontWeight: 600, color: 'var(--charcoal)' };
