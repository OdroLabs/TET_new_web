"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Logo from "./Logo";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { t, getAssetUrl, isPreview, data } = useLanguage();

  const customLogo = data?.["site_logo"];

  // Social Links with real SVGs and fallback/dynamic URLs
  const socials = [
    {
      name: "Facebook",
      url: t("footer_fb_url", "https://www.facebook.com/share/12G6Xq5jZ15/"),   
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
    {
      name: "Instagram",
      url: t("footer_ig_url", "https://instagram.com"),
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
    },
    {
      name: "LinkedIn",
      url: t("footer_ln_url", "https://linkedin.com"),
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      ),
    },
    {
      name: "X (Twitter)",
      url: t("footer_x_url", "https://x.com"),
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
  ];

  return (
    <footer id="site-footer" className="scroll-mt-20 bg-gradient-to-b from-[#ebf6ff] via-[#d8efff] to-[#c5e6ff] pt-20 pb-12 border-t-2 border-sky-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16">
          
          {/* Column 1: Identity & Socials */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              {customLogo ? (
                <div className="relative h-10 w-44">
                  <Image
                    src={getAssetUrl(customLogo)}
                    fill
                    alt="Trans Equality Trust Logo"
                    className="object-contain object-left"
                    unoptimized={isPreview}
                  />
                </div>
              ) : (
                <Logo className="h-10 w-auto" />
              )}
            </Link>

            <p className="text-sky-900/85 text-sm leading-relaxed italic">
              {t('footer_desc', 'Sri Lanka’s leading advocacy group protecting the rights, safety, and choice of the transgender community.')}
            </p>

            {/* Clickable Social Media Icons */}
            <div className="flex gap-3">
              {socials.map((soc) => (
                <a
                  key={soc.name}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={soc.name}
                  aria-label={soc.name}
                  className="w-10 h-10 rounded-full bg-white border border-sky-300 flex items-center justify-center text-sky-700 hover:text-white hover:bg-sky-600 hover:border-sky-600 transition-all cursor-pointer shadow-sm shadow-sky-200/50 hover:scale-110 active:scale-95"
                >
                  {soc.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Organization Navigation */}
          <div>
            <h4 className="text-sky-950 font-black text-[11px] uppercase tracking-[0.25em] mb-6">
              {t('footer_head_org', 'Organization')}
            </h4>
            <ul className="space-y-3.5 text-[13px] text-sky-900 font-semibold">
              <li>
                <Link href="/about" className="hover:text-pink-600 transition-colors">
                  {t('nav_about', 'About TET')}
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-pink-600 transition-colors">
                  {t('nav_services', 'Our Services')}
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-pink-600 transition-colors">
                  {t('nav_projects', 'Advocacy Projects')}
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-pink-600 transition-colors">
                  {t('nav_activities', 'Media & Field Updates')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Initiatives & Impact */}
          <div>
            <h4 className="text-sky-950 font-black text-[11px] uppercase tracking-[0.25em] mb-6">
              {t('footer_head_init', 'Initiatives')}
            </h4>
            <ul className="space-y-3.5 text-[13px] text-sky-900 font-semibold">
              <li>
                <Link href="/booking" className="hover:text-pink-600 transition-colors">
                  {t('nav_booking', 'TET Spaces (Social Enterprise)')}
                </Link>
              </li>
              <li>
                <a 
                  href={t('footer_manual_url', '#')} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-pink-600 transition-colors"
                >
                  {t('footer_legal_manual', 'Legal Rights Manual')} ↗
                </a>
              </li>
              <li>
                <Link href="/volunteer" className="hover:text-pink-600 transition-colors">
                  {t('nav_volunteer', 'Volunteer Registry')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-pink-600 transition-colors">
                  {t('nav_contact', 'Emergency Hotline')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Support Card */}
          <div className="bg-white/90 backdrop-blur-sm p-7 rounded-[1.75rem] border-2 border-sky-200 shadow-md shadow-sky-300/40">
            <h4 className="text-sky-950 font-black text-[11px] uppercase tracking-[0.25em] mb-3">
              {t('footer_head_support', 'Support Our Work')}
            </h4>
            <p className="text-sky-900/80 text-xs mb-6 leading-relaxed">
              {t('footer_support_text', 'Your contribution directly funds 24/7 legal aid and rehabilitation paths.')}
            </p>
            <Link
              href={t('footer_donate_url', '/donate')}
              className="block w-full text-center bg-gradient-to-r from-sky-400 to-pink-400 hover:from-sky-500 hover:to-pink-500 text-white font-black text-[10px] uppercase tracking-widest py-3.5 rounded-xl shadow-md shadow-sky-300/50 hover:shadow-pink-300/60 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              {t('btn_donate', 'Make a Donation')}
            </Link>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Policies */}
        <div className="pt-8 border-t border-sky-300/80 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sky-800 text-[10px] font-bold uppercase tracking-[0.15em]">
            © {new Date().getFullYear()} {t('footer_copy', 'Trans Equality Trust Sri Lanka.')}
          </p>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-[0.15em] text-sky-800">
            <Link href={t('footer_privacy_url', '/privacy')} className="hover:text-pink-600 transition-colors">
              {t('footer_privacy', 'Privacy Policy')}
            </Link>
            <Link href={t('footer_terms_url', '/terms')} className="hover:text-pink-600 transition-colors">
              {t('footer_terms', 'Terms & Conditions')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}