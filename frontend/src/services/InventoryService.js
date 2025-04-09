import axios from 'axios';
import AuthService from './AuthService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Helper to include auth token in requests
const authHeader = () => {
  const admin = AuthService.getCurrentAdmin();
  if (admin && admin.token) {
    return { Authorization: `Bearer ${admin.token}` };
  } else {
    return {};
  }
};

const InventoryService = {
  // Get all inventory items
  getAllInventory: async () => {
    const response = await axios.get(`${API_URL}/api/inventory`, {
      headers: authHeader()
    });
    return response.data;
  },
  
  // Get inventory by category (base, sauce, cheese, veggies, meat)
  getInventoryByCategory: async (category) => {
    const response = await axios.get(`${API_URL}/api/inventory/category/${category}`, {
      headers: authHeader()
    });
    return response.data;
  },
  
  // Update inventory item quantity
  updateInventoryItem: async (itemId, quantity) => {
    const response = await axios.put(`${API_URL}/api/inventory/${itemId}`, {
      quantity
    }, {
      headers: authHeader()
    });
    return response.data;
  },
  
  // Add new inventory item
  addInventoryItem: async (itemData) => {
    const response = await axios.post(`${API_URL}/api/inventory`, itemData, {
      headers: authHeader()
    });
    return response.data;
  },
  
  // Delete inventory item
  deleteInventoryItem: async (itemId) => {
    const response = await axios.delete(`${API_URL}/api/inventory/${itemId}`, {
      headers: authHeader()
    });
    return response.data;
  },
  
  // Get inventory items that are below threshold
  getLowStockItems: async () => {
    const response = await axios.get(`${API_URL}/api/inventory/low-stock`, {
      headers: authHeader()
    });
    return response.data;
  },
  
  // Set threshold for inventory item
  setItemThreshold: async (itemId, threshold) => {
    const response = await axios.put(`${API_URL}/api/inventory/${itemId}/threshold`, {
      threshold
    }, {
      headers: authHeader()
    });
    return response.data;
  }
};

export default InventoryService;