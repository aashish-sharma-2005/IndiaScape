import { Link } from "react-router-dom";
import "./index.css";

const NotFound = () => {
  return (
    <section className="not-found-page">
      <div className="not-found-content">

        <span className="not-found-label">
          ERROR 404
        </span>

        <h1>
          Page not found
        </h1>

        <p>
          Sorry, we couldn't find the page you're looking for.
          It may have been moved or no longer exists.
        </p>

        <div className="not-found-actions">
          <Link to="/" className="not-found-primary">
            Go to Home
          </Link>

          <button
            className="not-found-secondary"
            onClick={() => window.history.back()}
          >
            Go Back
          </button>
        </div>

      </div>
    </section>
  );
};

export default NotFound;