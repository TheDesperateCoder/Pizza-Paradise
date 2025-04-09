import React, { useState, useEffect } from 'react';
import axios from 'axios';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Use the explicit API URL to ensure it works even if .env has issues
        const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
        console.log('Fetching orders from:', `${API_URL}/api/user/orders`);
        
        const response = await axios.get(`${API_URL}/api/user/orders`);
        console.log('Orders response:', response.data);
        setOrders(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError(`Failed to load order history: ${error.message}`);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getVeggiesString = (veggies) => {
    if (!veggies || veggies.length === 0) return 'No veggies';
    return veggies.join(', ');
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div className="container mt-5"><h3>Loading order history...</h3></div>;
  if (error) return <div className="container mt-5"><h3 className="text-danger">{error}</h3></div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Your Order History</h2>
      
      {orders.length === 0 ? (
        <div className="alert alert-info">
          You haven't placed any orders yet. <a href="/pizza-builder" className="alert-link">Order a pizza now!</a>
        </div>
      ) : (
        <div className="row">
          {orders.map((order) => (
            <div className="col-md-6 mb-4" key={order._id}>
              <div className="card h-100 shadow-sm">
                <div className="card-header" style={{ background: 'linear-gradient(to right, #ff9966, #ff5e62)', color: 'white' }}>
                  <h5>Order ID: {order._id.substring(0, 8)}...</h5>
                  <span className="badge bg-light text-dark">{order.status}</span>
                </div>
                <div className="card-body">
                  <h5 className="card-title">Pizza Details:</h5>
                  <ul className="list-group list-group-flush mb-3">
                    <li className="list-group-item"><strong>Base:</strong> {order.base}</li>
                    <li className="list-group-item"><strong>Sauce:</strong> {order.sauce}</li>
                    <li className="list-group-item"><strong>Cheese:</strong> {order.cheese}</li>
                    <li className="list-group-item"><strong>Veggies:</strong> {getVeggiesString(order.veggies)}</li>
                  </ul>
                  
                  <h5 className="card-title">Payment Details:</h5>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item"><strong>Amount:</strong> ₹{order.amount || 'N/A'}</li>
                    <li className="list-group-item"><strong>Payment ID:</strong> {order.paymentId || 'N/A'}</li>
                    <li className="list-group-item"><strong>Date:</strong> {formatDate(order.orderDate || order.createdAt)}</li>
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistory;
