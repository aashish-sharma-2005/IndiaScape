import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";

function SearchBar() {
  return (
    <InputGroup style={{ maxWidth: "400px" }}>
      <Form.Control
        type="search"
        placeholder="Search famous places..."
      />
      <Button variant="warning">
        🔍
      </Button>
    </InputGroup>
  );
}

export default SearchBar;