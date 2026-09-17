"use client";

import React, { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

const API_BASE = (process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000").replace(/\/+$/, "");

const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  whileInView: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  },
};

export default function DonatePage() {
  const { t, locale } = useLanguage();
  
  // Selection State
  const [selectedAmount, setSelectedAmount] = useState("5000");
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank_transfer">("card");
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Status & Receipt State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<{
    reference: string;
    amount: number;
    payment_method: string;
    bank_details?: {
      bank_name: string;
      account_name: string;
      account_number: string;
      branch: string;
      swift_code: string;
    };
  } | null>(null);

  // Cross-origin scroll listener
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "TET_SCROLL_TO_SECTION") {
        const { sectionId } = event.data;
        const target = document.getElementById(sectionId);
        if (target) {
          const targetY = target.getBoundingClientRect().top + window.pageYOffset - 90;
          window.scrollTo({ top: targetY, behavior: "smooth" });
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    if (e.target.value) {
      setSelectedAmount(e.target.value);
    }
  };

  const selectPreset = (amt: string) => {
    setSelectedAmount(amt);
    setCustomAmount("");
  };

  const finalAmount = customAmount || selectedAmount || "5000";

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/api/donations`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(finalAmount),
          donor_name: isAnonymous ? "Anonymous Donor" : donorName,
          donor_email: donorEmail,
          payment_method: paymentMethod,
          is_anonymous: isAnonymous,
        }),
      });

      if (!res.ok) throw new Error("Failed to process donation");

      const data = await res.json();
      setReceipt(data);
    } catch (err) {
      console.error(err);
      alert("Something went wrong while recording your donation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-[#f8fbff] text-slate-800 selection:bg-pink-100 selection:text-[#2A8ACD] overflow-x-hidden min-h-screen scroll-smooth">
      
      {/* 1. HERO SECTION */}
      <section id="donate-hero" className="scroll-mt-28 max-w-7xl mx-auto px-6 pt-16 pb-12 text-center">
        <motion.div initial="initial" whileInView="whileInView" viewport={{ once: true }} variants={fadeInUp}>
         
          <span className="text-[#2A8ACD] font-bold tracking-[0.3em] text-[11px] uppercase mb-4 px-4 py-1.5 bg-sky-50 rounded-full border border-[var(--tet-pink)]/40 inline-flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
            {t("dn_hero_label", "TRANS EQUALITY TRUST • INVEST IN CHANGE")}
          </span>

         
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-[#2A8ACD] mb-6 tracking-tight leading-tight">
            {t("dn_hero_title1", "Invest in")}{" "}
            <span className="text-pride-gradient italic font-normal font-playfair">
              {t("dn_hero_title2", "Equality & Dignity.")}
            </span>
          </h1>

          <p className="max-w-xl mx-auto text-slate-600 leading-relaxed text-sm md:text-base">
            {t(
              "dn_hero_desc",
              "Your financial support directly enables 24/7 legal aid, safe healthcare access, emergency shelter, and dignity for transgender individuals across Sri Lanka."
            )}
          </p>
        </motion.div>
      </section>

      {/* 2. DONATION INTERFACE CARD */}
      <section id="donate-desk" className="scroll-mt-28 max-w-4xl mx-auto px-6 pb-28">
        <motion.div 
          initial="initial" 
          whileInView="whileInView" 
          viewport={{ once: true }} 
          variants={fadeInUp} 
          className="bg-white rounded-3xl md:rounded-[3rem] shadow-xl border border-sky-200/80 overflow-hidden"
        >
          <div className="bg-gradient-to-r from-sky-500 via-sky-400 to-pink-400 p-8 md:p-12 text-white text-center relative overflow-hidden">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-3 relative z-10">
              {t("dn_desk_title", "Contribution Desk")}
            </h2>
            <p className="text-sky-50 text-xs md:text-sm max-w-md mx-auto relative z-10 leading-relaxed">
              {t("dn_desk_desc", "Select an amount to fund specific advocacy programs and emergency community services.")}
            </p>
          </div>

          <div className="p-8 md:p-14">
            {receipt ? (
              // RECEIPT & DEPOSIT INSTRUCTIONS SCREEN
              <div className="space-y-6 text-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto border border-emerald-300">
                  ✓
                </div>
               
                <h3 className="font-serif text-3xl font-bold text-[#2A8ACD]">Thank You for Your Support!</h3>
                <p className="text-slate-600 text-xs md:text-sm max-w-md mx-auto">
                  Your commitment has been recorded with reference <strong className="font-mono text-[#2A8ACD]">{receipt.reference}</strong> for <strong className="text-pink-600">LKR {Number(receipt.amount).toLocaleString()}</strong>.
                </p>

                {receipt.payment_method === "bank_transfer" && receipt.bank_details && (
                  <div className="bg-sky-50/80 border border-sky-200 p-6 rounded-3xl max-w-md mx-auto text-left text-xs space-y-2 mt-6">
                    <span className="font-bold text-[#2A8ACD] uppercase tracking-wider block mb-2 text-[10px]">
                      🏦 Direct Bank Deposit Instructions:
                    </span>
                    <p><strong className="text-slate-700">Bank:</strong> {receipt.bank_details.bank_name}</p>
                    <p><strong className="text-slate-700">Account Name:</strong> {receipt.bank_details.account_name}</p>
                    <p><strong className="text-slate-700">Account Number:</strong> {receipt.bank_details.account_number}</p>
                    <p><strong className="text-slate-700">Branch:</strong> {receipt.bank_details.branch}</p>
                    <p><strong className="text-slate-700">Swift Code:</strong> {receipt.bank_details.swift_code}</p>
                    <div className="mt-4 pt-3 border-t border-sky-200/60 text-[11px] text-slate-500 italic">
                      Please use reference <strong>{receipt.reference}</strong> in your deposit description and email deposit slips to finance@transequalitytrust.lk.
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setReceipt(null)}
                  className="bg-[#2A8ACD] hover:bg-[#2374b0] text-white px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest mt-6 cursor-pointer"
                >
                  Make Another Contribution
                </button>
              </div>
            ) : (
              // DONATION FORM
              <form onSubmit={handleSubmit} className="space-y-12">
                <div>
                
                  <label className="text-xs font-bold text-[#2A8ACD] uppercase tracking-widest mb-6 block text-center">
                    {t("dn_desk_amt_label", "Select Amount (LKR)")}
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {["1000", "5000", "10000", "25000"].map((amt) => (
                      <button 
                        key={amt} 
                        type="button" 
                        onClick={() => selectPreset(amt)} 
                       
                        className={`py-4 rounded-2xl font-serif text-xl font-bold transition-all border-2 cursor-pointer ${
                          selectedAmount === amt && !customAmount
                            ? "bg-gradient-to-r from-sky-400 to-pink-400 text-white border-transparent shadow-md shadow-pink-200/60 scale-105" 
                            : "bg-white text-[#2A8ACD] border-sky-100 hover:border-pink-300 hover:bg-sky-50/50"
                        }`}
                      >
                        {amt}
                      </button>
                    ))}
                  </div>

                  <div className="mt-6 flex justify-center">
                    <div className="relative w-full max-w-sm">
                      <input 
                        type="number" 
                        placeholder="Or enter custom amount (LKR)" 
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                        className="w-full text-center border-b-2 border-sky-200 py-3 focus:border-pink-400 outline-none bg-sky-50/30 rounded-t-lg text-sm text-[#2A8ACD] placeholder-slate-400 transition-colors" 
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <h4 className="text-[11px] font-black text-[#2A8ACD] uppercase tracking-widest border-b border-sky-100 pb-2">
                      {t("dn_id_title", "Donor Identity")}
                    </h4>
                    <div className="space-y-4">
                      <input 
                        type="text" 
                        placeholder="Full Name" 
                        value={donorName}
                        disabled={isAnonymous}
                        onChange={(e) => setDonorName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-sky-200 focus:border-[#2A8ACD] focus:ring-2 focus:ring-sky-100 outline-none text-sm transition-all bg-sky-50/20 disabled:opacity-50" 
                      />
                      <input 
                        type="email" 
                        placeholder="Email Address" 
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-sky-200 focus:border-[#2A8ACD] focus:ring-2 focus:ring-sky-100 outline-none text-sm transition-all bg-sky-50/20" 
                      />
                    </div>
                    <div className="flex items-center gap-3 pt-1">
                      <input 
                        type="checkbox" 
                        id="anon" 
                        checked={isAnonymous}
                        onChange={(e) => setIsAnonymous(e.target.checked)}
                        className="w-4 h-4 accent-pink-500 rounded cursor-pointer" 
                      />
                      <label htmlFor="anon" className="text-xs text-slate-500 cursor-pointer">
                        {t("dn_id_anon", "I prefer to remain an anonymous donor")}
                      </label>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-[11px] font-black text-[#2A8ACD] uppercase tracking-widest border-b border-sky-100 pb-2">
                      {t("dn_pay_title", "Payment Preference")}
                    </h4>
                    <div className="space-y-3.5">
                      <label 
                        onClick={() => setPaymentMethod("card")}
                        className={`flex items-center gap-4 p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                          paymentMethod === "card" ? "border-[#2A8ACD] bg-sky-50/60" : "border-sky-100 hover:border-pink-300"
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="pay" 
                          checked={paymentMethod === "card"}
                          onChange={() => setPaymentMethod("card")}
                          className="accent-[#2A8ACD] w-4 h-4 cursor-pointer" 
                        />
                        <span className="text-sm font-semibold text-[#2A8ACD]">
                          💳 {t("dn_pay_opt1", "Credit / Debit Card")}
                        </span>
                      </label>

                      <label 
                        onClick={() => setPaymentMethod("bank_transfer")}
                        className={`flex items-center gap-4 p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                          paymentMethod === "bank_transfer" ? "border-pink-400 bg-pink-50/60" : "border-sky-100 hover:border-pink-300"
                        }`}
                      >
                        <input 
                          type="radio" 
                          name="pay" 
                          checked={paymentMethod === "bank_transfer"}
                          onChange={() => setPaymentMethod("bank_transfer")}
                          className="accent-pink-500 w-4 h-4 cursor-pointer" 
                        />
                        {/* 👇 Applied #2A8ACD */}
                        <span className="text-sm font-semibold text-[#2A8ACD]">
                          🏦 {t("dn_pay_opt2", "Direct Bank Transfer")}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-sky-100 text-center">
        
                  <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="bg-[#2A8ACD] hover:bg-[#2374b0] text-white px-14 py-4 rounded-full text-xs font-black tracking-widest uppercase shadow-md shadow-pink-200/60 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? "Processing..." : `${t("dn_desk_btn", "Donate LKR")} ${Number(finalAmount).toLocaleString()} ${locale === "en" ? "Now" : ""}`}
                  </button>

                  <div className="mt-8 flex justify-center items-center gap-4 md:gap-6 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  
                    <span className="flex items-center gap-1.5 text-[#2A8ACD]">
                      <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {t("dn_badge1", "SSL Encrypted")}
                    </span>
                    <span className="w-1 h-1 bg-sky-300 rounded-full"></span>
                    <span className="text-[#2A8ACD]">{t("dn_badge2", "Verified NGO")}</span>
                    <span className="w-1 h-1 bg-sky-300 rounded-full"></span>
                    <span className="text-[#2A8ACD]">{t("dn_badge3", "100% Confidential")}</span>
                  </div>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </section>

      {/* 3. TRANSPARENCY SECTION */}
      <section id="donate-transparency" className="scroll-mt-28 py-24 bg-gradient-to-b from-[#ebf6ff]/70 via-white to-[#fdf2f8]/70 border-t border-sky-100 rounded-t-[3rem] md:rounded-t-[5rem]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-pink-600 font-bold uppercase text-[10px] tracking-[0.25em] block mb-2">
              {t("dn_imp_label", "Institutional Accountability")}
            </span>
    
            <h3 className="font-serif text-3xl md:text-5xl font-bold text-[#2A8ACD] mb-3">
              {t("dn_imp_title", "Where your investment goes.")}
            </h3>
            <p className="text-slate-600 text-xs md:text-sm max-w-lg mx-auto">
              Every rupee donated is audited and allocated directly to core human rights defenses and community protection networks.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { id: 1, val: "40%", title: "Legal Aid & Defense", desc: "Direct legal representation for community members facing arbitrary detentions and police harassment." },
              { id: 2, val: "35%", title: "Healthcare & Safe Housing", desc: "Affirmative medical consultations, hormone therapy support, and emergency crisis shelter beds." },
              { id: 3, val: "25%", title: "Systemic Advocacy", desc: "Constitutional reform drafting, police sensitization workshops, and national awareness programs." }
            ].map((item) => (
              <div 
                key={item.id} 
                className="bg-white/90 p-8 rounded-3xl border border-sky-200/80 shadow-sm hover:border-pink-300 hover:shadow-md transition-all space-y-3"
              >
                <span className="font-serif text-5xl font-extrabold text-pride-gradient block">
                  {t(`dn_i${item.id}_val`, item.val)}
                </span>
             
                <h4 className="font-bold text-[#2A8ACD] text-base uppercase tracking-wider">
                  {t(`dn_i${item.id}_title`, item.title)}
                </h4>
                <p className="text-slate-600 text-xs leading-relaxed max-w-xs mx-auto">
                  {t(`dn_i${item.id}_desc`, item.desc)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}