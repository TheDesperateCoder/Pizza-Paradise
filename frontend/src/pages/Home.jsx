import React from 'react';
import { Container, Row, Col, Button, Card, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Home() {
  // Sample data for featured products
  const featuredProducts = [
    {
      id: 1,
      name: "Classic Margherita",
      description: "Fresh tomatoes, mozzarella, and basil",
      price: "$12.99",
      image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      link: "/menu"
    },
    {
      id: 2,
      name: "Pepperoni Passion",
      description: "Loaded with pepperoni and extra cheese",
      price: "$14.99",
      image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      link: "/menu"
    },
    {
      id: 3,
      name: "Vegetarian Delight",
      description: "Bell peppers, mushrooms, onions, and olives",
      price: "$13.99",
      image: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      link: "/menu"
    }
  ];

  // Sample promotions data
  const promos = [
    {
      id: 1,
      title: "Buy 1 Get 1 Free",
      description: "Every Monday and Tuesday, buy one pizza and get another one free!",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      link: "/menu"
    },
    {
      id: 2,
      title: "Family Combo",
      description: "2 Large Pizzas, 4 Drinks, and Garlic Bread for just $35.99",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
      link: "/menu"
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-600 to-orange-700 text-white py-16">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="px-4">
              <h1 className="text-5xl font-bold mb-4">Delicious Pizza Delivered Fast</h1>
              <p className="text-xl mb-6">
                Made with fresh ingredients and baked to perfection. Order now and taste the difference!
              </p>
              <div className="mt-4">
                <Button as={Link} to="/menu" variant="primary" size="lg" className="me-3">
                  Order Now
                </Button>
                <Button as={Link} to="/menu" variant="outline-light" size="lg">
                  View Deals
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Promotions Section */}
      <section className="py-16 bg-gray-50">
        <Container>
          <h2 className="text-4xl font-semibold mb-10">Current Promotions</h2>
          <Carousel>
            {promos.map(promo => (
              <Carousel.Item key={promo.id}>
                <div className="py-4">
                  <Row>
                    <Col md={6}>
                      <img src={promo.image} alt={promo.title} className="w-100 h-300 rounded-lg shadow-md" />
                    </Col>
                    <Col md={6} className="d-flex align-items-center p-4">
                      <div>
                        <h3 className="text-3xl font-semibold mb-3">{promo.title}</h3>
                        <p className="text-lg mb-4">{promo.description}</p>
                        <Button as={Link} to={promo.link} variant="primary">
                          Order Now
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </Container>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <Container>
          <h2 className="text-4xl font-semibold mb-10">Customer Favorites</h2>
          <Row>
            {featuredProducts.map(product => (
              <Col md={4} key={product.id} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <div style={{ height: "200px", overflow: "hidden" }}>
                    <Card.Img variant="top" src={product.image} alt={product.name} className="w-100 h-100 object-cover" />
                  </div>
                  <Card.Body>
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text>{product.description}</Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="text-lg font-semibold text-primary">{product.price}</span>
                      <Button as={Link} to={product.link} variant="outline-primary">
                        Order
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="text-center mt-10">
            <Button as={Link} to="/menu" variant="primary" size="lg">
              View Full Menu
            </Button>
          </div>
        </Container>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50 text-center">
        <Container>
          <h2 className="text-4xl font-semibold mb-10 text-center">How It Works</h2>
          <Row className="text-center">
            <Col md={4}>
              <div className="p-4">
                <div className="w-16 h-16 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: "70px", height: "70px" }}>
                  <i className="fas fa-pizza-slice fa-2x"></i>
                </div>
                <h4 className="text-xl font-semibold mb-3">Choose Your Pizza</h4>
                <p>Select from our menu of specialty pizzas or create your own with your favorite toppings.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="p-4">
                <div className="w-16 h-16 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: "70px", height: "70px" }}>
                  <i className="fas fa-credit-card fa-2x"></i>
                </div>
                <h4 className="text-xl font-semibold mb-3">Place Your Order</h4>
                <p>Complete your order online with our secure checkout process.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="p-4">
                <div className="w-16 h-16 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: "70px", height: "70px" }}>
                  <i className="fas fa-shipping-fast fa-2x"></i>
                </div>
                <h4 className="text-xl font-semibold mb-3">Enjoy Your Meal</h4>
                <p>Your pizza will be prepared fresh and delivered hot to your doorstep.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="bg-dark text-white text-center">
        <Container>
          <Row className="justify-content-center">
            <Col md={8} className="py-16">
              <h2 className="text-4xl font-bold mb-4">Ready to Order Your Perfect Pizza?</h2>
              <p className="text-xl mb-6">Place your order now and get it delivered to your doorstep.</p>
              <Button as={Link} to="/menu" size="lg" variant="primary">
                Order Now
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}

export default Home;