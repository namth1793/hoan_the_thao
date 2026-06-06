import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const API = 'http://localhost:5032/api';

const InputField = ({ label, required, ...props }) => (
  <div>
    <label className="block text-sm font-bold mb-1.5" style={{ color: '#05051F' }}>
      {label} {required && <span style={{ color: '#2AAEDF' }}>*</span>}
    </label>
    <input
      className="w-full border rounded-xl px-4 py-3 outline-none transition-colors text-sm"
      style={{ borderColor: '#E2E8F0', color: '#05051F' }}
      onFocus={e => { e.target.style.borderColor = '#2AAEDF'; e.target.style.boxShadow = '0 0 0 3px rgba(42,174,223,0.1)'; }}
      onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
      {...props}
    />
  </div>
);

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', note: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (items.length === 0) return (
    <div className="pt-16 min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: '#F7F9FC' }}>
          <svg className="w-12 h-12" style={{ color: '#718096' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
          </svg>
        </div>
        <h2 className="text-xl font-black mb-2" style={{ color: '#05051F' }}>Giỏ hàng trống</h2>
        <p className="mb-5 text-sm" style={{ color: '#718096' }}>Thêm sản phẩm để tiếp tục đặt hàng</p>
        <Link to="/san-pham"
          className="inline-flex items-center gap-2 font-bold px-6 py-3 rounded-xl text-white"
          style={{ backgroundColor: '#2AAEDF' }}>
          Tiếp tục mua sắm
        </Link>
      </div>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) { setError('Vui lòng điền đầy đủ thông tin bắt buộc'); return; }
    setLoading(true);
    try {
      const res = await axios.post(`${API}/orders`, {
        customer_name: form.name, customer_phone: form.phone, customer_email: form.email,
        customer_address: form.address, items, total, note: form.note
      });
      clearCart();
      navigate(`/dat-hang/thanh-cong?code=${res.data.order_code}`);
    } catch { setError('Đặt hàng thất bại, vui lòng thử lại'); } finally { setLoading(false); }
  };

  return (
    <div className="pt-16 min-h-screen bg-white">
      <div className="py-10" style={{ backgroundColor: '#05051F' }}>
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#2AAEDF' }}>SoccerPro</p>
          <h1 className="text-3xl font-black text-white">Đặt Hàng</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Form */}
          <div className="md:col-span-2">
            <div className="rounded-2xl p-8" style={{ border: '1px solid rgba(5,5,31,0.08)' }}>
              <h2 className="font-black text-lg mb-6" style={{ color: '#05051F' }}>Thông tin giao hàng</h2>

              {error && (
                <div className="rounded-xl p-4 mb-5 text-sm font-medium" style={{ backgroundColor: 'rgba(239,68,68,0.08)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.2)' }}>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <InputField label="Họ và tên" required type="text" value={form.name}
                    onChange={e => setForm({...form, name: e.target.value})} placeholder="Nguyễn Văn A" />
                  <InputField label="Số điện thoại" required type="tel" value={form.phone}
                    onChange={e => setForm({...form, phone: e.target.value})} placeholder="0987 654 321" />
                </div>
                <InputField label="Email" type="email" value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})} placeholder="example@email.com" />
                <div>
                  <label className="block text-sm font-bold mb-1.5" style={{ color: '#05051F' }}>
                    Địa chỉ giao hàng <span style={{ color: '#2AAEDF' }}>*</span>
                  </label>
                  <textarea value={form.address} onChange={e => setForm({...form, address: e.target.value})}
                    className="w-full border rounded-xl px-4 py-3 outline-none transition-colors text-sm resize-none"
                    style={{ borderColor: '#E2E8F0', color: '#05051F' }}
                    onFocus={e => { e.target.style.borderColor = '#2AAEDF'; e.target.style.boxShadow = '0 0 0 3px rgba(42,174,223,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
                    rows={3} placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố" />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-1.5" style={{ color: '#05051F' }}>Ghi chú</label>
                  <textarea value={form.note} onChange={e => setForm({...form, note: e.target.value})}
                    className="w-full border rounded-xl px-4 py-3 outline-none transition-colors text-sm resize-none"
                    style={{ borderColor: '#E2E8F0', color: '#05051F' }}
                    onFocus={e => { e.target.style.borderColor = '#2AAEDF'; e.target.style.boxShadow = '0 0 0 3px rgba(42,174,223,0.1)'; }}
                    onBlur={e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; }}
                    rows={2} placeholder="Ghi chú thêm..." />
                </div>

                <div className="rounded-xl p-4" style={{ backgroundColor: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <p className="font-bold text-sm mb-1" style={{ color: '#F59E0B' }}>💳 Thanh toán khi nhận hàng (COD)</p>
                  <p className="text-sm" style={{ color: '#4A5568' }}>Bạn chỉ thanh toán khi nhận được hàng và kiểm tra sản phẩm.</p>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-4 rounded-xl font-black text-lg text-white transition-colors duration-200 disabled:opacity-50"
                  style={{ backgroundColor: '#2AAEDF' }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#2093BE'; }}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2AAEDF'}>
                  {loading ? 'Đang xử lý...' : `Đặt hàng — ${total.toLocaleString()}đ`}
                </button>
              </form>
            </div>
          </div>

          {/* Order summary */}
          <div>
            <div className="rounded-2xl p-6 sticky top-24" style={{ border: '1px solid rgba(5,5,31,0.08)' }}>
              <h2 className="font-black text-base mb-5 pb-4 border-b" style={{ color: '#05051F', borderColor: 'rgba(5,5,31,0.06)' }}>
                Đơn hàng ({items.length} sản phẩm)
              </h2>
              <div className="space-y-4 mb-5">
                {items.map(item => (
                  <div key={item.key} className="flex gap-3">
                    <img src={item.image} alt={item.name}
                      className="w-14 h-14 object-contain rounded-xl p-1" style={{ backgroundColor: '#F7F9FC' }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold line-clamp-2" style={{ color: '#05051F' }}>{item.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: '#718096' }}>Size {item.size} · {item.color}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs" style={{ color: '#718096' }}>×{item.qty}</span>
                        <span className="text-sm font-black" style={{ color: '#2AAEDF' }}>{(item.price * item.qty).toLocaleString()}đ</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2.5" style={{ borderColor: 'rgba(5,5,31,0.06)' }}>
                <div className="flex justify-between text-sm">
                  <span style={{ color: '#718096' }}>Tạm tính</span>
                  <span style={{ color: '#4A5568' }}>{total.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: '#718096' }}>Phí vận chuyển</span>
                  <span className="font-semibold" style={{ color: '#22C55E' }}>Miễn phí</span>
                </div>
                <div className="flex justify-between font-black text-lg pt-3 border-t" style={{ borderColor: 'rgba(5,5,31,0.06)' }}>
                  <span style={{ color: '#05051F' }}>Tổng cộng</span>
                  <span style={{ color: '#2AAEDF' }}>{total.toLocaleString()}đ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
