import React, { useState } from 'react';

const ZALO_URL = 'https://zalo.me/0334661392';
const PHONE    = '0334661392';

export default function FloatingZalo() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-4 z-50 flex flex-col items-end gap-2">

      {/* Expanded quick-action panel */}
      <div
        className="flex flex-col items-end gap-2 transition-all duration-300 origin-bottom-right"
        style={{
          opacity: expanded ? 1 : 0,
          transform: expanded ? 'scale(1) translateY(0)' : 'scale(0.85) translateY(10px)',
          pointerEvents: expanded ? 'auto' : 'none',
        }}>

        {/* Phone call */}
        <a href={`tel:${PHONE}`}
          className="flex items-center gap-2.5 pl-3 pr-4 py-2.5 rounded-2xl font-bold text-sm text-white shadow-lg transition-transform active:scale-95"
          style={{ backgroundColor: '#05051F' }}>
          <span className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
            </svg>
          </span>
          {PHONE}
        </a>

        {/* Zalo chat */}
        <a href={ZALO_URL} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2.5 pl-3 pr-4 py-2.5 rounded-2xl font-bold text-sm text-white shadow-lg transition-transform active:scale-95"
          style={{ backgroundColor: '#2AAEDF' }}>
          <span className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z"/>
            </svg>
          </span>
          Nhắn Zalo
        </a>
      </div>

      {/* Main FAB */}
      <button
        onClick={() => setExpanded(v => !v)}
        aria-label="Liên hệ"
        className="zalo-fab w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl transition-all duration-200"
        style={{ backgroundColor: '#2AAEDF' }}>
        {expanded ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/>
          </svg>
        ) : (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z"/>
          </svg>
        )}
      </button>
    </div>
  );
}
