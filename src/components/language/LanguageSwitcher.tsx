import { useEffect, useState, useCallback, useRef } from "react";

const LANGUAGES = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ja", name: "日本語", flag: "🇯🇵" },
] as const;

type LanguageCode = (typeof LANGUAGES)[number]["code"];

const STORAGE_KEY = "preferred_language";
const GOOGLE_SELECTOR = ".goog-te-combo";

const LanguageSwitcher = () => {
  const [currentLang, setCurrentLang] = useState<LanguageCode>("ja");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const getSelectBox = useCallback((): HTMLSelectElement | null => {
    return document.querySelector(GOOGLE_SELECTOR);
  }, []);

  const setCookie = useCallback((langCode: LanguageCode) => {
    const domain = window.location.hostname;
    if (langCode === "en") {
      document.cookie =
        "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`;
    } else {
      document.cookie = `googtrans=/en/${langCode}; path=/`;
      document.cookie = `googtrans=/en/${langCode}; path=/; domain=${domain}`;
    }
  }, []);

  const changeLanguage = useCallback(
    (langCode: LanguageCode) => {
      if (langCode === currentLang) {
        setIsOpen(false);
        return;
      }

      localStorage.setItem(STORAGE_KEY, langCode);
      setCurrentLang(langCode);
      setCookie(langCode);

      const selectBox = getSelectBox();

      if (langCode === "en") {
        if (selectBox) {
          selectBox.value = "en";
          selectBox.dispatchEvent(new Event("change", { bubbles: true }));
        }
      } else {
        if (selectBox) {
          selectBox.value = "ja";
          selectBox.dispatchEvent(new Event("change", { bubbles: true }));
        }
        setTimeout(() => window.location.reload(), 150);
      }

      setIsOpen(false);
    },
    [currentLang, getSelectBox, setCookie],
  );

  useEffect(() => {
    const savedLang = localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
    if (savedLang) setCurrentLang(savedLang);

    const syncWithGoogle = () => {
      const selectBox = getSelectBox();
      if (selectBox?.value && selectBox.value !== "en") {
        const googleLang = selectBox.value as LanguageCode;
        if (googleLang !== currentLang) setCurrentLang(googleLang);
      }
    };

    const timeout = setTimeout(syncWithGoogle, 1000);
    const interval = setInterval(syncWithGoogle, 3000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [getSelectBox, currentLang]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !dropdownRef.current?.contains(target) &&
        !buttonRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const currentLanguage =
    LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen((prev) => !prev);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setIsOpen((prev) => !prev);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        ref={buttonRef}
        role="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <span className="text-xl">{currentLanguage.flag}</span>
      </div>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <div
            className="absolute top-full right-0 mt-2 min-w-48 backdrop-blur-sm rounded-2xl overflow-hidden shadow-xl shadow-black/10 border-[0.5px] border-white/20 z-dropdown"
            role="menu"
          >
            <div className="py-2 bg-black/20">
              {LANGUAGES.map((lang, idx) => {
                const isActive = currentLang === lang.code;
                const isLast = idx === LANGUAGES.length - 1;

                return (
                  <div
                    key={lang.code}
                    className={`px-4 py-3 cursor-pointer transition-colors hover:bg-white/10 ${
                      !isLast ? "border-b-[0.5px] border-white/20" : ""
                    }`}
                    onClick={() => changeLanguage(lang.code)}
                    role="menuitem"
                  >
                    <div
                      className={`text-sm flex items-center gap-3 ${
                        isActive
                          ? "text-white font-semibold"
                          : "text-white/60 hover:text-white"
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="flex-1">{lang.name}</span>
                      {isActive && (
                        <span className="w-1.5 h-1.5 bg-white rounded-full" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
