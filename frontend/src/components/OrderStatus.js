import React, { useState, useEffect } from 'react';
import axios from 'axios';

function OrderStatus({ orderId }) {
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchStatus = async () => {
      const { data } = await axios.get(`http://localhost:5000/api/user/order-status/${orderId}`);
      setStatus(data.status);
    };
    fetchStatus();

    const interval = setInterval(fetchStatus, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [orderId]);

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4" style={{ background: 'linear-gradient(to right, #56ccf2, #2f80ed)', color: 'white' }}>
        <h2 className="text-center">Order Status</h2>
        <p className="text-center">Current Status: {status}</p>
      </div>
    </div>
  );
}

export default OrderStatus;