import React, { useEffect, useState } from "react";
import "../styles/components/MemberDashboard.css";

const MemberDashboard = ({ memberId }) => {
  const [memberDetails, setMemberDetails] = useState({});
  const [events, setEvents] = useState([]);
  const [newsletters, setNewsletters] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const memberResponse = await fetch(
          `http://localhost:5000/api/members/${memberId}`
        );
        const memberData = await memberResponse.json();

        const eventsResponse = await fetch("http://localhost:5000/api/events");
        const eventsData = await eventsResponse.json();

        const newslettersResponse = await fetch(
          "http://localhost:5000/api/newsletters"
        );
        const newslettersData = await newslettersResponse.json();

        if (memberResponse.ok) setMemberDetails(memberData);
        else setError("Failed to fetch member details.");

        if (eventsResponse.ok) setEvents(eventsData);
        else setError("Failed to fetch events.");

        if (newslettersResponse.ok) setNewsletters(newslettersData);
        else setError("Failed to fetch newsletters.");
      } catch (err) {
        setError("An error occurred while fetching data.");
      }
    };

    fetchData();
  }, [memberId]);

  return (
    <div className="member-dashboard">
      <h1>Welcome, {memberDetails.name || "Member"}</h1>

      {error && <p className="member-dashboard__error">{error}</p>}

      <div className="member-dashboard__section">
        <h2>Your Account Details</h2>
        <p>
          <strong>Name:</strong> {memberDetails.name}
        </p>
        <p>
          <strong>Email:</strong> {memberDetails.email}
        </p>
        <p>
          <strong>Role:</strong> {memberDetails.role}
        </p>
        <p>
          <strong>Joined On:</strong>{" "}
          {memberDetails.joinDate &&
            new Date(memberDetails.joinDate).toLocaleDateString()}
        </p>
      </div>

      <div className="member-dashboard__section">
        <h2>Upcoming Events</h2>
        {events.length > 0 ? (
          <ul>
            {events.map((event) => (
              <li key={event.id}>
                <strong>{event.name}</strong> - {event.date}
                {event.requiresRegistration && (
                  <button
                    onClick={() => alert(`Registered for ${event.name}`)}
                    className="member-dashboard__register-btn"
                  >
                    Register
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No upcoming events.</p>
        )}
      </div>

      <div className="member-dashboard__section">
        <h2>Newsletters</h2>
        {newsletters.length > 0 ? (
          <ul>
            {newsletters.map((newsletter) => (
              <li key={newsletter.id}>
                <strong>{newsletter.title}</strong>
                <p>{newsletter.content}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No newsletters available.</p>
        )}
      </div>
    </div>
  );
};

export default MemberDashboard;
