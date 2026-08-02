import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function SomeCards() {

  const navigate = useNavigate();

  // Redux se featured places
  const { featuredPlaces, loading } = useSelector(
    (state) => state.places
  );


  // Loading
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div
          className="spinner-border text-warning"
          role="status"
        >
          <span className="visually-hidden">
            Loading...
          </span>
        </div>
      </Container>
    );
  }


  // No data
  if (!featuredPlaces || featuredPlaces.length === 0) {
    return (
      <Container className="py-5 text-center">
        <h4>No places found</h4>
      </Container>
    );
  }


  return (
    <Container className="my-0">

      {/* SECTION TITLE */}

      <div className="text-center mb-5">

        <span className="section-kicker">
          EXPLORE INDIA
        </span>

        <h2 className="fw-bold mt-2">
          ✨ Famous Places
        </h2>

        <p className="text-muted">
          Discover some of the most beautiful destinations
          across India.
        </p>

      </div>


      {/* CARDS */}

      <Row className="g-4">

        {featuredPlaces.map((place) => (

          <Col
            key={place._id}
            xs={12}
            md={6}
            lg={4}
          >

            <Card className="h-100 shadow-sm border-0 rounded-4">

              {/* IMAGE */}

              <Card.Img
                variant="top"
                src={
                  place.photos?.[0]?.url ||
                  "/images/temple.jpeg"
                }
                alt={place.name}
                style={{
                  height: "220px",
                  objectFit: "cover",
                }}
              />


              {/* BODY */}

              <Card.Body className="d-flex flex-column">

                <Card.Title className="fw-bold">
                  {place.name}
                </Card.Title>


                <Card.Subtitle className="mb-2 text-muted">
                  {place.title || place.state || "India"}
                </Card.Subtitle>


                <Card.Text>

                  {place.description?.length > 100
                    ? place.description.substring(0, 100) + "..."
                    : place.description}

                </Card.Text>


                {/* BUTTON */}

                <Button
                  variant="warning"
                  className="mt-auto rounded-pill fw-semibold"
                  onClick={() =>
                    navigate(
                      `/dashboard/place/${place._id}`
                    )
                  }
                >
                  View Details →
                </Button>

              </Card.Body>

            </Card>

          </Col>

        ))}

      </Row>


      {/* VIEW ALL */}

      <div className="text-center mt-5">

        <Button
          variant="outline-dark"
          size="lg"
          className="rounded-pill px-4"
          onClick={() =>
            navigate("/dashboard/states")
          }
        >
          View All Places →
        </Button>

      </div>

    </Container>
  );
}