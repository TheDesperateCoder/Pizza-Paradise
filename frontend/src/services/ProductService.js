import axios from 'axios';
import AuthService from './AuthService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ProductService {
  // Helper to get auth header
  _getAuthHeader() {
    const user = AuthService.getCurrentUser();
    if (user && user.token) {
      return { Authorization: `Bearer ${user.token}` };
    } else {
      return {};
    }
  }
  
  // Get all products
  getAllProducts() {
    return axios.get(`${API_URL}/products`)
      .then(response => response.data);
  }
  
  // Get products by category
  getProductsByCategory(category) {
    return axios.get(`${API_URL}/products/category/${category}`)
      .then(response => response.data);
  }
  
  // Get product by ID
  getProductById(productId) {
    return axios.get(`${API_URL}/products/${productId}`)
      .then(response => response.data);
  }
  
  // Get featured products
  getFeaturedProducts() {
    return axios.get(`${API_URL}/products/featured`)
      .then(response => response.data);
  }
  
  // Search products
  searchProducts(query) {
    return axios.get(`${API_URL}/products/search?q=${encodeURIComponent(query)}`)
      .then(response => response.data);
  }
  
  // Admin: Create product
  createProduct(productData) {
    return axios.post(
      `${API_URL}/admin/products`,
      productData,
      { headers: this._getAuthHeader() }
    ).then(response => response.data);
  }
  
  // Admin: Update product
  updateProduct(productId, productData) {
    return axios.put(
      `${API_URL}/admin/products/${productId}`,
      productData,
      { headers: this._getAuthHeader() }
    ).then(response => response.data);
  }
  
  // Admin: Delete product
  deleteProduct(productId) {
    return axios.delete(
      `${API_URL}/admin/products/${productId}`,
      { headers: this._getAuthHeader() }
    ).then(response => response.data);
  }
  
  // Get all product categories
  getCategories() {
    return axios.get(`${API_URL}/products/categories`)
      .then(response => response.data);
  }
  
  // Get mock product data for UI development
  getMockProductsData() {
    return [
      {
        id: 1,
        name: "Classic Pepperoni",
        description: "Traditional pizza with tomato sauce, mozzarella, and pepperoni",
        price: 14.99,
        image: "/images/pizzas/pepperoni.jpg",
        category: "PIZZA",
        nutritionalInfo: {
          calories: 285,
          protein: 12,
          carbs: 36,
          fat: 10
        },
        available: true,
        featured: true,
        sizes: [
          { name: "Small", price: 10.99 },
          { name: "Medium", price: 14.99 },
          { name: "Large", price: 17.99 }
        ],
        toppings: [
          { name: "Extra Cheese", price: 1.49 },
          { name: "Extra Pepperoni", price: 1.99 }
        ],
        rating: 4.8,
        reviews: 234
      },
      {
        id: 2,
        name: "Veggie Supreme",
        description: "Loaded with bell peppers, onions, mushrooms, black olives and tomatoes",
        price: 16.99,
        image: "/images/pizzas/veggie.jpg",
        category: "PIZZA",
        nutritionalInfo: {
          calories: 240,
          protein: 10,
          carbs: 42,
          fat: 6
        },
        available: true,
        featured: true,
        sizes: [
          { name: "Small", price: 12.99 },
          { name: "Medium", price: 16.99 },
          { name: "Large", price: 19.99 }
        ],
        toppings: [
          { name: "Extra Cheese", price: 1.49 },
          { name: "Add Jalapeños", price: 0.99 }
        ],
        rating: 4.6,
        reviews: 187
      },
      {
        id: 3,
        name: "Buffalo Wings",
        description: "Crispy chicken wings tossed in spicy buffalo sauce",
        price: 9.99,
        image: "/images/sides/wings.jpg",
        category: "SIDES",
        nutritionalInfo: {
          calories: 320,
          protein: 22,
          carbs: 8,
          fat: 24
        },
        available: true,
        featured: false,
        sizes: [
          { name: "6 Pieces", price: 9.99 },
          { name: "12 Pieces", price: 17.99 }
        ],
        rating: 4.7,
        reviews: 156
      },
      {
        id: 4,
        name: "Chocolate Lava Cake",
        description: "Rich chocolate cake with molten center",
        price: 6.99,
        image: "/images/desserts/lava-cake.jpg",
        category: "DESSERTS",
        nutritionalInfo: {
          calories: 410,
          protein: 5,
          carbs: 58,
          fat: 19
        },
        available: true,
        featured: true,
        rating: 4.9,
        reviews: 89
      },
      {
        id: 5,
        name: "Coca-Cola",
        description: "Classic soda refreshment",
        price: 1.99,
        image: "/images/drinks/coke.jpg",
        category: "DRINKS",
        nutritionalInfo: {
          calories: 140,
          protein: 0,
          carbs: 39,
          fat: 0
        },
        available: true,
        featured: false,
        sizes: [
          { name: "20oz Bottle", price: 1.99 },
          { name: "2L Bottle", price: 3.49 }
        ],
        rating: 4.5,
        reviews: 62
      },
      {
        id: 6,
        name: "Meat Lovers",
        description: "Loaded with pepperoni, sausage, ham, and bacon",
        price: 18.99,
        image: "/images/pizzas/meat-lovers.jpg",
        category: "PIZZA",
        nutritionalInfo: {
          calories: 330,
          protein: 18,
          carbs: 36,
          fat: 14
        },
        available: true,
        featured: true,
        sizes: [
          { name: "Small", price: 14.99 },
          { name: "Medium", price: 18.99 },
          { name: "Large", price: 21.99 }
        ],
        toppings: [
          { name: "Extra Cheese", price: 1.49 },
          { name: "Add Jalapeños", price: 0.99 }
        ],
        rating: 4.9,
        reviews: 278
      }
    ];
  }
}

export default new ProductService();