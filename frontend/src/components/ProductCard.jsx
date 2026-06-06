import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import ProductModal from './ProductModal';

const ZALO_URL = 'https://zalo.me/0334661392';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [imgIdx, setImgIdx] = useState(0);
  const [addedAnim, setAddedAnim] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
    <>
    {showModal && <ProductModal product={product} onClose={() => setShowModal(false)} />}
    <div className="card-product group flex flex-col">
      {/* Image Gallery */}
      <div
        className="relative overflow-hidden flex-shrink-0 cursor-pointer"
        style={{ backgroundColor: '#F7F9FC', aspectRatio: '1/1' }}
        onClick={() => setShowModal(true)}>
        <img
          src={allImages[imgIdx]}
          alt={product.name}
          className="w-full h-full object-contain p-2 sm:p-3 transition-all duration-300 group-hover:scale-105"
          onError={e => { e.target.src = 'https://placehold.co/400x400/EBF8FD/2AAEDF?text=VH24'; }}
        />

        {allImages.length > 1 && (
          <>
            <button onClick={goPrev}
              className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shadow-md transition-all duration-200 md:opacity-0 md:group-hover:opacity-100"
              style={{ backgroundColor: 'rgba(255,255,255,0.92)', color: '#05051F' }}>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <button onClick={goNext}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shadow-md transition-all duration-200 md:opacity-0 md:group-hover:opacity-100"
              style={{ backgroundColor: 'rgba(255,255,255,0.92)', color: '#05051F' }}>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1 items-center">
              {allImages.map((_, i) => (
                <button key={i} onClick={(e) => goDot(e, i)}
                  className="rounded-full transition-all duration-200"
                  style={{
                    width: i === imgIdx ? '14px' : '5px',
                    height: '5px',
                    backgroundColor: i === imgIdx ? '#2AAEDF' : 'rgba(255,255,255,0.7)',
                  }} />
              ))}
            </div>
            <div className="absolute top-1.5 right-1.5 text-xs font-bold px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: 'rgba(5,5,31,0.55)', color: '#fff', fontSize: '10px' }}>
              {imgIdx + 1}/{allImages.length}
            </div>
          </>
        )}

        <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
          {product.is_new === 1 && <span className="badge-new">MỚI</span>}
          {discount && <span className="badge-sale">-{discount}%</span>}
          {isOutOfStock && (
            <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: '#EF4444', color: '#fff', fontSize: '10px' }}>
              HẾT HÀNG
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-1 p-2.5 sm:p-4">
        <p className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: '#718096', fontSize: '10px' }}>
          {product.brand_name}
        </p>
        <h3
          onClick={() => setShowModal(true)}
          className="font-bold leading-snug line-clamp-2 mb-1.5 flex-1 cursor-pointer hover:underline"
          style={{ color: '#05051F', fontSize: '12px' }}>
          {product.name}
        </h3>
        <div className="flex items-baseline gap-1.5 mb-1">
          <span className="font-black" style={{ color: '#2AAEDF', fontSize: '14px' }}>
            {price.toLocaleString()}đ
          </span>
          {product.sale_price && (
            <span className="line-through" style={{ color: '#718096', fontSize: '11px' }}>
              {product.price.toLocaleString()}đ
            </span>
          )}
        </div>
        <p className="font-medium mb-2.5" style={{
          color: isOutOfStock ? '#EF4444' : isLowStock ? '#F59E0B' : '#718096',
          fontSize: '10px',
        }}>
          {isOutOfStock ? 'Hết hàng' : isLowStock ? `Còn ${product.stock} sp` : `Còn ${product.stock} sp`}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-1.5 mt-auto">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className="flex-1 py-2 rounded-lg font-bold border-2 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1"
            style={{
              borderColor: addedAnim ? '#22C55E' : '#2AAEDF',
              color: addedAnim ? '#22C55E' : '#2AAEDF',
              fontSize: '11px',
            }}>
            {addedAnim ? (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
                Đã thêm
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
                Thêm
              </>
            )}
          </button>
          <a
            href={ZALO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2 rounded-lg font-bold text-white text-center transition-colors duration-200 flex items-center justify-center gap-1"
            style={{
              backgroundColor: isOutOfStock ? '#718096' : '#2AAEDF',
              cursor: isOutOfStock ? 'not-allowed' : 'pointer',
              fontSize: '11px',
            }}
            onClick={isOutOfStock ? (e) => e.preventDefault() : undefined}
            onMouseEnter={e => { if (!isOutOfStock) e.currentTarget.style.backgroundColor = '#2093BE'; }}
            onMouseLeave={e => { if (!isOutOfStock) e.currentTarget.style.backgroundColor = '#2AAEDF'; }}>
            <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z"/>
            </svg>
            Mua ngay
          </a>
        </div>
      </div>
    </div>
    </>;
}
