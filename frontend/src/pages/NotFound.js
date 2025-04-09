import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/NotFound.css';

const NotFound = () => {
  return (
    <Container className="not-found-container">
      <Row className="justify-content-center text-center">
        <Col md={8} lg={6}>
          <div className="error-content">
            <h1 className="error-code">404</h1>
            <h2 className="error-title">Page Not Found</h2>
            <p className="error-message">
              The page you're looking for doesn't exist or has been moved.
            </p>
            
            <div className="not-found-actions">
              <Button as={Link} to="/" variant="primary" size="lg" className="me-3">
                Go Home
              </Button>
              <Button as={Link} to="/menu" variant="outline-primary" size="lg">
                Browse Menu
              </Button>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;