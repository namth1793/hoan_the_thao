import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="pt-16 min-h-screen bg-white">
      {/* Hero */}
      <div className="relative overflow-hidden py-24" style={{ backgroundColor: '#05051F' }}>
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 right-20 w-64 h-64 rounded-full" style={{ backgroundColor: '#2AAEDF', filter: 'blur(80px)' }} />
          <div className="absolute bottom-10 left-20 w-48 h-48 rounded-full" style={{ backgroundColor: '#2AAEDF', filter: 'blur(60px)' }} />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <span className="text-4xl block mb-4">⚽</span>
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#2AAEDF' }}>Về chúng tôi</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-5">SoccerPro</h1>
          <p className="text-xl max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Hơn 10 năm đồng hành cùng người chơi bóng Việt Nam — nhà phân phối giày đá bóng chính hãng uy tín hàng đầu.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16 space-y-20">
        {/* Story */}
        <div className="grid md:grid-cols-2 gap-14 items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#2AAEDF' }}>Câu chuyện</p>
            <h2 className="text-2xl font-black mb-5" style={{ color: '#05051F' }}>Được xây dựng bởi tình yêu bóng đá</h2>
            <p className="leading-relaxed mb-4" style={{ color: '#4A5568' }}>
              SoccerPro được thành lập năm 2014 bởi những người đam mê bóng đá và am hiểu về giày cầu thủ. Chúng tôi nhận ra rằng người chơi bóng Việt Nam xứng đáng được sử dụng giày chính hãng với giá cả hợp lý.
            </p>
            <p className="leading-relaxed mb-4" style={{ color: '#4A5568' }}>
              Từ một cửa hàng nhỏ tại Đà Nẵng, SoccerPro phát triển thành chuỗi cung cấp giày đá bóng chính hãng với hơn 10.000 khách hàng trung thành trên cả nước.
            </p>
            <p className="leading-relaxed" style={{ color: '#4A5568' }}>
              Chúng tôi là đối tác phân phối chính thức của Nike, Adidas, Puma, New Balance và Mizuno tại Việt Nam.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[['2014', 'Năm thành lập'], ['10K+', 'Khách hàng'], ['500+', 'Mẫu giày'], ['5', 'Thương hiệu']].map(([num, label]) => (
              <div key={label} className="rounded-2xl p-7 text-center"
                style={{ backgroundColor: '#F7F9FC', border: '1px solid rgba(5,5,31,0.06)' }}>
                <p className="text-3xl font-black mb-1" style={{ color: '#2AAEDF' }}>{num}</p>
                <p className="text-sm" style={{ color: '#718096' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission */}
        <div className="rounded-3xl p-12 text-center" style={{ backgroundColor: '#F7F9FC', border: '1px solid rgba(5,5,31,0.06)' }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#2AAEDF' }}>Sứ mệnh</p>
          <blockquote className="text-xl font-semibold max-w-3xl mx-auto leading-relaxed" style={{ color: '#05051F' }}>
            "Mang đến cho mỗi cầu thủ Việt Nam — từ người mới bắt đầu đến cầu thủ chuyên nghiệp — cơ hội tiếp cận giày đá bóng chính hãng chất lượng cao với dịch vụ tư vấn tận tâm."
          </blockquote>
        </div>

        {/* Values */}
        <div>
          <div className="text-center mb-10">
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: '#2AAEDF' }}>Giá trị cốt lõi</p>
            <h2 className="text-2xl font-black" style={{ color: '#05051F' }}>Những gì chúng tôi tin tưởng</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: '🏆', title: 'Chính hãng tuyệt đối', desc: 'Cam kết 100% hàng chính hãng, có tem xác nhận và đầy đủ giấy tờ chứng minh nguồn gốc.' },
              { icon: '❤️', title: 'Tận tâm với khách hàng', desc: 'Đội ngũ chuyên gia sẵn sàng tư vấn để mỗi khách hàng tìm được đôi giày phù hợp nhất.' },
              { icon: '🌱', title: 'Phát triển bền vững', desc: 'Hỗ trợ các đội bóng địa phương và chương trình phát triển bóng đá trẻ Việt Nam.' },
            ].map(v => (
              <div key={v.title}
                className="rounded-2xl p-7 transition-all duration-300 cursor-default"
                style={{ border: '1px solid rgba(5,5,31,0.08)' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#2AAEDF'; e.currentTarget.style.backgroundColor = 'rgba(42,174,223,0.03)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(5,5,31,0.08)'; e.currentTarget.style.backgroundColor = 'transparent'; }}>
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="font-bold text-lg mb-3" style={{ color: '#05051F' }}>{v.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: '#718096' }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="rounded-3xl p-12 text-center" style={{ backgroundColor: '#05051F' }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#2AAEDF' }}>Bắt đầu ngay</p>
          <h2 className="text-2xl font-black text-white mb-3">Khám phá bộ sưu tập hôm nay</h2>
          <p className="mb-8" style={{ color: 'rgba(255,255,255,0.55)' }}>Hàng ngàn mẫu giày chính hãng đang chờ bạn</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/san-pham"
              className="font-bold px-10 py-4 rounded-xl text-white transition-colors duration-200"
              style={{ backgroundColor: '#2AAEDF' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#2093BE'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2AAEDF'}>
              Xem sản phẩm →
            </Link>
            <Link to="/lien-he"
              className="font-bold px-10 py-4 rounded-xl border-2 transition-colors duration-200"
              style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.85)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; }}>
              Liên hệ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
