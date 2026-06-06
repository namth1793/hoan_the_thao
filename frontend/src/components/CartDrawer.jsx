import React from 'react';
import { useCart } from '../context/CartContext';

const ZALO_URL = 'https://zalo.me/0334661392';

export default function CartDrawer() {
  const { items, removeItem, updateQty, total, count, isOpen, setIsOpen } = useCart();

  if (!isOpen) return null;

  const zaloMessage = items.length > 0
    ? `Xin chào VH24 SPORT! Tôi muốn mua:\n` + items.map(i => `- ${i.name} x${i.qty}`).join('\n')
    : null;

  const zaloHref = zaloMessage
    ? `${ZALO_URL}?text=${encodeURIComponent(zaloMessage)}`
    : ZALO_URL;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 text-white" style={{ backgroundColor: '#05051F' }}>
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="VH24 SPORT" className="h-8 w-8 rounded-lg object-cover" />
            <div>
              <p className="font-black text-sm leading-none">Giỏ hàng</p>
              {count > 0 && <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.6)' }}>{count} sản phẩm</p>}
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg opacity-70 hover:opacity-100 transition-opacity">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: '#F7F9FC' }}>
                <svg className="w-10 h-10" style={{ color: '#718096' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                </svg>
              </div>
              <p className="font-bold mb-1" style={{ color: '#05051F' }}>Chưa có sản phẩm</p>
              <p className="text-sm mb-4" style={{ color: '#718096' }}>Thêm sản phẩm yêu thích vào đây</p>
              <button onClick={() => setIsOpen(false)}
                className="font-semibold text-sm transition-colors"
                style={{ color: '#2AAEDF' }}>
                Tiếp tục xem sản phẩm →
              </button>
            </div>
          ) : items.map(item => (
            <div key={item.key} className="flex gap-3 rounded-xl p-3" style={{ backgroundColor: '#F7F9FC' }}>
              <img src={item.image} alt={item.name}
                className="w-16 h-16 object-contain bg-white rounded-lg flex-shrink-0 p-1"
                onError={e => { e.target.src = 'https://placehold.co/64x64/EBF8FD/2AAEDF?text=VH'; }} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-xs line-clamp-2 leading-snug" style={{ color: '#05051F' }}>{item.name}</p>
                <p className="text-xs mt-0.5" style={{ color: '#718096' }}>{item.brand}</p>
                <p className="font-black text-sm mt-1" style={{ color: '#2AAEDF' }}>{item.price.toLocaleString()}đ</p>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => updateQty(item.key, item.qty - 1)}
                    className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-xs hover:border-gray-400 transition-colors">
                    −
                  </button>
                  <span className="font-bold text-sm w-4 text-center" style={{ color: '#05051F' }}>{item.qty}</span>
                  <button onClick={() => updateQty(item.key, item.qty + 1)}
                    className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center font-bold text-xs hover:border-gray-400 transition-colors">
                    +
                  </button>
                  <button onClick={() => removeItem(item.key)} className="ml-auto text-red-400 hover:text-red-600 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t bg-white space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-sm" style={{ color: '#4A5568' }}>Tạm tính:</span>
              <span className="text-xl font-black" style={{ color: '#05051F' }}>{total.toLocaleString()}đ</span>
            </div>

            {/* Zalo CTA */}
            <a href={zaloHref} target="_blank" rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 text-white font-black py-4 rounded-xl transition-colors duration-200 text-base"
              style={{ backgroundColor: '#2AAEDF' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2093BE'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2AAEDF'}>
              <svg className="w-5 h-5" viewBox="0 0 48 48" fill="currentColor">
                <path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm2 28.5l-8-12h4v-9l8 12h-4v9z"/>
              </svg>
              Liên hệ Zalo để đặt hàng
            </a>

            <p className="text-center text-xs" style={{ color: '#718096' }}>
              Nhắn tin Zalo để được tư vấn & đặt hàng nhanh nhất
            </p>
          </div>
        )}
      </div>
    </>
  );
}
