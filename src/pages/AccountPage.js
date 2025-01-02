import React, { useEffect, useState } from "react";
import "../styles/components/AccountPage.css";

const AccountPage = ({ memberId }) => {
  const [memberDetails, setMemberDetails] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/members/${memberId}`
        );
        const data = await response.json();

        if (response.ok) {
          setMemberDetails(data);
          setFormValues(data);
        } else {
          setError("Failed to fetch member details.");
        }
      } catch (err) {
        setError("An error occurred while fetching member details.");
      }
    };

    fetchMemberDetails();
  }, [memberId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:5000/api/members/${memberId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formValues),
        }
      );
      const data = await response.json();

      if (response.ok) {
        setMemberDetails(data);
        setEditMode(false);
        setSuccessMessage("Details updated successfully!");
      } else {
        setError(data.message || "Failed to update details.");
      }
    } catch (err) {
      setError("An error occurred while updating details.");
    }
  };

  return (
    <div className="account-page">
      <h1>My Account</h1>

      {error && <p className="account-page__error">{error}</p>}
      {successMessage && (
        <p className="account-page__success">{successMessage}</p>
      )}

      {!editMode ? (
        <div className="account-page__details">
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
          <button
            onClick={() => setEditMode(true)}
            className="account-page__edit-btn"
          >
            Edit Details
          </button>
        </div>
      ) : (
        <form className="account-page__form" onSubmit={handleUpdateDetails}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formValues.name || ""}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formValues.email || ""}
              onChange={handleInputChange}
              required
            />
          </label>
          <button type="submit" className="account-page__save-btn">
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => setEditMode(false)}
            className="account-page__cancel-btn"
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
};

export default AccountPage;
