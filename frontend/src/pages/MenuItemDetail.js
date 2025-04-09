import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Button, Spinner, Alert, Form } from 'react-bootstrap';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const MenuItemDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuItem, setMenuItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  
  // Extract category from the URL path
  const getCategory = () => {
    const path = location.pathname;
    if (path.includes('/menu/sides/')) return 'sides';
    if (path.includes('/menu/drinks/')) return 'drinks';
    if (path.includes('/menu/desserts/')) return 'desserts';
    return '';
  };
  
  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        setLoading(true);
        const category = getCategory();
        const response = await axios.get(`${API_URL}/menu/${category}/${id}`);
        
        if (response.data) {
          setMenuItem(response.data);
        } else {
          setError('Item not found');
        }
      } catch (err) {
        console.error('Error fetching menu item details:', err);
        setError('Failed to load item details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMenuItem();
  }, [id, location.pathname]);
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 10) {
      setQuantity(value);
    }
  };
  
  const calculatePrice = () => {
    if (!menuItem) return 0;
    return menuItem.price * quantity;
  };
  
  const addToCart = () => {
    if (!menuItem) return;
    
    const cartItem = {
      id: menuItem._id,
      name: menuItem.name,
      price: menuItem.price,
      quantity,
      image: menuItem.image,
      category: getCategory()
    };
    
    // Get existing cart from localStorage
    const existingCart = localStorage.getItem('cart');
    let cart = existingCart ? JSON.parse(existingCart) : [];
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => item.id === cartItem.id);
    
    if (existingItemIndex !== -1) {
      // Update quantity of existing item
      cart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      cart.push(cartItem);
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Notify user
    alert('Item added to cart!');
  };
  
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p>Loading item details...</p>
      </Container>
    );
  }
  
  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
        <Button variant="primary" onClick={() => navigate('/menu')}>Back to Menu</Button>
      </Container>
    );
  }
  
  if (!menuItem) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Item not found!</Alert>
        <Button variant="primary" onClick={() => navigate('/menu')}>Back to Menu</Button>
      </Container>
    );
  }
  
  return (
    <Container className="py-5">
      <Row>
        <Col md={6} className="mb-4">
          <img 
            src={menuItem.image} 
            alt={menuItem.name} 
            className="img-fluid rounded"
            style={{ maxHeight: '400px', objectFit: 'cover', width: '100%' }}
          />
        </Col>
        
        <Col md={6}>
          <h2>{menuItem.name}</h2>
          
          {menuItem.isVegetarian && (
            <span className="badge bg-success me-2">Vegetarian</span>
          )}
          
          {menuItem.isGlutenFree && (
            <span className="badge bg-info me-2">Gluten Free</span>
          )}
          
          <p className="text-muted mt-3">{menuItem.description}</p>
          
          {menuItem.nutritionalInfo && (
            <div className="mb-4">
              <h5>Nutritional Information:</h5>
              <ul>
                <li>Calories: {menuItem.nutritionalInfo.calories}</li>
                {menuItem.nutritionalInfo.protein && <li>Protein: {menuItem.nutritionalInfo.protein}g</li>}
                {menuItem.nutritionalInfo.carbs && <li>Carbs: {menuItem.nutritionalInfo.carbs}g</li>}
                {menuItem.nutritionalInfo.fat && <li>Fat: {menuItem.nutritionalInfo.fat}g</li>}
              </ul>
            </div>
          )}
          
          <div className="mb-4">
            <h5>Quantity:</h5>
            <div className="d-flex align-items-center">
              <Button 
                variant="outline-secondary" 
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                disabled={quantity <= 1}
              >
                -
              </Button>
              <Form.Control
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                className="mx-3 text-center"
                style={{ width: '60px' }}
                min="1"
                max="10"
              />
              <Button 
                variant="outline-secondary" 
                onClick={() => quantity < 10 && setQuantity(quantity + 1)}
                disabled={quantity >= 10}
              >
                +
              </Button>
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="mb-3">Price: ${calculatePrice().toFixed(2)}</h4>
            
            <Button 
              variant="primary" 
              size="lg" 
              onClick={addToCart}
              className="me-2"
            >
              Add to Cart
            </Button>
            
            <Button 
              variant="outline-primary" 
              size="lg"
              onClick={() => navigate('/menu')}
            >
              Back to Menu
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default MenuItemDetail;