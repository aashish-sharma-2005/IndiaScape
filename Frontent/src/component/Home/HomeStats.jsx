import { useSelector } from "react-redux";
import "./HomeStats.css";

export default function HomeStats() {
  const user = useSelector(
    (state) => state.loginReducer.user
  );

  return (
    <div className="stats-wrapper">

      {/* STATES EXPLORED */}

      <div className="modern-stat-card">

        <div className="stat-icon location-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"
            />
            <circle
              cx="12"
              cy="10"
              r="2.5"
            />
          </svg>
        </div>

        <div className="stat-content">

          <span className="stat-number">
            {user?.visitedStates?.length || 0}
          </span>

          <span className="stat-label">
            States Explored
          </span>

          <span className="stat-description">
            Your journey across India
          </span>

        </div>

      </div>


      {/* FAVORITE PLACES */}

      <div className="modern-stat-card">

        <div className="stat-icon favorite-icon">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path
              d="M20.8 8.8
              c0 5.5-8.8 10.2-8.8 10.2
              S3.2 14.3 3.2 8.8
              A4.8 4.8 0 0 1 12 6.2
              A4.8 4.8 0 0 1 20.8 8.8Z"
            />
          </svg>
        </div>

        <div className="stat-content">

          <span className="stat-number">
            {user?.favoritePlaces?.length || 0}
          </span>

          <span className="stat-label">
            Favorite Places
          </span>

          <span className="stat-description">
            Places worth remembering
          </span>

        </div>

      </div>

    </div>
  );
}