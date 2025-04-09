import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      
      try {
        const token = await currentUser.getIdToken();
        const response = await axios.get('http://localhost:3001/api/orders/history', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log('Orders data:', response.data);
        setOrders(response.data.orders || []);
      } catch (err) {
        console.error('Error fetching order history:', err);
        setError('Failed to load order history. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [currentUser]);

  const getStatusBadge = (status) => {
    switch(status.toLowerCase()) {
      case 'processing':
        return <Badge bg="warning">Processing</Badge>;
      case 'confirmed':
        return <Badge bg="info">Confirmed</Badge>;
      case 'preparing':
        return <Badge bg="primary">Preparing</Badge>;
      case 'out for delivery':
        return <Badge bg="secondary">Out for Delivery</Badge>;
      case 'delivered':
        return <Badge bg="success">Delivered</Badge>;
      case 'cancelled':
        return <Badge bg="danger">Cancelled</Badge>;
      default:
        return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  if (!currentUser) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          Please log in to view your order history.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="mb-4">Your Order History</h1>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      {orders.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-receipt" style={{ fontSize: '4rem' }}></i>
          <h3 className="mt-3">No orders yet</h3>
          <p className="text-muted">You haven't placed any orders yet. Start ordering delicious pizzas!</p>
          <Button href="/menu" variant="primary" className="mt-3">
            Browse Menu
          </Button>
        </div>
      ) : (
        <Row>
          {orders.map(order => (
            <Col lg={6} key={order.id} className="mb-4">
              <Card>
                <Card.Header className="d-flex justify-content-between">
                  <span>Order #{order.id.substring(0, 8)}</span>
                  {getStatusBadge(order.status)}
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <strong>Date:</strong> {formatDate(order.createdAt)}
                  </div>
                  <div className="mb-3">
                    <strong>Items:</strong>
                    <ul className="list-unstyled mt-2">
                      {order.items.map((item, index) => (
                        <li key={index} className="border-bottom pb-2 mb-2">
                          <div className="d-flex justify-content-between">
                            <span>{item.quantity}x {item.name}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                          <small className="text-muted">{item.description}</small>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mb-3">
                    <strong>Delivery Address:</strong>
                    <p className="mb-0">{order.deliveryAddress}</p>
                  </div>
                  <div className="mb-3">
                    <strong>Payment Method:</strong> {order.paymentMethod === 'credit' ? 'Credit Card' : 'Cash on Delivery'}
                  </div>
                  <div className="d-flex justify-content-between border-top pt-3 mt-3">
                    <strong>Total:</strong>
                    <strong>${order.totalAmount.toFixed(2)}</strong>
                  </div>
                </Card.Body>
                <Card.Footer>
                  <Button variant="outline-primary" size="sm" className="me-2" disabled={!['processing', 'confirmed'].includes(order.status.toLowerCase())}>
                    Track Order
                  </Button>
                  <Button variant="outline-secondary" size="sm">
                    Reorder
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default OrderHistory;