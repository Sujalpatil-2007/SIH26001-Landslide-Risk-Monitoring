import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main className="not-found">
      <h1>404</h1>
      <p>Page not found.</p>

      <Link to="/" className="primary-button">
        Back to Home
      </Link>
    </main>
  );
}

export default NotFoundPage;