import React from "react";

export default function EventOpenPopup({
  selectedEvent,
  isOpening,
  openError,
  onConfirm,
  onClose,
}) {
  if (!selectedEvent) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="event-open-popup">
        <button
          type="button"
          className="popup-close-button"
          onClick={onClose}
        >
          X
        </button>
        <h3 className="event-open-popup-title">Open Event</h3>
        <p className="event-open-popup-copy">
          Are you sure you want to open <strong>{selectedEvent.title}</strong>?
        </p>
        <p className="event-open-popup-copy">
          This action should use the dedicated event-open flow.
        </p>
        {openError && <p className="auth-popup-error">{openError}</p>}
        <div className="event-open-popup-actions">
          <button
            type="button"
            className="event-open-confirm-button"
            onClick={onConfirm}
            disabled={isOpening}
          >
            {isOpening ? "Opening..." : "Confirm Open"}
          </button>
        </div>
      </div>
    </div>
  );
}
