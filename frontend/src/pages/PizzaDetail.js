import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert, Form } from 'react-bootstrap';
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const PizzaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pizza, setPizza] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  
  useEffect(() => {
    const fetchPizza = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/menu/${id}`);
        setPizza(response.data);
        
        // Set default size
        if (response.data.sizes && response.data.sizes.length > 0) {
          setSelectedSize(response.data.sizes[0]);
        }
      } catch (err) {
        console.error('Error fetching pizza details:', err);
        setError('Failed to load pizza details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPizza();
  }, [id]);
  
  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 10) {
      setQuantity(value);
    }
  };
  
  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };
  
  const calculatePrice = () => {
    if (!pizza) return 0;
    
    let basePrice = pizza.price;
    if (selectedSize && selectedSize.priceModifier) {
      basePrice += selectedSize.priceModifier;
    }
    
    return basePrice * quantity;
  };
  
  const addToCart = () => {
    const cartItem = {
      id: pizza._id,
      name: pizza.name,
      price: calculatePrice() / quantity,
      quantity,
      image: pizza.image,
      size: selectedSize ? selectedSize.name : null
    };
    
    // Get existing cart from localStorage
    const existingCart = localStorage.getItem('cart');
    let cart = existingCart ? JSON.parse(existingCart) : [];
    
    // Check if item already exists in cart with same size
    const existingItemIndex = cart.findIndex(
      item => item.id === cartItem.id && item.size === cartItem.size
    );
    
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
        <p>Loading pizza details...</p>
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
  
  if (!pizza) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Pizza not found!</Alert>
        <Button variant="primary" onClick={() => navigate('/menu')}>Back to Menu</Button>
      </Container>
    );
  }
  
  return (
    <Container className="py-5">
      <Row>
        <Col md={6} className="mb-4">
          <img 
            src={pizza.image} 
            alt={pizza.name} 
            className="img-fluid rounded"
            style={{ maxHeight: '400px', objectFit: 'cover', width: '100%' }}
          />
        </Col>
        
        <Col md={6}>
          <h2>{pizza.name}</h2>
          
          {pizza.isVegetarian && (
            <span className="badge bg-success me-2">Vegetarian</span>
          )}
          
          {pizza.isSpicy && (
            <span className="badge bg-danger me-2">Spicy</span>
          )}
          
          <p className="text-muted mt-3">{pizza.description}</p>
          
          <div className="mb-4">
            <h5>Ingredients:</h5>
            <ul>
              {pizza.ingredients && pizza.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
          
          {pizza.sizes && pizza.sizes.length > 0 && (
            <div className="mb-4">
              <h5>Size:</h5>
              <div className="d-flex flex-wrap">
                {pizza.sizes.map((size, index) => (
                  <Button
                    key={index}
                    variant={selectedSize && selectedSize.name === size.name ? "primary" : "outline-primary"}
                    className="me-2 mb-2"
                    onClick={() => handleSizeChange(size)}
                  >
                    {size.name} {size.priceModifier > 0 && `(+$${size.priceModifier.toFixed(2)})`}
                  </Button>
                ))}
              </div>
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

export default PizzaDetail;