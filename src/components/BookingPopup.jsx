import React from "react";

export default function BookingPopup({
  selectedEvent,
  pendingBooking,
  isBookingLoading,
  bookingError,
  onConfirmBooking,
  onCancelBooking,
  onClose,
}) {
  if (!selectedEvent) {
    return null;
  }

  const formattedDateTime = `${new Date(selectedEvent.date).toLocaleDateString("de-DE")} - ${new Date(
    selectedEvent.date,
  ).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;

  const hasPendingBooking = Boolean(pendingBooking);

  return (
    <div className="modal-overlay">
      <div className="booking-popup">
        <button type="button" className="popup-close-button" onClick={onClose}>
          X
        </button>

        <h3 className="booking-popup-title">
          {hasPendingBooking ? "Pending Booking" : "Booking Summary"}
        </h3>

        <img
          className="booking-popup-image"
          src={selectedEvent.image}
          alt={selectedEvent.title}
        />

        <div className="booking-popup-details">
          <p>
            <strong>Title:</strong> {selectedEvent.title}
          </p>
          <p>
            <strong>Location:</strong> {selectedEvent.location}
          </p>
          <p>
            <strong>Date & Time:</strong> {formattedDateTime}
          </p>
          <p>
            <strong>Description:</strong> {selectedEvent.description}
          </p>
          <p>
            <strong>Price:</strong> {selectedEvent.price} EUR
          </p>
          {hasPendingBooking && (
            <p>
              <strong>Status:</strong> {pendingBooking.status}
            </p>
          )}
        </div>

        {bookingError && <p className="auth-popup-error">{bookingError}</p>}

        <div className="booking-popup-actions">
          <button
            type="button"
            className="booking-pay-button"
            disabled={isBookingLoading}
            onClick={() => {
              if (hasPendingBooking) {
                console.log("Start payment session for:", selectedEvent);
                return;
              }

              onConfirmBooking();
            }}
          >
            {isBookingLoading && !hasPendingBooking
              ? "Confirming..."
              : hasPendingBooking
                ? "Pay"
                : "Confirm Booking"}
          </button>

          {hasPendingBooking && (
            <button
              type="button"
              className="booking-cancel-button"
              disabled={isBookingLoading}
              onClick={onCancelBooking}
            >
              {isBookingLoading ? "Cancelling..." : "Cancel Booking"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

