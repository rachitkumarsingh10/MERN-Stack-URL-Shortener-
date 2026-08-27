import { useState, useEffect } from "react";
import axios from "axios";
import UrlForm from "./components/UrlForm";
import UrlList from "./components/UrlList";

const API_BASE = `${import.meta.env.VITE_API_URL}/api/urls`;

function App() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    fetchUrls();
  }, []);

  const fetchUrls = async () => {
    try {
      setLoading(true);
      setFetchError("");

      const response = await axios.get(API_BASE);
      setUrls(response.data);
    } catch (err) {
      setFetchError("Could not load URLs. Is the backend running?");
      console.error("Fetch error:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUrlCreated = (newUrl) => {
    setUrls((prevUrls) => [newUrl, ...prevUrls]);
  };

  const handleUrlDeleted = (deletedId) => {
    setUrls((prevUrls) => prevUrls.filter((url) => url._id !== deletedId));
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🔗 URL Shortener</h1>
        <p>Paste a long URL and get a short, shareable link instantly.</p>
      </header>

      <UrlForm onUrlCreated={handleUrlCreated} apiBase={API_BASE} />

      {loading ? (
        <p className="loading">Loading URLs…</p>
      ) : fetchError ? (
        <p className="form-message error">{fetchError}</p>
      ) : (
        <UrlList urls={urls} onUrlDeleted={handleUrlDeleted} />
      )}

    <footer>© 2026 Rachit Kumar Singh. All rights reserved.</footer>
    </div>
  );
}

export default App;