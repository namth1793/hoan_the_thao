import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const ZALO_URL = 'https://zalo.me/0334661392';

export default function Navbar() {
  const { count, setIsOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const links = [
    { to: '/', label: 'Trang chủ' },
    { to: '/san-pham', label: 'Sản phẩm' },
    { to: '/gioi-thieu', label: 'Giới thiệu' },
    { to: '/lien-he', label: 'Liên hệ' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'shadow-xl shadow-black/30' : ''}`}
      style={{ backgroundColor: '#05051F' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.jpg" alt="VH24 SPORT"
              className="h-10 w-10 rounded-xl object-cover"
              style={{ border: '2px solid rgba(42,174,223,0.3)' }} />
            <div className="hidden sm:block">
              <p className="font-black text-white text-sm leading-tight">VH24 SPORT</p>
              <p className="text-xs leading-none" style={{ color: '#2AAEDF' }}>Giày đá bóng chính hãng</p>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <Link key={l.to} to={l.to}
                className="px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200"
                style={{ color: isActive(l.to) ? '#2AAEDF' : 'rgba(255,255,255,0.8)' }}
                onMouseEnter={e => { if (!isActive(l.to)) e.target.style.color = '#2AAEDF'; }}
                onMouseLeave={e => { if (!isActive(l.to)) e.target.style.color = 'rgba(255,255,255,0.8)'; }}>
                {l.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Zalo link */}
            <a href={ZALO_URL} target="_blank" rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-lg transition-colors duration-200"
              style={{ backgroundColor: 'rgba(42,174,223,0.15)', color: '#2AAEDF' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#2AAEDF'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(42,174,223,0.15)'; e.currentTarget.style.color = '#2AAEDF'; }}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z"/>
              </svg>
              Zalo: 0334 661 392
            </a>

            {/* Cart */}
            <button onClick={() => setIsOpen(true)}
              className="relative p-2.5 rounded-xl text-white transition-colors duration-200 flex items-center gap-1.5"
              style={{ backgroundColor: count > 0 ? '#2AAEDF' : 'rgba(255,255,255,0.1)' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2AAEDF'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = count > 0 ? '#2AAEDF' : 'rgba(255,255,255,0.1)'}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
              {count > 0 && (
                <span className="text-xs font-black bg-white rounded-full w-5 h-5 flex items-center justify-center" style={{ color: '#2AAEDF' }}>
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </button>

            {/* Mobile menu toggle */}
            <button className="md:hidden p-2 text-white rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
              onClick={() => setMenuOpen(!menuOpen)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}/>
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-3 border-t space-y-1" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            {links.map(l => (
              <Link key={l.to} to={l.to}
                className="block px-4 py-2.5 rounded-lg font-medium text-sm"
                style={{ color: isActive(l.to) ? '#2AAEDF' : 'rgba(255,255,255,0.8)' }}>
                {l.label}
              </Link>
            ))}
            <a href={ZALO_URL} target="_blank" rel="noopener noreferrer"
              className="block px-4 py-2.5 font-bold text-sm"
              style={{ color: '#2AAEDF' }}>
              💬 Zalo: 0334 661 392
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
