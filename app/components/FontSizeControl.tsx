"use client";

import React, { useState, useEffect } from 'react';

export default function FontSizeControl() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    // Set the CSS variable on the html tag
    document.documentElement.style.setProperty('--font-scale', scale.toString());
  }, [scale]);

  const sizes = [
    { label: 'A-', value: 0.9, title: 'Small' },
    { label: 'A', value: 1, title: 'Default' },
    { label: 'A+', value: 1.15, title: 'Large' },
  ];

  return (
    <div className="flex items-center gap-1 border-l border-gray-200 pl-6 ml-4">
      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mr-2">Text</span>
      <div className="flex bg-gray-100 p-1 rounded-full">
        {sizes.map((s) => (
          <button
            key={s.label}
            onClick={() => setScale(s.value)}
            className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
              scale === s.value 
                ? 'bg-white text-[#1a365d] shadow-sm scale-110' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
            title={s.title}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}