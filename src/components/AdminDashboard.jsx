import React, { useEffect, useRef, useState } from "react";
import PaginationControls from "./PaginationControls.jsx";

export default function AdminDashboard({
  currentUser,
  adminView,
  onAdminViewChange,
  onOpenCreateEvent,
  bookingStatusFilter,
  onBookingStatusFilterChange,
  bookingSearchQuery,
  onBookingSearchQueryChange,
  bookingEventFilter,
  onBookingEventFilterChange,
  onAdminBookingListSearch,
  onAdminBookingIdSearch,
  singleUserQuery,
  onSingleUserInputChange,
  onSingleUserSearch,
  eventSearchQuery,
  onEventSearchQueryChange,
  isLoadingAdminBookings,
  adminBookingsError,
  filteredAdminBookings,
  adminBookingsPage,
  adminBookingsTotalPages,
  onAdminBookingsPageSelect,
  onAdminBookingsPreviousPage,
  onAdminBookingsNextPage,
  onUserOpen,
  isLoadingAdminUsers,
  adminUsersError,
  attendeeIdFilter,
  onAttendeeIdFilterChange,
  attendeeFirstNameFilter,
  onAttendeeFirstNameFilterChange,
  attendeeLastNameFilter,
  onAttendeeLastNameFilterChange,
  onClearAttendeeFilters,
  filteredAdminUsers,
  adminUsersPage,
  adminUsersTotalPages,
  onAdminUsersPageSelect,
  onAdminUsersPreviousPage,
  onAdminUsersNextPage,
  isLoadingSelectedUser,
  selectedUserError,
  selectedUserData,
  isLoadingSelectedUserBookings,
  selectedUserBookingsError,
  selectedUserBookings,
  selectedUserBookingsPage,
  selectedUserBookingsTotalPages,
  onSelectedUserBookingsPageSelect,
  onSelectedUserBookingsPreviousPage,
  onSelectedUserBookingsNextPage,
  isLoadingAdminEvents,
  adminEventsError,
  filteredAdminEvents,
  adminEventsPage,
  adminEventsTotalPages,
  onAdminEventsPageSelect,
  onAdminEventsPreviousPage,
  onAdminEventsNextPage,
  onEditEvent,
  onOpenEvent,
  onCloseEvent,
  onCancelEvent,
}) {
  const formatCancellationValue = (value) =>
    value
      ? value
          .toLowerCase()
          .split("_")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" ")
      : "";

  const formatDateTime = (value) =>
    value
      ? `${new Date(value).toLocaleDateString("de-DE")} - ${new Date(
          value,
        ).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`
      : "";

  const formatEventStatus = (value) =>
    value
      ? value
          .toLowerCase()
          .split("_")
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" ")
      : "";

  const getEventCapacitySummary = (event) => {
    const confirmedCount =
      event.status === "CANCELLED"
        ? event.cancelledConfirmedCount ?? event.confirmedCount ?? 0
        : event.confirmedCount ?? event.bookedCount ?? 0;
    const pendingCount = event.pendingCount ?? 0;

    return `${event.capacity} / ${confirmedCount} / ${pendingCount}`;
  };

  const [activeCancellationDetailsId, setActiveCancellationDetailsId] =
    useState(null);
  const activeCancellationDetailsRef = useRef(null);
  const [activeEventActionsId, setActiveEventActionsId] = useState(null);
  const activeEventActionsRef = useRef(null);

  useEffect(() => {
    if (!activeCancellationDetailsId) {
      return undefined;
    }

    const handleDocumentMouseDown = (event) => {
      if (
        activeCancellationDetailsRef.current &&
        !activeCancellationDetailsRef.current.contains(event.target)
      ) {
        setActiveCancellationDetailsId(null);
      }
    };

    document.addEventListener("mousedown", handleDocumentMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleDocumentMouseDown);
    };
  }, [activeCancellationDetailsId]);

  useEffect(() => {
    if (!activeEventActionsId) {
      return undefined;
    }

    const handleDocumentMouseDown = (event) => {
      if (
        activeEventActionsRef.current &&
        !activeEventActionsRef.current.contains(event.target)
      ) {
        setActiveEventActionsId(null);
      }
    };

    document.addEventListener("mousedown", handleDocumentMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleDocumentMouseDown);
    };
  }, [activeEventActionsId]);

  const renderCancellationDetails = (booking) => {
    if (booking.bookingStatus !== "CANCELLED" || !booking.cancellationReason) {
      return null;
    }

    const isOpen = activeCancellationDetailsId === booking.id;

    return (
      <span
        className="booking-status-details"
        ref={isOpen ? activeCancellationDetailsRef : null}
      >
        <button
          type="button"
          className="booking-status-details-trigger"
          onClick={() =>
            setActiveCancellationDetailsId((currentId) =>
              currentId === booking.id ? null : booking.id,
            )
          }
        >
          More details
        </button>
        {isOpen && (
          <span className="booking-status-details-popover">
            <span className="booking-status-meta">
              {`Reason: ${formatCancellationValue(booking.cancellationReason)}`}
            </span>
            {booking.cancelledFromStatus && (
              <span className="booking-status-meta">
                {`From: ${formatCancellationValue(booking.cancelledFromStatus)}`}
              </span>
            )}
            {booking.cancelledAt && (
              <span className="booking-status-meta">
                {`At: ${formatDateTime(booking.cancelledAt)}`}
              </span>
            )}
          </span>
        )}
      </span>
    );
  };

  const renderPaginationControls = () => {
    if (adminView === "events") {
      return (
        <PaginationControls
          page={adminEventsPage}
          totalPages={adminEventsTotalPages}
          isLoading={isLoadingAdminEvents}
          onPageSelect={onAdminEventsPageSelect}
          onPrevious={onAdminEventsPreviousPage}
          onNext={onAdminEventsNextPage}
        />
      );
    }

    if (adminView === "bookings") {
      return (
        <PaginationControls
          page={adminBookingsPage}
          totalPages={adminBookingsTotalPages}
          isLoading={isLoadingAdminBookings}
          onPageSelect={onAdminBookingsPageSelect}
          onPrevious={onAdminBookingsPreviousPage}
          onNext={onAdminBookingsNextPage}
        />
      );
    }

    if (adminView === "attendees") {
      return (
        <PaginationControls
          page={adminUsersPage}
          totalPages={adminUsersTotalPages}
          isLoading={isLoadingAdminUsers}
          onPageSelect={onAdminUsersPageSelect}
          onPrevious={onAdminUsersPreviousPage}
          onNext={onAdminUsersNextPage}
        />
      );
    }

    if (adminView === "singleAttendee" && selectedUserData) {
      return (
        <PaginationControls
          page={selectedUserBookingsPage}
          totalPages={selectedUserBookingsTotalPages}
          isLoading={isLoadingSelectedUserBookings}
          onPageSelect={onSelectedUserBookingsPageSelect}
          onPrevious={onSelectedUserBookingsPreviousPage}
          onNext={onSelectedUserBookingsNextPage}
        />
      );
    }

    return null;
  };

  return (
    <main className="user-main admin-dashboard">
      <div className="dashboard-intro">
        <span className="dashboard-kicker">Admin Dashboard</span>
        <h1>
          {currentUser.name} {currentUser.lastName}
        </h1>
        <p className="dashboard-meta">Administrator account</p>
        <p className="dashboard-meta">User ID: {currentUser.id}</p>
      </div>
      <div className="admin-primary-action-row">
        <button
          type="button"
          className="admin-create-event-button"
          onClick={onOpenCreateEvent}
        >
          Create an Event
        </button>
      </div>
      <div className="admin-view-switch" aria-label="Admin dashboard views">
        <button
          type="button"
          className={`admin-view-button ${adminView === "events" ? "is-active" : ""}`}
          onClick={() => onAdminViewChange("events")}
        >
          Events
        </button>
        <button
          type="button"
          className={`admin-view-button ${adminView === "bookings" ? "is-active" : ""}`}
          onClick={() => onAdminViewChange("bookings")}
        >
          Event Bookings
        </button>
        <button
          type="button"
          className={`admin-view-button ${adminView === "attendees" ? "is-active" : ""}`}
          onClick={() => onAdminViewChange("attendees")}
        >
          All Attendees
        </button>
        <button
          type="button"
          className={`admin-view-button ${adminView === "singleAttendee" ? "is-active" : ""}`}
          onClick={() => onAdminViewChange("singleAttendee")}
        >
          Attendee Bookings
        </button>
      </div>
      <section className="bookings-section admin-section">
        {adminView === "bookings" ? (
          <div className="booking-search-groups">
            <div className="bookings-filter-row booking-search-group">
              <label
                className="bookings-filter-label"
                htmlFor="booking-status-filter"
              >
                Status
              </label>
              <select
                id="booking-status-filter"
                className="bookings-filter-select"
                value={bookingStatusFilter}
                onChange={(event) =>
                  onBookingStatusFilterChange(event.target.value)
                }
              >
                <option value="all">All</option>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <label
                className="bookings-filter-label"
                htmlFor="booking-event-id"
              >
                Event ID
              </label>
              <input
                id="booking-event-id"
                className="single-attendee-input"
                type="text"
                placeholder="Find bookings by event ID"
                value={bookingEventFilter}
                onChange={(event) =>
                  onBookingEventFilterChange(event.target.value)
                }
              />
              <button
                type="button"
                className="single-attendee-search-button"
                onClick={onAdminBookingListSearch}
              >
                Search
              </button>
            </div>
            <div className="single-attendee-search booking-search-group booking-search-group-exact">
              <label
                className="bookings-filter-label"
                htmlFor="booking-search-id"
              >
                Booking ID
              </label>
              <input
                id="booking-search-id"
                className="single-attendee-input"
                type="text"
                placeholder="Find booking by ID"
                value={bookingSearchQuery}
                onChange={(event) =>
                  onBookingSearchQueryChange(event.target.value)
                }
              />
              <button
                type="button"
                className="single-attendee-search-button"
                onClick={onAdminBookingIdSearch}
              >
                Search
              </button>
            </div>
          </div>
        ) : adminView === "singleAttendee" ? (
          <div className="single-attendee-search">
            <label
              className="bookings-filter-label"
              htmlFor="single-attendee-id"
            >
              Find by Attendee ID
            </label>
            <input
              id="single-attendee-id"
              className="single-attendee-input"
              type="text"
              placeholder="Find by ID"
              value={singleUserQuery}
              onChange={onSingleUserInputChange}
            />
            <button
              type="button"
              className="single-attendee-search-button"
              onClick={onSingleUserSearch}
            >
              Search
            </button>
          </div>
        ) : adminView === "events" ? (
          <div className="single-attendee-search">
            <label className="bookings-filter-label" htmlFor="event-search-id">
              Find by ID
            </label>
            <input
              id="event-search-id"
              className="single-attendee-input"
              type="text"
              placeholder="Find event by ID"
              value={eventSearchQuery}
              onChange={(event) => onEventSearchQueryChange(event.target.value)}
            />
          </div>
        ) : adminView === "attendees" ? (
          <div className="bookings-filter-row">
            <label
              className="bookings-filter-label"
              htmlFor="attendee-filter-id"
            >
              Attendee ID
            </label>
            <input
              id="attendee-filter-id"
              className="single-attendee-input"
              type="text"
              placeholder="Find attendee by ID"
              value={attendeeIdFilter}
              onChange={(event) => onAttendeeIdFilterChange(event.target.value)}
            />
            <label
              className="bookings-filter-label"
              htmlFor="attendee-filter-first-name"
            >
              First Name
            </label>
            <input
              id="attendee-filter-first-name"
              className="single-attendee-input"
              type="text"
              placeholder="Filter by first name"
              value={attendeeFirstNameFilter}
              onChange={(event) =>
                onAttendeeFirstNameFilterChange(event.target.value)
              }
            />
            <label
              className="bookings-filter-label"
              htmlFor="attendee-filter-last-name"
            >
              Last Name
            </label>
            <input
              id="attendee-filter-last-name"
              className="single-attendee-input"
              type="text"
              placeholder="Filter by last name"
              value={attendeeLastNameFilter}
              onChange={(event) =>
                onAttendeeLastNameFilterChange(event.target.value)
              }
            />
            <button
              type="button"
              className="single-attendee-search-button"
              onClick={onClearAttendeeFilters}
            >
              Clear
            </button>
          </div>
        ) : null}
        <div className="dashboard-pagination-row">
          {renderPaginationControls()}
        </div>
        <div className="bookings-card" key={adminView}>
          {adminView === "bookings" ? (
            <>
              {isLoadingAdminBookings && filteredAdminBookings.length > 0 && (
                <p className="dashboard-table-loading">Loading next page...</p>
              )}
              {isLoadingAdminBookings && filteredAdminBookings.length === 0 ? (
                <p>Loading all bookings...</p>
              ) : adminBookingsError && filteredAdminBookings.length === 0 ? (
                <p>{adminBookingsError}</p>
              ) : filteredAdminBookings.length === 0 ? (
                <div className="bookings-empty-state">No bookings found.</div>
              ) : (
                <>
                  <div className="bookings-table-head bookings-table-head-admin">
                    <span>Booking ID</span>
                    <span>Event ID</span>
                    <span>Title</span>
                    <span>Status</span>
                    <span>User ID</span>
                  </div>
                  {filteredAdminBookings.map((booking) => (
                    <div
                      className="bookings-row bookings-row-admin"
                      key={booking.id ?? `${booking.userId}-${booking.eventId}`}
                    >
                      <span className="bookings-cell">{booking.id}</span>
                      <span className="bookings-cell">{booking.eventId}</span>
                      <span className="bookings-cell">
                        {booking.eventTitle}
                      </span>
                      <span
                        className={`bookings-cell booking-status booking-status-${booking.bookingStatus.toLowerCase()}`}
                      >
                        {booking.bookingStatus}
                        {renderCancellationDetails(booking)}
                      </span>
                      <button
                        type="button"
                        className="bookings-cell attendee-link-button"
                        onClick={() => onUserOpen(booking.userId)}
                      >
                        {booking.userId}
                      </button>
                    </div>
                  ))}
                </>
              )}
            </>
          ) : adminView === "attendees" ? (
            <>
              {isLoadingAdminUsers && filteredAdminUsers.length > 0 && (
                <p className="dashboard-table-loading">Loading next page...</p>
              )}
              {isLoadingAdminUsers && filteredAdminUsers.length === 0 ? (
                <p>Loading attendees...</p>
              ) : adminUsersError && filteredAdminUsers.length === 0 ? (
                <p>{adminUsersError}</p>
              ) : filteredAdminUsers.length === 0 ? (
                <div className="bookings-empty-state">No attendees found.</div>
              ) : (
                <>
                  <div className="bookings-table-head attendees-table-head">
                    <span>User ID</span>
                    <span>First Name</span>
                    <span>Last Name</span>
                  </div>
                  {filteredAdminUsers.map((user) => (
                    <div className="bookings-row attendees-row" key={user.id}>
                      <button
                        type="button"
                        className="bookings-cell attendee-link-button"
                        onClick={() => onUserOpen(user.id)}
                      >
                        {user.id}
                      </button>
                      <span className="bookings-cell">{user.firstName}</span>
                      <span className="bookings-cell">{user.lastName}</span>
                    </div>
                  ))}
                </>
              )}
            </>
          ) : adminView === "singleAttendee" ? (
            <>
              {isLoadingSelectedUser ? (
                <p>Loading attendee...</p>
              ) : selectedUserError ? (
                <p>{selectedUserError}</p>
              ) : selectedUserData ? (
                <>
                  <div className="admin-attendee-detail">
                    <div className="admin-attendee-detail-copy">
                      <p className="dashboard-meta">
                        {selectedUserData.firstName} {selectedUserData.lastName}
                      </p>
                      <p className="dashboard-meta">
                        User ID: {selectedUserData.id}
                      </p>
                    </div>
                  </div>
                  {isLoadingSelectedUserBookings &&
                  selectedUserBookings.length > 0 ? (
                    <p className="dashboard-table-loading">
                      Loading next page...
                    </p>
                  ) : null}
                  {isLoadingSelectedUserBookings &&
                  selectedUserBookings.length === 0 ? (
                    <p>Loading attendee bookings...</p>
                  ) : selectedUserBookingsError &&
                    selectedUserBookings.length === 0 ? (
                    <p>{selectedUserBookingsError}</p>
                  ) : selectedUserBookings.length === 0 ? (
                    <div className="bookings-empty-state">
                      No bookings found for this attendee.
                    </div>
                  ) : (
                    <>
                      <div className="bookings-table-head attendee-bookings-table-head">
                        <span>Booking ID</span>
                        <span>Event ID</span>
                        <span>Title</span>
                        <span>Status</span>
                      </div>
                      {selectedUserBookings.map((booking) => (
                        <div
                          className="bookings-row attendee-bookings-row"
                          key={
                            booking.id ??
                            `${selectedUserData.id}-${booking.eventId}`
                          }
                        >
                          <span className="bookings-cell">{booking.id}</span>
                          <span className="bookings-cell">
                            {booking.eventId}
                          </span>
                          <span className="bookings-cell">
                            {booking.eventTitle}
                          </span>
                          <span
                            className={`bookings-cell booking-status booking-status-${booking.bookingStatus.toLowerCase()}`}
                          >
                            {booking.bookingStatus}
                            {renderCancellationDetails(booking)}
                          </span>
                        </div>
                      ))}
                    </>
                  )}
                </>
              ) : (
                <div className="bookings-empty-state">
                  Enter an attendee ID to view their bookings.
                </div>
              )}
            </>
          ) : (
            <>
              {isLoadingAdminEvents && filteredAdminEvents.length > 0 && (
                <p className="dashboard-table-loading">Loading next page...</p>
              )}
              {isLoadingAdminEvents && filteredAdminEvents.length === 0 ? (
                <p>Loading events...</p>
              ) : adminEventsError && filteredAdminEvents.length === 0 ? (
                <p>{adminEventsError}</p>
              ) : filteredAdminEvents.length === 0 ? (
                <div className="bookings-empty-state">No events found.</div>
              ) : (
                <>
                  <div className="bookings-table-head events-table-head">
                    <span>Event ID</span>
                    <span>Title</span>
                    <span>Capacity / Confirmed / Pending</span>
                    <span>Status</span>
                    <span>Date-Time</span>
                    <span>Actions</span>
                  </div>
                  {filteredAdminEvents.map((event) => (
                    <div className="bookings-row events-row" key={event.id}>
                      <span className="bookings-cell">{event.id}</span>
                      <span className="bookings-cell">{event.title}</span>
                      <span className="bookings-cell event-capacity-cell">
                        {getEventCapacitySummary(event)}
                      </span>
                      <span
                        className="bookings-cell"
                      >
                        <span
                          className={`event-status-indicator event-status-${event.status.toLowerCase()}`}
                          data-status={formatEventStatus(event.status)}
                          aria-label={formatEventStatus(event.status)}
                        />
                      </span>
                      <span className="bookings-cell">
                        {`${new Date(event.dateTime).toLocaleDateString("de-DE")} - ${new Date(
                          event.dateTime,
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}`}
                      </span>
                      <div className="bookings-cell event-actions-cell">
                        <div
                          className="event-actions-menu"
                          ref={
                            activeEventActionsId === event.id
                              ? activeEventActionsRef
                              : null
                          }
                        >
                          <button
                            type="button"
                            className="event-actions-trigger"
                            aria-label={`Open actions for ${event.title}`}
                            onClick={() =>
                              setActiveEventActionsId((currentId) =>
                                currentId === event.id ? null : event.id,
                              )
                            }
                          >
                            &#8942;
                          </button>
                          {activeEventActionsId === event.id && (
                            <div className="event-actions-popover">
                              <button
                                type="button"
                                className="event-actions-item"
                                onClick={() => {
                                  setActiveEventActionsId(null);
                                  onEditEvent(event);
                                }}
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                className="event-actions-item event-actions-item-open"
                                onClick={() => {
                                  setActiveEventActionsId(null);
                                  onOpenEvent(event);
                                }}
                              >
                                Open
                              </button>
                              <button
                                type="button"
                                className="event-actions-item event-actions-item-close"
                                onClick={() => {
                                  setActiveEventActionsId(null);
                                  onCloseEvent(event);
                                }}
                              >
                                Close
                              </button>
                              <button
                                type="button"
                                className="event-actions-item event-actions-item-cancel"
                                onClick={() => {
                                  setActiveEventActionsId(null);
                                  onCancelEvent(event);
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </>
          )}
        </div>
        <div className="dashboard-pagination-row dashboard-pagination-row-bottom">
          {renderPaginationControls()}
        </div>
      </section>
    </main>
  );
}
