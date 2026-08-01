import Carousel from "react-bootstrap/Carousel";
import homeSlider from "../../data/homeSlider.json";

function HomeSlider() {
  return (
    <Carousel pause={false} fade controls interval={5000}>
      {homeSlider.map((item) => (
        <Carousel.Item key={item.id}>
          <img
            className="d-block w-100 hero-img"
            src={item.image_urls[0]}
            alt={item.title}
            style={{
              height: "80vh",
              objectFit: "cover",
            }}
          />

          <Carousel.Caption
            style={{
              background: "rgba(0,0,0,0.45)",
              borderRadius: "10px",
              padding: "20px",
            }}
          >
            <h2>{item.title}</h2>
            <p>{item.description}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default HomeSlider;