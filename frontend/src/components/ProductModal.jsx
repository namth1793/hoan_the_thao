import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

const ZALO_URL = 'https://zalo.me/0334661392';

export default function ProductModal({ product, onClose }) {
  const { addToCart } = useCart();
  const [imgIdx, setImgIdx]           = useState(0);
  const [selectedSize, setSelectedSize]   = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [qty, setQty]                 = useState(1);
  const [addedAnim, setAddedAnim]     = useState(false);

  const allImages = [product.image, ...(product.images || [])].filter(Boolean);
  const price    = product.sale_price || product.price;
  const discount = product.sale_price
    ? Math.round((1 - product.sale_price / product.price) * 100) : null;
  const isOutOfStock = product.stock <= 0;
  const isLowStock   = product.stock > 0 && product.stock <= 10;

  // Lock body scroll + close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    document.body.classList.add('product-modal-open');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      document.body.classList.remove('product-modal-open');
    };
  }, [onClose]);

  const handleAddToCart = () => {
    addToCart({ ...product, selectedSize, selectedColor }, qty);
    setAddedAnim(true);
    setTimeout(() => { setAddedAnim(false); }, 1500);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 backdrop-blur-sm"
        style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        onClick={onClose}
      />

      {/* Modal — bottom sheet on mobile, centered dialog on sm+ */}
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4">
        <div
          className="relative bg-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col"
          style={{ maxHeight: '92vh' }}
          onClick={e => e.stopPropagation()}>

          {/* Drag handle (mobile only) */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-10 h-1 rounded-full" style={{ backgroundColor: '#E2E8F0' }} />
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-3 sm:right-3 w-8 h-8 rounded-full flex items-center justify-center transition-colors z-10"
            style={{ backgroundColor: 'rgba(5,5,31,0.07)', color: '#4A5568' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(5,5,31,0.14)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(5,5,31,0.07)'}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          {/* Scrollable body */}
          <div className="overflow-y-auto flex-1">
            <div className="flex flex-col sm:flex-row gap-0 sm:gap-6 p-4 sm:p-6">

              {/* ── Image gallery ── */}
              <div className="sm:w-64 sm:flex-shrink-0">
                {/* Main image */}
                <div className="relative aspect-square rounded-2xl overflow-hidden mb-2"
                  style={{ backgroundColor: '#F7F9FC' }}>
                  <img
                    src={allImages[imgIdx]}
                    alt={product.name}
                    className="w-full h-full object-contain p-4 transition-all duration-300"
                    onError={e => { e.target.src = 'https://placehold.co/400x400/EBF8FD/2AAEDF?text=VH24'; }}
                  />
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.is_new === 1 && (
                      <span className="badge-new">MỚI</span>
                    )}
                    {discount && (
                      <span className="badge-sale">-{discount}%</span>
                    )}
                  </div>
                </div>
                {/* Thumbnail strip */}
                {allImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {allImages.map((img, i) => (
                      <button key={i} onClick={() => setImgIdx(i)}
                        className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden transition-all"
                        style={{
                          border: `2px solid ${i === imgIdx ? '#2AAEDF' : 'rgba(5,5,31,0.1)'}`,
                          backgroundColor: '#F7F9FC',
                        }}>
                        <img src={img} alt="" className="w-full h-full object-contain p-1.5"
                          onError={e => { e.target.src = 'https://placehold.co/56x56/EBF8FD/2AAEDF?text=IMG'; }} />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Product info ── */}
              <div className="flex-1 pt-3 sm:pt-0">
                {/* Brand */}
                <p className="text-xs font-bold uppercase tracking-widest mb-1"
                  style={{ color: '#2AAEDF' }}>
                  {product.brand_name || 'VH24 SPORT'}
                </p>

                {/* Name */}
                <h2 className="font-black text-lg leading-snug mb-3" style={{ color: '#05051F' }}>
                  {product.name}
                </h2>

                {/* Price */}
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-2xl font-black" style={{ color: '#2AAEDF' }}>
                    {price.toLocaleString()}đ
                  </span>
                  {product.sale_price && (
                    <span className="text-base line-through font-medium" style={{ color: '#A0AEC0' }}>
                      {product.price.toLocaleString()}đ
                    </span>
                  )}
                </div>

                {/* Stock + sold */}
                <div className="flex items-center gap-4 mb-4">
                  <p className="text-xs font-semibold"
                    style={{ color: isOutOfStock ? '#EF4444' : isLowStock ? '#F59E0B' : '#22C55E' }}>
                    {isOutOfStock ? 'Hết hàng' : isLowStock ? `Chỉ còn ${product.stock} sản phẩm` : `Còn hàng (${product.stock} sp)`}
                  </p>
                  {product.sold_count > 0 && (
                    <p className="text-xs font-semibold" style={{ color: '#718096' }}>
                      Đã bán {product.sold_count >= 1000 ? `${(product.sold_count / 1000).toFixed(1).replace('.0','')}k` : product.sold_count}
                    </p>
                  )}
                </div>

                {/* Description */}
                {product.description && (
                  <p className="text-sm leading-relaxed mb-4 pb-4 border-b"
                    style={{ color: '#718096', borderColor: 'rgba(5,5,31,0.08)' }}>
                    {product.description}
                  </p>
                )}

                {/* Size selector */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#4A5568' }}>
                      Size{selectedSize && <span className="ml-2 font-black" style={{ color: '#2AAEDF' }}>— {selectedSize}</span>}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map(s => (
                        <button key={s} onClick={() => setSelectedSize(s === selectedSize ? '' : s)}
                          className="min-w-[40px] h-10 px-3 rounded-xl text-sm font-bold border-2 transition-all duration-150"
                          style={{
                            borderColor: selectedSize === s ? '#2AAEDF' : 'rgba(5,5,31,0.12)',
                            backgroundColor: selectedSize === s ? 'rgba(42,174,223,0.1)' : '#fff',
                            color: selectedSize === s ? '#2AAEDF' : '#4A5568',
                          }}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color selector */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#4A5568' }}>
                      Màu sắc{selectedColor && <span className="ml-2 font-black" style={{ color: '#2AAEDF' }}>— {selectedColor}</span>}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {product.colors.map(c => (
                        <button key={c} onClick={() => setSelectedColor(c === selectedColor ? '' : c)}
                          className="px-3 h-9 rounded-xl text-xs font-bold border-2 transition-all duration-150"
                          style={{
                            borderColor: selectedColor === c ? '#2AAEDF' : 'rgba(5,5,31,0.12)',
                            backgroundColor: selectedColor === c ? 'rgba(42,174,223,0.1)' : '#fff',
                            color: selectedColor === c ? '#2AAEDF' : '#4A5568',
                          }}>
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div className="mb-5">
                  <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: '#4A5568' }}>
                    Số lượng
                  </p>
                  <div className="flex items-center gap-0 w-fit rounded-xl overflow-hidden border-2"
                    style={{ borderColor: 'rgba(5,5,31,0.12)' }}>
                    <button
                      onClick={() => setQty(q => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center font-black text-lg transition-colors"
                      style={{ color: '#4A5568' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F7F9FC'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                      −
                    </button>
                    <span className="w-10 text-center font-black text-sm" style={{ color: '#05051F' }}>
                      {qty}
                    </span>
                    <button
                      onClick={() => setQty(q => Math.min(product.stock || 99, q + 1))}
                      className="w-10 h-10 flex items-center justify-center font-black text-lg transition-colors"
                      style={{ color: '#4A5568' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F7F9FC'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Sticky action footer ── */}
          <div className="p-4 sm:px-6 sm:pb-5 border-t flex gap-3"
            style={{ borderColor: 'rgba(5,5,31,0.08)' }}>
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="flex-1 py-3 rounded-2xl font-bold text-sm border-2 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                borderColor: addedAnim ? '#22C55E' : '#2AAEDF',
                color: addedAnim ? '#22C55E' : '#2AAEDF',
              }}>
              {addedAnim ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                  </svg>
                  Đã thêm vào giỏ
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                  </svg>
                  Thêm vào giỏ
                </>
              )}
            </button>

            <a
              href={`${ZALO_URL}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 rounded-2xl font-bold text-sm text-white text-center transition-colors duration-200 flex items-center justify-center gap-2"
              style={{ backgroundColor: isOutOfStock ? '#718096' : '#2AAEDF' }}
              onClick={isOutOfStock ? e => e.preventDefault() : undefined}
              onMouseEnter={e => { if (!isOutOfStock) e.currentTarget.style.backgroundColor = '#2093BE'; }}
              onMouseLeave={e => { if (!isOutOfStock) e.currentTarget.style.backgroundColor = isOutOfStock ? '#718096' : '#2AAEDF'; }}>
              <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z"/>
              </svg>
              Mua qua Zalo
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
