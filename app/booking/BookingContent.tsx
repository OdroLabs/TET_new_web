"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, Variants, AnimatePresence } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

const API_BASE = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000").replace(/\/+$/, "");

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 24 },
  whileInView: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export interface ProductItem {
  id: number;
  title: Record<string, string> | string;
  description: Record<string, string> | string;
  price: number;
  currency: string;
  specs: string;
  badge: string;
  icon: string;
}

export default function BookingPage({ initialProducts = null }: { initialProducts?: ProductItem[] | null }) {
  const { t, getAssetUrl, isPreview, locale } = useLanguage();
  const [productsList, setProductsList] = useState<ProductItem[]>(initialProducts ?? []);

  // Modal Order / Booking State
  const [activeInquiry, setActiveInquiry] = useState<{
    type: "product_order" | "hall_booking";
    itemName: string;
    unitPrice?: number;
  } | null>(null);

  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receiptRef, setReceiptRef] = useState<string | null>(null);

  // 1. Fetch live product catalog
  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/products`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && Array.isArray(data)) {
            setProductsList(data);
          }
        }
      } catch (err) {
        console.warn("Products API unavailable:", err);
      }
    };
    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Cross-origin position scroll listener
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

  const resolveText = (val: Record<string, string> | string | undefined, fallback = "") => {
    if (!val) return fallback;
    if (typeof val === "object") return val[locale] || val["en"] || Object.values(val)[0] || fallback;
    return String(val);
  };

  const openOrderModal = (prod: ProductItem) => {
    setActiveInquiry({
      type: "product_order",
      itemName: resolveText(prod.title),
      unitPrice: prod.price,
    });
    setQuantity(1);
    setReceiptRef(null);
  };

  const openHallModal = () => {
    setActiveInquiry({
      type: "hall_booking",
      itemName: t("se_hall_name"),
    });
    setQuantity(1);
    setReceiptRef(null);
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInquiry) return;
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/api/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          type: activeInquiry.type,
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_email: customerEmail,
          item_name: activeInquiry.itemName,
          quantity: quantity,
          estimated_total: activeInquiry.unitPrice ? activeInquiry.unitPrice * quantity : null,
          message: notes,
        }),
      });

      if (!res.ok) throw new Error("Submission failed");
      const data = await res.json();
      setReceiptRef(data.reference);
      setCustomerName("");
      setCustomerPhone("");
      setCustomerEmail("");
      setNotes("");
    } catch (err) {
      console.error(err);
      alert(t("ui_booking_error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#f8fbff] text-slate-800 selection:bg-pink-100 selection:text-[#2A8ACD] overflow-x-hidden scroll-smooth">
      
      {/* 1. HERO SECTION */}
      <section id="se-hero" className="scroll-mt-28 relative max-w-7xl mx-auto px-6 pt-16 pb-20 md:pt-28 text-center">
        <motion.div initial="initial" whileInView="whileInView" viewport={{ once: true }} variants={fadeInUp}>
          <span className="text-[#2A8ACD] font-bold tracking-[0.3em] text-[11px] uppercase mb-4 px-4 py-1.5 bg-sky-50 rounded-full border border-[var(--tet-pink)]/40 inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
            {t("se_hero_badge")}
          </span>

          <h1 className="font-serif text-5xl md:text-7xl font-bold text-[#2A8ACD] mb-6 tracking-tight leading-tight">
            {t("se_hero_title1")}{" "}
            <span className="text-pride-gradient italic font-normal font-playfair">
              {t("se_hero_title2")}
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-600 text-sm md:text-base leading-relaxed mb-10">
            {t(
              "se_hero_desc"
            )}
          </p>

          <div className="flex flex-wrap justify-center gap-3">
            <a href="#hall-booking" className="px-5 py-2.5 rounded-full bg-white border border-[#2A8ACD]/30 text-[#2A8ACD] text-xs font-bold hover:border-pink-300 hover:shadow-sm transition-all">
              
              {t("ui_booking_hall_booking")}
            </a>
            <a href="#daily-care" className="px-5 py-2.5 rounded-full bg-white border border-[#2A8ACD]/30 text-[#2A8ACD] text-xs font-bold hover:border-pink-300 hover:shadow-sm transition-all">
              
              {t("ui_booking_daily_care_center")}
            </a>
            <a href="#condom-business" className="px-5 py-2.5 rounded-full bg-white border border-pink-200 text-pink-700 text-xs font-bold hover:bg-pink-50 hover:shadow-sm transition-all">
              
              {t("ui_booking_safe_products_condoms")}
            </a>
          </div>
        </motion.div>
      </section>

      <section id="hall-booking" className="scroll-mt-28 py-20 max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-3xl md:rounded-[3.5rem] p-8 md:p-16 border border-sky-200/80 shadow-md flex flex-col lg:flex-row items-center gap-12">
          
          <div className="w-full lg:w-1/2 relative h-[380px] md:h-[500px] rounded-2xl md:rounded-[2.5rem] overflow-hidden bg-sky-100 shadow-xl border-4 border-white">
            <Image
              src={getAssetUrl("se_hall_img")}
              fill
              alt={t("ui_booking_tet_hall_booking")}
              className="object-cover"
              priority
              unoptimized={isPreview}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-sky-950/40 via-transparent to-transparent"></div>
            <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl text-xs font-bold text-[#2A8ACD] border border-sky-200">
              {t("se_hall_capacity")}
            </div>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col items-start text-left">
            <span className="text-[#2A8ACD] font-bold tracking-[0.25em] text-[10px] uppercase mb-2 px-3 py-1 bg-sky-50 rounded-full border border-sky-200">
              {t("se_hall_tag")}
            </span>

            <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#2A8ACD] mb-4 leading-tight">
              {t("se_hall_title1")} <br />
              <span className="text-pride-gradient italic font-normal">
                {t("se_hall_title2")}
              </span>
            </h2>

            <p className="text-slate-600 text-sm leading-relaxed mb-6">
              {t(
                "se_hall_desc"
              )}
            </p>

            <div className="grid grid-cols-2 gap-4 w-full mb-8 text-xs">
              <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100">
                <span className="font-bold text-[#2A8ACD] block">{t("ui_booking_audio_visual_equipment")}</span>
                <span className="text-slate-500 text-[11px]">{t("ui_booking_hd_projectors_and_pa_sound")}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100">
                <span className="font-bold text-[#2A8ACD] block">{t("ui_booking_kitchen_and_catering_access")}</span>
                <span className="text-slate-500 text-[11px]">{t("ui_booking_tea_coffee_and_dining_service")}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100">
                <span className="font-bold text-[#2A8ACD] block">{t("ui_booking_accessible_and_safe_space")}</span>
                <span className="text-slate-500 text-[11px]">{t("ui_booking_zero_discrimination_guarantee")}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100">
                <span className="font-bold text-[#2A8ACD] block">{t("ui_booking_competitive_rates")}</span>
                <span className="text-slate-500 text-[11px]">{t("ui_booking_hourly_half_day_and_full")}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={openHallModal}
              className="bg-[#2A8ACD] hover:bg-[#2374b0] text-white px-8 py-3.5 rounded-full text-xs font-black uppercase tracking-widest shadow-md shadow-pink-200/50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              {t("se_hall_btn")}
            </button>
          </div>
        </div>
      </section>

      {/* 3. BUSINESS 2: DAILY CARE CENTER */}
      <section id="daily-care" className="scroll-mt-28 py-20 bg-gradient-to-b from-[#ebf6ff]/70 via-white to-[#fdf2f8]/70 border-y border-sky-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <span className="text-pink-600 font-bold uppercase text-[10px] tracking-[0.25em] block mb-2">
              {t("se_care_tag")}
            </span>
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#2A8ACD] mb-4">
              {t("se_care_title1")}{" "}
              <span className="text-pride-gradient italic font-normal">
                {t("se_care_title2")}
              </span>
            </h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed">
              {t(
                "se_care_desc"
              )}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[1, 2, 3].map((n) => ({
              title: t(`se_care_${n}_title`),
              desc: t(`se_care_${n}_desc`),
              icon: t(`se_care_${n}_icon`),
              tag: t(`se_care_${n}_tag`),
            })).map((srv, idx) => (
              <div
                key={idx}
                className="bg-white/95 p-8 rounded-3xl border border-sky-200/80 shadow-sm hover:shadow-lg hover:border-[#2A8ACD] transition-all flex flex-col justify-between"
              >
                <div>
                  <span className="text-4xl mb-4 block">{srv.icon}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-pink-600 bg-pink-50 px-3 py-1 rounded-full border border-pink-200 inline-block mb-3">
                    {srv.tag}
                  </span>
                  
                  <h3 className="font-serif text-xl font-bold text-[#2A8ACD] mb-3">{srv.title}</h3>
                  <p className="text-slate-600 text-xs leading-relaxed">{srv.desc}</p>
                </div>
       
                <div className="pt-6 mt-4 border-t border-sky-50 text-[11px] font-bold text-[#2A8ACD]">
                  
                  {t("ui_booking_daily_and_monthly_packages_available")}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section> 

      {/* 4. BUSINESS 3: DYNAMIC PRODUCTS (CONDOMS & WELLNESS) */}
      <section id="condom-business" className="scroll-mt-28 py-24 max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-3xl md:rounded-[3.5rem] p-8 md:p-16 border-2 border-pink-200 shadow-xl overflow-hidden relative">
          <div className="max-w-2xl mb-12 text-left">
            <span className="text-pink-600 font-bold uppercase text-[10px] tracking-[0.25em] block mb-2">
              {t("se_prod_tag")}
            </span>
          
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#2A8ACD] mb-4">
              {t("se_prod_title1")} <br />
              <span className="text-pride-gradient italic font-normal font-playfair">
                {t("se_prod_title2")}
              </span>
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              {t(
                "se_prod_desc"
              )}
            </p>
          </div>

          {/* DYNAMIC PRODUCTS CATALOG */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {productsList.map((prod) => (
              <div
                key={prod.id}
                className="bg-gradient-to-b from-sky-50/50 to-pink-50/30 p-7 rounded-3xl border border-sky-100 flex flex-col justify-between hover:border-[#2A8ACD] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{prod.icon}</span>
                    {prod.badge && (
                      <span className="text-[10px] font-bold text-pink-700 bg-pink-100 px-3 py-1 rounded-full uppercase">
                        {prod.badge}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-serif text-lg font-bold text-[#2A8ACD] mb-2">
                    {resolveText(prod.title)}
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed mb-4">
                    {resolveText(prod.description)}
                  </p>
                  <div className="text-[11px] font-semibold text-[#2A8ACD] mb-1">{prod.specs}</div>
                </div>

                <div className="pt-4 border-t border-sky-200/60 flex items-center justify-between">
                  <span className="text-sm font-black text-[#2A8ACD]">
                    {prod.currency} {Number(prod.price).toLocaleString()}
                  </span>
                  <button
                    type="button"
                    onClick={() => openOrderModal(prod)}
                    className="text-[10px] font-bold text-pink-600 hover:text-pink-700 uppercase cursor-pointer"
                  >
                    
                    {t("ui_booking_order_now")}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-2xl bg-white border border-pink-100 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 text-slate-700 font-semibold">
              <span>📦</span>{" "}{t("ui_booking_100_discreet_islandwide_delivery")}
            </div>
            <div className="flex items-center gap-2 text-slate-700 font-semibold">
              <span>🏢</span>{" "}{t("ui_booking_bulk_supplies_for_ngos_clinics")}
            </div>
            <div className="flex items-center gap-2 text-slate-700 font-semibold">
              <span>🧪</span>{" "}{t("ui_booking_international_quality_iso_tested")}
            </div>
          </div>
        </div>
      </section>

      {/* 5. INQUIRY / CHECKOUT MODAL */}
      <AnimatePresence>
        {activeInquiry && (
          <div 
            onClick={() => setActiveInquiry(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-sky-950/60 backdrop-blur-md overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-lg rounded-3xl p-8 md:p-10 shadow-2xl border border-sky-100 relative my-auto"
            >
              <button
                onClick={() => setActiveInquiry(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>

              {receiptRef ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-2xl mx-auto">
                    ✓
                  </div>
                  {/* 👇 Applied #2A8ACD */}
                  <h3 className="font-serif text-2xl font-bold text-[#2A8ACD]">{t("ui_booking_inquiry_received")}</h3>
                  <p className="text-slate-600 text-xs leading-relaxed max-w-xs mx-auto">
                    {/* 👇 Applied #2A8ACD */}
                    
                    {t("ui_booking_your_request_reference_is")}{" "}<strong className="font-mono text-[#2A8ACD]">{receiptRef}</strong>{t("ui_booking_our_commercial_team_will_call")}
                  </p>
                  {/* 👇 Applied #2A8ACD */}
                  <button
                    onClick={() => setActiveInquiry(null)}
                    className="bg-[#2A8ACD] hover:bg-[#2374b0] text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider mt-4 cursor-pointer"
                  >
                    
                    {t("ui_booking_close")}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-4">
                  <div>
                    <span className="text-[10px] font-black uppercase text-pink-600 tracking-widest block">
                      {activeInquiry.type === "product_order" ? t("ui_booking_order_request") : t("ui_booking_venue_inquiry")}
                    </span>
                  
                    <h3 className="font-serif text-xl font-bold text-[#2A8ACD] mt-0.5">
                      {activeInquiry.itemName}
                    </h3>
                  </div>

                  {activeInquiry.type === "product_order" && activeInquiry.unitPrice && (
                    <div className="p-3 bg-sky-50 rounded-xl flex items-center justify-between text-xs">
                      <span className="text-slate-500">{t("ui_booking_unit_price")}</span>
                      <strong className="text-[#2A8ACD]">{t("ui_booking_lkr")}{" "}{activeInquiry.unitPrice.toLocaleString()}</strong>
                    </div>
                  )}

                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">{t("ui_booking_your_full_name")}</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder={t("ui_booking_e_g_priyantha_silva")}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-pink-400"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">{t("ui_booking_contact_phone_whatsapp")}</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder={t("ui_booking_07x_xxx_xxxx")}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-pink-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">{t("ui_booking_email_optional")}</label>
                      <input
                        type="email"
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder={t("ui_booking_name_mail_com")}
                        className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
                      />
                    </div>

                    {activeInquiry.type === "product_order" && (
                      <div>
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">{t("ui_booking_quantity_packs")}</label>
                        <input
                          type="number"
                          min="1"
                          required
                          value={quantity}
                          onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                          className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                      {activeInquiry.type === "product_order" ? t("ui_booking_notes_label_order") : t("ui_booking_notes_label_venue")}
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder={activeInquiry.type === "product_order" ? t("ui_booking_notes_placeholder_order") : t("ui_booking_notes_placeholder_venue")}
                      className="w-full border border-slate-200 rounded-xl px-3 py-2 text-xs h-16 outline-none focus:ring-1 focus:ring-pink-400"
                    ></textarea>
                  </div>

              
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#2A8ACD] hover:bg-[#2374b0] text-white py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer disabled:opacity-50 mt-2"
                  >
                    {isSubmitting ? t("ui_booking_sending") : t("ui_booking_submit")}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}