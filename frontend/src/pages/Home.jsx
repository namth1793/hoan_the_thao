import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5032/api';
const ZALO_URL = 'https://zalo.me/0334661392';

const CATS = [
  { label: 'Sân Cỏ Tự Nhiên', sub: 'FG · Firm Ground', icon: '🌿', slug: 'san-co-tu-nhien' },
  { label: 'Sân Cỏ Nhân Tạo', sub: 'AG · Artificial Ground', icon: '🏟️', slug: 'san-co-nhan-tao' },
  { label: 'Sân Futsal', sub: 'IC · Indoor Court', icon: '🏠', slug: 'san-futsal' },
  { label: 'Sân Cứng', sub: 'TF · Turf', icon: '🏙️', slug: 'san-cung' },
];

const REASONS = [
  { icon: '✅', title: '100% Chính Hãng', desc: 'Phân phối chính thức từ hơn 30 thương hiệu lớn.' },
  { icon: '💬', title: 'Tư Vấn Qua Zalo', desc: 'Nhắn Zalo để được chọn giày đúng vị trí, đúng sân.' },
  { icon: '🚀', title: 'Giao Hàng Nhanh', desc: 'Giao toàn quốc 2-4 ngày, miễn phí đơn từ 500K.' },
  { icon: '🔄', title: 'Đổi Trả 30 Ngày', desc: 'Đổi trả miễn phí nếu có lỗi sản xuất.' },
  { icon: '💳', title: 'Thanh Toán Linh Hoạt', desc: 'COD, chuyển khoản, ví điện tử.' },
  { icon: '🏆', title: 'Bảo Hành Chính Hãng', desc: 'Xử lý lỗi theo chính sách hãng.' },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [newest, setNewest] = useState([]);

  useEffect(() => {
    axios.get(`${API}/products?featured=true&limit=4`).then(r => setFeatured(r.data.products));
    axios.get(`${API}/products?sort=newest&limit=8`).then(r => setNewest(r.data.products));
  }, []);

  return (
    <div className="pt-16">
      {/* ── HERO BANNER ── */}
      <section className="relative overflow-hidden" style={{ minHeight: '75vh' }}>
        <img
          src="/banner.jpg"
          alt="VH24 SPORT Phân Phối 2026"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="relative min-h-[75vh]" />
      </section>

      {/* ── STATS BAR ── */}
      <section className="border-b" style={{ backgroundColor: '#05051F', borderColor: 'rgba(42,174,223,0.2)' }}>
        <div className="max-w-7xl mx-auto px-4 py-5">
          <div className="flex flex-wrap justify-center md:justify-between gap-6 items-center">
            {[
              ['30+', 'Thương hiệu phân phối'],
              ['10K+', 'Khách hàng tin tưởng'],
              ['500+', 'Mẫu giày sẵn có'],
              ['100%', 'Hàng chính hãng'],
            ].map(([num, label]) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-black" style={{ color: '#2AAEDF' }}>{num}</p>
                <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</p>
              </div>
            ))}
            <a href={ZALO_URL} target="_blank" rel="noopener noreferrer"
              className="font-bold text-sm px-5 py-2.5 rounded-xl text-white transition-colors duration-200 flex items-center gap-2"
              style={{ backgroundColor: '#2AAEDF' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2093BE'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2AAEDF'}>
              💬 Zalo: 0334 661 392
            </a>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-16" style={{ backgroundColor: '#F7F9FC' }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#2AAEDF' }}>Lựa chọn theo nhu cầu</p>
            <h2 className="text-2xl font-black" style={{ color: '#05051F' }}>Phân Loại Theo Mặt Sân</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATS.map(cat => (
              <Link key={cat.slug} to={`/san-pham?category=${cat.slug}`}
                className="group bg-white rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
                style={{ border: '1px solid rgba(5,5,31,0.08)' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 16px 40px rgba(42,174,223,0.15)'; e.currentTarget.style.borderColor = '#2AAEDF'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'rgba(5,5,31,0.08)'; }}>
                <div className="text-3xl mb-3">{cat.icon}</div>
                <h3 className="font-bold text-sm mb-0.5" style={{ color: '#05051F' }}>{cat.label}</h3>
                <p className="text-xs" style={{ color: '#718096' }}>{cat.sub}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ── */}
      {featured.length > 0 && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#2AAEDF' }}>Được chọn nhiều nhất</p>
                <h2 className="text-2xl font-black" style={{ color: '#05051F' }}>Sản Phẩm Nổi Bật</h2>
              </div>
              <Link to="/san-pham?featured=true" className="text-sm font-semibold flex items-center gap-1" style={{ color: '#2AAEDF' }}>
                Xem tất cả <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {featured.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── ZALO CTA BANNER ── */}
      <section className="py-14" style={{ backgroundColor: '#05051F' }}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#2AAEDF' }}>Mua hàng dễ dàng</p>
            <h2 className="text-2xl font-black text-white mb-2">Nhắn Zalo — Mua Ngay!</h2>
            <p style={{ color: 'rgba(255,255,255,0.55)' }}>Tư vấn miễn phí · Báo giá nhanh · Giao hàng toàn quốc</p>
          </div>
          <a href={ZALO_URL} target="_blank" rel="noopener noreferrer"
            className="flex-shrink-0 flex items-center gap-3 font-black text-white px-10 py-4 rounded-2xl transition-colors duration-200"
            style={{ backgroundColor: '#2AAEDF' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2093BE'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2AAEDF'}>
            <svg className="w-6 h-6" viewBox="0 0 48 48" fill="currentColor">
              <path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm2 28.5l-8-12h4v-9l8 12h-4v9z"/>
            </svg>
            Nhắn Zalo: 0334 661 392
          </a>
        </div>
      </section>

      {/* ── NEWEST PRODUCTS ── */}
      {newest.length > 0 && (
        <section className="py-16" style={{ backgroundColor: '#F7F9FC' }}>
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#2AAEDF' }}>Cập nhật liên tục</p>
                <h2 className="text-2xl font-black" style={{ color: '#05051F' }}>Hàng Mới Về</h2>
              </div>
              <Link to="/san-pham?sort=newest" className="text-sm font-semibold flex items-center gap-1" style={{ color: '#2AAEDF' }}>
                Xem tất cả <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {newest.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* ── WHY CHOOSE US ── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#2AAEDF' }}>Tại sao chọn chúng tôi</p>
            <h2 className="text-2xl font-black" style={{ color: '#05051F' }}>VH24 SPORT Cam Kết</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {REASONS.map(r => (
              <div key={r.title} className="rounded-2xl p-6 transition-all duration-200 cursor-default"
                style={{ backgroundColor: '#F7F9FC', border: '1px solid rgba(5,5,31,0.06)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#2AAEDF'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(5,5,31,0.06)'; }}>
                <div className="text-3xl mb-3">{r.icon}</div>
                <h3 className="font-bold text-sm mb-1.5" style={{ color: '#05051F' }}>{r.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: '#718096' }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-16" style={{ backgroundColor: '#F7F9FC' }}>
        <div className="max-w-xl mx-auto px-4 text-center">
          <img src="/logo.jpg" alt="VH24 SPORT" className="h-16 w-16 rounded-2xl object-cover mx-auto mb-5 shadow-lg" />
          <h2 className="text-2xl font-black mb-3" style={{ color: '#05051F' }}>Cần tư vấn chọn giày?</h2>
          <p className="mb-7 text-sm leading-relaxed" style={{ color: '#718096' }}>
            Nhắn Zalo để được chuyên gia VH24 SPORT tư vấn miễn phí — chọn đúng giày cho vị trí và mặt sân của bạn.
          </p>
          <a href={ZALO_URL} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-3 font-black text-white px-10 py-4 rounded-2xl transition-colors duration-200 text-base"
            style={{ backgroundColor: '#2AAEDF' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2093BE'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2AAEDF'}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z"/>
            </svg>
            Nhắn Zalo: 0334 661 392
          </a>
        </div>
      </section>
    </div>
  );
}
