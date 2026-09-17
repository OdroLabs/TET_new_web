"use client";

import React from "react";
import Footer from "../components/Footer";

export default function FooterPreviewPage() {
  return (
    <div className="min-h-screen flex flex-col justify-end bg-[#FDFCF9]">
      <div className="p-8 text-center text-slate-400 text-xs uppercase tracking-widest font-bold border-b border-slate-100">
        Footer Live Inspection Canvas
      </div>
      {/* Renders isolated footer */}
      <Footer />
    </div>
  );
}