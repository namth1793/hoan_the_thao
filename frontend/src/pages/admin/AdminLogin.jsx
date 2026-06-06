import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5032/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('vh24_admin_token')) navigate('/admin');
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) { setError('Vui lòng điền đầy đủ thông tin'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API}/admin/login`, form);
      localStorage.setItem('vh24_admin_token', res.data.token);
      localStorage.setItem('vh24_admin_user', res.data.username);
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#05051F' }}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl" style={{ backgroundColor: '#2AAEDF' }} />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-5 blur-3xl" style={{ backgroundColor: '#2AAEDF' }} />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {/* Logo + title */}
          <div className="text-center mb-8">
            <img src="/logo.jpg" alt="VH24 SPORT"
              className="h-16 w-16 rounded-2xl object-cover mx-auto mb-4 shadow-lg"
              style={{ border: '3px solid rgba(42,174,223,0.2)' }} />
            <h1 className="text-xl font-black" style={{ color: '#05051F' }}>Quản trị viên</h1>
            <p className="text-sm mt-1" style={{ color: '#718096' }}>VH24 SPORT Admin Panel</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm font-medium text-center"
              style={{ backgroundColor: 'rgba(239,68,68,0.08)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-bold mb-1.5" style={{ color: '#05051F' }}>Tên đăng nhập</label>
              <input
                type="text"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                placeholder="admin"
                className="w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all"
                style={{ borderColor: '#E2E8F0', color: '#05051F' }}
                onFocus={e => { e.target.style.borderColor = '#2AAEDF'; e.target.style.boxShadow = '0 0 0 3px rgba(42,174,223,0.12)'; }}
                onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
                autoComplete="username"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold mb-1.5" style={{ color: '#05051F' }}>Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full border rounded-xl px-4 py-3 text-sm outline-none transition-all pr-11"
                  style={{ borderColor: '#E2E8F0', color: '#05051F' }}
                  onFocus={e => { e.target.style.borderColor = '#2AAEDF'; e.target.style.boxShadow = '0 0 0 3px rgba(42,174,223,0.12)'; }}
                  onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-opacity opacity-50 hover:opacity-100">
                  {showPass ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Login button */}
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl font-black text-white transition-colors duration-200 disabled:opacity-50 mt-2"
              style={{ backgroundColor: '#2AAEDF' }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#2093BE'; }}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2AAEDF'}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Đang đăng nhập...
                </span>
              ) : 'Đăng nhập'}
            </button>
          </form>

          {/* Back to home */}
          <div className="mt-6 pt-5 border-t text-center" style={{ borderColor: '#F1F5F9' }}>
            <Link to="/"
              className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
              style={{ color: '#718096' }}
              onMouseEnter={e => e.currentTarget.style.color = '#05051F'}
              onMouseLeave={e => e.currentTarget.style.color = '#718096'}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
              </svg>
              Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
