"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

/**
 * Shown while Coming Soon mode is on but this browser holds the admin preview pass,
 * so it is always clear why the real site is visible. Hidden inside the admin preview frames.
 */
export default function PreviewBanner() {
  const { t } = useLanguage();
  const [inFrame, setInFrame] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInFrame(window.self !== window.top);
  }, []);

  if (inFrame) return null;

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 bg-[#1a365d] text-white pl-4 pr-1.5 py-1.5 rounded-full shadow-2xl text-xs max-w-[calc(100%-2rem)]">
      <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0" />
      <span className="truncate">{t("ui_preview_banner")}</span>
      <a
        href="?tet_preview=exit"
        className="shrink-0 bg-white/15 hover:bg-white/25 px-3 py-1.5 rounded-full font-bold whitespace-nowrap"
      >
        {t("ui_preview_exit")}
      </a>
    </div>
  );
}
