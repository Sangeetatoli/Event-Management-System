import React, { useEffect, useState } from "react";
import "../styles/components/AdminDashBoard.css";

const AdminDashboard = () => {
  const [members, setMembers] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [error, setError] = useState("");
  const [newsletter, setNewsletter] = useState({ title: "", content: "" });
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const membersResponse = await fetch("http://localhost:5000/api/members");
        const membersData = await membersResponse.json();
        const registrationsResponse = await fetch(
          "http://localhost:5000/api/registrations"
        );
        const registrationsData = await registrationsResponse.json();

        if (membersResponse.ok) setMembers(membersData);
        else setError("Failed to fetch members.");

        if (registrationsResponse.ok) setRegistrations(registrationsData);
        else setError("Failed to fetch registrations.");
      } catch (err) {
        setError("An error occurred while fetching data.");
      }
    };

    fetchData();
  }, []);

  const handleAddNewsletter = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/newsletters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newsletter),
      });
      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Newsletter added successfully!");
        setNewsletter({ title: "", content: "" });
      } else {
        setError(data.message || "Failed to add newsletter.");
      }
    } catch (err) {
      setError("An error occurred while adding the newsletter.");
    }
  };

  const handleDeleteMember = async (memberId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/members/${memberId}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        setMembers(members.filter((member) => member.id !== memberId));
        setSuccessMessage("Member deleted successfully!");
      } else {
        setError("Failed to delete member.");
      }
    } catch (err) {
      setError("An error occurred while deleting the member.");
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      {error && <p className="admin-dashboard__error">{error}</p>}
      {successMessage && (
        <p className="admin-dashboard__success">{successMessage}</p>
      )}

      <div className="admin-dashboard__section">
        <h2>Manage Members</h2>
        <ul>
          {members.map((member) => (
            <li key={member.id}>
              {member.name} ({member.email}) - {member.role}
              <button
                onClick={() => handleDeleteMember(member.id)}
                className="admin-dashboard__delete-btn"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="admin-dashboard__section">
        <h2>Post a Newsletter</h2>
        <form onSubmit={handleAddNewsletter}>
          <input
            type="text"
            placeholder="Title"
            value={newsletter.title}
            onChange={(e) =>
              setNewsletter({ ...newsletter, title: e.target.value })
            }
            required
          />
          <textarea
            placeholder="Content"
            value={newsletter.content}
            onChange={(e) =>
              setNewsletter({ ...newsletter, content: e.target.value })
            }
            required
          ></textarea>
          <button type="submit" className="admin-dashboard__submit-btn">
            Post
          </button>
        </form>
      </div>

      <div className="admin-dashboard__section">
        <h2>Event Registrations</h2>
        <ul>
          {registrations.map((registration) => (
            <li key={registration.id}>
              {registration.name} - {registration.eventName}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
