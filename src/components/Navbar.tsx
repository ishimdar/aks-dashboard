import { NavLink } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

const AksNavbar = () => {
  return (
    <Navbar bg="light" data-bs-theme="light" expand="lg">
      <Container>
        <Navbar.Brand as={NavLink} to="/" className="d-flex align-items-center">
          <img
            src="https://res.cloudinary.com/ozyxuezu/image/upload/v1783856296/logo_rtqtpx.png"
            alt="logo"
            // style={{ height: '40px' }}
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={NavLink} to="/" end>
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/features">
              Features
            </Nav.Link>
            <Nav.Link as={NavLink} to="/pricing">
              Pricing
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AksNavbar;