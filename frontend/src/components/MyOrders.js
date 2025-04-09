import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Table, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { formatDate, formatCurrency } from '../utils/format';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` }
        };

        const { data } = await axios.get('http://localhost:3001/api/orders/myorders', config);
        setOrders(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Function to determine badge color based on order status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'processing':
        return 'info';
      case 'out_for_delivery':
        return 'primary';
      case 'delivered':
        return 'success';
      case 'cancelled':
        return 'danger';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        Error loading orders: {error}
      </Alert>
    );
  }

  if (orders.length === 0) {
    return (
      <Alert variant="info">
        You haven't placed any orders yet. <Link to="/menu">Browse our menu</Link> to place your first order!
      </Alert>
    );
  }

  return (
    <div className="my-orders">
      <h2 className="mb-4">My Orders</h2>
      <Table responsive striped hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>{order._id.substring(0, 8)}...</td>
              <td>{formatDate(order.createdAt)}</td>
              <td>{formatCurrency(order.totalAmount)}</td>
              <td>
                <Badge bg={getStatusBadge(order.status)}>
                  {order.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </td>
              <td>
                <Link to={`/order/${order._id}`}>
                  <Button variant="outline-primary" size="sm">View Details</Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default MyOrders;