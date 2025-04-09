import axios from 'axios';
import AuthService from './AuthService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Helper to include auth token in requests
const authHeader = () => {
  const user = AuthService.getCurrentUser();
  if (user && user.token) {
    return { Authorization: `Bearer ${user.token}` };
  } else {
    return {};
  }
};

const PizzaService = {
  // Get all pizza bases
  getPizzaBases: async () => {
    const response = await axios.get(`${API_URL}/api/pizza/bases`);
    return response.data;
  },
  
  // Get all sauces
  getSauces: async () => {
    const response = await axios.get(`${API_URL}/api/pizza/sauces`);
    return response.data;
  },
  
  // Get all cheese types
  getCheeseTypes: async () => {
    const response = await axios.get(`${API_URL}/api/pizza/cheese`);
    return response.data;
  },
  
  // Get all veggie toppings
  getVeggieToppings: async () => {
    const response = await axios.get(`${API_URL}/api/pizza/veggies`);
    return response.data;
  },
  
  // Get all meat toppings
  getMeatToppings: async () => {
    const response = await axios.get(`${API_URL}/api/pizza/meats`);
    return response.data;
  },
  
  // Get all pizza varieties (pre-made options)
  getPizzaVarieties: async () => {
    const response = await axios.get(`${API_URL}/api/pizza/varieties`);
    return response.data;
  },
  
  // Calculate pizza price based on selections
  calculatePrice: async (pizzaOptions) => {
    const response = await axios.post(`${API_URL}/api/pizza/calculate-price`, pizzaOptions);
    return response.data;
  },
  
  // Save custom pizza to user favorites
  saveCustomPizza: async (pizzaData) => {
    const response = await axios.post(`${API_URL}/api/pizza/favorites`, pizzaData, {
      headers: authHeader()
    });
    return response.data;
  },
  
  // Get user's favorite pizzas
  getFavoritePizzas: async () => {
    const response = await axios.get(`${API_URL}/api/pizza/favorites`, {
      headers: authHeader()
    });
    return response.data;
  }
};

export default PizzaService;