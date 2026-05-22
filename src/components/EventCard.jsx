import React from "react";

export default function EventCard({ event, onReadMore, onBook }) {
  const formattedDateTime = `${new Date(event.date).toLocaleDateString("de-DE")} - ${new Date(
    event.date,
  ).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
  const hasLongDescription = Boolean(event.longDescription?.trim());
  const isComingSoon = event.status === "COMING_SOON";
  const isClosed = event.status === "CLOSED";
  const isCancelled = event.status === "CANCELLED";
  const imageStatusLabel = isCancelled
    ? "CANCELLED"
    : isClosed
      ? "CLOSED"
      : isComingSoon
        ? "COMING SOON"
        : "";

  return (
    <article
      className={`event-card ${
        isCancelled
          ? "event-card-cancelled"
          : isClosed
            ? "event-card-closed"
          : isComingSoon
            ? "event-card-coming-soon"
            : ""
      }`}
    >
      <div className="event-card-image-shell">
        <img className="event-card-image" src={event.image} alt={event.title} />
        {imageStatusLabel && (
          <span className="event-card-image-status">{imageStatusLabel}</span>
        )}
      </div>
      <div className="event-card-content">
        <span className="event-card-date">{formattedDateTime}</span>
        <h3 className="event-card-title">{event.title}</h3>
        <span className="event-card-location">{event.location}</span>
        <p className="event-card-description">{event.description}</p>
      </div>
      <div className="event-card-actions">
        {hasLongDescription && (
          <button
            type="button"
            className="read-button"
            onClick={() => onReadMore(event)}
          >
            Read More
          </button>
        )}
        <span className="event-card-price">{`${event.price} EUR`}</span>
        <button
          type="button"
          className="book-button"
          onClick={() => onBook(event)}
        >
          {isCancelled ? "Cancelled" : "Book"}
        </button>
      </div>
    </article>
  );
}
