import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CATEGORIES } from '../constants/categories';

const ZALO_URL = 'https://zalo.me/0334661392';

export default function Navbar() {
  const { count, setIsOpen } = useCart();
  const [scrolled, setScrolled]     = useState(false);
  const [menuOpen, setMenuOpen]     = useState(false);
  const [catOpen, setCatOpen]       = useState(false);   // desktop mega
  const [mobileCat, setMobileCat]   = useState(null);    // expanded mobile parent
  const location  = useLocation();
  const navigate  = useNavigate();
  const megaRef   = useRef(null);
  const timerRef  = useRef(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => { setMenuOpen(false); setCatOpen(false); }, [location]);

  // Close mega on outside click
  useEffect(() => {
    const h = (e) => { if (megaRef.current && !megaRef.current.contains(e.target)) setCatOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const openMega  = () => { clearTimeout(timerRef.current); setCatOpen(true); };
  const closeMega = () => { timerRef.current = setTimeout(() => setCatOpen(false), 150); };

  const goCategory = (slug) => {
    navigate(`/san-pham?category=${slug}`);
    setCatOpen(false);
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'shadow-xl shadow-black/30' : ''}`}
      style={{ backgroundColor: '#05051F' }}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 flex-shrink-0">
            <img src="/logo.jpg" alt="VH24 SPORT"
              className="h-10 w-10 rounded-xl object-cover"
              style={{ border: '2px solid rgba(42,174,223,0.3)' }} />
            <div className="hidden sm:block">
              <p className="font-black text-white text-sm leading-tight">VH24 SPORT</p>
              <p className="text-xs leading-none" style={{ color: '#2AAEDF' }}>Thể thao chính hãng</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1" ref={megaRef}>
            <Link to="/"
              className="px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200"
              style={{ color: isActive('/') ? '#2AAEDF' : 'rgba(255,255,255,0.8)' }}
              onMouseEnter={e => { if (!isActive('/')) e.currentTarget.style.color = '#2AAEDF'; }}
              onMouseLeave={e => { if (!isActive('/')) e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}>
              Trang chủ
            </Link>

            {/* Danh mục trigger */}
            <div className="relative" onMouseEnter={openMega} onMouseLeave={closeMega}>
              <button
                className="flex items-center gap-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200"
                style={{ color: catOpen ? '#2AAEDF' : 'rgba(255,255,255,0.8)' }}
                onClick={() => setCatOpen(v => !v)}>
                Danh mục
                <svg className={`w-3 h-3 transition-transform duration-200 ${catOpen ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              {/* Mega dropdown */}
              {catOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[720px] rounded-2xl shadow-2xl p-6 z-50"
                  style={{ backgroundColor: '#0D0D2A', border: '1px solid rgba(42,174,223,0.15)' }}
                  onMouseEnter={openMega} onMouseLeave={closeMega}>
                  <div className="grid grid-cols-4 gap-6">
                    {CATEGORIES.map(cat => (
                      <div key={cat.slug}>
                        <button onClick={() => goCategory(cat.slug)}
                          className="w-full text-left font-black text-xs uppercase tracking-wider mb-2 pb-1.5 border-b transition-colors"
                          style={{ color: '#2AAEDF', borderColor: 'rgba(42,174,223,0.2)' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                          onMouseLeave={e => e.currentTarget.style.color = '#2AAEDF'}>
                          {cat.icon} {cat.label}
                        </button>
                        <ul className="space-y-0.5">
                          {cat.children.map(child => (
                            <li key={child.slug}>
                              <button onClick={() => goCategory(child.slug)}
                                className="w-full text-left text-xs py-0.5 transition-colors"
                                style={{ color: 'rgba(255,255,255,0.55)' }}
                                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.55)'}>
                                {child.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link to="/san-pham"
              className="px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200"
              style={{ color: isActive('/san-pham') ? '#2AAEDF' : 'rgba(255,255,255,0.8)' }}
              onMouseEnter={e => { if (!isActive('/san-pham')) e.currentTarget.style.color = '#2AAEDF'; }}
              onMouseLeave={e => { if (!isActive('/san-pham')) e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}>
              Sản phẩm
            </Link>
            <Link to="/gioi-thieu"
              className="px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200"
              style={{ color: isActive('/gioi-thieu') ? '#2AAEDF' : 'rgba(255,255,255,0.8)' }}
              onMouseEnter={e => { if (!isActive('/gioi-thieu')) e.currentTarget.style.color = '#2AAEDF'; }}
              onMouseLeave={e => { if (!isActive('/gioi-thieu')) e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}>
              Giới thiệu
            </Link>
            <Link to="/lien-he"
              className="px-4 py-2 rounded-lg font-medium text-sm transition-colors duration-200"
              style={{ color: isActive('/lien-he') ? '#2AAEDF' : 'rgba(255,255,255,0.8)' }}
              onMouseEnter={e => { if (!isActive('/lien-he')) e.currentTarget.style.color = '#2AAEDF'; }}
              onMouseLeave={e => { if (!isActive('/lien-he')) e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}>
              Liên hệ
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
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
            <button className="md:hidden p-2 text-white rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
              onClick={() => setMenuOpen(v => !v)}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d={menuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}/>
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-3 border-t space-y-1 max-h-[80vh] overflow-y-auto"
            style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <Link to="/" className="block px-4 py-2.5 rounded-lg font-medium text-sm"
              style={{ color: isActive('/') ? '#2AAEDF' : 'rgba(255,255,255,0.8)' }}>
              Trang chủ
            </Link>

            {/* Mobile categories accordion */}
            <div>
              <button onClick={() => setMobileCat(mobileCat === 'all' ? null : 'all')}
                className="w-full text-left flex items-center justify-between px-4 py-2.5 rounded-lg font-medium text-sm"
                style={{ color: '#2AAEDF', backgroundColor: mobileCat === 'all' ? 'rgba(42,174,223,0.08)' : 'transparent' }}>
                Danh mục
                <svg className={`w-3.5 h-3.5 transition-transform ${mobileCat === 'all' ? 'rotate-180' : ''}`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              {mobileCat === 'all' && (
                <div className="ml-2 mt-1 space-y-1">
                  {CATEGORIES.map(cat => (
                    <div key={cat.slug}>
                      <button onClick={() => setMobileCat(mobileCat === cat.slug ? 'all' : cat.slug)}
                        className="w-full text-left flex items-center justify-between px-4 py-2 rounded-lg text-xs font-black uppercase tracking-wider"
                        style={{ color: mobileCat === cat.slug ? '#2AAEDF' : 'rgba(255,255,255,0.7)' }}>
                        {cat.icon} {cat.label}
                        <svg className={`w-3 h-3 transition-transform ${mobileCat === cat.slug ? 'rotate-180' : ''}`}
                          fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/>
                        </svg>
                      </button>
                      {mobileCat === cat.slug && (
                        <div className="ml-4 space-y-0.5 mb-2">
                          <button onClick={() => goCategory(cat.slug)}
                            className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold"
                            style={{ color: '#2AAEDF' }}>
                            Tất cả {cat.label}
                          </button>
                          {cat.children.map(child => (
                            <button key={child.slug} onClick={() => goCategory(child.slug)}
                              className="w-full text-left px-3 py-1.5 rounded-lg text-xs"
                              style={{ color: 'rgba(255,255,255,0.6)' }}>
                              {child.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link to="/san-pham" className="block px-4 py-2.5 rounded-lg font-medium text-sm"
              style={{ color: 'rgba(255,255,255,0.8)' }}>
              Tất cả sản phẩm
            </Link>
            <Link to="/gioi-thieu" className="block px-4 py-2.5 rounded-lg font-medium text-sm"
              style={{ color: 'rgba(255,255,255,0.8)' }}>
              Giới thiệu
            </Link>
            <Link to="/lien-he" className="block px-4 py-2.5 rounded-lg font-medium text-sm"
              style={{ color: 'rgba(255,255,255,0.8)' }}>
              Liên hệ
            </Link>
            <a href={ZALO_URL} target="_blank" rel="noopener noreferrer"
              className="block px-4 py-2.5 font-bold text-sm" style={{ color: '#2AAEDF' }}>
              💬 Zalo: 0334 661 392
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
