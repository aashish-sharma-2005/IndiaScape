import HomeStats from "./HomeStats";
import SomeCards from "./HomeSomeCards";
import "./home.css";

export function Home() {
  return (
    <main className="home-page">

      {/* ================= HERO ================= */}

      <section className="home-hero">

        <div className="hero-overlay"></div>

        {/* LEFT SIDE - HERO CONTENT */}

        <div className="hero-content">

          <span className="hero-badge">
            🇮🇳 Discover Incredible India
          </span>

          <h1>
            Explore India.
            <br />
            <span>One Journey at a Time.</span>
          </h1>

          <p>
            Discover breathtaking places, rich heritage,
            hidden gems and unforgettable experiences
            across India.
          </p>

          <div className="hero-actions">

            <button
              className="hero-primary-btn"
              onClick={() =>
                (window.location.href = "/dashboard/states")
              }
            >
              Explore Places
              <span>→</span>
            </button>

            <div className="hero-mini-info">
              <strong>28+</strong>
              <span>States to Explore</span>
            </div>

          </div>

        </div>


        {/* RIGHT SIDE - STATS */}

        <div className="hero-stats-wrapper">
          <HomeStats />
        </div>


        {/* SCROLL */}

        <div className="hero-scroll">
          <span>Scroll to explore</span>
          <div className="scroll-line"></div>
        </div>

      </section>


      {/* ================= FAMOUS PLACES ================= */}

      <section className="home-famous-section">
        <SomeCards />
      </section>

    </main>
  );
}