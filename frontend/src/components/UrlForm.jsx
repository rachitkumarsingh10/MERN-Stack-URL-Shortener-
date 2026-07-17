// ─────────────────────────────────────────────────────────
//  src/components/UrlForm.jsx  — Form to shorten a URL
//
//  Props:
//    • onUrlCreated(newUrl)  — called after a successful POST
//    • apiBase               — the backend API URL string
//
//  What this component does:
//    1. Controls a text input (controlled component pattern)
//    2. On submit, sends a POST request to the backend
//    3. Passes the returned URL document up to App via onUrlCreated
//    4. Shows success or error feedback below the form
// ─────────────────────────────────────────────────────────

import { useState } from "react";
import axios from "axios";

// Receives onUrlCreated callback and apiBase URL from parent (App.jsx)
function UrlForm({ onUrlCreated, apiBase }) {
  // ── Local State ──────────────────────────────────────────
  // inputUrl   — the value of the text input field
  // submitting — true while the POST request is in-flight (disables button)
  // message    — feedback string shown below the form
  // isError    — true if message is an error (controls CSS class)
  const [inputUrl, setInputUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  // ── Submit Handler ───────────────────────────────────────
  const handleSubmit = async (e) => {
    // Prevent the default HTML form behavior (page reload)
    e.preventDefault();

    // Don't submit if the input is blank (trim removes whitespace)
    if (!inputUrl.trim()) {
      setIsError(true);
      setMessage("Please enter a URL.");
      return;
    }

    try {
      setSubmitting(true); // Disable the button while the request is pending
      setMessage("");      // Clear any previous message

      // POST request to the backend with the original URL in the body.
      // axios automatically serialises the object to JSON.
      const response = await axios.post(apiBase, { originalUrl: inputUrl });

      // response.data is the saved URL document returned by the backend
      const createdUrl = response.data;

      // Notify the parent (App.jsx) so it can add the new URL to the list
      onUrlCreated(createdUrl);

      // Clear the input field after success
      setInputUrl("");

      // Show the short link as a success message
      setIsError(false);
      setMessage(`✅ Short URL created: ${createdUrl.shortUrl}`);
    } catch (err) {
      // Axios wraps error responses in err.response
      // If err.response exists, use the backend's error message; otherwise generic
      const errMsg =
        err.response?.data?.error || "Failed to shorten URL. Try again.";
      setIsError(true);
      setMessage(errMsg);
      console.error("Submit error:", err.message);
    } finally {
      // Re-enable the button regardless of success or failure
      setSubmitting(false);
    }
  };

  // ── Render ───────────────────────────────────────────────
  return (
    // The "card" CSS class gives it the white surface / border look
    <div className="card url-form">
      <h2>Shorten a URL</h2>

      {/* onSubmit calls our handler above */}
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          {/* Controlled input — its value is always in sync with inputUrl state */}
          <input
            type="text"
            placeholder="https://example.com/very/long/url"
            value={inputUrl}
            // onChange updates state on every keystroke
            onChange={(e) => setInputUrl(e.target.value)}
            aria-label="Long URL to shorten"
          />

          {/* Submit button — disabled while the request is in-flight */}
          <button type="submit" className="btn-primary" disabled={submitting}>
            {/* Show different text while submitting so the user knows it's working */}
            {submitting ? "Shortening…" : "Shorten"}
          </button>
        </div>

        {/* Show feedback message only when message is not empty */}
        {message && (
          <p className={`form-message ${isError ? "error" : "success"}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default UrlForm;
