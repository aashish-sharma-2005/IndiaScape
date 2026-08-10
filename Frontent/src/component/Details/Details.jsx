import { Container, Row, Col, Card, Button } from "react-bootstrap";
import Images from "./Images";

export function Details({
    data,
    isFavorite,
    favoriteLoading,
    onFavorite
}) {

    return (
        <Container className="py-5">

            <Row className="g-4">

                {/* ================= IMAGE ================= */}

                <Col md={6}>

                    <Images
                        data={data.photos}
                        name={data.name}
                    />

                </Col>


                {/* ================= DETAILS ================= */}

                <Col md={6}>

                    <div className="d-flex justify-content-between align-items-start">

                        <div>

                            <h2>
                                {data.name}
                            </h2>

                            <h5 className="text-muted">
                                {data.title}
                            </h5>

                        </div>


                        {/* ================= FAVORITE ================= */}

                        <Button
                            variant={
                                isFavorite
                                    ? "danger"
                                    : "outline-danger"
                            }
                            onClick={onFavorite}
                            disabled={favoriteLoading}
                        >

                            {isFavorite
                                ? "❤️ Remove Favourite"
                                : "♡ Add to Favourite"}

                        </Button>

                    </div>


                    <p className="mt-3">
                        {data.description}
                    </p>


                    <Card className="mt-4">

                        <Card.Body>

                            <p>
                                <strong>
                                    Story :-{" "}
                                </strong>

                                {data.story}

                            </p>

                        </Card.Body>

                    </Card>

                </Col>

            </Row>

        </Container>
    );
}