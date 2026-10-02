"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

const RAW_API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://qtxzpyl7n4pxoe9ku8fr280l.51.79.156.158.sslip.io"; 
const API_BASE = RAW_API_BASE.replace(/\/+$/, "");

export type TrilingualTranslations = Record<string, string>;
export type SettingValue = string | TrilingualTranslations;
export type SettingsMap = Record<string, SettingValue | undefined>;

interface LanguageContextType {
  locale: string;
  setLocale: (lang: string) => void;
  data: SettingsMap;
  isPreview: boolean;
  t: (key: string) => string;
  getAsset: (keyOrPath: SettingValue | null | undefined) => string;
  getAssetUrl: (keyOrPath: SettingValue | null | undefined) => string;
}

const EMPTY_IMAGE = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({
  children,
  initialSettings = {},
}: {
  children: React.ReactNode;
  initialSettings?: SettingsMap;
}) => {
  const [locale, setLocale] = useState<string>("en");
  const [initialData, setInitialData] = useState<SettingsMap>(initialSettings);
  const [previewData, setPreviewData] = useState<SettingsMap | null>(null);

  useEffect(() => {
    if (typeof document !== "undefined" && locale) {
      document.documentElement.lang = locale;
    }
  }, [locale]);

  useEffect(() => {
    let isMounted = true;

    const loadSettings = () => {
      fetch(`${API_BASE}/api/settings?t=${Date.now()}`, {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Settings fetch failed");
          return res.json();
        })
        .then((json: SettingsMap) => {
          if (isMounted) {
            setInitialData(json);
          }
        })
        .catch((err) => {
          console.error("API Settings Fetch Error:", err);
        });
    };

    loadSettings();

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "TET_LIVE_PREVIEW") {
        setPreviewData((prev) => ({
          ...(prev || {}),
          ...event.data.state,
        }));
      }

      if (event.data?.type === "TET_RELOAD_SETTINGS") {
        loadSettings();
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      isMounted = false;
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  const mergedData = useMemo<SettingsMap>(() => {
    return { ...initialData, ...(previewData || {}) };
  }, [initialData, previewData]);

  const t = useCallback(
    (key: string): string => {
      const val = mergedData[key];
      if (val === undefined || val === null || val === "") return "";

      if (typeof val === "object") {
        return val[locale] || val["en"] || "";
      }

      return String(val);
    },
    [mergedData, locale]
  );

  const getAsset = useCallback(
    (keyOrPath: SettingValue | null | undefined): string => {
      const fallback = EMPTY_IMAGE;
      if (!keyOrPath) return fallback;

      let target: SettingValue | undefined = keyOrPath;

      if (typeof keyOrPath === "string") {
        if (keyOrPath in mergedData) {
          target = mergedData[keyOrPath];
        } else if (!keyOrPath.includes("/") && !keyOrPath.includes(".")) {
          return fallback;
        }
      }

      if (!target) return fallback;

      let finalPath = "";
      if (typeof target === "object") {
        finalPath = target[locale] || target["en"] || Object.values(target)[0] || "";
      } else {
        finalPath = String(target).trim().replace(/^["']|["']$/g, "").replace(/\\/g, "/");
      }

      if (!finalPath) return fallback;

      if (
        finalPath.startsWith("http://") ||
        finalPath.startsWith("https://") ||
        finalPath.startsWith("blob:") ||
        finalPath.includes("livewire")
      ) {
        return finalPath;
      }

      const cleanPath = finalPath.replace(/^\/+/, "");
      const normalizedPath = cleanPath.startsWith("storage/")
        ? cleanPath.replace(/^storage\//, "")
        : cleanPath;

      return `${API_BASE}/storage/${normalizedPath}`;
    },
    [mergedData, locale]
  );

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        data: mergedData,
        isPreview: Boolean(previewData),
        t,
        getAsset,
        getAssetUrl: getAsset, 
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};