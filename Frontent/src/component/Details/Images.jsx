import Carousel from "react-bootstrap/Carousel";

function Images({ data = [], name }) {
    return (
        <Carousel interval={3000}>
            {data.map((photo, index) => (
                <Carousel.Item key={photo.publicId || index}>
                    <img
                        src={photo.url}
                        alt={`${name} ${index + 1}`}
                        className="d-block w-100 rounded-4"
                        style={{
                            height: "400px",
                            objectFit: "cover",
                        }}
                    />
                </Carousel.Item>
            ))}
        </Carousel>
    );
}

export default Images;