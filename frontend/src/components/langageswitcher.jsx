import React from "react";
import i18n from "../i18n/i18n";

const LanguageSwitcher = () => {
  const changeLang = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  return (
    <select
      onChange={(e) => changeLang(e.target.value)}
      value={i18n.language}
      style={{ padding: "4px 8px" }}
    >
      <option value="en">English</option>
      <option value="fr">Français</option>
      <option value="ar">العربية</option>
    </select>
  );
};

export default LanguageSwitcher;
