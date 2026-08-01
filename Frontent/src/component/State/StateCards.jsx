import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

export function StateCards({ places }) {
  const { state } = useParams()
  const navigate = useNavigate()
  const navigateDetails = (id) => {
    navigate(`/dashboard/place/${id}`)
  }
  return (
    <Container className="py-4">
      <Row className="g-4">
        {places.map((place) => (
          <Col key={place._id} xs={12} md={6} lg={4}>
            <Card className="h-100 shadow-sm border-0 rounded-4">
              <Card.Img
                variant="top"
                src={place.photos?.[0]?.url}
                alt={place.name}
                style={{
                  height: "180px",
                  objectFit: "cover",
                }}
              />

              <Card.Body className="d-flex flex-column">
                <Card.Title>{place.name}</Card.Title>

                <Card.Subtitle className="text-muted mb-2">
                  {place.title}
                </Card.Subtitle>

                <Card.Text>
                  {place.description.length > 80
                    ? place.description.substring(0, 80) + "..."
                    : place.description}
                </Card.Text>

                <Button
                  onClick={() => navigateDetails(place._id)}
                  variant="warning"
                  className="mt-auto rounded-pill"
                >
                  View Details
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}