import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    paymentMethod: 'credit',
    notes: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderSuccess, setOrderSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Load cart items from localStorage
    try {
      const savedCart = localStorage.getItem('cart');
      const parsedCart = savedCart ? JSON.parse(savedCart) : [];
      
      if (parsedCart.length === 0) {
        // Redirect to cart if empty
        navigate('/cart');
      }
      
      setCartItems(parsedCart);
      
      // Try to pre-fill with user data if available
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      if (userData && userData.user) {
        setFormData(prev => ({
          ...prev,
          firstName: userData.user.firstName || '',
          lastName: userData.user.lastName || '',
          email: userData.user.email || '',
          phone: userData.user.contactNumber || ''
        }));
      }
    } catch (err) {
      console.error('Error loading cart:', err);
      setError('Could not load your cart. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const deliveryFee = 3.99;
    const tax = subtotal * 0.085; // 8.5% tax rate
    return subtotal + deliveryFee + tax;
  };

  const validateForm = () => {
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone',
      'address', 'city', 'state', 'zip'
    ];
    
    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(`Please fill in all required fields.`);
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare order data
      const orderData = {
        items: cartItems,
        totalAmount: calculateTotal(),
        deliveryAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}`,
        paymentMethod: formData.paymentMethod,
        customerDetails: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone
        },
        notes: formData.notes
      };
      
      // Only proceed with Razorpay for credit card payments
      if (formData.paymentMethod === 'credit') {
        // Create Razorpay order using existing backend endpoint
        const response = await axios.post('http://localhost:3001/api/payment/create-order', { 
          amount: orderData.totalAmount 
        });
        
        if (!response.data || !response.data.success) {
          throw new Error('Failed to create payment order');
        }
        
        const orderDataRazorpay = response.data.order;
        
        // Load Razorpay checkout
        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID, // Already in .env file
          amount: orderDataRazorpay.amount,
          currency: orderDataRazorpay.currency,
          name: 'Pizza Paradise',
          description: 'Food Order Payment',
          order_id: orderDataRazorpay.id,
          handler: async (response) => {
            try {
              // Send payment verification to backend
              const verificationData = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              };
              
              const verifyResponse = await axios.post('http://localhost:3001/api/payment/verify-payment', verificationData);
              
              if (verifyResponse.data.success) {
                // Payment successful
                setOrderSuccess(true);
                
                // Clear cart
                localStorage.removeItem('cart');
                
                // Redirect to confirmation after delay
                setTimeout(() => {
                  navigate('/dashboard');
                }, 2000);
              } else {
                setError('Payment verification failed. Please try again.');
              }
            } catch (error) {
              console.error('Payment verification failed:', error);
              setError('Payment could not be verified. Please contact support.');
            } finally {
              setLoading(false);
            }
          },
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            contact: formData.phone,
          },
          notes: {
            address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}`
          },
          theme: {
            color: '#FF5F6D'
          }
        };

        const razorpayInstance = new window.Razorpay(options);
        razorpayInstance.open();
        razorpayInstance.on('payment.failed', function(response) {
          setError(`Payment failed: ${response.error.description}`);
          setLoading(false);
        });
        
      } else if (formData.paymentMethod === 'cash') {
        // Handle cash on delivery - create order in database
        try {
          const orderResponse = await axios.post('http://localhost:3001/api/orders/create', orderData, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
          
          if (orderResponse.data && orderResponse.data.success) {
            // Order created successfully
            setOrderSuccess(true);
            
            // Clear cart
            localStorage.removeItem('cart');
            
            // Redirect to order confirmation
            setTimeout(() => {
              navigate(`/order-confirmation/${orderResponse.data.order._id}`);
            }, 2000);
          } else {
            throw new Error('Failed to create order');
          }
        } catch (orderErr) {
          console.error('Error creating order:', orderErr);
          setError('Could not create your order. Please try again.');
        }
        
        setLoading(false);
      }
    } catch (err) {
      console.error('Error processing order:', err);
      setError('Could not place your order. Please try again.');
      setLoading(false);
    }
  };

  if (loading && !orderSuccess) {
    return <div className="text-center py-5"><div className="spinner-border" role="status"></div></div>;
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4">Checkout</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {orderSuccess && (
        <Alert variant="success">
          <Alert.Heading>Order Placed Successfully!</Alert.Heading>
          <p>Your order has been placed. You will be redirected to your account shortly.</p>
        </Alert>
      )}
      
      {!orderSuccess && (
        <Row>
          <Col lg={8}>
            <Card className="mb-4">
              <Card.Header>Delivery Information</Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group controlId="firstName">
                        <Form.Label>First Name*</Form.Label>
                        <Form.Control
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="lastName">
                        <Form.Label>Last Name*</Form.Label>
                        <Form.Control
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group controlId="email">
                        <Form.Label>Email*</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="phone">
                        <Form.Label>Phone*</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-3" controlId="address">
                    <Form.Label>Address*</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>
                  
                  <Row className="mb-3">
                    <Col md={5}>
                      <Form.Group controlId="city">
                        <Form.Label>City*</Form.Label>
                        <Form.Control
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group controlId="state">
                        <Form.Label>State*</Form.Label>
                        <Form.Select
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select...</option>
                          <option value="AL">Alabama</option>
                          <option value="CA">California</option>
                          <option value="NY">New York</option>
                          {/* More states */}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group controlId="zip">
                        <Form.Label>Zip*</Form.Label>
                        <Form.Control
                          type="text"
                          name="zip"
                          value={formData.zip}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  
                  <Form.Group className="mb-3" controlId="notes">
                    <Form.Label>Delivery Instructions</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Apartment number, delivery preferences, etc."
                    />
                  </Form.Group>

                  <Card.Header className="mt-4 mb-3">Payment Method</Card.Header>
                  
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="radio"
                      id="payment-credit"
                      name="paymentMethod"
                      value="credit"
                      label="Pay Online (Razorpay)"
                      checked={formData.paymentMethod === 'credit'}
                      onChange={handleChange}
                    />
                    <Form.Check
                      type="radio"
                      id="payment-cash"
                      name="paymentMethod"
                      value="cash"
                      label="Cash on Delivery"
                      checked={formData.paymentMethod === 'cash'}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  
                  {formData.paymentMethod === 'credit' && (
                    <div className="border p-3 rounded mb-3 bg-light">
                      <p className="mb-0">
                        <i className="fas fa-info-circle me-2"></i>
                        You'll be redirected to Razorpay's secure payment page to complete your payment.
                      </p>
                    </div>
                  )}

                  <div className="d-flex justify-content-between mt-4">
                    <Button as={Link} to="/cart" variant="outline-secondary">
                      Return to Cart
                    </Button>
                    <Button 
                      type="submit" 
                      variant="primary"
                      disabled={loading}
                    >
                      {loading ? 'Processing...' : 'Place Order'}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
          
          <Col lg={4}>
            <Card className="mb-4 sticky-top" style={{ top: '20px' }}>
              <Card.Header>Order Summary</Card.Header>
              <Card.Body>
                <div className="mb-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="d-flex justify-content-between mb-2">
                      <span>{item.quantity}x {item.name}</span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                
                <hr />
                
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <span>${calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Delivery Fee:</span>
                  <span>$3.99</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax:</span>
                  <span>${(calculateSubtotal() * 0.085).toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mt-3 pt-2 border-top fw-bold">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
                
                <Form.Group className="mt-3">
                  <Form.Label>Promo Code</Form.Label>
                  <div className="d-flex">
                    <Form.Control
                      type="text"
                      placeholder="Enter code"
                    />
                    <Button variant="outline-secondary" className="ms-2">Apply</Button>
                  </div>
                </Form.Group>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Checkout;