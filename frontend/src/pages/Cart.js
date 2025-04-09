import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      // Load cart from localStorage
      const savedCart = localStorage.getItem('cart');
      console.log('Saved cart from localStorage:', savedCart);
      
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        console.log('Parsed cart:', parsedCart);
        
        // Ensure parsedCart is an array
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
        } else {
          console.error('Cart is not an array:', parsedCart);
          setCartItems([]);
          localStorage.setItem('cart', JSON.stringify([]));
        }
      } else {
        setCartItems([]);
      }
    } catch (err) {
      console.error('Error loading cart:', err);
      setError('Error loading your cart. Please try refreshing the page.');
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateQuantity = (itemId, newQuantity) => {
    try {
      if (newQuantity < 1) return;
      
      const updatedCart = cartItems.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      
      setCartItems(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError('Failed to update quantity. Please try again.');
    }
  };

  const removeItem = (itemId) => {
    try {
      const updatedCart = cartItems.filter(item => item.id !== itemId);
      setCartItems(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } catch (err) {
      console.error('Error removing item:', err);
      setError('Failed to remove item. Please try again.');
    }
  };

  const clearCart = () => {
    try {
      setCartItems([]);
      localStorage.removeItem('cart');
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError('Failed to clear cart. Please try again.');
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border" role="status"></div></div>;
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4">Your Cart</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {cartItems.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-cart-x" style={{ fontSize: '4rem' }}></i>
          <h3 className="mt-3">Your cart is empty</h3>
          <p className="text-muted">Looks like you haven't added any items to your cart yet.</p>
          <Button as={Link} to="/menu" variant="primary" className="mt-3">
            Browse Menu
          </Button>
        </div>
      ) : (
        <Row>
          <Col lg={8}>
            <Card className="mb-4">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <span>Cart Items ({cartItems.length})</span>
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={clearCart}
                >
                  Clear All
                </Button>
              </Card.Header>
              <Card.Body>
                {cartItems.map((item) => (
                  <div key={item.id} className="d-flex flex-wrap mb-4 border-bottom pb-4">
                    <div className="flex-shrink-0" style={{ width: '100px', height: '100px' }}>
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="img-fluid rounded" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div className="flex-grow-1 ms-3">
                      <div className="d-flex justify-content-between">
                        <h5>{item.name}</h5>
                        <h5>${(item.price * item.quantity).toFixed(2)}</h5>
                      </div>
                      <p className="text-muted small">{item.description}</p>
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <div className="d-flex align-items-center">
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            −
                          </Button>
                          <span className="px-3">{item.quantity}</span>
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => removeItem(item.id)}
                        >
                          <i className="bi bi-trash"></i> Remove
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4}>
            <Card className="mb-4">
              <Card.Header>Order Summary</Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Estimated Tax:</span>
                  <span>${(calculateSubtotal() * 0.085).toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Delivery Fee:</span>
                  <span>$3.99</span>
                </div>
                <div className="d-flex justify-content-between mt-3 pt-2 border-top fw-bold">
                  <span>Total:</span>
                  <span>${(calculateSubtotal() + (calculateSubtotal() * 0.085) + 3.99).toFixed(2)}</span>
                </div>
                
                <Button 
                  as={Link} 
                  to="/checkout" 
                  variant="primary" 
                  size="lg" 
                  className="w-100 mt-3"
                >
                  Proceed to Checkout
                </Button>
                
                <Button 
                  as={Link} 
                  to="/menu" 
                  variant="outline-secondary" 
                  className="w-100 mt-2"
                >
                  Continue Shopping
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Cart;