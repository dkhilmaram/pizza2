import React, { useState, useEffect } from "react";
import i18n from "../i18n/i18n";
import "../styles/languageswitcher.css"; // <-- make sure path is correct

const LanguageSwitcher = () => {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState(i18n.language || "en");

  const changeLang = (newLang) => {
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang);
    setLang(newLang);
    setOpen(false);
  };

  useEffect(() => {
    const saved = localStorage.getItem("lang");
    if (saved && saved !== lang) {
      setLang(saved);
      i18n.changeLanguage(saved);
    }
  }, []);

  return (
    <div className="language-switcher">
      {/* 🔴 Red rounded button */}
      <button
        className="language-button"
        onClick={() => setOpen(!open)}
      >
        {lang.toUpperCase()}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="dropdown-menu">
          {[
            ["en", "English"],
            ["fr", "Français"],
            ["ar", "العربية"],
            ["es", "Español"],
            ["zh", "中文"],
            ["it", "Italiano"],
          ].map(([code, name]) => (
            <button
              key={code}
              className="dropdown-item"
              onClick={() => changeLang(code)}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
