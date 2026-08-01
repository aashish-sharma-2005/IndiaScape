import { Container, Row, Col, Card } from "react-bootstrap";
import Images from "./Images";

export function Details({ data }) {
  return (
    <Container className="py-5">
      <Row className="g-5">
        <Col md={6}>
          <Images data={data.photos} />
        </Col>

        <Col md={6}>
          <h2>{data.name}</h2>
          <h5 className="text-muted">{data.title}</h5>

          <p className="mt-3">{data.description}</p>

          <Card className="mt-4">
            <Card.Body>
              <p><strong>Story :- </strong> {data.story}</p>
              {/* <p><strong>State ID:</strong> {data.state_id}</p> */}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}