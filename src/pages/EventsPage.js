import React, { useEffect, useState } from "react";
import "../styles/components/EventsPage.css";

const EventsPage = ({ memberId }) => {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/events");
        const data = await response.json();

        if (response.ok) {
          setEvents(data);
        } else {
          setError("Failed to fetch events.");
        }
      } catch (err) {
        setError("An error occurred while fetching events.");
      }
    };

    fetchEvents();
  }, []);

  const handleRegister = async (eventId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/events/${eventId}/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ memberId }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(`Successfully registered for event: ${data.eventName}`);
      } else {
        setError(data.message || "Failed to register for the event.");
      }
    } catch (err) {
      setError("An error occurred while registering for the event.");
    }
  };

  return (
    <div className="events-page">
      <h1>Upcoming Events</h1>

      {error && <p className="events-page__error">{error}</p>}
      {successMessage && (
        <p className="events-page__success">{successMessage}</p>
      )}

      <div className="events-page__list">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="events-page__card">
              <h2>{event.name}</h2>
              <p>
                <strong>Date:</strong>{" "}
                {new Date(event.date).toLocaleDateString()}
              </p>
              <p>
                <strong>Description:</strong> {event.description}
              </p>
              {event.requiresRegistration && (
                <button
                  onClick={() => handleRegister(event.id)}
                  className="events-page__register-btn"
                >
                  Register
                </button>
              )}
            </div>
          ))
        ) : (
          <p>No upcoming events.</p>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
