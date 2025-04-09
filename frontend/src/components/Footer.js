import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <Container>
        <Row>
          <Col md={4} className="mb-4 mb-md-0">
            <h5>Pizza Delivery</h5>
            <p className="text-muted">
              The best pizza delivery service in town. Fast, fresh, and delicious.
            </p>
          </Col>
          <Col md={2} className="mb-4 mb-md-0">
            <h5>Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/" className="text-muted">Home</Link></li>
              <li><Link to="/menu" className="text-muted">Menu</Link></li>
              <li><Link to="/about" className="text-muted">About Us</Link></li>
              <li><Link to="/contact" className="text-muted">Contact</Link></li>
            </ul>
          </Col>
          <Col md={3} className="mb-4 mb-md-0">
            <h5>Customer Service</h5>
            <ul className="list-unstyled">
              <li><Link to="/track-order" className="text-muted">Track Order</Link></li>
              <li><Link to="/faq" className="text-muted">FAQs</Link></li>
              <li><Link to="/terms" className="text-muted">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="text-muted">Privacy Policy</Link></li>
            </ul>
          </Col>
          <Col md={3}>
            <h5>Connect With Us</h5>
            <div className="d-flex gap-3 fs-5">
              <a href="https://facebook.com" className="text-muted">
                <i className="fab fa-facebook"></i>
              </a>
              <a href="https://twitter.com" className="text-muted">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://instagram.com" className="text-muted">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://youtube.com" className="text-muted">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
            <p className="mt-3 text-muted">
              <i className="fas fa-phone me-2"></i> (123) 456-7890
            </p>
            <p className="text-muted">
              <i className="fas fa-envelope me-2"></i> info@pizzadelivery.com
            </p>
          </Col>
        </Row>
        <hr className="my-3 border-secondary" />
        <div className="text-center text-muted small">
          <p>&copy; {new Date().getFullYear()} Pizza Delivery. All rights reserved.</p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;