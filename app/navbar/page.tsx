"use client";

import React from "react";
import Navbar from "../components/Navbar";

export default function NavbarPreviewPage() {
  return (
    <div className="min-h-screen bg-[#FDFCF9]">
      {/* Renders isolated navbar */}
      <Navbar />
      <div className="p-20 text-center text-slate-400 text-xs uppercase tracking-widest font-bold">
        Header &amp; Navigation Live Inspection Canvas
      </div>
    </div>
  );
}