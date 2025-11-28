import React from "react";
import "./ConfirmModal.css";
import { useTranslation } from "react-i18next";

export default function ConfirmModal({ message, onConfirm, onCancel }) {
  const { t, i18n } = useTranslation();

  // Check if current language is RTL
  const isRTL = i18n.language === "ar";

  return (
    <div className="overlay">
      <div className="confirm-box" style={{ direction: isRTL ? "rtl" : "ltr" }}>
        <h3>{message}</h3>
        <div className="confirm-buttons" style={{ justifyContent: isRTL ? "flex-start" : "flex-end" }}>
          <button className="btn btn-ok" onClick={onConfirm}>{t("yes")}</button>
          <button className="btn btn-cancel" onClick={onCancel}>{t("cancel")}</button>
        </div>
      </div>
    </div>
  );
}
