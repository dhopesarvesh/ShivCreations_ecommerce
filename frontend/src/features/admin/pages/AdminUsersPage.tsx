import { useCallback, useEffect, useState } from 'react';
import { fetchFromApi } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';

type UserRole = 'admin' | 'customer';
interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at?: string | null;
}
interface UserForm {
  name: string;
  email: string;
  role: UserRole;
  password: string;
  is_active: boolean;
}

const emptyForm: UserForm = { name: '', email: '', role: 'customer', password: '', is_active: true };

export default function AdminUsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [form, setForm] = useState<UserForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadUsers = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      setUsers(await fetchFromApi<AdminUser[]>('/admin/users', {}, token));
      setError('');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load users');
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Load the database-backed list whenever the authenticated admin changes.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void loadUsers(); }, [loadUsers]);

  const submitUser = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    const endpoint = editingId ? `/admin/users/${editingId}` : '/admin/users';
    const method = editingId ? 'PUT' : 'POST';
    try {
      await fetchFromApi<AdminUser>(endpoint, {
        method,
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          role: form.role,
          password: form.password || null,
          is_active: form.is_active,
        }),
      }, token);
      setForm(emptyForm);
      setEditingId(null);
      await loadUsers();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save user');
    }
  };

  const editUser = (user: AdminUser) => {
    setEditingId(user.id);
    setForm({ name: user.name, email: user.email, role: user.role, password: '', is_active: user.is_active });
  };

  const deleteUser = async (user: AdminUser) => {
    if (!window.confirm(`Delete ${user.name}?`)) return;
    try {
      await fetchFromApi(`/admin/users/${user.id}`, { method: 'DELETE' }, token);
      await loadUsers();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to delete user');
    }
  };

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '48px 24px 80px' }}>
      <p style={eyebrowStyle}>Admin</p>
      <h1 style={headingStyle}>Users</h1>
      {error && <p style={{ color: '#991b1b', background: '#fee2e2', padding: '12px', borderRadius: '8px' }}>{error}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 360px) 1fr', gap: '24px' }}>
        <section style={panelStyle}>
          <h2 style={{ marginTop: 0 }}>{editingId ? 'Edit user' : 'Add user'}</h2>
          <form onSubmit={submitUser} style={{ display: 'grid', gap: '12px' }}>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" style={inputStyle} />
            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email address" style={inputStyle} />
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })} style={inputStyle}>
              <option value="customer">Customer</option><option value="admin">Admin</option>
            </select>
            <input required={!editingId} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder={editingId ? 'New password (optional)' : 'Password'} style={inputStyle} />
            <label><input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} /> Active</label>
            <button type="submit" style={primaryButtonStyle}>{editingId ? 'Save changes' : 'Add user'}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }} style={secondaryButtonStyle}>Cancel</button>}
          </form>
        </section>
        <section style={{ ...panelStyle, overflowX: 'auto' }}>
          {loading ? <p>Loading users...</p> : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr><th style={thStyle}>Name</th><th style={thStyle}>Email</th><th style={thStyle}>Role</th><th style={thStyle}>Status</th><th style={thStyle}>Actions</th></tr></thead>
              <tbody>{users.map((user) => <tr key={user.id} style={{ borderTop: '1px solid rgba(44,31,24,0.08)' }}>
                <td style={tdStyle}>{user.name}</td><td style={tdStyle}>{user.email}</td><td style={tdStyle}>{user.role === 'admin' ? 'Admin' : 'Customer'}</td>
                <td style={tdStyle}>{user.is_active ? 'Active' : 'Inactive'}</td>
                <td style={tdStyle}><button type="button" onClick={() => editUser(user)} style={linkButtonStyle}>Edit</button>{' '}<button type="button" onClick={() => void deleteUser(user)} style={{ ...linkButtonStyle, color: '#991b1b' }}>Delete</button></td>
              </tr>)}</tbody>
            </table>
          )}
        </section>
      </div>
    </main>
  );
}

const eyebrowStyle = { margin: 0, fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: 'var(--gold)', fontWeight: 700 };
const headingStyle = { margin: '10px 0 24px', fontFamily: "'Playfair Display', serif", fontSize: 'clamp(32px, 4vw, 48px)', color: 'var(--charcoal)' };
const panelStyle = { background: '#fffdfb', border: '1px solid rgba(44,31,24,0.08)', borderRadius: '18px', padding: '24px', boxShadow: '0 10px 30px rgba(18, 12, 11, 0.04)' };
const inputStyle = { width: '100%', boxSizing: 'border-box' as const, padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(44,31,24,0.12)', background: '#fff', fontSize: '14px', color: 'var(--charcoal)' };
const primaryButtonStyle = { border: 'none', borderRadius: '12px', padding: '12px 18px', fontWeight: 700, color: '#fff', background: 'linear-gradient(135deg, var(--maroon), var(--gold))', cursor: 'pointer' };
const secondaryButtonStyle = { ...primaryButtonStyle, color: 'var(--charcoal)', background: '#fff', border: '1px solid rgba(44,31,24,0.2)' };
const thStyle = { padding: '16px 18px', textAlign: 'left' as const, fontSize: '12px', color: 'var(--maroon)' };
const tdStyle = { padding: '16px 18px', fontSize: '14px', color: 'var(--charcoal)' };
const linkButtonStyle = { border: 'none', background: 'transparent', padding: 0, fontWeight: 700, color: 'var(--maroon)', cursor: 'pointer' };
