"use client";

import React from 'react';

export default function Logo({ className = "h-12" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 300 80" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      <path 
        d="M40 25C40 15 50 10 60 20C70 30 50 45 40 55C30 45 10 30 20 20C30 10 40 15 40 25Z" 
        stroke="#D88998" 
        strokeWidth="2.5" 
        strokeLinecap="round"
      />
      <circle cx="40" cy="35" r="15" stroke="#1A365D" strokeWidth="1.5" strokeDasharray="4 2" />
      
      {/* Typography */}
      <text 
        x="70" 
        y="42" 
        fill="#1A365D" 
        style={{ font: 'bold 28px serif', letterSpacing: '-0.05em' }}
      >
        TET
      </text>
      
      <text 
        x="70" 
        y="60" 
        fill="#8e7f71" 
        style={{ font: 'bold 9px sans-serif', letterSpacing: '0.4em', textTransform: 'uppercase' }}
      >
        Trans Equality Trust
      </text>
    </svg>
  );
}