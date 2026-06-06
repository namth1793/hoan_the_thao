import React, { useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5032/api';
const ZALO_URL = 'https://zalo.me/0334661392';

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setLoading(true);
    try {
      await axios.post(`${API}/contacts`, form);
      setSent(true);
      setForm({ name: '', phone: '', email: '', message: '' });
    } finally { setLoading(false); }
  };

  const inputStyle = {
    width: '100%',
    border: '1px solid #E2E8F0',
    borderRadius: '12px',
    padding: '12px 16px',
    outline: 'none',
    fontSize: '14px',
    color: '#05051F',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };
  const onFocus = e => { e.target.style.borderColor = '#2AAEDF'; e.target.style.boxShadow = '0 0 0 3px rgba(42,174,223,0.1)'; };
  const onBlur = e => { e.target.style.borderColor = '#E2E8F0'; e.target.style.boxShadow = 'none'; };

  return (
    <div className="pt-16 min-h-screen bg-white">
      <div className="py-16" style={{ backgroundColor: '#05051F' }}>
        <div className="max-w-5xl mx-auto px-4 text-center">
          <img src="/logo.jpg" alt="VH24 SPORT" className="h-14 w-14 rounded-2xl object-cover mx-auto mb-4 shadow-lg" />
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#2AAEDF' }}>Liên hệ & Tư vấn</p>
          <h1 className="text-3xl font-black text-white mb-3">Mua Hàng Qua Zalo</h1>
          <p style={{ color: 'rgba(255,255,255,0.55)' }}>Nhanh nhất · Tiện lợi nhất · Hỗ trợ 8:00 - 21:00</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-14">
        {/* Zalo highlight */}
        <div className="rounded-2xl p-8 mb-10 flex flex-col md:flex-row items-center gap-6"
          style={{ backgroundColor: 'rgba(42,174,223,0.06)', border: '2px solid rgba(42,174,223,0.2)' }}>
          <div className="text-5xl">💬</div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-xl font-black mb-1" style={{ color: '#05051F' }}>Nhắn Zalo để đặt hàng ngay</h2>
            <p className="text-sm" style={{ color: '#718096' }}>Tư vấn miễn phí, báo giá nhanh, hỗ trợ chọn size và loại sân phù hợp.</p>
          </div>
          <a href={ZALO_URL} target="_blank" rel="noopener noreferrer"
            className="flex-shrink-0 flex items-center gap-2 font-black text-white px-8 py-4 rounded-xl transition-colors duration-200"
            style={{ backgroundColor: '#2AAEDF' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2093BE'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2AAEDF'}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z"/>
            </svg>
            Mở Zalo: 0334 661 392
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Info */}
          <div>
            <h2 className="text-lg font-black mb-6" style={{ color: '#05051F' }}>Thông tin liên hệ</h2>
            <div className="space-y-3">
              {[
                { icon: '📍', title: 'Địa chỉ', text: '123 Nguyễn Văn Linh, Q. Thanh Khê, TP. Đà Nẵng' },
                { icon: '💬', title: 'Zalo', text: '0334 661 392', href: ZALO_URL, external: true },
                { icon: '📞', title: 'Điện thoại', text: '0334 661 392', href: 'tel:0334661392' },
                { icon: '🕐', title: 'Giờ làm việc', text: '8:00 - 21:00 (T2 - CN)' },
              ].map(item => (
                <div key={item.title} className="flex items-start gap-4 p-4 rounded-xl"
                  style={{ backgroundColor: '#F7F9FC', border: '1px solid rgba(5,5,31,0.06)' }}>
                  <span className="text-xl flex-shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide mb-0.5" style={{ color: '#718096' }}>{item.title}</p>
                    {item.href
                      ? <a href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noopener noreferrer' : undefined}
                          className="font-semibold text-sm transition-colors" style={{ color: '#2AAEDF' }}>{item.text}</a>
                      : <p className="text-sm" style={{ color: '#4A5568' }}>{item.text}</p>
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="rounded-2xl p-7" style={{ border: '1px solid rgba(5,5,31,0.08)' }}>
            <h2 className="text-lg font-black mb-5" style={{ color: '#05051F' }}>Để lại thông tin</h2>
            <p className="text-sm mb-5" style={{ color: '#718096' }}>Điền form để chúng tôi chủ động liên hệ lại qua Zalo/điện thoại.</p>
            {sent ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'rgba(34,197,94,0.12)' }}>
                  <svg className="w-7 h-7" style={{ color: '#22C55E' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
                  </svg>
                </div>
                <h3 className="font-black mb-1" style={{ color: '#05051F' }}>Đã gửi!</h3>
                <p className="text-sm mb-5" style={{ color: '#718096' }}>Chúng tôi sẽ liên hệ sớm nhất qua Zalo.</p>
                <button onClick={() => setSent(false)} className="font-bold px-5 py-2.5 rounded-xl text-white text-sm" style={{ backgroundColor: '#2AAEDF' }}>
                  Gửi thêm
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { label: 'Họ và tên *', key: 'name', type: 'text', placeholder: 'Nguyễn Văn A' },
                  { label: 'Số điện thoại *', key: 'phone', type: 'tel', placeholder: '0334 661 392' },
                  { label: 'Email', key: 'email', type: 'email', placeholder: 'example@email.com' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-sm font-bold mb-1.5" style={{ color: '#05051F' }}>{f.label}</label>
                    <input type={f.type} value={form[f.key]}
                      onChange={e => setForm({...form, [f.key]: e.target.value})}
                      placeholder={f.placeholder} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-bold mb-1.5" style={{ color: '#05051F' }}>Nội dung</label>
                  <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})}
                    rows={3} placeholder="Tôi muốn hỏi về..."
                    style={{ ...inputStyle, resize: 'none' }} onFocus={onFocus} onBlur={onBlur} />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 rounded-xl font-bold text-white transition-colors duration-200 disabled:opacity-50"
                  style={{ backgroundColor: '#2AAEDF' }}
                  onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = '#2093BE'; }}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2AAEDF'}>
                  {loading ? 'Đang gửi...' : 'Gửi thông tin'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
