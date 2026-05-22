import React, { useState } from "react";
import { apiRequest } from "../lib/api";

function getInitialEventForm(selectedEventToEdit) {
  return {
    title: selectedEventToEdit?.title ?? "",
    dateTime: selectedEventToEdit?.dateTime ?? "",
    description: selectedEventToEdit?.description ?? "",
    longDescription: selectedEventToEdit?.longDescription ?? "",
    imageUrl: selectedEventToEdit?.imageUrl ?? "",
    location: selectedEventToEdit?.location ?? "",
    capacity: selectedEventToEdit ? String(selectedEventToEdit.capacity ?? "") : "",
    price: selectedEventToEdit ? String(selectedEventToEdit.price ?? "") : "",
    status: selectedEventToEdit?.status ?? "OPEN",
  };
}

export default function CreateEventPopup({
  isCreateEventOpen,
  onClose,
  onEventCreated,
  selectedEventToEdit,
}) {
  const initialForm = getInitialEventForm(selectedEventToEdit);
  const [eventTitle, setEventTitle] = useState(initialForm.title);
  const [eventDateTime, setEventDateTime] = useState(initialForm.dateTime);
  const [eventDescription, setEventDescription] = useState(
    initialForm.description,
  );
  const [eventLongDescription, setEventLongDescription] = useState(
    initialForm.longDescription,
  );
  const [eventImageUrl, setEventImageUrl] = useState(initialForm.imageUrl);
  const [eventLocation, setEventLocation] = useState(initialForm.location);
  const [eventCapacity, setEventCapacity] = useState(initialForm.capacity);
  const [eventPrice, setEventPrice] = useState(initialForm.price);
  const [eventStatus, setEventStatus] = useState(initialForm.status);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const isEditMode = Boolean(selectedEventToEdit);

  const handleCreateEventSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    const event = {
      title: eventTitle,
      description: eventDescription,
      longDescription: eventLongDescription,
      imageUrl: eventImageUrl,
      dateTime: eventDateTime,
      location: eventLocation,
      capacity: Number(eventCapacity),
      price: Number(eventPrice),
      status: eventStatus,
    };

    try {
      setIsSubmitting(true);

      const path = isEditMode
        ? `/api/events/${selectedEventToEdit.id}`
        : "/api/events";

      const method = isEditMode ? "PUT" : "POST";

      await apiRequest(path, {
        method,
        body: JSON.stringify(event),
      });

      onEventCreated?.();
      resetCreateEventForm();
      onClose();
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetCreateEventForm = () => {
    setEventTitle("");
    setEventDateTime("");
    setEventDescription("");
    setEventLongDescription("");
    setEventImageUrl("");
    setEventLocation("");
    setEventCapacity("");
    setEventPrice("");
    setEventStatus("OPEN");
    setSubmitError("");
  };

  return (
    isCreateEventOpen && (
      <div className="modal-overlay">
        <div className="create-event-popup">
          <button
            type="button"
            className="popup-close-button"
            onClick={() => {
              resetCreateEventForm();
              onClose();
            }}
          >
            X
          </button>
          <h3 className="create-event-title">
            {isEditMode ? "Edit Event" : "Create an Event"}
          </h3>
          <form
            className="create-event-form"
            onSubmit={handleCreateEventSubmit}
          >
            <input
              type="text"
              placeholder="Event Title"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              disabled={isSubmitting}
            />
            <input
              type="url"
              placeholder="Event Image URL"
              value={eventImageUrl}
              onChange={(e) => setEventImageUrl(e.target.value)}
              disabled={isSubmitting}
            />
            <input
              type="datetime-local"
              value={eventDateTime}
              onChange={(e) => setEventDateTime(e.target.value)}
              disabled={isSubmitting}
            />
            <input
              type="text"
              placeholder="Location"
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              disabled={isSubmitting}
            />
            <input
              type="number"
              placeholder="Capacity"
              value={eventCapacity}
              onChange={(e) => setEventCapacity(e.target.value)}
              disabled={isSubmitting}
            />
            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={eventPrice}
              onChange={(e) => setEventPrice(e.target.value)}
              disabled={isSubmitting}
            />
            <select
              value={eventStatus}
              onChange={(e) => setEventStatus(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="OPEN">Open</option>
              <option value="COMING_SOON">Coming Soon</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <textarea
              className="create-event-description"
              placeholder="Event Description"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
              maxLength={120}
              disabled={isSubmitting}
            />
            <textarea
              className="create-event-long-description"
              placeholder="Event Long Description"
              value={eventLongDescription}
              onChange={(e) => setEventLongDescription(e.target.value)}
              maxLength={8000}
              disabled={isSubmitting}
            />
            {submitError && <p className="auth-popup-error">{submitError}</p>}
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? isEditMode
                  ? "Saving..."
                  : "Creating..."
                : isEditMode
                  ? "Save Changes"
                  : "Create"}
            </button>
          </form>
        </div>
      </div>
    )
  );
}
