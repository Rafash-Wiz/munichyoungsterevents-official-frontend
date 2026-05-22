import React from "react";

export default function EventClosePopup({
  selectedEvent,
  isClosing,
  closeError,
  onConfirm,
  onClose,
}) {
  if (!selectedEvent) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="event-close-popup">
        <button
          type="button"
          className="popup-close-button"
          onClick={onClose}
        >
          X
        </button>
        <h3 className="event-close-popup-title">Close Event</h3>
        <p className="event-close-popup-copy">
          Are you sure you want to close <strong>{selectedEvent.title}</strong>?
        </p>
        <p className="event-close-popup-copy">
          This action should use the dedicated event-close flow.
        </p>
        {closeError && <p className="auth-popup-error">{closeError}</p>}
        <div className="event-close-popup-actions">
          <button
            type="button"
            className="event-close-confirm-button"
            onClick={onConfirm}
            disabled={isClosing}
          >
            {isClosing ? "Closing..." : "Confirm Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
