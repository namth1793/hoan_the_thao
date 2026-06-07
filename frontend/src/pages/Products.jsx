import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { CATEGORIES } from '../constants/categories';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5032/api';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts]   = useState([]);
  const [total, setTotal]         = useState(0);
  const [pages, setPages]         = useState(1);
  const [brands, setBrands]       = useState([]);
  const [openParents, setOpenParents] = useState({});
  const [loading, setLoading]     = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const page     = Number(searchParams.get('page') || 1);
  const category = searchParams.get('category') || '';
  const brand    = searchParams.get('brand') || '';
  const sort     = searchParams.get('sort') || '';
  const search   = searchParams.get('search') || '';
  const featured = searchParams.get('featured') || '';

  const fetchProducts = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (brand) params.set('brand', brand);
    if (sort) params.set('sort', sort);
    if (search) params.set('search', search);
    if (featured) params.set('featured', featured);
    params.set('page', page);
    params.set('limit', 12);
    axios.get(`${API}/products?${params}`).then(r => {
      setProducts(r.data.products);
      setTotal(r.data.total);
      setPages(r.data.pages);
    }).finally(() => setLoading(false));
  }, [category, brand, sort, search, featured, page]);

  useEffect(() => {
    axios.get(`${API}/brands`).then(r => setBrands(r.data));
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const setFilter = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    if (key !== 'page') p.delete('page');
    setSearchParams(p);
    setSidebarOpen(false);
  };

  const FilterBtn = ({ active, onClick, children }) => (
    <button onClick={onClick}
      className="w-full text-left text-sm px-3 py-2 rounded-lg transition-colors duration-200 font-medium"
      style={{
        backgroundColor: active ? 'rgba(42,174,223,0.1)' : 'transparent',
        color: active ? '#2AAEDF' : '#4A5568',
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = '#F7F9FC'; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = 'transparent'; }}>
      {children}
    </button>
  );

  const SidebarContent = () => (
    <>
      <div className="rounded-2xl p-4 mb-4" style={{ backgroundColor: '#F7F9FC', border: '1px solid rgba(5,5,31,0.06)' }}>
        <h3 className="font-black text-xs uppercase tracking-widest mb-3" style={{ color: '#05051F' }}>Danh mục</h3>
        <div className="space-y-0.5">
          <FilterBtn active={!category} onClick={() => setFilter('category', '')}>Tất cả sản phẩm</FilterBtn>
          {CATEGORIES.map(cat => {
            const isParentActive = category === cat.slug;
            const isChildActive  = cat.children.some(c => c.slug === category);
            const isOpen = openParents[cat.slug] ?? isChildActive;
            return (
              <div key={cat.slug}>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setFilter('category', cat.slug)}
                    className="flex-1 text-left text-sm px-3 py-2 rounded-lg transition-colors font-bold"
                    style={{
                      backgroundColor: isParentActive ? 'rgba(42,174,223,0.1)' : 'transparent',
                      color: isParentActive ? '#2AAEDF' : '#05051F',
                    }}>
                    {cat.label}
                  </button>
                  <button
                    onClick={() => setOpenParents(p => ({ ...p, [cat.slug]: !isOpen }))}
                    className="p-1 rounded-md flex-shrink-0"
                    style={{ color: '#718096' }}>
                    <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7"/>
                    </svg>
                  </button>
                </div>
                {isOpen && (
                  <div className="ml-3 border-l pl-2 space-y-0.5 mt-0.5"
                    style={{ borderColor: 'rgba(42,174,223,0.2)' }}>
                    {cat.children.map(child => (
                      <FilterBtn key={child.slug}
                        active={category === child.slug}
                        onClick={() => setFilter('category', child.slug)}>
                        {child.label}
                      </FilterBtn>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl p-4" style={{ backgroundColor: '#F7F9FC', border: '1px solid rgba(5,5,31,0.06)' }}>
        <h3 className="font-black text-xs uppercase tracking-widest mb-3" style={{ color: '#05051F' }}>Thương Hiệu</h3>
        <div className="space-y-0.5">
          <FilterBtn active={!brand} onClick={() => setFilter('brand', '')}>Tất cả</FilterBtn>
          {brands.map(b => (
            <FilterBtn key={b.id} active={brand === b.slug} onClick={() => setFilter('brand', b.slug)}>
              {b.name}
            </FilterBtn>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <div className="pt-14 sm:pt-16 min-h-screen bg-white">
      {/* Page header */}
      <div className="py-8 sm:py-12" style={{ backgroundColor: '#05051F' }}>
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: '#2AAEDF' }}>VH24 SPORT</p>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Tất Cả Sản Phẩm</h1>
          <p className="mt-1.5 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Trang thiết bị thể thao chính hãng</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-5 sm:py-8">
        {/* Top bar */}
        <div className="flex flex-wrap gap-2 sm:gap-3 items-center justify-between mb-5 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              className="md:hidden flex items-center gap-2 border rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              style={{ borderColor: '#E2E8F0', color: '#05051F' }}
              onClick={() => setSidebarOpen(!sidebarOpen)}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M6 8h12M9 12h6"/>
              </svg>
              Bộ lọc
              {(category || brand) && (
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#2AAEDF' }} />
              )}
            </button>
            <span className="text-sm" style={{ color: '#718096' }}>
              <span className="font-bold" style={{ color: '#05051F' }}>{total}</span> sản phẩm
            </span>
          </div>

          <div className="flex gap-2 items-center">
            <input type="text" placeholder="Tìm kiếm..." defaultValue={search}
              className="border rounded-lg px-3 py-2 text-sm w-36 sm:w-44 outline-none transition-colors"
              style={{ borderColor: '#E2E8F0', color: '#05051F' }}
              onFocus={e => e.target.style.borderColor = '#2AAEDF'}
              onBlur={e => e.target.style.borderColor = '#E2E8F0'}
              onKeyDown={e => e.key === 'Enter' && setFilter('search', e.target.value)} />
            <select value={sort} onChange={e => setFilter('sort', e.target.value)}
              className="border rounded-lg px-2 sm:px-3 py-2 text-sm bg-white outline-none cursor-pointer"
              style={{ borderColor: '#E2E8F0', color: '#05051F' }}>
              <option value="">Mặc định</option>
              <option value="newest">Mới nhất</option>
              <option value="price_asc">Giá tăng</option>
              <option value="price_desc">Giá giảm</option>
              <option value="rating">Đánh giá</option>
            </select>
          </div>
        </div>

        <div className="flex gap-5 sm:gap-7">
          {/* Sidebar — desktop always visible */}
          <aside className="w-48 sm:w-52 flex-shrink-0 hidden md:block">
            <SidebarContent />
          </aside>

          {/* Mobile sidebar drawer */}
          {sidebarOpen && (
            <div className="md:hidden fixed inset-0 z-40" onClick={() => setSidebarOpen(false)}>
              <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }} />
              <div className="absolute left-0 top-0 bottom-0 w-72 overflow-y-auto p-4 pt-16"
                style={{ backgroundColor: '#fff' }}
                onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-black text-sm uppercase" style={{ color: '#05051F' }}>Bộ lọc</span>
                  <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-lg" style={{ color: '#718096' }}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
                <SidebarContent />
              </div>
            </div>
          )}

          {/* Products grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-2xl h-64 animate-pulse" style={{ backgroundColor: '#F7F9FC' }} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 sm:py-20">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#F7F9FC' }}>
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: '#CBD5E0' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4m8-7v14"/>
                  </svg>
                </div>
                <p className="text-base font-bold mb-1" style={{ color: '#05051F' }}>Không tìm thấy sản phẩm</p>
                <p className="text-sm" style={{ color: '#718096' }}>Thử thay đổi bộ lọc hoặc từ khóa</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5">
                  {products.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
                {pages > 1 && (
                  <div className="flex justify-center gap-2 mt-8 sm:mt-10">
                    {[...Array(pages)].map((_, i) => (
                      <button key={i} onClick={() => setFilter('page', i + 1)}
                        className="w-9 h-9 rounded-lg text-sm font-bold transition-colors duration-200"
                        style={{
                          backgroundColor: page === i + 1 ? '#2AAEDF' : '#F7F9FC',
                          color: page === i + 1 ? '#fff' : '#4A5568',
                          border: `1px solid ${page === i + 1 ? '#2AAEDF' : 'rgba(5,5,31,0.08)'}`,
                        }}>
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
