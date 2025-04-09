import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminAnalytics() {
  const [analytics, setAnalytics] = useState({ totalSales: 0, popularPizzas: [], inventoryTrends: {} });

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/admin/analytics');
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div>
      <h2>Admin Analytics Dashboard</h2>
      <h3>Total Sales: ₹{analytics.totalSales}</h3>
      <h3>Popular Pizzas</h3>
      <ul>
        {analytics.popularPizzas.map((pizza) => (
          <li key={pizza._id}>{pizza._id}: {pizza.count} orders</li>
        ))}
      </ul>
      <h3>Inventory Trends</h3>
      <ul>
        {Object.entries(analytics.inventoryTrends).map(([item, quantity]) => (
          <li key={item}>{item}: {quantity}</li>
        ))}
      </ul>
    </div>
  );
}

export default AdminAnalytics;