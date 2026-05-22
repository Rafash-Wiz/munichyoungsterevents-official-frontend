import React from "react";
import PaginationControls from "./PaginationControls.jsx";

export default function AttendeeDashboard({
  currentUser,
  isLoadingBookings,
  bookingsError,
  myBookings,
  myBookingsPage,
  myBookingsTotalPages,
  bookingActionError,
  activeBookingActionId,
  onMyBookingsPageSelect,
  onMyBookingsPreviousPage,
  onMyBookingsNextPage,
  onPayBooking,
  onCancelBooking,
}) {
  const formatCancellationValue = (value) =>
    value
      ? value
          .toLowerCase()
          .split("_")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" ")
      : "";

  return (
    <main className="user-main attendee-dashboard">
      <div className="dashboard-intro">
        <span className="dashboard-kicker">My Dashboard</span>
        <h1>
          {currentUser.name} {currentUser.lastName}
        </h1>
        <p className="dashboard-meta">User ID: {currentUser.id}</p>
      </div>
      <section className="bookings-section">
        <h2>My Bookings</h2>
        <div className="dashboard-pagination-row">
          <PaginationControls
            page={myBookingsPage}
            totalPages={myBookingsTotalPages}
            isLoading={isLoadingBookings}
            onPageSelect={onMyBookingsPageSelect}
            onPrevious={onMyBookingsPreviousPage}
            onNext={onMyBookingsNextPage}
          />
        </div>
        {isLoadingBookings && myBookings.length === 0 ? (
          <p>Loading your bookings...</p>
        ) : bookingsError && myBookings.length === 0 ? (
          <p>{bookingsError}</p>
        ) : myBookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <>
            <div className="bookings-card">
              {isLoadingBookings && myBookings.length > 0 && (
                <p className="dashboard-table-loading">Loading next page...</p>
              )}
            {bookingActionError && (
              <p className="dashboard-table-error">{bookingActionError}</p>
            )}
              <div className="bookings-table-head bookings-table-head-attendee">
                <span>Booking ID</span>
                <span>Event ID</span>
                <span>Title</span>
                <span>Status</span>
                <span>Actions</span>
              </div>
              {myBookings.map((booking) => (
                <div
                  className="bookings-row bookings-row-attendee"
                  key={booking.id ?? booking.eventId}
                >
                  <span className="bookings-cell">{booking.id}</span>
                  <span className="bookings-cell">{booking.eventId}</span>
                  <span className="bookings-cell">
                    {booking.eventTitle || "Event title unavailable"}
                  </span>
                  <span
                    className={`bookings-cell booking-status booking-status-${booking.bookingStatus.toLowerCase()}`}
                  >
                    {booking.bookingStatus}
                    {booking.bookingStatus === "CANCELLED" &&
                      booking.cancellationReason && (
                        <span className="booking-status-meta">
                          {`Reason: ${formatCancellationValue(booking.cancellationReason)}`}
                        </span>
                      )}
                  </span>
                  <div className="bookings-cell booking-actions-cell">
                    <button
                      type="button"
                      className="events-edit-button"
                      disabled={booking.bookingStatus.toLowerCase() !== "pending"}
                      onClick={() => onPayBooking(booking)}
                    >
                      Pay
                    </button>
                    <button
                      type="button"
                      className="events-edit-button booking-cancel-action-button"
                      disabled={
                        booking.bookingStatus.toLowerCase() !== "pending" ||
                        activeBookingActionId === booking.id
                      }
                      onClick={() => onCancelBooking(booking)}
                    >
                      {activeBookingActionId === booking.id
                        ? "Cancelling..."
                        : "Cancel"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="dashboard-pagination-row dashboard-pagination-row-bottom">
              <PaginationControls
                page={myBookingsPage}
                totalPages={myBookingsTotalPages}
                isLoading={isLoadingBookings}
                onPageSelect={onMyBookingsPageSelect}
                onPrevious={onMyBookingsPreviousPage}
                onNext={onMyBookingsNextPage}
              />
            </div>
          </>
        )}
      </section>
    </main>
  );
}
