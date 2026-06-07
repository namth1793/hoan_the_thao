import React from 'react';
import { Link } from 'react-router-dom';

const ZALO_URL = 'https://zalo.me/0334661392';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#05051F' }} className="text-white">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:py-14 grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10">

        {/* Brand — full width on mobile */}
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="flex items-center gap-3 mb-4">
            <img src="/logo.jpg" alt="VH24 SPORT"
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl object-cover"
              style={{ border: '2px solid rgba(42,174,223,0.3)' }} />
            <div>
              <p className="font-black text-white text-base leading-tight">VH24 SPORT</p>
              <p className="text-xs" style={{ color: '#2AAEDF' }}>Đồ thể thao chính hãng</p>
            </div>
          </Link>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Nhà phân phối chính thức hơn 30 thương hiệu thể thao hàng đầu.
          </p>
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

        {/* Categories */}
        <div>
          <h3 className="font-bold text-white mb-4 text-xs uppercase tracking-widest">Danh mục</h3>
          <ul className="space-y-2">
            {[
              ['Áo CLB, ĐT', 'ao-clb-dt'],
              ['Giày Bóng Đá', 'giay-bong-da'],
              ['Quả Bóng Đá', 'qua-bong-da'],
              ['Giày CL - BC - PK', 'giay-cau-long-bc-pk'],
              ['Áo Thể Thao - Polo', 'ao-the-thao-polo'],
              ['Pickleball', 'pickleball'],
              ['Bóng Chuyền', 'bong-chuyen'],
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
          <ul className="space-y-2">
            {[['Wika','wika'],['Kamito','kamito'],['Jogarbola','jogarbola'],['Zocker','zocker'],['Mitre','mitre']].map(([name, slug]) => (
              <li key={slug}>
                <Link to={`/san-pham?brand=${slug}`}
                  className="text-sm transition-colors duration-200 block"
                  style={{ color: 'rgba(255,255,255,0.6)' }}
                  onMouseEnter={e => e.target.style.color = '#2AAEDF'}
                  onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}>
                  {name}
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
              {
                icon: <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>,
                text: 'CS1: 79 Thái Thịnh, Đống Đa, HN | CS2: Hà Trì, Hà Đông, HN',
              },
              {
                icon: <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>,
                text: '0334 661 392',
                href: 'tel:0334661392',
              },
              {
                icon: <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z"/></svg>,
                text: 'Zalo: 0334 661 392',
                href: ZALO_URL,
                external: true,
              },
              {
                icon: <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>,
                text: '8:00 - 21:00 (T2 - CN)',
              },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <span style={{ color: '#2AAEDF' }}>{item.icon}</span>
                {item.href ? (
                  <a href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className="transition-colors leading-relaxed"
                    style={{ color: 'rgba(255,255,255,0.6)' }}
                    onMouseEnter={e => e.target.style.color = '#2AAEDF'}
                    onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.6)'}>
                    {item.text}
                  </a>
                ) : (
                  <span className="leading-relaxed">{item.text}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t py-4 text-xs flex items-center justify-between px-4 max-w-7xl mx-auto"
        style={{ borderColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.35)' }}>
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
