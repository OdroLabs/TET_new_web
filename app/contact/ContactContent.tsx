"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

const API_BASE = (process.env.NEXT_PUBLIC_BACKEND_URL || "https://web-production-3c6bc.up.railway.app").replace(/\/+$/, "");

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function ContactPage() {
  const { t, getAssetUrl, isPreview } = useLanguage();

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receiptRef, setReceiptRef] = useState<string | null>(null);

  // Position-based scroll listener from Livewire Admin
  useEffect(() => {
    const handleScrollMessage = (event: MessageEvent) => {
      if (event.data?.type === "TET_SCROLL_TO_SECTION") {
        const { sectionId } = event.data;
        const target = document.getElementById(sectionId);
        if (target) {
          const targetY = target.getBoundingClientRect().top + window.pageYOffset - 90;
          window.scrollTo({ top: targetY, behavior: "smooth" });
        }
      }
    };
    window.addEventListener("message", handleScrollMessage);
    return () => window.removeEventListener("message", handleScrollMessage);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          message,
        }),
      });

      if (!res.ok) throw new Error("Submission failed");

      const data = await res.json();
      setReceiptRef(data.reference);
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#fdfcf9] text-[#2c3e50] selection:bg-pink-100 selection:text-[#2A8ACD] overflow-x-hidden scroll-smooth">
      
      {/* 1. HERO */}
      <section id="contact-hero" className="scroll-mt-28 max-w-7xl mx-auto px-6 pt-16 pb-12 text-center">
        <motion.div initial="initial" whileInView="whileInView" variants={fadeInUp}>
          <span className="text-[#8e7f71] font-bold tracking-[0.4em] text-[10px] uppercase mb-6 block">
            {t("ct_hero_label", "TRANS EQUALITY TRUST • CONNECT")}
          </span>
          {/* 👇 Applied #2A8ACD */}
          <h1 className="font-serif text-5xl md:text-7xl text-[#2A8ACD] mb-6 italic tracking-tight leading-tight">
            {t("ct_hero_title", "Connect with Us.")}
          </h1>
          <p className="max-w-xl mx-auto text-gray-500 leading-relaxed text-sm md:text-base italic">
            {t(
              "ct_hero_desc",
              "Whether you are seeking partnership, legal aid, or looking to support our mission, our institutional desk is ready to facilitate your inquiry."
            )}
          </p>
        </motion.div>
      </section>

      {/* 2. EMERGENCY INTERVENTION */}
      <section id="contact-crisis" className="scroll-mt-28 max-w-7xl mx-auto px-6 mb-20">
        <div className="bg-[#334155] rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(51,65,85,0.3)]">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#e8d5c4]/10 rounded-full blur-[80px] -mr-40 -mt-40"></div>

          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
            <div className="max-w-xl text-center lg:text-left">
              <span className="inline-block px-4 py-1 rounded-full bg-[#e8d5c4]/10 border border-[#e8d5c4]/20 text-[#e8d5c4] text-[9px] font-bold uppercase tracking-[0.3em] mb-6">
                {t("ct_crisis_badge", "Crisis Protocol Active")}
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 italic">
                {t("ct_crisis_title", "Urgent Safety Assistance")}
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed opacity-80">
                {t(
                  "ct_crisis_desc",
                  "If you are facing illegal detention, harassment, or medical mistreatment, our emergency response team is available 24/7 for direct legal aid and safe-access intervention."
                )}
              </p>
            </div>
            <div className="flex flex-col items-center lg:items-end gap-4">
              <a
                href={`tel:${t("ct_crisis_phone", "+94 11 234 5678").replace(/[^0-9+]/g, "")}`}
                className="group bg-white text-[#334155] px-10 py-5 rounded-full font-bold text-lg hover:bg-[#e8d5c4] transition-all flex items-center gap-3 shadow-lg active:scale-95 whitespace-nowrap"
              >
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                {t("ct_crisis_phone", "+94 11 234 5678")}
              </a>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest italic">
                Confidential • 24/7 • Secure
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CONTACT INFO GRID */}
      <section id="contact-cards" className="scroll-mt-28 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
        {[
          { id: 1, label: "General Inquiries", val: "info@transequalitytrust.lk", sub: "For institutional partnerships." },
          { id: 2, label: "Media & Press", val: "media@transequalitytrust.lk", sub: "Official statements & interviews." },
          { id: 3, label: "Office Registry", val: "Colombo 05, Sri Lanka", sub: "Central District HQ." },
        ].map((item) => (
          <motion.div
            key={item.id}
            initial="initial"
            whileInView="whileInView"
            variants={fadeInUp}
            transition={{ delay: item.id * 0.1 }}
            className="bg-white p-10 rounded-[2.5rem] border border-[#f3f0ec] hover:shadow-lg hover:border-[#2A8ACD] transition-all group"
          >
            <p className="text-[#8e7f71] text-[9px] font-bold uppercase tracking-[0.3em] mb-6">
              {t(`ct_g${item.id}_label`, item.label)}
            </p>
            <h4 className="font-serif text-xl text-[#2A8ACD] mb-2">
              {t(`ct_g${item.id}_val`, item.val)}
            </h4>
            <p className="text-gray-400 text-xs italic">
              {t(`ct_g${item.id}_sub`, item.sub)}
            </p>
          </motion.div>
        ))}
      </section>

      {/* 4. FORM SECTION */}
      <section id="contact-form" className="scroll-mt-28 max-w-7xl mx-auto px-6 pb-24">
        <div className="bg-white rounded-[4rem] overflow-hidden shadow-2xl border border-[#f3f0ec] flex flex-col lg:flex-row">
          <div className="w-full lg:w-3/5 p-12 md:p-20">
            <h3 className="font-serif text-3xl md:text-4xl text-[#2A8ACD] mb-10 tracking-tight">
              {t("ct_form_title", "Send a Message.")}
            </h3>

            {receiptRef ? (
              <div className="p-8 bg-sky-50 rounded-3xl border border-sky-100 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl mx-auto">
                  ✓
                </div>
                <h4 className="font-serif text-2xl font-bold text-[#2A8ACD]">Inquiry Dispatched</h4>
                <p className="text-slate-600 text-xs leading-relaxed max-w-sm mx-auto">
                  Thank you. Your message reference is <strong className="font-mono text-[#2A8ACD]">{receiptRef}</strong>. Our desk officers will respond as soon as possible.
                </p>
                <button
                  type="button"
                  onClick={() => setReceiptRef(null)}
                  className="bg-[#2A8ACD] hover:bg-[#2374b0] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider mt-4 cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border-b border-gray-200 py-4 focus:border-[#2A8ACD] outline-none transition-colors bg-transparent text-sm"
                      placeholder="Full Name"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border-b border-gray-200 py-4 focus:border-[#2A8ACD] outline-none transition-colors bg-transparent text-sm"
                      placeholder="hello@domain.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                    Phone / WhatsApp Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border-b border-gray-200 py-4 focus:border-[#2A8ACD] outline-none transition-colors bg-transparent text-sm"
                    placeholder="07X XXX XXXX"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full border-b border-gray-200 py-4 focus:border-[#2A8ACD] outline-none transition-colors bg-transparent text-sm resize-none"
                    placeholder="How can our desk assist you?"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-[#2A8ACD] hover:bg-[#2374b0] text-white px-12 py-4 rounded-full text-[10px] font-bold tracking-widest hover:shadow-xl transition-all uppercase active:scale-95 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Transmitting..." : t("ct_form_btn", "Submit Inquiry")}
                </button>
              </form>
            )}
          </div>

          <div className="hidden lg:block w-2/5 relative min-h-[480px]">
            <Image
              src={getAssetUrl(
                "ct_form_img",
                "https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
              )}
              fill
              alt="Community Desk"
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 30vw"
              unoptimized={isPreview}
            />
            <div className="absolute inset-0 bg-[#2A8ACD]/10 backdrop-blur-[1px]"></div>
          </div>
        </div>
      </section>
    </div>
  );
}