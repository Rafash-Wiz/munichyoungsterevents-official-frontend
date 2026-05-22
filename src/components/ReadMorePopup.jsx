import React from "react";

export default function ReadMorePopup({selectedEvent, onClose}) {
  return (
    selectedEvent && (
      <div className="modal-overlay">
        <div className="event-popup">
          <button
            type="button"
            className="popup-close-button"
            onClick={() => onClose(null)}
          >
            X
          </button>
          <img
            className="popup-image"
            src={selectedEvent.image}
            alt={selectedEvent.title}
          />
          <h3 className="popup-title">{selectedEvent.title}</h3>
          <span className="popup-date">{selectedEvent.date}</span>
          <p className="popup-long-description">
            {selectedEvent.longDescription}
          </p>
        </div>
      </div>
    )
  );
}
