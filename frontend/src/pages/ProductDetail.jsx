import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';

const API = 'http://localhost:5032/api';

export default function ProductDetail() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`${API}/products/${slug}`).then(r => {
      setProduct(r.data);
      setSelectedSize(r.data.sizes?.[0] || '');
      setSelectedColor(r.data.colors?.[0] || '');
    }).finally(() => setLoading(false));
  }, [slug]);

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) return;
    addToCart(product, selectedSize, selectedColor);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <div className="pt-16 min-h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: '#2AAEDF', borderTopColor: 'transparent' }} />
    </div>
  );

  if (!product) return (
    <div className="pt-16 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">😕</div>
        <p className="font-bold" style={{ color: '#05051F' }}>Không tìm thấy sản phẩm</p>
        <Link to="/san-pham" className="mt-4 inline-block text-sm font-semibold" style={{ color: '#2AAEDF' }}>← Quay lại</Link>
      </div>
    </div>
  );

  const images = [product.image, ...(product.images || [])].filter(Boolean);
  const price = product.sale_price || product.price;
  const discount = product.sale_price ? Math.round((1 - product.sale_price / product.price) * 100) : null;

  return (
    <div className="pt-16 min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b" style={{ borderColor: 'rgba(5,5,31,0.06)' }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm" style={{ color: '#718096' }}>
          <Link to="/" className="hover:text-[#2AAEDF] transition-colors">Trang chủ</Link>
          <span>/</span>
          <Link to="/san-pham" className="hover:text-[#2AAEDF] transition-colors">Sản phẩm</Link>
          <span>/</span>
          <span className="font-medium truncate max-w-xs" style={{ color: '#05051F' }}>{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="rounded-2xl overflow-hidden mb-4 aspect-square flex items-center justify-center"
              style={{ backgroundColor: '#F7F9FC' }}>
              <img src={images[activeImg]} alt={product.name}
                className="w-full h-full object-contain p-10"
                onError={e => { e.target.src = 'https://placehold.co/600x600/EBF8FD/2AAEDF?text=SoccerPro'; }} />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200 p-1"
                    style={{
                      borderColor: activeImg === i ? '#2AAEDF' : 'rgba(5,5,31,0.08)',
                      backgroundColor: '#F7F9FC',
                    }}>
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-bold uppercase tracking-wider" style={{ color: '#718096' }}>{product.brand_name}</span>
              {product.is_new === 1 && <span className="badge-new">MỚI</span>}
              {discount && <span className="badge-sale">-{discount}%</span>}
            </div>

            <h1 className="text-2xl font-black leading-tight mb-4" style={{ color: '#05051F' }}>{product.name}</h1>

            <div className="flex items-center gap-2 mb-5">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-200'}`}
                    fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                ))}
              </div>
              <span className="text-sm" style={{ color: '#718096' }}>{product.rating} ({product.reviews_count} đánh giá)</span>
            </div>

            <div className="flex items-baseline gap-3 pb-6 mb-6 border-b" style={{ borderColor: 'rgba(5,5,31,0.06)' }}>
              <span className="text-4xl font-black" style={{ color: '#2AAEDF' }}>{price.toLocaleString()}đ</span>
              {product.sale_price && (
                <span className="text-xl line-through" style={{ color: '#718096' }}>{product.price.toLocaleString()}đ</span>
              )}
            </div>

            {/* Size */}
            <div className="mb-6">
              <p className="font-bold text-sm mb-3" style={{ color: '#05051F' }}>
                Size: <span style={{ color: '#2AAEDF' }}>{selectedSize}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(s => (
                  <button key={s} onClick={() => setSelectedSize(s)}
                    className="w-11 h-11 rounded-xl text-sm font-bold border-2 transition-all duration-200"
                    style={{
                      borderColor: selectedSize === s ? '#2AAEDF' : 'rgba(5,5,31,0.12)',
                      backgroundColor: selectedSize === s ? 'rgba(42,174,223,0.08)' : '#fff',
                      color: selectedSize === s ? '#2AAEDF' : '#4A5568',
                    }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="mb-8">
              <p className="font-bold text-sm mb-3" style={{ color: '#05051F' }}>
                Màu sắc: <span style={{ color: '#2AAEDF' }}>{selectedColor}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(c => (
                  <button key={c} onClick={() => setSelectedColor(c)}
                    className="px-4 py-2 rounded-xl text-sm border-2 transition-all duration-200 font-medium"
                    style={{
                      borderColor: selectedColor === c ? '#2AAEDF' : 'rgba(5,5,31,0.12)',
                      backgroundColor: selectedColor === c ? 'rgba(42,174,223,0.08)' : '#fff',
                      color: selectedColor === c ? '#2AAEDF' : '#4A5568',
                    }}>
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={handleAddToCart}
              disabled={!selectedSize || !selectedColor}
              className="w-full py-4 rounded-xl font-black text-lg text-white transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: added ? '#22C55E' : '#2AAEDF' }}
              onMouseEnter={e => { if (!added && !e.currentTarget.disabled) e.currentTarget.style.backgroundColor = '#2093BE'; }}
              onMouseLeave={e => { if (!added) e.currentTarget.style.backgroundColor = added ? '#22C55E' : '#2AAEDF'; }}>
              {added ? '✓ Đã thêm vào giỏ!' : 'Thêm vào giỏ hàng'}
            </button>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {[['✅', 'Hàng chính hãng 100%'], ['🚀', 'Giao hàng 2-4 ngày'], ['🔄', 'Đổi trả 30 ngày'], ['💎', 'Bảo hành chính hãng']].map(([icon, text]) => (
                <div key={text} className="flex items-center gap-2 text-sm" style={{ color: '#718096' }}>
                  <span>{icon}</span><span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mt-12 pt-10 border-t" style={{ borderColor: 'rgba(5,5,31,0.06)' }}>
            <h2 className="text-xl font-black mb-5" style={{ color: '#05051F' }}>Mô tả sản phẩm</h2>
            <p className="leading-relaxed max-w-3xl" style={{ color: '#4A5568' }}>{product.description}</p>
            <div className="mt-8 grid md:grid-cols-3 gap-4">
              {[
                ['Thương hiệu', product.brand_name],
                ['Loại sân', product.category_name],
                ['Tình trạng', `Còn hàng (${product.stock})`],
              ].map(([label, val]) => (
                <div key={label} className="rounded-2xl p-5" style={{ backgroundColor: '#F7F9FC', border: '1px solid rgba(5,5,31,0.06)' }}>
                  <p className="text-xs font-bold uppercase tracking-wide mb-1" style={{ color: '#718096' }}>{label}</p>
                  <p className="font-bold" style={{ color: '#05051F' }}>{val}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
