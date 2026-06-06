import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5032/api';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const page = Number(searchParams.get('page') || 1);
  const category = searchParams.get('category') || '';
  const brand = searchParams.get('brand') || '';
  const sort = searchParams.get('sort') || '';
  const search = searchParams.get('search') || '';
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
    axios.get(`${API}/categories`).then(r => setCategories(r.data));
    axios.get(`${API}/brands`).then(r => setBrands(r.data));
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const setFilter = (key, val) => {
    const p = new URLSearchParams(searchParams);
    if (val) p.set(key, val); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
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

  return (
    <div className="pt-16 min-h-screen bg-white">
      {/* Page header */}
      <div className="py-12" style={{ backgroundColor: '#05051F' }}>
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#2AAEDF' }}>SoccerPro Store</p>
          <h1 className="text-3xl font-black text-white">Tất Cả Sản Phẩm</h1>
          <p className="mt-2" style={{ color: 'rgba(255,255,255,0.5)' }}>Tìm kiếm giày đá bóng phù hợp với bạn</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Top bar */}
        <div className="flex flex-wrap gap-3 items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden flex items-center gap-2 border rounded-lg px-3 py-2 text-sm font-medium transition-colors"
              style={{ borderColor: '#E2E8F0', color: '#05051F' }}
              onClick={() => setSidebarOpen(!sidebarOpen)}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18M6 8h12M9 12h6"/>
              </svg>
              Bộ lọc
            </button>
            <span className="text-sm" style={{ color: '#718096' }}>
              <span className="font-bold" style={{ color: '#05051F' }}>{total}</span> sản phẩm
            </span>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <input type="text" placeholder="Tìm kiếm..." defaultValue={search}
              className="border rounded-lg px-3 py-2 text-sm w-44 outline-none transition-colors"
              style={{ borderColor: '#E2E8F0', color: '#05051F' }}
              onFocus={e => e.target.style.borderColor = '#2AAEDF'}
              onBlur={e => e.target.style.borderColor = '#E2E8F0'}
              onKeyDown={e => e.key === 'Enter' && setFilter('search', e.target.value)} />
            <select value={sort} onChange={e => setFilter('sort', e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm bg-white outline-none cursor-pointer"
              style={{ borderColor: '#E2E8F0', color: '#05051F' }}>
              <option value="">Mặc định</option>
              <option value="newest">Mới nhất</option>
              <option value="price_asc">Giá tăng dần</option>
              <option value="price_desc">Giá giảm dần</option>
              <option value="rating">Đánh giá cao</option>
            </select>
          </div>
        </div>

        <div className="flex gap-7">
          {/* Sidebar */}
          <aside className={`w-52 flex-shrink-0 space-y-5 ${sidebarOpen ? 'block' : 'hidden md:block'}`}>
            <div className="rounded-2xl p-4" style={{ backgroundColor: '#F7F9FC', border: '1px solid rgba(5,5,31,0.06)' }}>
              <h3 className="font-black text-xs uppercase tracking-widest mb-3" style={{ color: '#05051F' }}>Loại Sân</h3>
              <div className="space-y-0.5">
                <FilterBtn active={!category} onClick={() => setFilter('category', '')}>Tất cả</FilterBtn>
                {categories.map(c => (
                  <FilterBtn key={c.id} active={category === c.slug} onClick={() => setFilter('category', c.slug)}>
                    {c.name}
                  </FilterBtn>
                ))}
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
          </aside>

          {/* Products grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="rounded-2xl h-72 animate-pulse" style={{ backgroundColor: '#F7F9FC' }} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">👟</div>
                <p className="text-lg font-bold mb-1" style={{ color: '#05051F' }}>Không tìm thấy sản phẩm</p>
                <p className="text-sm" style={{ color: '#718096' }}>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                  {products.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
                {pages > 1 && (
                  <div className="flex justify-center gap-2 mt-10">
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
