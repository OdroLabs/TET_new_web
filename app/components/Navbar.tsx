"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "./Logo";
import { useLanguage } from "../context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { locale, setLocale, t, getAssetUrl, isPreview, data } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const languages = [
    { code: "en", label: "EN", name: "English" },
    { code: "si", label: "සිං", name: "සිංහල" },
    { code: "ta", label: "தமி", name: "தமிழ்" },
  ];

  const navLinks = [
    // { name: t("nav_home", "Home"), href: "/" },
    { name: t("nav_about", "About"), href: "/about" },
    { name: t("nav_services", "Services"), href: "/services", hasDropdown: true },
    { name: t("nav_projects", "Projects"), href: "/projects" },
    { name: t("nav_gallery", "Events & Gallery"), href: "/gallery" },
    { name: t("nav_activities", "Activities"), href: "/news" },
    { name: t("nav_booking", "Social Enterprise"), href: "/booking" },
    { name: t("nav_contact", "Contact Us"), href: "/contact" },
  ];

  const customLogo = data?.["site_logo"];

  return (
    // 👇 Solid clean light pink background with no gray/silver gradients
    <nav className="bg-[#fbf4f6] backdrop-blur-md sticky top-0 z-50 border-b border-[#EFB9C5]/60 shadow-sm">
      
      <div className="px-4 md:px-8 w-full">
        <div className="flex justify-between h-20 items-center">
          
          {/* LOGO */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            {customLogo ? (
              <div className="relative h-9 md:h-12 w-36 md:w-48">
                <Image
                  src={getAssetUrl(customLogo)}
                  fill
                  alt="Trans Equality Trust Logo"
                  className="object-contain object-left"
                  priority
                  unoptimized={isPreview}
                />
              </div>
            ) : (
              <Logo className="h-8 md:h-11 w-auto" />
            )}
          </Link>

          {/* DESKTOP LINKS */}
          <div className="hidden lg:flex items-center flex-grow justify-center space-x-5 xl:space-x-7 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-700">
            {navLinks.map((link) => (
              link.hasDropdown ? (
                <div 
                  key={link.name} 
                  className="relative group" 
                  onMouseEnter={() => setIsServicesOpen(true)} 
                  onMouseLeave={() => setIsServicesOpen(false)}
                >
                  <Link 
                    href={link.href} 
                    className="hover:text-[#2A8ACD] transition-colors flex items-center gap-1 py-2"
                  >
                    {link.name}
                    <svg className="w-2.5 h-2.5 text-[#2A8ACD]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                    </svg>
                  </Link>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {isServicesOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 8 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        exit={{ opacity: 0, y: 8 }} 
                        className="absolute top-full left-0 pt-1 w-52"
                      >
                        <div className="bg-white shadow-lg shadow-pink-100/50 rounded-2xl py-2 border border-[#EFB9C5]/40">
                          <Link 
                            href="/services" 
                            className="block px-4 py-2 hover:bg-pink-50 text-slate-700 hover:text-[#2A8ACD] transition-colors text-[10px]"
                          >
                            {t("nav_drop_services", "Advocacy Services")}
                          </Link>
                          <Link 
                            href="/volunteer" 
                            className="block px-4 py-2 hover:bg-pink-50 text-slate-700 hover:text-[#2A8ACD] transition-colors text-[10px]"
                          >
                            {t("nav_drop_volunteer", "Volunteer")}
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  className="hover:text-[#2A8ACD] transition-colors whitespace-nowrap"
                >
                  {link.name}
                </Link>
              )
            ))}
          </div>

          {/* RIGHT ACTIONS: DONATE + TRILINGUAL SWITCHER */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            <div className="flex items-center bg-white border border-[#EFB9C5]/60 rounded-full p-1 shadow-sm">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setLocale(lang.code)}
                  title={lang.name}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase transition-all cursor-pointer ${
                    locale === lang.code
                      ? "bg-[#2A8ACD] text-white shadow-sm scale-105"
                      : "text-slate-600 hover:text-[#2A8ACD]"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Donate Button */}
            <Link 
              href={t("nav_donate_url", "/donate")} 
              className="bg-[#2A8ACD] hover:bg-[#2374b0] text-white text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-full shadow-md shadow-sky-100 transition-all hover:scale-105 active:scale-95"
            >
              {t("btn_donate", "Donate")}
            </Link>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <button 
            className="lg:hidden p-2 text-[#2A8ACD] hover:opacity-80 transition-colors" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: "auto" }} 
            exit={{ opacity: 0, height: 0 }} 
            className="lg:hidden bg-white border-b border-[#EFB9C5]/40 overflow-hidden shadow-md"
          >
            <div className="flex flex-col p-6 space-y-4 text-[12px] font-bold uppercase tracking-widest text-slate-700">
              
              <div className="flex items-center justify-between pb-3 border-b border-pink-100">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Language:
                </span>
                <div className="flex gap-1.5 bg-slate-50 p-1 rounded-full border border-[#EFB9C5]/40">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLocale(lang.code)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                        locale === lang.code
                          ? "bg-[#2A8ACD] text-white shadow-sm"
                          : "text-slate-600"
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              </div>

              {navLinks.map((link) => (
                <div key={link.name}>
                  <Link 
                    href={link.href} 
                    className="hover:text-[#2A8ACD] transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                  {link.hasDropdown && (
                    <div className="pl-4 pt-2 space-y-2 text-slate-500 text-[10px]">
                      <Link 
                        href="/volunteer" 
                        className="block hover:text-[#2A8ACD]"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {t("nav_drop_volunteer", "Volunteer")}
                      </Link>
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-2">
                <Link 
                  href={t("nav_donate_url", "/donate")} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-center bg-[#2A8ACD] text-white py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-md"
                >
                  {t('btn_donate', 'Donate')}
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}