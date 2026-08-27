// ─────────────────────────────────────────────────────────
//  src/components/UrlList.jsx  — Table of all shortened URLs
//
//  Props:
//    • urls[]          — array of URL documents from MongoDB
//    • onUrlDeleted(id) — called after a successful DELETE
//
//  What this component does:
//    1. Renders an empty state when there are no URLs yet
//    2. Renders a table with one row per URL
//    3. Each row shows: original URL (truncated), short link,
//       click count badge, and a Delete button
//    4. On delete, calls the backend DELETE endpoint and
//       notifies the parent via onUrlDeleted
// ─────────────────────────────────────────────────────────

import { useState } from "react";
import axios from "axios";

// Base URL used to build the DELETE request
const API_BASE = `${import.meta.env.VITE_API_URL}/api/urls`;

// Receives the urls array and the onUrlDeleted callback from App.jsx
function UrlList({ urls, onUrlDeleted }) {
  // deletingId tracks which URL is currently being deleted.
  // Only that row's button is disabled; all others remain clickable.
  const [deletingId, setDeletingId] = useState(null);

  // ── Delete Handler ───────────────────────────────────────
  const handleDelete = async (id) => {
    // Optimistic UX: mark this ID as "being deleted" to disable its button
    setDeletingId(id);

    try {
      // DELETE /api/urls/:id — removes the document from MongoDB
      await axios.delete(`${API_BASE}/${id}`);

      // Tell the parent to remove this URL from its state array
      onUrlDeleted(id);
    } catch (err) {
      // If delete fails, show an alert (simple error handling for beginners)
      alert("Could not delete the URL. Please try again.");
      console.error("Delete error:", err.message);
    } finally {
      // Re-enable the button even if deletion failed
      setDeletingId(null);
    }
  };

  // ── Empty State ──────────────────────────────────────────
  // Show a friendly message when there are no URLs yet
  if (urls.length === 0) {
    return (
      <div className="card url-list">
        <h2>Your Shortened URLs</h2>
        <p className="empty-state">
          No URLs yet — paste one above to get started! 🔗
        </p>
      </div>
    );
  }

  // ── Render Table ─────────────────────────────────────────
  return (
    <div className="card url-list">
      <h2>Your Shortened URLs ({urls.length})</h2>

      {/* table-wrapper adds horizontal scroll on small/mobile screens */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {/* Column headers */}
              <th>Original URL</th>
              <th>Short Link</th>
              <th>Clicks</th>
              <th>Created</th>
              <th></th> {/* Delete column — no header text */}
            </tr>
          </thead>
          <tbody>
            {/* Map over the urls array — one <tr> per URL document */}
            {urls.map((url) => (
              // key prop is required by React to efficiently update the list.
              // We use the MongoDB _id because it is guaranteed unique.
              <tr key={url._id}>
                {/* Original URL — truncated with CSS if it's too long */}
                <td>
                  <a
                    href={url.originalUrl}
                    target="_blank"          // Open in a new tab
                    rel="noopener noreferrer" // Security best practice for target="_blank"
                    className="original-url"
                    title={url.originalUrl}  // Full URL shown on hover
                  >
                    {url.originalUrl}
                  </a>
                </td>

                {/* Short link — opens the redirect endpoint in a new tab */}
                <td>
                  <a
                    href={url.shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="short-link"
                  >
                    {url.shortUrl}
                  </a>
                </td>

                {/* Click count shown as a pill badge */}
                <td>
                  <span className="clicks-badge">{url.clicks}</span>
                </td>

                {/* Created date — toLocaleDateString() formats it like "1/15/2024" */}
                <td>{new Date(url.createdAt).toLocaleDateString()}</td>

                {/* Delete button — disabled while this specific row is being deleted */}
                <td>
                  <button
                    className="btn-danger"
                    onClick={() => handleDelete(url._id)}
                    disabled={deletingId === url._id}
                    aria-label={`Delete ${url.shortUrl}`}
                  >
                    {deletingId === url._id ? "Deleting…" : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UrlList;
