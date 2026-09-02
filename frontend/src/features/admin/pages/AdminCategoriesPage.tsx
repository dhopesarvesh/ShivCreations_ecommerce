import { useCallback, useEffect, useState } from 'react';
import { fetchFromApi, uploadImage } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

interface Category { id: number; name: string; description?: string; image_url?: string; is_active: boolean; product_count?: number; }
interface Form { name: string; description: string; image_url: string; is_active: boolean; }
const emptyForm: Form = { name: '', description: '', image_url: '', is_active: true };

export default function AdminCategoriesPage() {
  const { token } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<Form>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try { setCategories(await fetchFromApi<Category[]>('/admin/categories', {}, token)); setError(''); }
    catch (requestError) { setError(requestError instanceof Error ? requestError.message : 'Unable to load categories'); }
    finally { setLoading(false); }
  }, [token]);
  // Refresh the list after authentication and after each catalog mutation.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void load(); }, [load]);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setError('');
    try {
      const imageUrl = imageFile ? await uploadImage(imageFile, token) : form.image_url.trim() || null;
      await fetchFromApi(editingId ? `/admin/categories/${editingId}` : '/admin/categories', {
        method: editingId ? 'PUT' : 'POST',
        body: JSON.stringify({ name: form.name.trim(), description: form.description.trim() || null, image_url: imageUrl, is_active: form.is_active }),
      }, token);
      setForm(emptyForm); setImageFile(null); setEditingId(null); await load();
    } catch (requestError) { setError(requestError instanceof Error ? requestError.message : 'Unable to save category'); }
  };
  const remove = async (category: Category) => {
    if (!window.confirm(`Delete ${category.name}?`)) return;
    try { await fetchFromApi(`/admin/categories/${category.id}`, { method: 'DELETE' }, token); await load(); }
    catch (requestError) { setError(requestError instanceof Error ? requestError.message : 'Unable to delete category'); }
  };
  return <main style={pageStyle}><p style={eyebrowStyle}>Admin</p><h1 style={headingStyle}>Categories</h1>
    {error && <p style={errorStyle}>{error}</p>}
    <div style={layoutStyle}><section style={panelStyle}><h2 style={{ marginTop: 0 }}>{editingId ? 'Edit category' : 'Add category'}</h2>
      <form onSubmit={submit} style={formStyle}><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Category name" style={inputStyle} /><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={4} style={inputStyle} /><label style={fileLabelStyle}>Upload image from device<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(e) => setImageFile(e.target.files?.[0] || null)} /></label><input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="Or paste a Drive/public image URL" style={inputStyle} /><label><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Active</label><button type="submit" style={primaryButtonStyle}>{editingId ? 'Save changes' : 'Add category'}</button>{editingId && <button type="button" onClick={() => { setEditingId(null); setImageFile(null); setForm(emptyForm); }} style={secondaryButtonStyle}>Cancel</button>}</form>
    </section><section style={{ ...panelStyle, overflowX: 'auto' }}>{loading ? <p>Loading categories...</p> : <table style={{ width: '100%', borderCollapse: 'collapse' }}><thead><tr><th style={thStyle}>Name</th><th style={thStyle}>Description</th><th style={thStyle}>Products</th><th style={thStyle}>Status</th><th style={thStyle}>Actions</th></tr></thead><tbody>{categories.map((category) => <tr key={category.id} style={{ borderTop: '1px solid rgba(44,31,24,0.08)' }}><td style={tdStyle}>{category.name}</td><td style={tdStyle}>{category.description || '-'}</td><td style={tdStyle}>{category.product_count ?? 0}</td><td style={tdStyle}>{category.is_active ? 'Active' : 'Inactive'}</td><td style={tdStyle}><button type="button" onClick={() => { setEditingId(category.id); setForm({ name: category.name, description: category.description || '', image_url: category.image_url || '', is_active: category.is_active }); }} style={linkButtonStyle}>Edit</button>{' '}<button type="button" onClick={() => void remove(category)} style={{ ...linkButtonStyle, color: '#991b1b' }}>Delete</button></td></tr>)}</tbody></table>}</section></div>
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
