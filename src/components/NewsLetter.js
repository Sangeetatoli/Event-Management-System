import React, { useEffect, useState } from "react";
import "../styles/components/NewsLetter.css";
;

const NewsLetters = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/newsletters");
        const data = await response.json();

        if (response.ok) {
          setNewsletters(data);
        } else {
          setError(data.message || "Failed to fetch newsletters.");
        }
      } catch (err) {
        setError("An error occurred while fetching newsletters.");
      }
    };

    fetchNewsletters();
  }, []);

  return (
    <div className="newsletters">
      <h2>Newsletters & Announcements</h2>
      {error && <p className="newsletters__error">{error}</p>}
      {newsletters.length > 0 ? (
        <ul className="newsletters__list">
          {newsletters.map((newsletter) => (
            <li key={newsletter.id} className="newsletters__item">
              <h3>{newsletter.title}</h3>
              <p>{newsletter.content}</p>
              <p className="newsletters__date">
                Published on: {new Date(newsletter.date).toLocaleDateString()}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No newsletters available at the moment.</p>
      )}
    </div>
  );
};

export default NewsLetters;
