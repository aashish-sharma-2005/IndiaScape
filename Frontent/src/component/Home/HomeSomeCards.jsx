import { useNavigate } from "react-router-dom";
import HomeSomeCards from "../../data/homeSomeCards.json";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

export default function SomeCards() {
  const navigate = useNavigate()
  return (
    <Container className="my-0">
      <h2 className="text-center fw-bold mb-4">✨ Famous Places</h2>
      <Row className="g-4">
        {HomeSomeCards.map((place) => (
          <Col key={place.id} xs={12} md={6} lg={4}>
            <Card className="h-100 shadow-sm border-0 rounded-4">
              <Card.Img
                variant="top"
                src={place.image_urls[1] || '/public/images/temple.jpeg'}
                alt={place.name}
                style={{
                  height: "100px",
                  objectFit: "cover",
                }}
              />

              <Card.Body className="d-flex flex-column">
                <Card.Title>{place.name}</Card.Title>

                <Card.Subtitle className="mb-2 text-muted">
                  {place.title}
                </Card.Subtitle>

                <Card.Text>
                  {place.description.length > 100
                    ? place.description.substring(0, 100) + "..."
                    : place.description}
                </Card.Text>

                <Button
                  variant="warning"
                  className="mt-auto rounded-pill fw-semibold"
                >
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="text-center mt-5">
        <Button variant="outline-dark" size="lg"
        onClick={navigate('/dashboard/states')}>
          View All Places
        </Button>
      </div>
    </Container>
  );
}