import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../constants/categories';
import { useCart } from '../context/CartContext';

const ZALO_URL = 'https://zalo.me/0334661392';

export default function Navbar() {
  const { count, setIsOpen } = useCart();
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const [catOpen, setCatOpen]     = useState(false);
  const [mobileCat, setMobileCat] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const megaRef  = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => { setMenuOpen(false); setCatOpen(false); }, [location]);

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
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex items-center justify-between h-14 sm:h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <img src="/logo.jpg" alt="VH24 SPORT"
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl object-cover"
              style={{ border: '2px solid rgba(42,174,223,0.3)' }} />
            <div>
              <p className="font-black text-white text-sm leading-tight">VH24 SPORT</p>
              <p className="text-xs leading-none hidden sm:block" style={{ color: '#2AAEDF' }}>Đồ Thể Thao Chính Hãng</p>
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

              {catOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[680px] rounded-2xl shadow-2xl p-5 z-50"
                  style={{ backgroundColor: '#0D0D2A', border: '1px solid rgba(42,174,223,0.15)' }}
                  onMouseEnter={openMega} onMouseLeave={closeMega}>
                  <div className="grid grid-cols-4 gap-5">
                    {CATEGORIES.map(cat => (
                      <div key={cat.slug}>
                        <button onClick={() => goCategory(cat.slug)}
                          className="w-full text-left font-black text-xs uppercase tracking-wider mb-2 pb-1.5 border-b transition-colors"
                          style={{ color: '#2AAEDF', borderColor: 'rgba(42,174,223,0.2)' }}
                          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                          onMouseLeave={e => e.currentTarget.style.color = '#2AAEDF'}>
                          {cat.label}
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
              0334 661 392
            </a>
            <button onClick={() => setIsOpen(true)}
              className="relative p-2 sm:p-2.5 rounded-xl text-white transition-colors duration-200 flex items-center gap-1"
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
          <div className="md:hidden pb-3 border-t max-h-[75vh] overflow-y-auto"
            style={{ borderColor: 'rgba(255,255,255,0.08)' }}>

            {/* Quick links row */}
            <div className="flex gap-2 pt-3 pb-2">
              <Link to="/" className="flex-1 text-center py-2 rounded-lg text-sm font-medium"
                style={{ backgroundColor: isActive('/') ? 'rgba(42,174,223,0.15)' : 'rgba(255,255,255,0.06)', color: isActive('/') ? '#2AAEDF' : 'rgba(255,255,255,0.8)' }}>
                Trang chủ
              </Link>
              <Link to="/san-pham" className="flex-1 text-center py-2 rounded-lg text-sm font-medium"
                style={{ backgroundColor: isActive('/san-pham') ? 'rgba(42,174,223,0.15)' : 'rgba(255,255,255,0.06)', color: isActive('/san-pham') ? '#2AAEDF' : 'rgba(255,255,255,0.8)' }}>
                Sản phẩm
              </Link>
              <Link to="/lien-he" className="flex-1 text-center py-2 rounded-lg text-sm font-medium"
                style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.8)' }}>
                Liên hệ
              </Link>
            </div>

            {/* Zalo bar */}
            <a href={ZALO_URL} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 mb-3 rounded-xl font-bold text-sm"
              style={{ backgroundColor: 'rgba(42,174,223,0.15)', color: '#2AAEDF' }}>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z"/>
              </svg>
              Zalo: 0334 661 392
            </a>

            {/* Categories */}
            <p className="text-xs font-black uppercase tracking-widest px-1 mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
              Danh mục
            </p>
            <div className="space-y-1">
              {CATEGORIES.map(cat => (
                <div key={cat.slug} className="rounded-xl overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                  <button
                    onClick={() => setMobileCat(mobileCat === cat.slug ? null : cat.slug)}
                    className="w-full flex items-center justify-between px-3 py-2.5"
                    style={{ color: mobileCat === cat.slug ? '#2AAEDF' : 'rgba(255,255,255,0.85)' }}>
                    <span className="text-sm font-bold">{cat.label}</span>
                    <svg className={`w-3.5 h-3.5 flex-shrink-0 transition-transform ${mobileCat === cat.slug ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/>
                    </svg>
                  </button>

                  {mobileCat === cat.slug && (
                    <div className="px-3 pb-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                      <button
                        onClick={() => goCategory(cat.slug)}
                        className="w-full text-left py-1.5 text-xs font-bold mt-1.5"
                        style={{ color: '#2AAEDF' }}>
                        Tất cả {cat.label}
                      </button>
                      <div className="grid grid-cols-2 gap-x-3">
                        {cat.children.map(child => (
                          <button key={child.slug}
                            onClick={() => goCategory(child.slug)}
                            className="text-left py-1.5 text-xs border-b"
                            style={{ color: 'rgba(255,255,255,0.6)', borderColor: 'rgba(255,255,255,0.05)' }}>
                            {child.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
