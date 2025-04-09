import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Tabs, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState('pizzas');
  const [products, setProducts] = useState({
    pizzas: [],
    sides: [],
    drinks: [],
    desserts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Mock data for products
  const mockProducts = {
    pizzas: [
      {
        id: 'p1',
        name: 'Classic Margherita',
        description: 'Fresh tomatoes, mozzarella cheese, fresh basil, salt, and extra-virgin olive oil.',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'pizzas',
        popular: true,
        options: {
          sizes: ['Small', 'Medium', 'Large'],
          crusts: ['Thin', 'Regular', 'Thick']
        }
      },
      {
        id: 'p2',
        name: 'Pepperoni',
        description: 'Classic pizza with tomato sauce, mozzarella cheese and pepperoni slices.',
        price: 14.99,
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'pizzas',
        popular: true,
        options: {
          sizes: ['Small', 'Medium', 'Large'],
          crusts: ['Thin', 'Regular', 'Thick']
        }
      },
      {
        id: 'p3',
        name: 'Vegetarian',
        description: 'Fresh bell peppers, onions, mushrooms, olives on our handcrafted pizza base.',
        price: 13.99,
        image: 'https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'pizzas',
        popular: false,
        options: {
          sizes: ['Small', 'Medium', 'Large'],
          crusts: ['Thin', 'Regular', 'Thick']
        }
      },
      {
        id: 'p4',
        name: 'BBQ Chicken',
        description: 'Grilled chicken, BBQ sauce, red onions, and cilantro on a mozzarella base.',
        price: 15.99,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'pizzas',
        popular: true,
        options: {
          sizes: ['Small', 'Medium', 'Large'],
          crusts: ['Thin', 'Regular', 'Thick']
        }
      },
    ],
    sides: [
      {
        id: 's1',
        name: 'Garlic Bread',
        description: 'Oven-baked bread brushed with garlic butter and herbs.',
        price: 4.99,
        image: 'https://images.unsplash.com/photo-1619531038896-abcafd55a29a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'sides',
        popular: true
      },
      {
        id: 's2',
        name: 'Chicken Wings',
        description: 'Crispy chicken wings tossed in your choice of sauce.',
        price: 8.99,
        image: 'https://images.unsplash.com/photo-1588591795084-1770cb3be374?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'sides',
        popular: true
      },
    ],
    drinks: [
      {
        id: 'd1',
        name: 'Soda',
        description: 'Your choice of soft drinks.',
        price: 2.49,
        image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'drinks',
        popular: false
      },
      {
        id: 'd2',
        name: 'Iced Tea',
        description: 'Refreshing iced tea with lemon.',
        price: 2.49,
        image: 'https://images.unsplash.com/photo-1556679343-c1c4b8b4a524?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'drinks',
        popular: true
      },
    ],
    desserts: [
      {
        id: 'de1',
        name: 'Chocolate Brownie',
        description: 'Warm chocolate brownie with vanilla ice cream.',
        price: 6.99,
        image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80',
        category: 'desserts',
        popular: true
      },
    ]
  };
  
  // Load products on component mount
  useEffect(() => {
    // This would normally be an API call
    // For demo purposes, we'll use the mock data
    setProducts(mockProducts);
    setLoading(false);
  }, []);

  // Handle add to cart
  const handleAddToCart = (product) => {
    // For pizza items, redirect to the pizza builder
    if (product.category === 'pizzas') {
      // This would typically navigate to pizza builder with the selected pizza
      window.location.href = `/pizza-builder/${product.id}`;
      return;
    }
    
    // For non-pizza items, add directly to cart
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    // Check if item is already in cart
    const existingItemIndex = cartItems.findIndex(item => item.id === product.id);
    
    if (existingItemIndex >= 0) {
      // Item exists, increase quantity
      cartItems[existingItemIndex].quantity += 1;
    } else {
      // Add new item
      cartItems.push({
        ...product,
        quantity: 1
      });
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Show confirmation (this would be better with a toast notification)
    alert(`${product.name} added to cart!`);
  };

  // Filter products based on active category
  const filteredProducts = products[activeCategory] || [];
  
  return (
    <Container className="py-5">
      <h1 className="mb-4">Our Menu</h1>
      
      <Tabs
        activeKey={activeCategory}
        onSelect={(k) => setActiveCategory(k)}
        className="mb-4"
      >
        <Tab eventKey="pizzas" title="Pizzas" />
        <Tab eventKey="sides" title="Sides" />
        <Tab eventKey="drinks" title="Drinks" />
        <Tab eventKey="desserts" title="Desserts" />
      </Tabs>
      
      {loading ? (
        <div className="text-center py-5">Loading products...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          <p className="mb-4">
            {activeCategory === 'pizzas' 
              ? 'Select a pizza to customize or click "Build Your Own" to create from scratch!' 
              : `Browse our selection of delicious ${activeCategory}.`}
          </p>
          
          {activeCategory === 'pizzas' && (
            <div className="mb-4">
              <Button 
                as={Link} 
                to="/pizza-builder" 
                variant="primary" 
                size="lg"
              >
                Build Your Own Pizza
              </Button>
            </div>
          )}
          
          <Row>
            {filteredProducts.map(product => (
              <Col lg={4} md={6} key={product.id} className="mb-4">
                <Card className="h-100 shadow-sm product-card">
                  <div className="card-img-wrapper">
                    <Card.Img variant="top" src={product.image} alt={product.name} />
                    {product.popular && (
                      <span className="badge bg-danger position-absolute top-0 end-0 m-2">
                        Popular
                      </span>
                    )}
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{product.name}</Card.Title>
                    <Card.Text className="text-muted mb-3">
                      {product.description}
                    </Card.Text>
                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="h5 mb-0 text-primary">${product.price.toFixed(2)}</span>
                        <Button 
                          variant="outline-primary" 
                          onClick={() => handleAddToCart(product)}
                        >
                          {product.category === 'pizzas' ? 'Customize' : 'Add to Cart'}
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
};

export default Menu;