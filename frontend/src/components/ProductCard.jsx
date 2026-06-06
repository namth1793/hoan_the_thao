import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const ZALO_URL = 'https://zalo.me/0334661392';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [imgIdx, setImgIdx] = useState(0);
  const [addedAnim, setAddedAnim] = useState(false);

  const allImages = [product.image, ...(product.images || [])].filter(Boolean);
  const price = product.sale_price || product.price;
  const discount = product.sale_price ? Math.round((1 - product.sale_price / product.price) * 100) : null;

  const goPrev = (e) => { e.stopPropagation(); setImgIdx(i => (i - 1 + allImages.length) % allImages.length); };
  const goNext = (e) => { e.stopPropagation(); setImgIdx(i => (i + 1) % allImages.length); };
  const goDot = (e, i) => { e.stopPropagation(); setImgIdx(i); };

  const handleAddToCart = () => {
    addToCart(product);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1500);
  };

  const isLowStock = product.stock > 0 && product.stock <= 10;
  const isOutOfStock = product.stock <= 0;

  return (
    <div className="card-product group flex flex-col">
      {/* ── Image Gallery ── */}
      <div className="relative overflow-hidden flex-shrink-0" style={{ backgroundColor: '#F7F9FC', aspectRatio: '1/1' }}>
        {/* Main image */}
        <img
          src={allImages[imgIdx]}
          alt={product.name}
          className="w-full h-full object-contain p-3 transition-all duration-300"
          onError={e => { e.target.src = 'https://placehold.co/400x400/EBF8FD/2AAEDF?text=VH24'; }}
        />

        {/* Arrows — visible on hover (desktop) and always visible on mobile */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all duration-200 md:opacity-0 md:group-hover:opacity-100"
              style={{ backgroundColor: 'rgba(255,255,255,0.92)', color: '#05051F' }}
              aria-label="Ảnh trước">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <button
              onClick={goNext}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center shadow-md transition-all duration-200 md:opacity-0 md:group-hover:opacity-100"
              style={{ backgroundColor: 'rgba(255,255,255,0.92)', color: '#05051F' }}
              aria-label="Ảnh sau">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 items-center">
              {allImages.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => goDot(e, i)}
                  className="rounded-full transition-all duration-200"
                  style={{
                    width: i === imgIdx ? '16px' : '6px',
                    height: '6px',
                    backgroundColor: i === imgIdx ? '#2AAEDF' : 'rgba(255,255,255,0.7)',
                  }}
                  aria-label={`Ảnh ${i + 1}`}
                />
              ))}
            </div>

            {/* Image counter */}
            <div className="absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'rgba(5,5,31,0.55)', color: '#fff' }}>
              {imgIdx + 1}/{allImages.length}
            </div>
          </>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.is_new === 1 && <span className="badge-new">MỚI</span>}
          {discount && <span className="badge-sale">-{discount}%</span>}
          {isOutOfStock && (
            <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: '#EF4444', color: '#fff' }}>
              HẾT HÀNG
            </span>
          )}
        </div>
      </div>

      {/* ── Product Info ── */}
      <div className="flex flex-col flex-1 p-4">
        {/* Brand */}
        <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#718096' }}>
          {product.brand_name}
        </p>

        {/* Name */}
        <h3 className="font-bold text-sm leading-snug line-clamp-2 mb-2 flex-1" style={{ color: '#05051F' }}>
          {product.name}
        </h3>

        {/* Price row */}
        <div className="flex items-baseline gap-2 mb-1.5">
          <span className="text-lg font-black" style={{ color: '#2AAEDF' }}>
            {price.toLocaleString()}đ
          </span>
          {product.sale_price && (
            <span className="text-xs line-through" style={{ color: '#718096' }}>
              {product.price.toLocaleString()}đ
            </span>
          )}
        </div>

        {/* Stock */}
        <p className="text-xs font-medium mb-3"
          style={{ color: isOutOfStock ? '#EF4444' : isLowStock ? '#F59E0B' : '#718096' }}>
          {isOutOfStock ? 'Hết hàng' : isLowStock ? `⚡ Chỉ còn ${product.stock} sản phẩm` : `Còn ${product.stock} sản phẩm`}
        </p>

        {/* ── Action Buttons ── */}
        <div className="flex gap-2 mt-auto">
          {/* Add to cart */}
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold border-2 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1"
            style={{ borderColor: addedAnim ? '#22C55E' : '#2AAEDF', color: addedAnim ? '#22C55E' : '#2AAEDF' }}>
            {addedAnim ? (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
                Đã thêm
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                Giỏ hàng
              </>
            )}
          </button>

          {/* Buy via Zalo */}
          <a
            href={ZALO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white text-center transition-colors duration-200 flex items-center justify-center gap-1"
            style={{ backgroundColor: isOutOfStock ? '#718096' : '#2AAEDF', cursor: isOutOfStock ? 'not-allowed' : 'pointer' }}
            onClick={isOutOfStock ? (e) => e.preventDefault() : undefined}
            onMouseEnter={e => { if (!isOutOfStock) e.currentTarget.style.backgroundColor = '#2093BE'; }}
            onMouseLeave={e => { if (!isOutOfStock) e.currentTarget.style.backgroundColor = '#2AAEDF'; }}>
            {/* Zalo icon */}
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z"/>
            </svg>
            Mua ngay
          </a>
        </div>
      </div>
    </div>
  );
}
