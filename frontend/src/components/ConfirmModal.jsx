import React from "react";
import "./ConfirmModal.css"; 

export default function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="overlay">
      <div className="confirm-box">
        <h3>{message}</h3>
        <div className="confirm-buttons">
          <button className="btn btn-ok" onClick={onConfirm}>oui</button>
          <button className="btn btn-cancel" onClick={onCancel}>Annuler</button>
        </div>
      </div>
    </div>
  );
}
