import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaMotorcycle } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [order, setOrder] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(30);

  useEffect(() => {
    // Get order details from location state or fetch from API
    if (location.state?.order) {
      setOrder(location.state.order);
    } else if (location.search) {
      // Extract order ID from URL query params
      const params = new URLSearchParams(location.search);
      const orderId = params.get('id');
      
      if (orderId) {
        // Fetch order details using the ID
        fetchOrderDetails(orderId);
      } else {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [location, navigate]);

  const fetchOrderDetails = async (orderId) => {
    try {
      // Placeholder for API call
      // In a real app, you would fetch order details from your API
      console.log(`Fetching order details for ID: ${orderId}`);
      
      // Mock order data for demonstration
      const mockOrderData = {
        id: orderId,
        items: [
          { name: 'Pepperoni Pizza', quantity: 1, price: 14.99 },
          { name: 'Garlic Bread', quantity: 1, price: 4.99 }
        ],
        totalAmount: 19.98,
        deliveryAddress: '123 Main St, Anytown, USA',
        status: 'processing',
        paymentMethod: 'Credit Card',
        createdAt: new Date().toISOString()
      };
      
      setOrder(mockOrderData);
    } catch (error) {
      console.error('Error fetching order details:', error);
      // Handle error appropriately
    }
  };

  if (!order) {
    return (
      <Container className="py-5 text-center">
        <h2>Loading order details...</h2>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body className="text-center p-5">
              <FaCheckCircle className="text-success mb-4" size={60} />
              <h1 className="mb-4">Thank You for Your Order!</h1>
              <p className="lead mb-4">
                Your order has been received and is being prepared.
              </p>
              <div className="order-details mb-4">
                <h4>Order Summary</h4>
                <p><strong>Order ID:</strong> {order.id}</p>
                <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                <p><strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}</p>
                <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
              </div>
              
              <div className="delivery-info p-4 mb-4 bg-light rounded">
                <h4 className="d-flex align-items-center justify-content-center">
                  <FaMotorcycle className="me-2" />
                  Delivery Information
                </h4>
                <p className="mb-2"><strong>Address:</strong> {order.deliveryAddress}</p>
                <p><strong>Estimated Delivery Time:</strong> {estimatedTime} minutes</p>
              </div>
              
              <div className="d-grid gap-3">
                <Button 
                  variant="outline-primary" 
                  onClick={() => navigate('/track-order', { state: { orderId: order.id } })}
                >
                  Track Your Order
                </Button>
                <Button 
                  variant="primary" 
                  onClick={() => navigate('/menu')}
                >
                  Continue Shopping
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderConfirmation;