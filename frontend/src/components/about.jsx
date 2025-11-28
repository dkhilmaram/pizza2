import React from "react";
import { useTranslation } from "react-i18next";

export default function About() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const sectionStyle = {
    padding: "40px 20px",
    textAlign: isRTL ? "right" : "left",
    maxWidth: "900px",
    margin: "0 auto",
    backgroundColor: "var(--card)", // uses your light/dark card background
    borderRadius: "12px",
    color: "var(--text)", // uses your text color for both themes
  };

  const titleStyle = {
    color: "var(--primary)", // primary color from CSS vars
    fontSize: "32px",
    marginBottom: "20px",
    textAlign: "center",
  };

  const textStyle = {
    fontSize: "18px",
    lineHeight: 1.8,
    textAlign: "justify",
    marginBottom: "16px",
    color: "var(--text)", // ensures text matches theme
  };

  return (
    <div style={sectionStyle}>
      <h1 style={titleStyle}>{t("about_us")}</h1>
      <p style={textStyle}>{t("paragraph_1")}</p>
      <p style={textStyle}>{t("paragraph_2")}</p>
      <p style={textStyle}>{t("paragraph_3")}</p>
    </div>
  );
}
