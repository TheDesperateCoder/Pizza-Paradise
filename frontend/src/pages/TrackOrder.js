import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, ProgressBar } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { FaPizzaSlice, FaCheck, FaMotorcycle, FaPhoneAlt } from 'react-icons/fa';

const TrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [progressPercentage, setProgressPercentage] = useState(0);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // In production, replace this with actual API call
        // const response = await axios.get(`/api/orders/${orderId}`, {
        //   headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        // });
        // setOrder(response.data.order);
        
        // Mock data for development
        setTimeout(() => {
          // Mock order data
          const mockOrder = {
            _id: orderId || 'ORD123456',
            status: 'preparing', // Options: received, confirmed, preparing, out_for_delivery, delivered
            items: [
              { name: 'Pepperoni Pizza (Large)', quantity: 1, price: 18.99 },
              { name: 'Garlic Bread', quantity: 1, price: 4.99 },
              { name: 'Coke (2L)', quantity: 1, price: 2.99 }
            ],
            totalAmount: 26.97,
            deliveryAddress: '123 Main Street, Apt 4B, New York, NY 10001',
            paymentMethod: 'Credit Card',
            estimatedDeliveryTime: '30-40 min',
            createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
            deliveryPerson: {
              name: 'John D.',
              phone: '555-123-4567'
            }
          };
          
          setOrder(mockOrder);
          
          // Set progress percentage based on status
          const statusValues = {
            'received': 10,
            'confirmed': 25, 
            'preparing': 50,
            'out_for_delivery': 75,
            'delivered': 100
          };
          
          setProgressPercentage(statusValues[mockOrder.status] || 0);
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Could not load order details. Please try again.');
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId]);
  
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading your order details...</p>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container className="py-5 text-center">
        <div className="alert alert-danger">
          {error}
        </div>
        <Button 
          variant="primary" 
          onClick={() => navigate('/order-history')}
        >
          Go to Order History
        </Button>
      </Container>
    );
  }
  
  if (!order) {
    return (
      <Container className="py-5 text-center">
        <div className="alert alert-warning">
          Order not found. Please check your order ID and try again.
        </div>
        <Button 
          variant="primary" 
          onClick={() => navigate('/order-history')}
        >
          Go to Order History
        </Button>
      </Container>
    );
  }
  
  const getStatusDetails = (status) => {
    const statusMap = {
      'received': {
        title: 'Order Received',
        description: 'We\'ve received your order and are processing it.',
        icon: <FaCheck className="text-success" size={24} />
      },
      'confirmed': {
        title: 'Order Confirmed',
        description: 'Your order has been confirmed and is being prepared.',
        icon: <FaCheck className="text-success" size={24} />
      },
      'preparing': {
        title: 'Preparing',
        description: 'Our chefs are preparing your delicious pizza!',
        icon: <FaPizzaSlice className="text-warning" size={24} />
      },
      'out_for_delivery': {
        title: 'Out for Delivery',
        description: 'Your order is on its way to you!',
        icon: <FaMotorcycle className="text-primary" size={24} />
      },
      'delivered': {
        title: 'Delivered',
        description: 'Your order has been delivered. Enjoy!',
        icon: <FaCheck className="text-success" size={24} />
      }
    };
    
    return statusMap[status] || {
      title: 'Processing',
      description: 'Your order is being processed.',
      icon: <FaCheck className="text-secondary" size={24} />
    };
  };
  
  const { title, description, icon } = getStatusDetails(order.status);
  
  // Format date string
  const orderDate = new Date(order.createdAt).toLocaleString();
  
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <div className="mb-4">
            <h1>Track Your Order</h1>
            <p className="text-muted">Order #{order._id}</p>
          </div>
          
          <Card className="mb-4">
            <Card.Body>
              <div className="d-flex align-items-center mb-4">
                {icon}
                <div className="ms-3">
                  <h2 className="h4 mb-1">{title}</h2>
                  <p className="mb-0">{description}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <ProgressBar 
                  now={progressPercentage} 
                  label={`${progressPercentage}%`} 
                  variant="success" 
                  style={{ height: '15px' }}
                />
              </div>
              
              <Row className="text-center mb-4">
                <Col xs={3} className={order.status === 'received' || order.status === 'confirmed' || order.status === 'preparing' || order.status === 'out_for_delivery' || order.status === 'delivered' ? 'text-success' : 'text-muted'}>
                  <div className="mb-2">
                    <FaCheck size={20} />
                  </div>
                  <div className="small">Received</div>
                </Col>
                <Col xs={3} className={order.status === 'confirmed' || order.status === 'preparing' || order.status === 'out_for_delivery' || order.status === 'delivered' ? 'text-success' : 'text-muted'}>
                  <div className="mb-2">
                    <FaCheck size={20} />
                  </div>
                  <div className="small">Confirmed</div>
                </Col>
                <Col xs={3} className={order.status === 'preparing' || order.status === 'out_for_delivery' || order.status === 'delivered' ? 'text-success' : 'text-muted'}>
                  <div className="mb-2">
                    <FaPizzaSlice size={20} />
                  </div>
                  <div className="small">Preparing</div>
                </Col>
                <Col xs={3} className={order.status === 'out_for_delivery' || order.status === 'delivered' ? 'text-success' : 'text-muted'}>
                  <div className="mb-2">
                    <FaMotorcycle size={20} />
                  </div>
                  <div className="small">Delivering</div>
                </Col>
              </Row>
              
              {order.status === 'out_for_delivery' && order.deliveryPerson && (
                <div className="alert alert-info d-flex align-items-center">
                  <div className="me-3">
                    <FaMotorcycle size={24} />
                  </div>
                  <div>
                    <p className="mb-1"><strong>{order.deliveryPerson.name}</strong> is delivering your order</p>
                    <p className="mb-0 small">
                      <FaPhoneAlt className="me-1" /> {order.deliveryPerson.phone}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="border-top pt-3 mt-3">
                <p><strong>Estimated Delivery Time:</strong> {order.estimatedDeliveryTime}</p>
                <p><strong>Order Time:</strong> {orderDate}</p>
                <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
              </div>
            </Card.Body>
          </Card>
          
          <Card className="mb-4">
            <Card.Header><h3 className="h5 mb-0">Order Summary</h3></Card.Header>
            <Card.Body>
              <div className="mb-3">
                {order.items.map((item, index) => (
                  <Row key={index} className="mb-2">
                    <Col xs={7}>
                      <div className="d-flex">
                        <span className="me-2">{item.quantity}x</span>
                        <span>{item.name}</span>
                      </div>
                    </Col>
                    <Col xs={5} className="text-end">
                      ${(item.price * item.quantity).toFixed(2)}
                    </Col>
                  </Row>
                ))}
              </div>
              
              <Row className="border-top pt-3">
                <Col xs={7}>
                  <strong>Total</strong>
                </Col>
                <Col xs={5} className="text-end">
                  <strong>${order.totalAmount.toFixed(2)}</strong>
                </Col>
              </Row>
              
              <Row className="mt-2">
                <Col xs={7}>
                  <span className="text-muted">Payment Method</span>
                </Col>
                <Col xs={5} className="text-end">
                  <span className="text-muted">{order.paymentMethod}</span>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          
          <div className="d-flex justify-content-between">
            <Button 
              variant="outline-secondary" 
              as={Link} 
              to="/order-history"
            >
              Back to Order History
            </Button>
            <Button variant="primary" as={Link} to="/menu">
              Order Again
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default TrackOrder;