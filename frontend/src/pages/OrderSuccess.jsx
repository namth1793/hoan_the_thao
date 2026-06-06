import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

export default function OrderSuccess() {
  const [params] = useSearchParams();
  const code = params.get('code');

  return (
    <div className="pt-16 min-h-screen flex items-center justify-center bg-white">
      <div className="rounded-2xl p-10 max-w-lg w-full text-center mx-4"
        style={{ border: '1px solid rgba(5,5,31,0.08)', boxShadow: '0 20px 60px rgba(5,5,31,0.08)' }}>
        {/* Checkmark */}
        <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: 'rgba(34,197,94,0.12)' }}>
          <svg className="w-10 h-10" style={{ color: '#22C55E' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
          </svg>
        </div>

        <h1 className="text-2xl font-black mb-2" style={{ color: '#05051F' }}>Đặt hàng thành công!</h1>
        <p className="mb-5" style={{ color: '#718096' }}>Cảm ơn bạn đã mua hàng tại SoccerPro</p>

        {code && (
          <div className="rounded-2xl p-5 mb-6" style={{ backgroundColor: 'rgba(42,174,223,0.06)', border: '1px solid rgba(42,174,223,0.2)' }}>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#718096' }}>Mã đơn hàng</p>
            <p className="text-3xl font-black" style={{ color: '#2AAEDF' }}>{code}</p>
          </div>
        )}

        <div className="rounded-2xl p-5 mb-7 text-left space-y-3" style={{ backgroundColor: '#F7F9FC' }}>
          {[
            ['📦', 'Đơn hàng sẽ được xử lý trong', '1-2 giờ'],
            ['🚚', 'Giao hàng trong', '2-4 ngày làm việc'],
            ['📞', 'Nhân viên xác nhận qua', '0987 654 321'],
          ].map(([icon, text, bold]) => (
            <div key={text} className="flex items-center gap-3 text-sm" style={{ color: '#4A5568' }}>
              <span>{icon}</span>
              <span>{text} <strong style={{ color: '#05051F' }}>{bold}</strong></span>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Link to="/"
            className="flex-1 py-3 rounded-xl font-bold border-2 transition-colors duration-200 text-center"
            style={{ borderColor: '#05051F', color: '#05051F' }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#05051F'; e.currentTarget.style.color = '#fff'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#05051F'; }}>
            Về trang chủ
          </Link>
          <Link to="/san-pham"
            className="flex-1 py-3 rounded-xl font-bold text-white transition-colors duration-200 text-center"
            style={{ backgroundColor: '#2AAEDF' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2093BE'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2AAEDF'}>
            Tiếp tục mua
          </Link>
        </div>
      </div>
    </div>
  );
}
