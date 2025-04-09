import React from 'react';
import { Container, Row, Col, Card, Button, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../styles/Home.css';

const Home = () => {
  // Example promo data
  const promos = [
    {
      id: 1,
      title: 'Family Deal',
      description: 'Get 2 large pizzas, breadsticks, and a 2L soda for only $29.99!',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
      link: '/menu'
    },
    {
      id: 2,
      title: 'Student Special',
      description: 'Show your student ID and get a medium 1-topping pizza for $7.99',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
      link: '/menu'
    },
    {
      id: 3,
      title: 'Free Delivery',
      description: 'Free delivery on all orders over $15',
      image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80',
      link: '/menu'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Container fluid>
          <Row className="align-items-center">
            <Col md={6} className="hero-content">
              <h1>Delicious Pizza Delivered Fast</h1>
              <p className="lead">
                Made with fresh ingredients and baked to perfection. Order now and taste the difference!
              </p>
              <div className="hero-buttons">
                <Button as={Link} to="/menu" variant="primary" size="lg" className="me-3">
                  Order Now
                </Button>
                <Button as={Link} to="/deals" variant="outline-light" size="lg">
                  View Deals
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Promotions Section */}
      <section className="promos-section">
        <Container>
          <h2 className="section-title">Current Promotions</h2>
          <Carousel>
            {promos.map(promo => (
              <Carousel.Item key={promo.id}>
                <div className="promo-slide">
                  <Row>
                    <Col md={6}>
                      <img src={promo.image} alt={promo.title} className="promo-image" />
                    </Col>
                    <Col md={6} className="promo-content d-flex align-items-center">
                      <div>
                        <h3>{promo.title}</h3>
                        <p>{promo.description}</p>
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
      <FeaturedItems />

      {/* How It Works Section */}
      <section className="how-it-works">
        <Container>
          <h2 className="section-title text-center">How It Works</h2>
          <Row className="text-center">
            <Col md={4}>
              <div className="step-item">
                <div className="step-icon">
                  <i className="fas fa-pizza-slice"></i>
                </div>
                <h4>Choose Your Pizza</h4>
                <p>Select from our menu of specialty pizzas or create your own with your favorite toppings.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="step-item">
                <div className="step-icon">
                  <i className="fas fa-credit-card"></i>
                </div>
                <h4>Place Your Order</h4>
                <p>Complete your order online with our secure checkout process.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className="step-item">
                <div className="step-icon">
                  <i className="fas fa-shipping-fast"></i>
                </div>
                <h4>Enjoy Your Meal</h4>
                <p>Your pizza will be prepared fresh and delivered hot to your doorstep.</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <Container>
          <Row className="justify-content-center">
            <Col md={10} lg={8} className="text-center">
              <h2>Ready to Order?</h2>
              <p>
                Fresh, hot pizza delivered to your doorstep is just a few clicks away!
              </p>
              <Button as={Link} to="/menu" variant="primary" size="lg">
                Order Now
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

const FeaturedItems = () => {
  // Sample featured items
  const items = [
    {
      id: "1",
      name: "Margherita Pizza",
      image: "https://images.unsplash.com/photo-1598023696416-0193a0bcd302?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80",
      description: "Classic Margherita pizza with tomato sauce and mozzarella",
      price: 12.99,
      category: "pizza"
    },
    {
      id: "2",
      name: "Pepperoni Pizza",
      image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80",
      description: "Spicy pepperoni pizza with extra cheese",
      price: 13.99,
      category: "pizza"
    },
    {
      id: "3",
      name: "Garlic Bread",
      image: "https://images.unsplash.com/photo-1650436765329-78ae9a1c96bc?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzAxNzI0NjY2fA&ixlib=rb-4.0.3&utm_source=unsplash_source&utm_medium=referral&utm_campaign=api-credit",
      description: "Freshly baked garlic bread with herbs",
      price: 5.99,
      category: "sides"
    },
    {
      id: "4",
      name: "Chocolate Brownie",
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80",
      description: "Rich, fudgy chocolate brownie",
      price: 4.99,
      category: "desserts"
    }
  ];

  const addToCart = (item, e) => {
    e.preventDefault(); // Prevent navigation to detail page
    e.stopPropagation(); // Prevent event bubbling
    
    const cartItem = {
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      category: item.category
    };
    
    // Get existing cart from localStorage
    const existingCart = localStorage.getItem('cart');
    let cart = existingCart ? JSON.parse(existingCart) : [];
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(i => i.id === cartItem.id);
    
    if (existingItemIndex !== -1) {
      // Update quantity of existing item
      cart[existingItemIndex].quantity += 1;
    } else {
      // Add new item to cart
      cart.push(cartItem);
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Show notification
    alert(`${item.name} added to cart!`);
  };

  return (
    <div className="featured-items py-5">
      <Container>
        <h2 className="text-center mb-5">Customer Favorites</h2>
        <Row>
          {items.map((item) => (
            <Col md={3} sm={6} className="mb-4" key={item.id}>
              <Card className="h-100 menu-item-card">
                <Link to={`/menu/${item.category}/${item.id}`} className="text-decoration-none">
                  <Card.Img 
                    variant="top" 
                    src={item.image} 
                    alt={item.name} 
                    className="menu-item-image"
                  />
                </Link>
                <Card.Body>
                  <Link to={`/menu/${item.category}/${item.id}`} className="text-decoration-none">
                    <Card.Title>{item.name}</Card.Title>
                    <Card.Text className="text-muted small">{item.description}</Card.Text>
                  </Link>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold">${item.price.toFixed(2)}</span>
                    <div>
                      {item.category === 'pizza' ? (
                        <Button 
                          as={Link} 
                          to="/pizza-builder"
                          variant="primary" 
                          size="sm"
                        >
                          Customize
                        </Button>
                      ) : (
                        <Button 
                          variant="primary" 
                          size="sm" 
                          onClick={(e) => addToCart(item, e)}
                        >
                          Add to Cart
                        </Button>
                      )}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <div className="text-center mt-4">
          <Link to="/menu">
            <Button variant="primary">View Full Menu</Button>
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default Home;