import React from 'react';
import { Link } from 'react-router-dom';

const ZALO_URL = 'https://zalo.me/0334661392';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#05051F' }} className="text-white">
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1">
          <Link to="/" className="flex items-center gap-3 mb-5">
            <img src="/logo.jpg" alt="VH24 SPORT"
              className="h-12 w-12 rounded-xl object-cover"
              style={{ border: '2px solid rgba(42,174,223,0.3)' }} />
            <div>
              <p className="font-black text-white text-base leading-tight">VH24 SPORT</p>
              <p className="text-xs" style={{ color: '#2AAEDF' }}>Giày đá bóng chính hãng</p>
            </div>
          </Link>
          <p className="text-sm leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Nhà phân phối chính thức hơn 30 thương hiệu giày thể thao hàng đầu thế giới.
          </p>
          {/* Zalo CTA in footer */}
          <a href={ZALO_URL} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl transition-colors duration-200"
            style={{ backgroundColor: '#2AAEDF', color: '#fff' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2093BE'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2AAEDF'}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z"/>
            </svg>
            Nhắn Zalo
          </a>
        </div>

        {/* Products */}
        <div>
          <h3 className="font-bold text-white mb-4 text-xs uppercase tracking-widest">Sản phẩm</h3>
          <ul className="space-y-2.5">
            {[
              ['Sân Cỏ Tự Nhiên (FG)', 'san-co-tu-nhien'],
              ['Sân Cỏ Nhân Tạo (AG)', 'san-co-nhan-tao'],
              ['Sân Futsal (IC)', 'san-futsal'],
              ['Sân Cứng (TF)', 'san-cung'],
            ].map(([label, slug]) => (
              <li key={slug}>
                <Link to={`/san-pham?category=${slug}`}
                  className="text-sm transition-colors duration-200 block"
                  style={{ color: 'rgba(255,255,255,0.6)' }}
                  onMouseEnter={e => e.target.style.color = '#2AAEDF'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Brands */}
        <div>
          <h3 className="font-bold text-white mb-4 text-xs uppercase tracking-widest">Thương hiệu</h3>
          <ul className="space-y-2.5">
            {['Nike', 'Adidas', 'Puma', 'New Balance', 'Mizuno'].map(b => (
              <li key={b}>
                <Link to={`/san-pham?brand=${b.toLowerCase().replace(' ', '-')}`}
                  className="text-sm transition-colors duration-200 block"
                  style={{ color: 'rgba(255,255,255,0.6)' }}
                  onMouseEnter={e => e.target.style.color = '#2AAEDF'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}>
                  {b}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-bold text-white mb-4 text-xs uppercase tracking-widest">Liên hệ</h3>
          <ul className="space-y-3">
            {[
              { icon: '📍', text: '123 Nguyễn Văn Linh, Q. Thanh Khê, Đà Nẵng' },
              { icon: '💬', text: 'Zalo: 0334 661 392', href: ZALO_URL, external: true },
              { icon: '📞', text: '0334 661 392', href: 'tel:0334661392' },
              { icon: '🕐', text: '8:00 - 21:00 (T2 - CN)' },
            ].map(item => (
              <li key={item.text} className="flex items-start gap-2.5 text-sm">
                <span className="flex-shrink-0 mt-0.5">{item.icon}</span>
                {item.href ? (
                  <a href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className="transition-colors"
                    style={{ color: 'rgba(255,255,255,0.6)' }}
                    onMouseEnter={e => e.target.style.color = '#2AAEDF'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}>
                    {item.text}
                  </a>
                ) : (
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>{item.text}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t py-4 text-xs flex items-center justify-between px-4 max-w-7xl mx-auto w-full" style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.35)' }}>
        <span>© 2025 VH24 SPORT. All rights reserved.</span>
        <Link to="/admin/login"
          className="flex items-center gap-1 transition-colors duration-200"
          style={{ color: 'rgba(255,255,255,0.18)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.18)'}>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
          Admin
        </Link>
      </div>
    </footer>
  );
}
