import React from "react";
import "./ConfirmModal.css";

export default function ConfirmModal({ message, onConfirm, onCancel, lang = "en" }) {
  // Button labels per language
  const labels = {
    en: { yes: "Yes", cancel: "Cancel" },
    fr: { yes: "Oui", cancel: "Annuler" },
    ar: { yes: "نعم", cancel: "إلغاء" },
  };

  const { yes, cancel } = labels[lang] || labels.en;

  return (
    <div className="overlay">
      <div className="confirm-box">
        <h3>{message}</h3>
        <div className="confirm-buttons">
          <button className="btn btn-ok" onClick={onConfirm}>{yes}</button>
          <button className="btn btn-cancel" onClick={onCancel}>{cancel}</button>
        </div>
      </div>
    </div>
  );
}
