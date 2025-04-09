import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Deals = () => {
  // Sample deals data
  const deals = [
    {
      id: 1,
      title: "Family Deal",
      description: "2 large pizzas, 4 drinks, and garlic bread",
      originalPrice: 49.99,
      dealPrice: 35.99,
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=500&q=60",
      validUntil: "2023-12-31",
      discount: "28%"
    },
    {
      id: 2,
      title: "Buy 1 Get 1 Free",
      description: "Purchase any large pizza and get a second one free",
      originalPrice: 21.99,
      dealPrice: 21.99,
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=60",
      validUntil: "2023-09-30",
      discount: "50%"
    },
    {
      id: 3,
      title: "Pizza & Wings Combo",
      description: "Medium pizza with 12 wings and 2 dips",
      originalPrice: 29.99,
      dealPrice: 24.99,
      image: "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?auto=format&fit=crop&w=500&q=60",
      validUntil: "2023-10-15",
      discount: "17%"
    },
    {
      id: 4,
      title: "Lunch Special",
      description: "Personal pizza, side salad, and a drink",
      originalPrice: 15.99,
      dealPrice: 11.99,
      image: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=500&q=60",
      validUntil: "Valid Mon-Fri, 11am-2pm",
      discount: "25%"
    },
    {
      id: 5,
      title: "Game Day Bundle",
      description: "2 large pizzas, 20 wings, and breadsticks",
      originalPrice: 55.99,
      dealPrice: 45.99,
      image: "https://images.unsplash.com/photo-1506354666786-959d6d497f1a?auto=format&fit=crop&w=500&q=60",
      validUntil: "2023-12-31",
      discount: "18%"
    },
    {
      id: 6,
      title: "Student Special",
      description: "Medium 2-topping pizza and a drink",
      originalPrice: 18.99,
      dealPrice: 13.99,
      image: "https://images.unsplash.com/photo-1520201163981-8cc95007dd2a?auto=format&fit=crop&w=500&q=60",
      validUntil: "Valid with student ID",
      discount: "26%"
    }
  ];

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3">Hot Deals & Offers</h1>
        <p className="lead text-muted">Save big on your favorite pizzas and combos with our limited-time offers</p>
      </div>

      <Row>
        {deals.map(deal => (
          <Col md={6} lg={4} key={deal.id} className="mb-4">
            <Card className="h-100 shadow-sm hover-elevation">
              <div className="position-relative">
                <Card.Img 
                  variant="top" 
                  src={deal.image} 
                  alt={deal.title} 
                  className="deal-image"
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Badge 
                  bg="danger" 
                  className="position-absolute top-0 end-0 m-2 py-2 px-3"
                >
                  SAVE {deal.discount}
                </Badge>
              </div>
              <Card.Body className="d-flex flex-column">
                <Card.Title className="fw-bold fs-4">{deal.title}</Card.Title>
                <Card.Text>{deal.description}</Card.Text>
                <div className="mt-2 d-flex align-items-center mb-3">
                  <span className="text-decoration-line-through text-muted me-2">
                    ${deal.originalPrice.toFixed(2)}
                  </span>
                  <span className="fs-4 fw-bold text-danger">
                    ${deal.dealPrice.toFixed(2)}
                  </span>
                </div>
                <div className="text-muted small mb-3">
                  <i className="far fa-calendar-alt me-2"></i>
                  {deal.validUntil}
                </div>
                <div className="mt-auto">
                  <Button 
                    as={Link} 
                    to="/menu" 
                    variant="primary" 
                    className="w-100"
                  >
                    Order Now
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="bg-light p-4 rounded mt-5 text-center">
        <h3>Got a Promo Code?</h3>
        <p className="mb-4">Enter your promo code at checkout to redeem your special offer.</p>
        <Button as={Link} to="/menu" variant="outline-primary" size="lg">
          Browse Menu
        </Button>
      </div>

      <div className="mt-5">
        <h3>Deal Terms & Conditions</h3>
        <ul className="small text-muted">
          <li>All deals are subject to availability.</li>
          <li>Cannot be combined with other offers or promotions.</li>
          <li>Valid for delivery, carryout, or dine-in unless otherwise specified.</li>
          <li>All prices are subject to change without notice.</li>
          <li>Additional charge for extra toppings may apply.</li>
        </ul>
      </div>
    </Container>
  );
};

export default Deals;