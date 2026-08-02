import Carousel from "react-bootstrap/Carousel";
import { useSelector } from "react-redux";

function HomeSlider() {

  const { featuredPlaces, loading } = useSelector(
    (state) => state.places
  );

  // Loading
  if (loading) {
    return (
      <div className="home-loader">
        <div
          className="spinner-border text-warning"
          role="status"
        >
          <span className="visually-hidden">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  // No featured places
  if (!featuredPlaces || featuredPlaces.length === 0) {
    return (
      <div className="text-center py-5">
        <h4>No featured places found</h4>
      </div>
    );
  }

  return (
    <Carousel
      pause={false}
      fade
      controls
      interval={5000}
    >
      {featuredPlaces.map((item) => (
        <Carousel.Item key={item._id}>

          <img
            className="d-block w-100 hero-img"
            src={item.photos?.[0]?.url}
            alt={item.name}
          />

          <Carousel.Caption
            style={{
              background: "rgba(0, 0, 0, 0.45)",
              borderRadius: "10px",
              padding: "20px",
            }}
          >
            <h2>
              {item.title || item.name}
            </h2>

            <p>
              {item.description}
            </p>
          </Carousel.Caption>

        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default HomeSlider;