import { Container, Row, Col, Button } from "react-bootstrap";
import Carousel from "react-bootstrap/Carousel";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "./allStateData.css";

export function AllStateData() {
    const navigate = useNavigate();

    const { famous, states } = useSelector(
        (state) => state.states
    );

    return (
        <Container className="states-container">
            <div className="states-heading">
                <p>EXPLORE INDIA</p>
                <h2>Discover Places by State</h2>
                <span>
                    Find beautiful destinations, hidden gems and
                    unforgettable experiences across India.
                </span>
            </div>

            <Row className="g-4">
                {states.map((state) => {
                    const places = famous.filter(
                        (item) => item.state_id?._id === state._id
                    );

                    if (!places.length) return null;

                    return (
                        <Col lg={6} key={state._id}>
                            <div className="state-box">

                                <div className="state-box-top">
                                    <div>
                                        <small>STATE</small>
                                        <h3>{state.name}</h3>
                                    </div>

                                    <div className="place-count">
                                        {places.length} Places
                                    </div>
                                </div>

                                <Carousel
                                    fade
                                    interval={3000}
                                    indicators={places.length > 1}
                                    controls={places.length > 1}
                                >
                                    {places.slice(0, 4).map((place) => (
                                        <Carousel.Item key={place._id}>
                                            <div className="state-place-image">
                                                <img
                                                    src={place.photos?.[0]?.url}
                                                    alt={place.name}
                                                />

                                                <div className="place-overlay">
                                                    <div>
                                                        <h4>{place.name}</h4>
                                                        <p>{place.title}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Carousel.Item>
                                    ))}
                                </Carousel>

                                <div className="state-box-bottom">
                                    <span>
                                        Explore amazing places in{" "}
                                        {state.name}
                                    </span>

                                    <Button
                                        onClick={() =>
                                            navigate(
                                                `/dashboard/states/${state.name}`
                                            )
                                        }
                                    >
                                        View All <b>→</b>
                                    </Button>
                                </div>

                            </div>
                        </Col>
                    );
                })}
            </Row>
        </Container>
    );
}