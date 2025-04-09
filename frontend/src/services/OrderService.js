import axios from 'axios';
import AuthService from './AuthService';

// Use the same API URL as AuthService for consistency
const API_URL = 'http://localhost:3001';

class OrderService {
  // Helper to get auth header
  _getAuthHeader() {
    const user = AuthService.getCurrentUser();
    if (user && user.token) {
      return { Authorization: `Bearer ${user.token}` };
    } else {
      return {};
    }
  }
  
  // Create a new order
  createOrder(orderData) {
    return axios.post(
      `${API_URL}/orders`,
      orderData,
      { headers: this._getAuthHeader() }
    ).then(response => response.data);
  }
  
  // Complete order after payment
  completeOrder(orderDetails, paymentResult) {
    return axios.post(
      `${API_URL}/orders/complete`,
      { orderDetails, paymentResult },
      { headers: this._getAuthHeader() }
    ).then(response => response.data);
  }
  
  // Get user's order history
  getMyOrders() {
    return axios.get(
      `${API_URL}/orders/my-orders`,
      { headers: this._getAuthHeader() }
    ).then(response => response.data);
  }
  
  // Get all orders for a customer
  getCustomerOrders() {
    return axios.get(
      `${API_URL}/user/order-history`,
      { headers: this._getAuthHeader() }
    ).then(response => response.data);
  }
  
  // Get a specific order by ID
  getOrderById(orderId) {
    return axios.get(
      `${API_URL}/orders/${orderId}`,
      { headers: this._getAuthHeader() }
    ).then(response => response.data);
  }
  
  // Get order status for tracking
  getOrderStatus(orderId) {
    return axios.get(
      `${API_URL}/user/order-status/${orderId}`,
      { headers: this._getAuthHeader() }
    ).then(response => response.data);
  }
  
  // Track order without auth (public)
  trackOrderPublic(orderId, email) {
    return axios.get(
      `${API_URL}/orders/track?orderId=${orderId}&email=${email}`
    ).then(response => response.data);
  }
  
  // Update order status (admin only)
  updateOrderStatus(orderId, status) {
    return axios.put(
      `${API_URL}/admin/orders/${orderId}/status`,
      { status },
      { headers: this._getAuthHeader() }
    ).then(response => response.data);
  }
  
  // Get all orders (admin only)
  getOrdersForAdmin(page = 1, limit = 10) {
    return axios.get(
      `${API_URL}/admin/orders?page=${page}&limit=${limit}`,
      { headers: this._getAuthHeader() }
    ).then(response => response.data);
  }
  
  // Cancel an order
  cancelOrder(orderId) {
    return axios.put(
      `${API_URL}/orders/${orderId}/cancel`,
      {},
      { headers: this._getAuthHeader() }
    ).then(response => response.data);
  }
  
  // Track order status
  trackOrder(orderId) {
    return axios.get(
      `${API_URL}/orders/${orderId}/track`,
      { headers: this._getAuthHeader() }
    ).then(response => response.data);
  }
  
  // Get order statuses for tracking
  getOrderStatusOptions() {
    return [
      { value: 'pending', label: 'Pending' },
      { value: 'order_received', label: 'Order Received' },
      { value: 'in_kitchen', label: 'Preparing' },
      { value: 'out_for_delivery', label: 'Out for Delivery' },
      { value: 'delivered', label: 'Delivered' },
      { value: 'cancelled', label: 'Cancelled' }
    ];
  }
  
  // Get mock order data for testing
  getMockOrdersData() {
    const mockData = [
      {
        id: '1001',
        date: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        total: 34.99,
        status: 'DELIVERED',
        items: [
          { id: 1, name: 'Pepperoni Pizza', size: 'Large', quantity: 1, price: 14.99 },
          { id: 2, name: 'Cheese Sticks', quantity: 1, price: 5.99 },
          { id: 3, name: 'Soda', size: '2L', quantity: 1, price: 2.99 }
        ],
        address: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'NY',
          zip: '10001'
        },
        paymentMethod: 'Credit Card',
        deliveryFee: 3.99
      },
      {
        id: '1002',
        date: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        total: 42.98,
        status: 'DELIVERED',
        items: [
          { id: 1, name: 'Supreme Pizza', size: 'Large', quantity: 1, price: 16.99 },
          { id: 2, name: 'Buffalo Wings', quantity: 1, price: 7.99 },
          { id: 3, name: 'Garlic Bread', quantity: 1, price: 4.99 },
          { id: 4, name: 'Soda', size: '2L', quantity: 1, price: 2.99 }
        ],
        address: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'NY',
          zip: '10001'
        },
        paymentMethod: 'PayPal',
        deliveryFee: 3.99
      },
      {
        id: '1003',
        date: new Date().toISOString(), // Today
        total: 26.99,
        status: 'PREPARING',
        items: [
          { id: 1, name: 'Hawaiian Pizza', size: 'Medium', quantity: 1, price: 12.99 },
          { id: 2, name: 'Caesar Salad', quantity: 1, price: 6.99 },
          { id: 3, name: 'Bottled Water', quantity: 2, price: 1.49 }
        ],
        address: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'NY',
          zip: '10001'
        },
        paymentMethod: 'Credit Card',
        deliveryFee: 3.99
      }
    ];
    
    return mockData;
  }
}

// Assign service to a variable before exporting
const orderService = new OrderService();

export default orderService;