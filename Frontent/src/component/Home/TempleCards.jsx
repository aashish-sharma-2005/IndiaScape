import Card from "react-bootstrap/Card";

export function TempleCard({ temple }) {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Img
        variant="top"
        src={
          temple.images.length > 0
            ? temple.images[0]
            : '/images/temple.jpeg'
        }
        style={{ height: "220px", objectFit: "cover" }}
      />

      <Card.Body>
        <Card.Title>{temple.templeName}</Card.Title>
        <Card.Text>{temple.city}</Card.Text>
      </Card.Body>
    </Card>
  );
}