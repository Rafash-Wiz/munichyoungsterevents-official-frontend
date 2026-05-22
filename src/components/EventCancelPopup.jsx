import React from "react";

export default function EventCancelPopup({
  selectedEvent,
  isCancelling,
  cancelError,
  onConfirm,
  onClose,
}) {
  if (!selectedEvent) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="event-cancel-popup">
        <button
          type="button"
          className="popup-close-button"
          onClick={onClose}
        >
          X
        </button>
        <h3 className="event-cancel-popup-title">Cancel Event</h3>
        <p className="event-cancel-popup-copy">
          Are you sure you want to cancel{" "}
          <strong>{selectedEvent.title}</strong>?
        </p>
        <p className="event-cancel-popup-copy">
          This action should use the dedicated event-cancel flow.
        </p>
        {cancelError && <p className="auth-popup-error">{cancelError}</p>}
        <div className="event-cancel-popup-actions">
          <button
            type="button"
            className="booking-cancel-button"
            onClick={onConfirm}
            disabled={isCancelling}
          >
            {isCancelling ? "Cancelling..." : "Confirm Cancellation"}
          </button>
        </div>
      </div>
    </div>
  );
}
