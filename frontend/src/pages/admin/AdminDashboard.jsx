import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5032/api';
const SIZES = ['36','37','38','39','40','41','42','43','44','45','46'];

const getAuth = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('vh24_admin_token')}` }
});

const defaultForm = {
  name: '', brand_id: '', category_id: '',
  price: '', sale_price: '', description: '',
  stock: 100, rating: 5.0, reviews_count: 0,
  is_featured: false, is_new: false,
  sizes: [], colors: [],
};

// ── Inline sub-components ──────────────────────────────────────────────────

function StatCard({ label, value, color }) {
  return (
    <div className="bg-white rounded-2xl p-5" style={{ border: '1px solid rgba(5,5,31,0.08)' }}>
      <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#718096' }}>{label}</p>
      <p className="text-2xl font-black" style={{ color: color || '#05051F' }}>{value}</p>
    </div>
  );
}

function TagInput({ tags, onChange, placeholder }) {
  const [input, setInput] = useState('');
  const add = () => {
    const v = input.trim();
    if (v && !tags.includes(v)) onChange([...tags, v]);
    setInput('');
  };
  return (
    <div>
      <div className="flex flex-wrap gap-1.5 mb-2">
        {tags.map(t => (
          <span key={t} className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: 'rgba(42,174,223,0.1)', color: '#2AAEDF' }}>
            {t}
            <button type="button" onClick={() => onChange(tags.filter(x => x !== t))}
              className="opacity-60 hover:opacity-100 ml-0.5">×</button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder={placeholder}
          className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none"
          style={{ borderColor: '#E2E8F0' }}
          onFocus={e => e.target.style.borderColor = '#2AAEDF'}
          onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
        <button type="button" onClick={add}
          className="px-3 py-2 rounded-lg text-sm font-bold text-white"
          style={{ backgroundColor: '#2AAEDF' }}>+</button>
      </div>
    </div>
  );
}

function ImageUploadArea({ existingImages, onRemoveExisting, newFiles, onAddFiles, onRemoveNew, uploading }) {
  const fileRef = useRef();
  const allCount = existingImages.length + newFiles.length;

  return (
    <div>
      <p className="text-xs text-gray-500 mb-2">
        {allCount} ảnh · Ảnh đầu tiên là ảnh chính
      </p>
      <div className="grid grid-cols-3 gap-2 mb-3">
        {/* Existing images */}
        {existingImages.map((url, i) => (
          <div key={`ex-${i}`} className="relative group aspect-square rounded-xl overflow-hidden"
            style={{ backgroundColor: '#F7F9FC', border: '1px solid rgba(5,5,31,0.08)' }}>
            <img src={url} alt="" className="w-full h-full object-contain p-2"
              onError={e => e.target.src = 'https://placehold.co/120x120/EBF8FD/2AAEDF?text=IMG'} />
            {i === 0 && (
              <span className="absolute top-1 left-1 text-xs font-bold px-1.5 py-0.5 rounded"
                style={{ backgroundColor: '#2AAEDF', color: '#fff' }}>Chính</span>
            )}
            <button type="button" onClick={() => onRemoveExisting(i)}
              className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ backgroundColor: '#EF4444', color: '#fff' }}>×</button>
          </div>
        ))}
        {/* New file previews */}
        {newFiles.map((f, i) => (
          <div key={`new-${i}`} className="relative group aspect-square rounded-xl overflow-hidden"
            style={{ backgroundColor: '#F7F9FC', border: '2px dashed #2AAEDF' }}>
            <img src={f.preview} alt="" className="w-full h-full object-contain p-2" />
            <span className="absolute top-1 left-1 text-xs font-bold px-1.5 py-0.5 rounded"
              style={{ backgroundColor: 'rgba(42,174,223,0.8)', color: '#fff' }}>Mới</span>
            <button type="button" onClick={() => onRemoveNew(i)}
              className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ backgroundColor: '#EF4444', color: '#fff' }}>×</button>
          </div>
        ))}
        {/* Add button */}
        <button type="button" onClick={() => fileRef.current.click()}
          className="aspect-square rounded-xl flex flex-col items-center justify-center gap-1 transition-all"
          style={{ border: '2px dashed rgba(5,5,31,0.15)', color: '#718096' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = '#2AAEDF'; e.currentTarget.style.color = '#2AAEDF'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(5,5,31,0.15)'; e.currentTarget.style.color = '#718096'; }}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
          </svg>
          <span className="text-xs font-semibold">Thêm ảnh</span>
        </button>
      </div>
      {uploading && (
        <div className="flex items-center gap-2 text-sm" style={{ color: '#2AAEDF' }}>
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          Đang tải ảnh lên Cloudinary...
        </div>
      )}
      <input ref={fileRef} type="file" multiple accept="image/*" className="hidden"
        onChange={e => { onAddFiles(Array.from(e.target.files)); e.target.value = ''; }} />
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('');

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [existingImages, setExistingImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  // Delete confirm
  const [deleteId, setDeleteId] = useState(null);

  // Toast
  const [toast, setToast] = useState('');
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [p, b, c] = await Promise.all([
        axios.get(`${API}/admin/products`, getAuth()),
        axios.get(`${API}/admin/brands`, getAuth()),
        axios.get(`${API}/admin/categories`, getAuth()),
      ]);
      setProducts(p.data);
      setBrands(b.data);
      setCats(c.data);
    } catch (err) {
      if (err.response?.status === 401) { navigate('/admin/login'); }
    } finally { setLoading(false); }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem('vh24_admin_token');
    if (!token) { navigate('/admin/login'); return; }
    fetchAll();
  }, [fetchAll, navigate]);

  const logout = () => {
    localStorage.removeItem('vh24_admin_token');
    localStorage.removeItem('vh24_admin_user');
    navigate('/admin/login');
  };

  const openAdd = () => {
    setEditId(null);
    setForm({ ...defaultForm, brand_id: brands[0]?.id || '', category_id: cats[0]?.id || '' });
    setExistingImages([]);
    setNewFiles([]);
    setFormError('');
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditId(p.id);
    setForm({
      name: p.name, brand_id: p.brand_id, category_id: p.category_id,
      price: p.price, sale_price: p.sale_price || '',
      description: p.description || '', stock: p.stock,
      rating: p.rating, reviews_count: p.reviews_count,
      is_featured: p.is_featured === 1, is_new: p.is_new === 1,
      sizes: p.sizes || [], colors: p.colors || [],
    });
    const imgs = [p.image, ...(p.images || [])].filter(Boolean);
    setExistingImages(imgs);
    setNewFiles([]);
    setFormError('');
    setShowForm(true);
  };

  const closeForm = () => {
    newFiles.forEach(f => URL.revokeObjectURL(f.preview));
    setNewFiles([]);
    setShowForm(false);
  };

  const handleAddFiles = (files) => {
    const previews = files.map(f => ({ file: f, preview: URL.createObjectURL(f) }));
    setNewFiles(prev => [...prev, ...previews]);
  };

  const handleSave = async () => {
    if (!form.name.trim()) { setFormError('Vui lòng nhập tên sản phẩm'); return; }
    if (!form.price) { setFormError('Vui lòng nhập giá sản phẩm'); return; }
    setFormError('');
    setSaving(true);

    try {
      // 1. Upload new images
      const uploadedUrls = [];
      if (newFiles.length > 0) {
        setUploading(true);
        for (const { file } of newFiles) {
          const fd = new FormData();
          fd.append('image', file);
          const res = await axios.post(`${API}/admin/upload`, fd, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('vh24_admin_token')}`,
              'Content-Type': 'multipart/form-data',
            },
          });
          uploadedUrls.push(res.data.url);
        }
        setUploading(false);
      }

      // 2. Combine images
      const allImages = [...existingImages, ...uploadedUrls];
      const payload = {
        ...form,
        price: Number(form.price),
        sale_price: form.sale_price ? Number(form.sale_price) : null,
        stock: Number(form.stock) || 0,
        image: allImages[0] || '',
        images: allImages.slice(1),
      };

      if (editId) {
        await axios.put(`${API}/admin/products/${editId}`, payload, getAuth());
        showToast('✅ Đã cập nhật sản phẩm!');
      } else {
        await axios.post(`${API}/admin/products`, payload, getAuth());
        showToast('✅ Đã thêm sản phẩm!');
      }

      closeForm();
      fetchAll();
    } catch (err) {
      setFormError(err.response?.data?.error || 'Lỗi: ' + err.message);
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API}/admin/products/${deleteId}`, getAuth());
      setDeleteId(null);
      fetchAll();
      showToast('🗑️ Đã xóa sản phẩm!');
    } catch { setDeleteId(null); }
  };

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand_name || '').toLowerCase().includes(search.toLowerCase());
    const matchBrand = !brandFilter || String(p.brand_id) === brandFilter;
    return matchSearch && matchBrand;
  });

  const lowStock = products.filter(p => p.stock <= 10 && p.stock > 0).length;
  const outOfStock = products.filter(p => p.stock <= 0).length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F9FC' }}>
      {/* ── Admin Navbar ── */}
      <nav className="sticky top-0 z-40 shadow-lg" style={{ backgroundColor: '#05051F' }}>
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="VH24" className="h-8 w-8 rounded-lg object-cover" />
            <div>
              <p className="font-black text-white text-sm leading-none">VH24 SPORT</p>
              <p className="text-xs" style={{ color: '#2AAEDF' }}>Admin Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
              {localStorage.getItem('vh24_admin_user')}
            </span>
            <Link to="/" target="_blank"
              className="text-xs px-3 py-1.5 rounded-lg transition-colors"
              style={{ color: 'rgba(255,255,255,0.6)', backgroundColor: 'rgba(255,255,255,0.07)' }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}>
              🌐 Xem web
            </Link>
            <button onClick={logout}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
              style={{ backgroundColor: 'rgba(239,68,68,0.12)', color: '#EF4444' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.25)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.12)'}>
              Đăng xuất
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ── Stats ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard label="Tổng sản phẩm" value={products.length} color="#05051F" />
          <StatCard label="Thương hiệu" value={brands.length} color="#2AAEDF" />
          <StatCard label="Sắp hết hàng" value={lowStock} color="#F59E0B" />
          <StatCard label="Hết hàng" value={outOfStock} color="#EF4444" />
        </div>

        {/* ── Toolbar ── */}
        <div className="flex flex-wrap gap-3 items-center justify-between mb-5">
          <div className="flex flex-wrap gap-2">
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="🔍  Tìm sản phẩm, thương hiệu..."
              className="border rounded-xl px-4 py-2.5 text-sm w-60 outline-none transition-colors"
              style={{ borderColor: '#E2E8F0', backgroundColor: '#fff' }}
              onFocus={e => e.target.style.borderColor = '#2AAEDF'}
              onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
            <select value={brandFilter} onChange={e => setBrandFilter(e.target.value)}
              className="border rounded-xl px-3 py-2.5 text-sm bg-white outline-none cursor-pointer"
              style={{ borderColor: '#E2E8F0' }}>
              <option value="">Tất cả thương hiệu</option>
              {brands.map(b => <option key={b.id} value={String(b.id)}>{b.name}</option>)}
            </select>
          </div>
          <button onClick={openAdd}
            className="flex items-center gap-2 font-bold text-sm px-5 py-2.5 rounded-xl text-white transition-colors"
            style={{ backgroundColor: '#2AAEDF' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2093BE'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2AAEDF'}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4"/>
            </svg>
            Thêm sản phẩm
          </button>
        </div>

        {/* ── Product Table ── */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid rgba(5,5,31,0.08)' }}>
          {loading ? (
            <div className="py-20 flex justify-center">
              <svg className="w-8 h-8 animate-spin" style={{ color: '#2AAEDF' }} fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ backgroundColor: '#F7F9FC', borderBottom: '1px solid rgba(5,5,31,0.08)' }}>
                    {['Sản phẩm', 'Thương hiệu', 'Loại sân', 'Giá bán', 'Tồn kho', 'Trạng thái', 'Thao tác'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider"
                        style={{ color: '#718096' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors"
                      style={{ borderBottom: '1px solid rgba(5,5,31,0.04)' }}>
                      {/* Product */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={p.image || 'https://placehold.co/48/EBF8FD/2AAEDF?text=VH'}
                            alt={p.name}
                            className="w-12 h-12 object-contain rounded-xl flex-shrink-0 p-1"
                            style={{ backgroundColor: '#F7F9FC', border: '1px solid rgba(5,5,31,0.06)' }}
                            onError={e => e.target.src = 'https://placehold.co/48/EBF8FD/2AAEDF?text=VH'} />
                          <div className="min-w-0">
                            <p className="font-semibold text-sm line-clamp-2 leading-snug" style={{ color: '#05051F' }}>
                              {p.name}
                            </p>
                            <p className="text-xs mt-0.5" style={{ color: '#718096' }}>
                              {[p.images?.length > 0 ? `${1 + (p.images?.length || 0)} ảnh` : '1 ảnh'].join(' · ')}
                            </p>
                          </div>
                        </div>
                      </td>
                      {/* Brand */}
                      <td className="px-4 py-3 text-sm" style={{ color: '#4A5568' }}>{p.brand_name}</td>
                      {/* Category */}
                      <td className="px-4 py-3 text-sm" style={{ color: '#4A5568' }}>{p.category_name}</td>
                      {/* Price */}
                      <td className="px-4 py-3">
                        <p className="font-bold text-sm" style={{ color: '#2AAEDF' }}>
                          {(p.sale_price || p.price).toLocaleString()}đ
                        </p>
                        {p.sale_price && (
                          <p className="text-xs line-through" style={{ color: '#718096' }}>{p.price.toLocaleString()}đ</p>
                        )}
                      </td>
                      {/* Stock */}
                      <td className="px-4 py-3">
                        <span className="text-sm font-bold"
                          style={{ color: p.stock <= 0 ? '#EF4444' : p.stock <= 10 ? '#F59E0B' : '#22C55E' }}>
                          {p.stock}
                        </span>
                      </td>
                      {/* Status badges */}
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-1">
                          {p.is_featured === 1 && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full w-fit"
                              style={{ backgroundColor: 'rgba(42,174,223,0.1)', color: '#2AAEDF' }}>Nổi bật</span>
                          )}
                          {p.is_new === 1 && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full w-fit"
                              style={{ backgroundColor: 'rgba(5,5,31,0.08)', color: '#05051F' }}>Mới</span>
                          )}
                        </div>
                      </td>
                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEdit(p)}
                            className="text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                            style={{ backgroundColor: 'rgba(42,174,223,0.1)', color: '#2AAEDF' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(42,174,223,0.2)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(42,174,223,0.1)'}>
                            ✏️ Sửa
                          </button>
                          <button onClick={() => setDeleteId(p.id)}
                            className="text-xs font-bold px-3 py-1.5 rounded-lg transition-colors"
                            style={{ backgroundColor: 'rgba(239,68,68,0.08)', color: '#EF4444' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.18)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.08)'}>
                            🗑️ Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && !loading && (
                    <tr>
                      <td colSpan={7} className="text-center py-16" style={{ color: '#718096' }}>
                        <p className="text-3xl mb-2">📦</p>
                        Không tìm thấy sản phẩm
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <p className="text-xs mt-3 text-right" style={{ color: '#718096' }}>
          Hiển thị {filtered.length} / {products.length} sản phẩm
        </p>
      </div>

      {/* ── Delete Confirm Dialog ── */}
      {deleteId && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={() => setDeleteId(null)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-7 max-w-sm w-full shadow-2xl">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: 'rgba(239,68,68,0.1)' }}>
                <svg className="w-6 h-6" style={{ color: '#EF4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </div>
              <h3 className="font-black text-lg text-center mb-1" style={{ color: '#05051F' }}>Xóa sản phẩm?</h3>
              <p className="text-sm text-center mb-6" style={{ color: '#718096' }}>
                Hành động này không thể hoàn tác.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)}
                  className="flex-1 py-3 rounded-xl font-semibold text-sm border-2 transition-colors"
                  style={{ borderColor: '#E2E8F0', color: '#4A5568' }}>
                  Hủy
                </button>
                <button onClick={handleDelete}
                  className="flex-1 py-3 rounded-xl font-bold text-sm text-white transition-colors"
                  style={{ backgroundColor: '#EF4444' }}>
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Product Form Drawer ── */}
      {showForm && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={closeForm} />
          <div className="fixed right-0 top-0 h-full w-full max-w-xl bg-white z-50 shadow-2xl flex flex-col">
            {/* Drawer header */}
            <div className="flex items-center justify-between p-5 border-b" style={{ backgroundColor: '#05051F' }}>
              <div>
                <p className="font-black text-white">{editId ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {editId ? 'Cập nhật thông tin & hình ảnh' : 'Điền thông tin sản phẩm'}
                </p>
              </div>
              <button onClick={closeForm}
                className="p-2 rounded-lg transition-opacity opacity-60 hover:opacity-100"
                style={{ color: '#fff' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Drawer body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {formError && (
                <div className="p-3 rounded-xl text-sm font-medium"
                  style={{ backgroundColor: 'rgba(239,68,68,0.08)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                  {formError}
                </div>
              )}

              {/* ── Hình ảnh ── */}
              <section>
                <h3 className="font-black text-sm uppercase tracking-wider mb-3" style={{ color: '#05051F' }}>
                  📷 Hình ảnh sản phẩm
                </h3>
                <ImageUploadArea
                  existingImages={existingImages}
                  onRemoveExisting={(i) => setExistingImages(prev => prev.filter((_, idx) => idx !== i))}
                  newFiles={newFiles}
                  onAddFiles={handleAddFiles}
                  onRemoveNew={(i) => {
                    URL.revokeObjectURL(newFiles[i].preview);
                    setNewFiles(prev => prev.filter((_, idx) => idx !== i));
                  }}
                  uploading={uploading}
                />
              </section>

              {/* ── Thông tin cơ bản ── */}
              <section>
                <h3 className="font-black text-sm uppercase tracking-wider mb-3" style={{ color: '#05051F' }}>
                  📋 Thông tin cơ bản
                </h3>
                <div className="space-y-3">
                  <FormField label="Tên sản phẩm *">
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      placeholder="VD: Nike Mercurial Superfly 9 Elite FG"
                      className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                      style={{ borderColor: '#E2E8F0' }}
                      onFocus={e => e.target.style.borderColor = '#2AAEDF'}
                      onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                  </FormField>

                  <div className="grid grid-cols-2 gap-3">
                    <FormField label="Thương hiệu">
                      <select value={form.brand_id} onChange={e => setForm({ ...form, brand_id: e.target.value })}
                        className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none bg-white cursor-pointer"
                        style={{ borderColor: '#E2E8F0' }}>
                        {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                      </select>
                    </FormField>
                    <FormField label="Loại sân">
                      <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}
                        className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none bg-white cursor-pointer"
                        style={{ borderColor: '#E2E8F0' }}>
                        {cats.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </FormField>
                  </div>

                  <FormField label="Mô tả">
                    <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                      rows={3} placeholder="Mô tả chi tiết sản phẩm..."
                      className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none resize-none transition-colors"
                      style={{ borderColor: '#E2E8F0' }}
                      onFocus={e => e.target.style.borderColor = '#2AAEDF'}
                      onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                  </FormField>
                </div>
              </section>

              {/* ── Giá & Tồn kho ── */}
              <section>
                <h3 className="font-black text-sm uppercase tracking-wider mb-3" style={{ color: '#05051F' }}>
                  💰 Giá & Tồn kho
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  <FormField label="Giá gốc (đ) *">
                    <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                      placeholder="5000000"
                      className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                      style={{ borderColor: '#E2E8F0' }}
                      onFocus={e => e.target.style.borderColor = '#2AAEDF'}
                      onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                  </FormField>
                  <FormField label="Giá sale (đ)">
                    <input type="number" value={form.sale_price} onChange={e => setForm({ ...form, sale_price: e.target.value })}
                      placeholder="Bỏ trống nếu không"
                      className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                      style={{ borderColor: '#E2E8F0' }}
                      onFocus={e => e.target.style.borderColor = '#2AAEDF'}
                      onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                  </FormField>
                  <FormField label="Tồn kho">
                    <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })}
                      className="w-full border rounded-xl px-4 py-2.5 text-sm outline-none transition-colors"
                      style={{ borderColor: '#E2E8F0' }}
                      onFocus={e => e.target.style.borderColor = '#2AAEDF'}
                      onBlur={e => e.target.style.borderColor = '#E2E8F0'} />
                  </FormField>
                </div>
              </section>

              {/* ── Sizes ── */}
              <section>
                <h3 className="font-black text-sm uppercase tracking-wider mb-3" style={{ color: '#05051F' }}>
                  👟 Size có sẵn
                </h3>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map(s => (
                    <button key={s} type="button"
                      onClick={() => setForm(f => ({
                        ...f, sizes: f.sizes.includes(s) ? f.sizes.filter(x => x !== s) : [...f.sizes, s]
                      }))}
                      className="w-11 h-11 rounded-xl text-sm font-bold border-2 transition-all duration-150"
                      style={{
                        borderColor: form.sizes.includes(s) ? '#2AAEDF' : 'rgba(5,5,31,0.12)',
                        backgroundColor: form.sizes.includes(s) ? 'rgba(42,174,223,0.1)' : '#fff',
                        color: form.sizes.includes(s) ? '#2AAEDF' : '#4A5568',
                      }}>
                      {s}
                    </button>
                  ))}
                </div>
              </section>

              {/* ── Màu sắc ── */}
              <section>
                <h3 className="font-black text-sm uppercase tracking-wider mb-3" style={{ color: '#05051F' }}>
                  🎨 Màu sắc
                </h3>
                <TagInput
                  tags={form.colors}
                  onChange={colors => setForm(f => ({ ...f, colors }))}
                  placeholder="Nhập màu, nhấn Enter hoặc +"
                />
              </section>

              {/* ── Trạng thái ── */}
              <section>
                <h3 className="font-black text-sm uppercase tracking-wider mb-3" style={{ color: '#05051F' }}>
                  🏷️ Trạng thái
                </h3>
                <div className="flex gap-4">
                  {[
                    { key: 'is_featured', label: 'Sản phẩm nổi bật', icon: '⭐' },
                    { key: 'is_new', label: 'Hàng mới về', icon: '🆕' },
                  ].map(({ key, label, icon }) => (
                    <label key={key} className="flex items-center gap-3 cursor-pointer p-4 rounded-xl flex-1 transition-all"
                      style={{
                        border: `2px solid ${form[key] ? '#2AAEDF' : 'rgba(5,5,31,0.1)'}`,
                        backgroundColor: form[key] ? 'rgba(42,174,223,0.06)' : '#fff',
                      }}>
                      <div className="relative">
                        <input type="checkbox" checked={form[key]}
                          onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))}
                          className="sr-only" />
                        <div className="w-10 h-6 rounded-full transition-colors flex items-center px-1"
                          style={{ backgroundColor: form[key] ? '#2AAEDF' : '#E2E8F0' }}>
                          <div className="w-4 h-4 bg-white rounded-full shadow transition-transform"
                            style={{ transform: form[key] ? 'translateX(16px)' : 'translateX(0)' }} />
                        </div>
                      </div>
                      <span className="text-sm font-semibold" style={{ color: form[key] ? '#2AAEDF' : '#4A5568' }}>
                        {icon} {label}
                      </span>
                    </label>
                  ))}
                </div>
              </section>
            </div>

            {/* Drawer footer */}
            <div className="p-5 border-t bg-white">
              {formError && (
                <p className="text-xs text-red-500 mb-3 text-center">{formError}</p>
              )}
              <div className="flex gap-3">
                <button type="button" onClick={closeForm}
                  className="flex-1 py-3 rounded-xl font-semibold border-2 text-sm transition-colors"
                  style={{ borderColor: '#E2E8F0', color: '#4A5568' }}>
                  Hủy
                </button>
                <button type="button" onClick={handleSave} disabled={saving}
                  className="flex-1 py-3 rounded-xl font-black text-sm text-white transition-colors disabled:opacity-50"
                  style={{ backgroundColor: '#2AAEDF' }}
                  onMouseEnter={e => { if (!saving) e.currentTarget.style.backgroundColor = '#2093BE'; }}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2AAEDF'}>
                  {saving ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      {uploading ? 'Đang upload ảnh...' : 'Đang lưu...'}
                    </span>
                  ) : (editId ? '💾 Lưu thay đổi' : '✅ Thêm sản phẩm')}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl text-sm font-bold text-white shadow-2xl"
          style={{ backgroundColor: '#05051F' }}>
          {toast}
        </div>
      )}
    </div>
  );
}

// Helper label wrapper
function FormField({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: '#718096' }}>{label}</label>
      {children}
    </div>
  );
}
