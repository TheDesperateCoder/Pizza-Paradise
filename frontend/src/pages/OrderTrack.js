import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, ProgressBar } from 'react-bootstrap';
import OrderService from '../services/OrderService';
import '../styles/OrderTrack.css';

const OrderTrack = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  
  useEffect(() => {
    // Check if orderId exists in URL params
    const params = new URLSearchParams(location.search);
    const orderIdParam = params.get('orderId');
    
    if (orderIdParam) {
      setOrderId(orderIdParam);
      // Auto-fetch if user is logged in
      const autoFetch = async () => {
        try {
          setLoading(true);
          // Try trackOrder first, then fall back to trackOrderPublic if needed
          try {
            const response = await OrderService.trackOrder(orderIdParam);
            setOrder(response);
          } catch (err) {
            console.log('Need email to view this order');
            // If already have email in state, try with it
            if (email) {
              const response = await OrderService.trackOrderPublic(orderIdParam, email);
              setOrder(response);
            }
          }
        } catch (err) {
          // Silently fail - we'll wait for the user to enter an email
          console.log('Will wait for user to enter tracking info');
        } finally {
          setLoading(false);
        }
      };
      
      autoFetch();
    }
  }, [location.search, email]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!orderId.trim()) {
      setError('Please enter your order ID');
      return;
    }
    
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    
    setError('');
    setLoading(true);
    setSubmitted(true);
    
    try {
      const response = await OrderService.trackOrderPublic(orderId.trim(), email.trim());
      setOrder(response);
    } catch (err) {
      setError(err.response?.data?.message || 'Order not found. Please check your Order ID and email.');
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusPercentage = (status) => {
    switch(status) {
      case 'Order Received': return 25;
      case 'Preparing': return 50;
      case 'Out for Delivery': return 75;
      case 'Delivered': return 100;
      default: return 0;
    }
  };
  
  const getStatusClass = (status) => {
    switch(status) {
      case 'Cancelled': return 'cancelled';
      case 'Delivered': return 'delivered';
      default: return '';
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };
  
  return (
    <Container className="order-track-container my-5">
      <h1 className="mb-4">Track Your Order</h1>
      
      <Row className="justify-content-center">
        {!order && !submitted && (
          <Col md={6}>
            <Card>
              <Card.Body>
                <h4 className="mb-4">Enter Your Order Details</h4>
                
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Order ID</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter your order ID"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      disabled={loading}
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email used for ordering"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                  </Form.Group>
                  
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                        <span className="ms-2">Tracking...</span>
                      </>
                    ) : (
                      'Track Order'
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
            
            <div className="text-center mt-4">
              <p>Need to place an order?</p>
              <Button variant="outline-primary" onClick={() => navigate('/')}>
                Order Now
              </Button>
            </div>
          </Col>
        )}
        
        {loading && submitted && (
          <Col md={6} className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-3">Looking up your order...</p>
          </Col>
        )}
        
        {order && (
          <Col md={8}>
            <Card>
              <Card.Header>
                <h4>Order #{order.id}</h4>
              </Card.Header>
              <Card.Body>
                <div className="order-status-header">
                  <div>
                    <p><strong>Order Date:</strong> {formatDate(order.orderDate)}</p>
                    <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
                  </div>
                  <div className={`status-badge ${getStatusClass(order.status)}`}>
                    {order.status}
                  </div>
                </div>
                
                {order.status !== 'Cancelled' && (
                  <div className="tracking-progress mt-4 mb-5">
                    <ProgressBar 
                      now={getStatusPercentage(order.status)} 
                      variant="success" 
                    />
                    <div className="tracking-steps">
                      <div className={`step ${order.status ? 'completed' : ''}`}>
                        <div className="step-icon">1</div>
                        <div className="step-label">Order Received</div>
                      </div>
                      <div className={`step ${order.status === 'Preparing' || order.status === 'Out for Delivery' || order.status === 'Delivered' ? 'completed' : ''}`}>
                        <div className="step-icon">2</div>
                        <div className="step-label">Preparing</div>
                      </div>
                      <div className={`step ${order.status === 'Out for Delivery' || order.status === 'Delivered' ? 'completed' : ''}`}>
                        <div className="step-icon">3</div>
                        <div className="step-label">Out for Delivery</div>
                      </div>
                      <div className={`step ${order.status === 'Delivered' ? 'completed' : ''}`}>
                        <div className="step-icon">4</div>
                        <div className="step-label">Delivered</div>
                      </div>
                    </div>
                  </div>
                )}
                
                <h5>Order Details</h5>
                <div className="order-items">
                  {order.items.map((item, index) => (
                    <div className="order-item" key={index}>
                      <div className="item-details">
                        <h6>{item.name}</h6>
                        <p className="item-meta">{item.size}{item.toppings && `, ${item.toppings.join(', ')}`}</p>
                      </div>
                      <div className="item-quantity">x{item.quantity}</div>
                      <div className="item-price">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
                
                <div className="order-summary">
                  <div className="summary-row">
                    <div>Subtotal</div>
                    <div>${order.subtotal.toFixed(2)}</div>
                  </div>
                  <div className="summary-row">
                    <div>Delivery Fee</div>
                    <div>${order.deliveryFee.toFixed(2)}</div>
                  </div>
                  <div className="summary-row">
                    <div>Tax</div>
                    <div>${order.tax.toFixed(2)}</div>
                  </div>
                  <div className="summary-row total">
                    <div>Total</div>
                    <div>${order.orderTotal.toFixed(2)}</div>
                  </div>
                </div>
              </Card.Body>
              <Card.Footer>
                <Row>
                  <Col>
                    <p className="mb-0">
                      <strong>Payment Method:</strong> {order.paymentMethod === 'card' ? 'Credit/Debit Card' : 'Cash on Delivery'}
                    </p>
                  </Col>
                  <Col className="text-end">
                    <p className="mb-0">
                      <strong>Payment Status:</strong> {order.paymentStatus}
                    </p>
                  </Col>
                </Row>
              </Card.Footer>
            </Card>
            
            <div className="text-center mt-4">
              <Button variant="primary" onClick={() => navigate('/')}>
                Order Again
              </Button>
              <Button variant="link" onClick={() => {
                setOrder(null);
                setSubmitted(false);
                setOrderId('');
                setEmail('');
              }}>
                Track Another Order
              </Button>
            </div>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default OrderTrack;