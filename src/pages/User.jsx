import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import AdminDashboard from "../components/AdminDashboard.jsx";
import AttendeeDashboard from "../components/AttendeeDashboard.jsx";
import CreateEventPopup from "../components/CreateEventPopup.jsx";
import EventCancelPopup from "../components/EventCancelPopup.jsx";
import EventClosePopup from "../components/EventClosePopup.jsx";
import EventOpenPopup from "../components/EventOpenPopup.jsx";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

import { useAuth } from "../auth/useAuth.js";
import { apiRequest } from "../lib/api";

export default function User() {
  const navigate = useNavigate();
  const [adminView, setAdminView] = useState("events");
  const [bookingStatusFilter, setBookingStatusFilter] = useState("all");
  const [bookingSearchQuery, setBookingSearchQuery] = useState("");
  const [bookingEventFilter, setBookingEventFilter] = useState("");
  const [appliedBookingSearchQuery, setAppliedBookingSearchQuery] =
    useState("");
  const [appliedBookingEventFilter, setAppliedBookingEventFilter] =
    useState("");
  const [attendeeIdFilter, setAttendeeIdFilter] = useState("");
  const [attendeeFirstNameFilter, setAttendeeFirstNameFilter] = useState("");
  const [attendeeLastNameFilter, setAttendeeLastNameFilter] = useState("");
  const [singleUserQuery, setSingleUserQuery] = useState("");
  const [eventSearchQuery, setEventSearchQuery] = useState("");
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [selectedEventToEdit, setSelectedEventToEdit] = useState(null);
  const [selectedEventToClose, setSelectedEventToClose] = useState(null);
  const [selectedEventToOpen, setSelectedEventToOpen] = useState(null);
  const [selectedEventToCancel, setSelectedEventToCancel] = useState(null);
  const [isClosingEvent, setIsClosingEvent] = useState(false);
  const [isOpeningEvent, setIsOpeningEvent] = useState(false);
  const [isCancellingEvent, setIsCancellingEvent] = useState(false);
  const [closeEventError, setCloseEventError] = useState("");
  const [openEventError, setOpenEventError] = useState("");
  const [cancelEventError, setCancelEventError] = useState("");
  const [adminBookingsPage, setAdminBookingsPage] = useState(0);
  const [adminBookingsTotalPages, setAdminBookingsTotalPages] = useState(1);
  const [adminUsersPage, setAdminUsersPage] = useState(0);
  const [adminUsersTotalPages, setAdminUsersTotalPages] = useState(1);
  const [adminEventsPage, setAdminEventsPage] = useState(0);
  const [adminEventsTotalPages, setAdminEventsTotalPages] = useState(1);
  const [selectedUserBookingsPage, setSelectedUserBookingsPage] = useState(0);
  const [selectedUserBookingsTotalPages, setSelectedUserBookingsTotalPages] =
    useState(1);
  const [myBookingsPage, setMyBookingsPage] = useState(0);
  const [myBookingsTotalPages, setMyBookingsTotalPages] = useState(1);

  const [adminBookings, setAdminBookings] = useState([]);
  const [isLoadingAdminBookings, setIsLoadingAdminBookings] = useState(false);
  const [adminBookingsError, setAdminBookingsError] = useState("");
  const [adminUsers, setAdminUsers] = useState([]);
  const [isLoadingAdminUsers, setIsLoadingAdminUsers] = useState(false);
  const [adminUsersError, setAdminUsersError] = useState("");
  const [adminEvents, setAdminEvents] = useState([]);
  const [isLoadingAdminEvents, setIsLoadingAdminEvents] = useState(false);
  const [adminEventsError, setAdminEventsError] = useState("");
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [isLoadingSelectedUser, setIsLoadingSelectedUser] = useState(false);
  const [selectedUserError, setSelectedUserError] = useState("");
  const [selectedUserBookings, setSelectedUserBookings] = useState([]);
  const [isLoadingSelectedUserBookings, setIsLoadingSelectedUserBookings] =
    useState(false);
  const [selectedUserBookingsError, setSelectedUserBookingsError] =
    useState("");

  const [myBookings, setMyBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [bookingsError, setBookingsError] = useState("");
  const [bookingActionError, setBookingActionError] = useState("");
  const [activeBookingActionId, setActiveBookingActionId] = useState(null);
  const { user, setUser } = useAuth();
  const normalizeBooking = (booking) => {
    const normalizedStatus =
      booking.bookingStatus ?? booking.status ?? "UNKNOWN";

    return {
      ...booking,
      bookingStatus: normalizedStatus,
      userId: booking.userId,
      userName:
        booking.userName ??
        [booking.firstName, booking.lastName].filter(Boolean).join(" "),
    };
  };

  const currentUser = useMemo(() => {
    if (!user) {
      return null;
    }

    return {
      id: user.userId,
      role: user.role?.toLowerCase(),
      name: user.firstName,
      lastName: user.lastName,
      email: user.email,
      bookings: [],
    };
  }, [user]);

  const filteredAdminBookings = adminBookings;

  const filteredAdminEvents = !eventSearchQuery.trim()
    ? adminEvents
    : adminEvents.filter((event) =>
        String(event.id).includes(eventSearchQuery.trim()),
      );

  const filteredAdminUsers = adminUsers;

  const handleClearAdminUserFilters = () => {
    setAttendeeIdFilter("");
    setAttendeeFirstNameFilter("");
    setAttendeeLastNameFilter("");
    setAdminUsersPage(0);
  };

  const handleAttendeeIdFilterChange = (value) => {
    setAttendeeIdFilter(value);
    setAdminUsersPage(0);
  };

  const handleAttendeeFirstNameFilterChange = (value) => {
    setAttendeeFirstNameFilter(value);
    setAdminUsersPage(0);
  };

  const handleAttendeeLastNameFilterChange = (value) => {
    setAttendeeLastNameFilter(value);
    setAdminUsersPage(0);
  };

  const resetAdminUserFilters = () => {
    setAttendeeIdFilter("");
    setAttendeeFirstNameFilter("");
    setAttendeeLastNameFilter("");
    setAdminUsersError("");
    setAdminUsersPage(0);
  };

  const resetAdminBookingFilters = () => {
    setBookingStatusFilter("all");
    setBookingSearchQuery("");
    setBookingEventFilter("");
    setAppliedBookingSearchQuery("");
    setAppliedBookingEventFilter("");
    setAdminBookingsError("");
    setAdminBookingsPage(0);
  };

  const loadMyBookingsPage = useCallback(
    async (page) => {
      if (!currentUser || currentUser.role !== "attendee") {
        return;
      }

      try {
        setIsLoadingBookings(true);
        setBookingsError("");

        const data = await apiRequest(`/api/bookings/me?page=${page}&size=10`);
        setMyBookings(data.content.map(normalizeBooking));
        setMyBookingsTotalPages(data.totalPages || 1);
      } catch (error) {
        setBookingsError(error.message);
      } finally {
        setIsLoadingBookings(false);
      }
    },
    [currentUser],
  );

  const refreshMyBookings = async () => {
    await loadMyBookingsPage(myBookingsPage);
  };

  const loadAdminBookingsPage = useCallback(
    async (
      page,
      {
        bookingId = appliedBookingSearchQuery.trim(),
        eventId = appliedBookingEventFilter.trim(),
        status = bookingStatusFilter,
      } = {},
    ) => {
      if (!currentUser || currentUser.role !== "admin") {
        return;
      }

      try {
        setIsLoadingAdminBookings(true);
        setAdminBookingsError("");

        if (bookingId) {
          const booking = await apiRequest(`/api/bookings/${bookingId}`);
          setAdminBookings([normalizeBooking(booking)]);
          setAdminBookingsTotalPages(1);
          return;
        }

        const queryParams = new URLSearchParams({
          page: String(page),
          size: "10",
        });

        if (eventId) {
          queryParams.set("eventId", eventId);
        }

        if (status !== "all") {
          queryParams.set("status", status.toUpperCase());
        }

        const data = await apiRequest(
          `/api/bookings?${queryParams.toString()}`,
        );
        setAdminBookings(data.content.map(normalizeBooking));
        setAdminBookingsTotalPages(data.totalPages || 1);
      } catch (error) {
        if (bookingId && error.status === 404) {
          setAdminBookings([]);
          setAdminBookingsError("No booking found.");
          setAdminBookingsTotalPages(1);
          return;
        }

        setAdminBookingsError(error.message);
      } finally {
        setIsLoadingAdminBookings(false);
      }
    },
    [
      appliedBookingEventFilter,
      appliedBookingSearchQuery,
      bookingStatusFilter,
      currentUser,
    ],
  );

  const loadSelectedUserBookings = useCallback(async (userId, page) => {
    try {
      setIsLoadingSelectedUserBookings(true);
      setSelectedUserBookingsError("");

      const userBookings = await apiRequest(
        `/api/bookings?userId=${userId}&page=${page}&size=10`,
      );
      setSelectedUserBookings(userBookings.content.map(normalizeBooking));
      setSelectedUserBookingsTotalPages(userBookings.totalPages || 1);
    } catch (error) {
      setSelectedUserBookingsError(error.message);
      setSelectedUserBookings([]);
    } finally {
      setIsLoadingSelectedUserBookings(false);
    }
  }, []);

  useEffect(() => {
    const loadMyBookings = async () => {
      if (!currentUser || currentUser.role !== "attendee") {
        return;
      }

      await loadMyBookingsPage(myBookingsPage);
    };

    loadMyBookings();
  }, [currentUser, loadMyBookingsPage, myBookingsPage]);

  useEffect(() => {
    const loadAdminBookings = async () => {
      if (!currentUser || currentUser.role !== "admin") {
        return;
      }

      await loadAdminBookingsPage(adminBookingsPage);
    };

    loadAdminBookings();
  }, [adminBookingsPage, currentUser, loadAdminBookingsPage]);

  const handleBookingStatusFilterChange = (nextStatus) => {
    setBookingSearchQuery("");
    setAppliedBookingSearchQuery("");
    setBookingStatusFilter(nextStatus);
    setAdminBookingsPage(0);
  };

  const handleAdminBookingListSearch = async () => {
    const nextEventId = bookingEventFilter.trim();

    setBookingSearchQuery("");
    setAppliedBookingSearchQuery("");
    setAppliedBookingEventFilter(nextEventId);

    if (adminBookingsPage !== 0) {
      setAdminBookingsPage(0);
      return;
    }

    await loadAdminBookingsPage(0, {
      bookingId: "",
      eventId: nextEventId,
      status: bookingStatusFilter,
    });
  };

  const handleAdminBookingIdSearch = async () => {
    const nextBookingId = bookingSearchQuery.trim();

    setBookingStatusFilter("all");
    setBookingEventFilter("");
    setAppliedBookingSearchQuery(nextBookingId);
    setAppliedBookingEventFilter("");

    if (adminBookingsPage !== 0) {
      setAdminBookingsPage(0);
      return;
    }

    await loadAdminBookingsPage(0, {
      bookingId: nextBookingId,
      eventId: "",
      status: "all",
    });
  };

  useEffect(() => {
    const loadAdminUsers = async () => {
      if (!currentUser || currentUser.role !== "admin") {
        return;
      }

      try {
        setIsLoadingAdminUsers(true);
        setAdminUsersError("");

        const queryParams = new URLSearchParams({
          role: "ATTENDEE",
          page: String(adminUsersPage),
          size: "10",
        });

        if (attendeeIdFilter.trim()) {
          queryParams.set("id", attendeeIdFilter.trim());
        }

        if (attendeeFirstNameFilter.trim()) {
          queryParams.set("firstName", attendeeFirstNameFilter.trim());
        }

        if (attendeeLastNameFilter.trim()) {
          queryParams.set("lastName", attendeeLastNameFilter.trim());
        }

        const data = await apiRequest(`/api/users?${queryParams.toString()}`);
        setAdminUsers(data.content);
        setAdminUsersTotalPages(data.totalPages || 1);
      } catch (error) {
        setAdminUsersError(error.message);
      } finally {
        setIsLoadingAdminUsers(false);
      }
    };

    loadAdminUsers();
  }, [
    adminUsersPage,
    attendeeFirstNameFilter,
    attendeeIdFilter,
    attendeeLastNameFilter,
    currentUser,
  ]);

  const refreshAdminEvents = async () => {
    if (!currentUser || currentUser.role !== "admin") {
      return;
    }

    try {
      setIsLoadingAdminEvents(true);
      setAdminEventsError("");

      const data = await apiRequest(
        `/api/events?page=${adminEventsPage}&size=10`,
      );
      setAdminEvents(data.content);
      setAdminEventsTotalPages(data.totalPages || 1);
    } catch (error) {
      setAdminEventsError(error.message);
    } finally {
      setIsLoadingAdminEvents(false);
    }
  };

  useEffect(() => {
    const loadAdminEvents = async () => {
      if (!currentUser || currentUser.role !== "admin") {
        return;
      }

      try {
        setIsLoadingAdminEvents(true);
        setAdminEventsError("");

        const data = await apiRequest(
          `/api/events?page=${adminEventsPage}&size=10`,
        );
        setAdminEvents(data.content);
        setAdminEventsTotalPages(data.totalPages || 1);
      } catch (error) {
        setAdminEventsError(error.message);
      } finally {
        setIsLoadingAdminEvents(false);
      }
    };

    loadAdminEvents();
  }, [adminEventsPage, currentUser]);

  const handleHeaderAuthClick = async () => {
    if (!user) {
      navigate("/");
      return;
    }

    try {
      await apiRequest("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setUser(null);
      navigate("/");
    }
  };

  const handleAdminViewChange = (view) => {
    const isLeavingBookings = adminView === "bookings" && view !== "bookings";
    const isLeavingAttendees =
      adminView === "attendees" && view !== "attendees";

    setAdminView(view);
    setAdminBookingsPage(0);
    setAdminUsersPage(0);
    setAdminEventsPage(0);
    setSelectedUserBookingsPage(0);

    if (isLeavingBookings || view === "bookings") {
      resetAdminBookingFilters();
    }

    if (isLeavingAttendees || view === "attendees") {
      resetAdminUserFilters();
    }

    if (view === "singleAttendee") {
      setSelectedUserData(null);
      setSelectedUserError("");
      setSingleUserQuery("");
      return;
    }

    if (view !== "singleAttendee") {
      setSelectedUserData(null);
      setSelectedUserError("");
      setSingleUserQuery("");
    }
  };

  const handleUserOpen = async (userId) => {
    try {
      setIsLoadingSelectedUser(true);
      setSelectedUserError("");

      const userData = await apiRequest(`/api/users/${userId}`);
      setSelectedUserData(userData);

      setSingleUserQuery(String(userId));
      setAdminView("singleAttendee");
      setSelectedUserBookingsPage(0);
    } catch (error) {
      setSelectedUserError(error.message);
      setSelectedUserData(null);
      setSelectedUserBookings([]);
      setSelectedUserBookingsError(error.message);
    } finally {
      setIsLoadingSelectedUser(false);
    }
  };

  const handleSingleUserInputChange = (event) => {
    const nextValue = event.target.value;
    setSingleUserQuery(nextValue);

    if (!nextValue.trim()) {
      setSelectedUserData(null);
      setSelectedUserError("");
      setSelectedUserBookings([]);
      setSelectedUserBookingsError("");
    }
  };

  const handleSingleUserSearch = async () => {
    if (!singleUserQuery.trim()) {
      setSelectedUserData(null);
      setSelectedUserError("");
      setSelectedUserBookings([]);
      setSelectedUserBookingsError("");
      return;
    }

    setSelectedUserBookingsPage(0);
    await handleUserOpen(singleUserQuery.trim());
  };

  const handleHeaderProfileClick = () => {
    if (!user) {
      return;
    }

    navigate(`/user/${user.userId}`);
  };

  const handlePayMyBooking = (booking) => {
    console.log("Start payment session for booking:", booking);
  };

  const handleCancelMyBooking = async (booking) => {
    if (booking.bookingStatus?.toLowerCase() !== "pending") {
      return;
    }

    try {
      setActiveBookingActionId(booking.id);
      setBookingActionError("");

      await apiRequest(`/api/bookings/${booking.id}/cancel`, {
        method: "PATCH",
      });

      await refreshMyBookings();
    } catch (error) {
      setBookingActionError(error.message);
    } finally {
      setActiveBookingActionId(null);
    }
  };

  const handleOpenCancelEvent = (event) => {
    setSelectedEventToCancel(event);
    setCancelEventError("");
  };

  const handleOpenCloseEvent = (event) => {
    setSelectedEventToClose(event);
    setCloseEventError("");
  };

  const handleOpenOpenEvent = (event) => {
    setSelectedEventToOpen(event);
    setOpenEventError("");
  };

  const handleCloseCloseEvent = () => {
    setSelectedEventToClose(null);
    setCloseEventError("");
  };

  const handleCloseOpenEvent = () => {
    setSelectedEventToOpen(null);
    setOpenEventError("");
  };

  const handleCloseCancelEvent = () => {
    setSelectedEventToCancel(null);
    setCancelEventError("");
  };

  const handleCancelEvent = async () => {
    if (!currentUser || currentUser.role !== "admin") {
      return;
    }
    if (!selectedEventToCancel) {
      return;
    }

    try {
      setIsCancellingEvent(true);
      setCancelEventError("");

      await apiRequest(`/api/events/${selectedEventToCancel.id}/cancel`, {
        method: "PATCH",
      });

      await refreshAdminEvents();
      handleCloseCancelEvent();
    } catch (error) {
      setCancelEventError(error.message);
    } finally {
      setIsCancellingEvent(false);
    }
  };

  const handleOpenEvent = async () => {
    if (!currentUser || currentUser.role !== "admin") {
      return;
    }
    if (!selectedEventToOpen) {
      return;
    }

    try {
      setIsOpeningEvent(true);
      setOpenEventError("");

      await apiRequest(`/api/events/${selectedEventToOpen.id}/open`, {
        method: "PATCH",
      });

      await refreshAdminEvents();
      handleCloseOpenEvent();
    } catch (error) {
      setOpenEventError(error.message);
    } finally {
      setIsOpeningEvent(false);
    }
  };

  const handleCloseEvent = async () => {
    if (!currentUser || currentUser.role !== "admin") {
      return;
    }
    if (!selectedEventToClose) {
      return;
    }

    try {
      setIsClosingEvent(true);
      setCloseEventError("");

      await apiRequest(`/api/events/${selectedEventToClose.id}/close`, {
        method: "PATCH",
      });

      await refreshAdminEvents();
      handleCloseCloseEvent();
    } catch (error) {
      setCloseEventError(error.message);
    } finally {
      setIsClosingEvent(false);
    }
  };

  useEffect(() => {
    const syncSelectedUserBookings = async () => {
      if (!selectedUserData) {
        return;
      }

      await loadSelectedUserBookings(
        selectedUserData.id,
        selectedUserBookingsPage,
      );
    };

    syncSelectedUserBookings();
  }, [loadSelectedUserBookings, selectedUserBookingsPage, selectedUserData]);

  if (!currentUser) {
    return <div>User not found</div>;
  }

  let pageContent;

  if (currentUser.role === "attendee") {
    pageContent = (
      <AttendeeDashboard
        currentUser={currentUser}
        isLoadingBookings={isLoadingBookings}
        bookingsError={bookingsError}
        myBookings={myBookings}
        myBookingsPage={myBookingsPage}
        myBookingsTotalPages={myBookingsTotalPages}
        bookingActionError={bookingActionError}
        activeBookingActionId={activeBookingActionId}
        onMyBookingsPageSelect={setMyBookingsPage}
        onMyBookingsPreviousPage={() =>
          setMyBookingsPage((currentPage) => currentPage - 1)
        }
        onMyBookingsNextPage={() =>
          setMyBookingsPage((currentPage) => currentPage + 1)
        }
        onPayBooking={handlePayMyBooking}
        onCancelBooking={handleCancelMyBooking}
      />
    );
  } else if (currentUser.role === "admin") {
    pageContent = (
      <AdminDashboard
        currentUser={currentUser}
        adminView={adminView}
        onAdminViewChange={handleAdminViewChange}
        onOpenCreateEvent={() => setIsCreateEventOpen(true)}
        bookingStatusFilter={bookingStatusFilter}
        onBookingStatusFilterChange={handleBookingStatusFilterChange}
        bookingSearchQuery={bookingSearchQuery}
        onBookingSearchQueryChange={setBookingSearchQuery}
        bookingEventFilter={bookingEventFilter}
        onBookingEventFilterChange={setBookingEventFilter}
        onAdminBookingListSearch={handleAdminBookingListSearch}
        onAdminBookingIdSearch={handleAdminBookingIdSearch}
        singleUserQuery={singleUserQuery}
        onSingleUserInputChange={handleSingleUserInputChange}
        onSingleUserSearch={handleSingleUserSearch}
        eventSearchQuery={eventSearchQuery}
        onEventSearchQueryChange={setEventSearchQuery}
        isLoadingAdminBookings={isLoadingAdminBookings}
        adminBookingsError={adminBookingsError}
        filteredAdminBookings={filteredAdminBookings}
        adminBookingsPage={adminBookingsPage}
        adminBookingsTotalPages={adminBookingsTotalPages}
        onAdminBookingsPageSelect={setAdminBookingsPage}
        onAdminBookingsPreviousPage={() =>
          setAdminBookingsPage((currentPage) => currentPage - 1)
        }
        onAdminBookingsNextPage={() =>
          setAdminBookingsPage((currentPage) => currentPage + 1)
        }
        onUserOpen={handleUserOpen}
        isLoadingAdminUsers={isLoadingAdminUsers}
        adminUsersError={adminUsersError}
        attendeeIdFilter={attendeeIdFilter}
        onAttendeeIdFilterChange={handleAttendeeIdFilterChange}
        attendeeFirstNameFilter={attendeeFirstNameFilter}
        onAttendeeFirstNameFilterChange={handleAttendeeFirstNameFilterChange}
        attendeeLastNameFilter={attendeeLastNameFilter}
        onAttendeeLastNameFilterChange={handleAttendeeLastNameFilterChange}
        onClearAttendeeFilters={handleClearAdminUserFilters}
        filteredAdminUsers={filteredAdminUsers}
        adminUsersPage={adminUsersPage}
        adminUsersTotalPages={adminUsersTotalPages}
        onAdminUsersPageSelect={setAdminUsersPage}
        onAdminUsersPreviousPage={() =>
          setAdminUsersPage((currentPage) => currentPage - 1)
        }
        onAdminUsersNextPage={() =>
          setAdminUsersPage((currentPage) => currentPage + 1)
        }
        isLoadingSelectedUser={isLoadingSelectedUser}
        selectedUserError={selectedUserError}
        selectedUserData={selectedUserData}
        isLoadingSelectedUserBookings={isLoadingSelectedUserBookings}
        selectedUserBookingsError={selectedUserBookingsError}
        selectedUserBookings={selectedUserBookings}
        selectedUserBookingsPage={selectedUserBookingsPage}
        selectedUserBookingsTotalPages={selectedUserBookingsTotalPages}
        onSelectedUserBookingsPageSelect={setSelectedUserBookingsPage}
        onSelectedUserBookingsPreviousPage={() =>
          setSelectedUserBookingsPage((currentPage) => currentPage - 1)
        }
        onSelectedUserBookingsNextPage={() =>
          setSelectedUserBookingsPage((currentPage) => currentPage + 1)
        }
        isLoadingAdminEvents={isLoadingAdminEvents}
        adminEventsError={adminEventsError}
        filteredAdminEvents={filteredAdminEvents}
        adminEventsPage={adminEventsPage}
        adminEventsTotalPages={adminEventsTotalPages}
        onAdminEventsPageSelect={setAdminEventsPage}
        onAdminEventsPreviousPage={() =>
          setAdminEventsPage((currentPage) => currentPage - 1)
        }
        onAdminEventsNextPage={() =>
          setAdminEventsPage((currentPage) => currentPage + 1)
        }
        onEditEvent={(event) => {
          setSelectedEventToEdit(event);
          setIsCreateEventOpen(true);
        }}
        onOpenEvent={handleOpenOpenEvent}
        onCloseEvent={handleOpenCloseEvent}
        onCancelEvent={handleOpenCancelEvent}
      />
    );
  } else {
    pageContent = <div>Invalid role</div>;
  }

  return (
    <div className="user-page">
      <Header
        onProfileClick={handleHeaderProfileClick}
        onAuthClick={handleHeaderAuthClick}
      />
      {pageContent}
      <CreateEventPopup
        key={selectedEventToEdit?.id ?? "create-event"}
        isCreateEventOpen={isCreateEventOpen}
        onClose={() => {
          setIsCreateEventOpen(false);
          setSelectedEventToEdit(null);
        }}
        onEventCreated={refreshAdminEvents}
        selectedEventToEdit={selectedEventToEdit}
      />
      <EventCancelPopup
        selectedEvent={selectedEventToCancel}
        isCancelling={isCancellingEvent}
        cancelError={cancelEventError}
        onConfirm={handleCancelEvent}
        onClose={handleCloseCancelEvent}
      />
      <EventOpenPopup
        selectedEvent={selectedEventToOpen}
        isOpening={isOpeningEvent}
        openError={openEventError}
        onConfirm={handleOpenEvent}
        onClose={handleCloseOpenEvent}
      />
      <EventClosePopup
        selectedEvent={selectedEventToClose}
        isClosing={isClosingEvent}
        closeError={closeEventError}
        onConfirm={handleCloseEvent}
        onClose={handleCloseCloseEvent}
      />
      <Footer />
    </div>
  );
}
