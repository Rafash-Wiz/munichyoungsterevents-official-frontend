import React from "react";

export default function RegisteredPopUp({ onClose }) {
  return (
    <div className="registered-popup-overlay">
      <div className="registered-popup" role="status" aria-live="polite">
        <button
          type="button"
          className="registered-popup-close"
          onClick={onClose}
        >
          X
        </button>
        <div className="registered-popup-check" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="registered-popup-check-icon">
            <path
              d="M20 6L9 17l-5-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="registered-popup-text">Account is successfully created.</p>
      </div>
    </div>
  );
}
