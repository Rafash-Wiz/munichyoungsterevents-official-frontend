import React, { useEffect, useState } from "react";
import { slides } from "../images/carousel/slides";
import EventCard from "../components/EventCard";
import AuthPopup from "../components/AuthPopup.jsx";
import ReadMorePopup from "../components/ReadMorePopup.jsx";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import PaginationControls from "../components/PaginationControls.jsx";
import {
  clearEventsError,
  setEvents,
  setEventsError,
  setEventsLoading,
} from "../store/eventsSlice";

import { apiRequest } from "../lib/api";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../store/authSlice";
import { useNavigate } from "react-router";
import BookingPopup from "../components/BookingPopup.jsx";

export default function Home() {
  const eventsPageSize = 9;
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [selectedBookingEvent, setSelectedBookingEvent] = useState(null);
  const [pendingBooking, setPendingBooking] = useState(null);
  const [isBookingLoading, setIsBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const user = useSelector((state) => state.auth.user);
  const [eventsView, setEventsView] = useState("OPEN");
  const [eventsPage, setEventsPage] = useState(0);

  const eventsList = useSelector((state) => state.events.eventsList);
  const isLoadingEvents = useSelector((state) => state.events.isLoadingEvents);
  const eventsError = useSelector((state) => state.events.eventsError);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const loadEvents = async () => {
      try {
        dispatch(setEventsLoading(true));
        dispatch(clearEventsError());

        const firstPage = await apiRequest("/api/events", {
          params: {
            page: 0,
            size: 50,
          },
        });
        const allEvents = [...firstPage.content];

        for (let page = 1; page < (firstPage.totalPages || 1); page += 1) {
          const nextPage = await apiRequest("/api/events", {
            params: {
              page,
              size: 50,
            },
          });
          allEvents.push(...nextPage.content);
        }

        const normalizedEvents = allEvents.map((event) => ({
          ...event,
          image: event.imageUrl,
          date: event.dateTime,
        }));

        dispatch(setEvents(normalizedEvents));
      } catch (error) {
        dispatch(setEventsError(error.message));
      } finally {
        dispatch(setEventsLoading(false));
      }
    };

    loadEvents();
  }, [dispatch]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % slides.length);
    }, 4500);

    return () => window.clearInterval(intervalId);
  }, []);

  const handleReadMore = (event) => {
    setSelectedEvent(event);
  };

  const handleHeaderAuthClick = async () => {
    if (!user) {
      setIsAuthOpen(true);
      setAuthMode("login");
      return;
    }

    try {
      await apiRequest("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(clearUser());
    }
  };

  const handleHeaderProfileClick = () => {
    if (!user) {
      return;
    }

    navigate(`/user/${user.userId}`);
  };

  const handleBookEvent = async (event) => {
    if (!user) {
      setIsAuthOpen(true);
      setAuthMode("login");
      return;
    }

    try {
      setIsBookingLoading(true);
      setBookingError("");
      setPendingBooking(null);

      const existingPendingBooking = await apiRequest(
        `/api/bookings/me/pending/${event.id}`,
      );

      setPendingBooking(existingPendingBooking);
      setSelectedBookingEvent(event);
    } catch (error) {
      if (error.status === 404) {
        setPendingBooking(null);
        setSelectedBookingEvent(event);
        return;
      }

      setBookingError(error.message);
      setSelectedBookingEvent(null);
    } finally {
      setIsBookingLoading(false);
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedBookingEvent || !user) {
      return;
    }

    try {
      setIsBookingLoading(true);
      setBookingError("");

      const createdBooking = await apiRequest("/api/bookings", {
        method: "POST",
        data: {
          eventId: selectedBookingEvent.id,
        },
      });

      setPendingBooking(createdBooking);
    } catch (error) {
      setBookingError(error.message);
    } finally {
      setIsBookingLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!pendingBooking) {
      return;
    }

    try {
      setIsBookingLoading(true);
      setBookingError("");

      await apiRequest(`/api/bookings/${pendingBooking.id}/cancel`, {
        method: "PATCH",
      });

      setPendingBooking(null);
    } catch (error) {
      setBookingError(error.message);
    } finally {
      setIsBookingLoading(false);
    }
  };

  const handleCloseBookingPopup = () => {
    setSelectedBookingEvent(null);
    setPendingBooking(null);
    setBookingError("");
  };

  const visibleEvents = eventsList.filter((event) =>
    eventsView === "OPEN"
      ? event.status === "OPEN" || event.status === "CLOSED"
      : event.status === eventsView,
  );
  const eventsTotalPages = Math.max(
    1,
    Math.ceil(visibleEvents.length / eventsPageSize),
  );
  const paginatedEvents = visibleEvents.slice(
    eventsPage * eventsPageSize,
    (eventsPage + 1) * eventsPageSize,
  );
  const emptyEventsMessage =
    eventsView === "OPEN"
      ? "No open for booking events right now."
      : eventsView === "COMING_SOON"
        ? "No coming soon events right now."
        : "No cancelled events right now.";

  return (
    <div className="app">
      <Header
        onProfileClick={handleHeaderProfileClick}
        onAuthClick={handleHeaderAuthClick}
      />
      <main className="home-main">
        <section className="hero-carousel" aria-label="Featured events">
          <div className="carousel-stage">
            {slides.map((slide, index) => (
              <article
                key={slide.title}
                className={`carousel-slide ${index === activeSlide ? "is-active" : ""}`}
              >
                <img src={slide.image} alt={slide.title} />
                <div className="carousel-overlay" />
                <div className="carousel-copy">
                  <span>{slide.eyebrow}</span>
                  <h1>{slide.title}</h1>
                </div>
              </article>
            ))}
            <div className="carousel-controls" aria-label="Carousel navigation">
              {slides.map((slide, index) => (
                <button
                  key={slide.eyebrow}
                  type="button"
                  className={`carousel-dot ${index === activeSlide ? "is-active" : ""}`}
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Show slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>
        <section className="events-section">
          <div className="events-section-header">
            <h2>Events</h2>
            <div className="events-view-switch">
              <button
                type="button"
                className={`events-view-button ${eventsView === "OPEN" ? "is-active" : ""}`}
                onClick={() => {
                  setEventsView("OPEN");
                  setEventsPage(0);
                }}
              >
                Open for Booking
              </button>
              <button
                type="button"
                className={`events-view-button ${eventsView === "COMING_SOON" ? "is-active" : ""}`}
                onClick={() => {
                  setEventsView("COMING_SOON");
                  setEventsPage(0);
                }}
              >
                Coming Soon
              </button>
              <button
                type="button"
                className={`events-view-button ${eventsView === "CANCELLED" ? "is-active" : ""}`}
                onClick={() => {
                  setEventsView("CANCELLED");
                  setEventsPage(0);
                }}
              >
                Cancelled
              </button>
            </div>
          </div>
          {isLoadingEvents ? (
            <p>Loading events...</p>
          ) : eventsError ? (
            <p>{eventsError}</p>
          ) : visibleEvents.length === 0 ? (
            <p>{emptyEventsMessage}</p>
          ) : (
            <div className="events-list">
              {paginatedEvents.map((event) => (
                <EventCard
                  event={event}
                  key={event.id}
                  onReadMore={handleReadMore}
                  onBook={handleBookEvent}
                />
              ))}
            </div>
          )}
          <PaginationControls
            page={eventsPage}
            totalPages={eventsTotalPages}
            isLoading={isLoadingEvents}
            onPageSelect={setEventsPage}
            onPrevious={() => setEventsPage((currentPage) => currentPage - 1)}
            onNext={() => setEventsPage((currentPage) => currentPage + 1)}
          />
        </section>
        <ReadMorePopup
          selectedEvent={selectedEvent}
          onClose={setSelectedEvent}
        />
        <BookingPopup
          selectedEvent={selectedBookingEvent}
          pendingBooking={pendingBooking}
          isBookingLoading={isBookingLoading}
          bookingError={bookingError}
          onConfirmBooking={handleConfirmBooking}
          onCancelBooking={handleCancelBooking}
          onClose={handleCloseBookingPopup}
        />

        <AuthPopup
          isAuthOpen={isAuthOpen}
          authMode={authMode}
          setIsAuthOpen={setIsAuthOpen}
          setAuthMode={setAuthMode}
        />
      </main>
      <Footer />
    </div>
  );
}
