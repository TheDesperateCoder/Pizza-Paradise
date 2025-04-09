import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const PizzaBuilder = () => {
  const navigate = useNavigate();
  
  const [customPizza, setCustomPizza] = useState({
    size: 'medium',
    crust: 'classic',
    sauce: 'tomato',
    cheese: 'mozzarella',
    toppings: []
  });
  
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  const sizes = [
    { id: 'small', name: 'Small (10")', price: 8.99 },
    { id: 'medium', name: 'Medium (12")', price: 11.99 },
    { id: 'large', name: 'Large (14")', price: 14.99 },
    { id: 'xl', name: 'Extra Large (16")', price: 17.99 }
  ];
  
  const crusts = [
    { id: 'classic', name: 'Classic', price: 0 },
    { id: 'thin', name: 'Thin & Crispy', price: 0 },
    { id: 'thick', name: 'Thick Pan', price: 1.50 },
    { id: 'stuffed', name: 'Cheese Stuffed Crust', price: 2.50 }
  ];
  
  const sauces = [
    { id: 'tomato', name: 'Tomato', price: 0 },
    { id: 'bbq', name: 'BBQ', price: 0 },
    { id: 'garlic', name: 'Garlic Parmesan', price: 1.00 },
    { id: 'buffalo', name: 'Buffalo', price: 1.00 }
  ];
  
  const cheeses = [
    { id: 'mozzarella', name: 'Mozzarella', price: 0 },
    { id: 'cheddar', name: 'Cheddar', price: 0.50 },
    { id: 'blend', name: 'Four Cheese Blend', price: 1.00 },
    { id: 'vegan', name: 'Vegan Cheese', price: 1.50 }
  ];
  
  const toppingOptions = [
    { id: 'pepperoni', name: 'Pepperoni', price: 1.50 },
    { id: 'mushrooms', name: 'Mushrooms', price: 1.00 },
    { id: 'onions', name: 'Onions', price: 1.00 },
    { id: 'sausage', name: 'Italian Sausage', price: 1.50 },
    { id: 'bacon', name: 'Bacon', price: 1.50 },
    { id: 'peppers', name: 'Green Peppers', price: 1.00 },
    { id: 'olives', name: 'Black Olives', price: 1.00 },
    { id: 'spinach', name: 'Spinach', price: 1.00 },
    { id: 'pineapple', name: 'Pineapple', price: 1.00 },
    { id: 'ham', name: 'Ham', price: 1.50 }
  ];
  
  const handleSizeChange = (e) => {
    setCustomPizza({...customPizza, size: e.target.value});
  };
  
  const handleCrustChange = (e) => {
    setCustomPizza({...customPizza, crust: e.target.value});
  };
  
  const handleSauceChange = (e) => {
    setCustomPizza({...customPizza, sauce: e.target.value});
  };
  
  const handleCheeseChange = (e) => {
    setCustomPizza({...customPizza, cheese: e.target.value});
  };
  
  const handleToppingChange = (e) => {
    const topping = e.target.value;
    
    if (e.target.checked) {
      // Add topping
      if (customPizza.toppings.length >= 5) {
        e.target.checked = false; // Uncheck the checkbox
        setNotification({
          show: true,
          message: 'Maximum 5 toppings allowed',
          type: 'warning'
        });
        setTimeout(() => setNotification({ show: false }), 3000);
        return;
      }
      setCustomPizza({
        ...customPizza, 
        toppings: [...customPizza.toppings, topping]
      });
    } else {
      // Remove topping
      setCustomPizza({
        ...customPizza,
        toppings: customPizza.toppings.filter(item => item !== topping)
      });
    }
  };
  
  const calculatePrice = () => {
    try {
      const sizePrice = sizes.find(size => size.id === customPizza.size).price;
      const crustPrice = crusts.find(crust => crust.id === customPizza.crust).price;
      const saucePrice = sauces.find(sauce => sauce.id === customPizza.sauce).price;
      const cheesePrice = cheeses.find(cheese => cheese.id === customPizza.cheese).price;
      
      const toppingsPrice = customPizza.toppings.reduce((total, toppingId) => {
        return total + toppingOptions.find(t => t.id === toppingId).price;
      }, 0);
      
      return sizePrice + crustPrice + saucePrice + cheesePrice + toppingsPrice;
    } catch (error) {
      console.error("Error calculating pizza price:", error);
      return 0;
    }
  };
  
  const addToCart = () => {
    try {
      const selectedSize = sizes.find(size => size.id === customPizza.size);
      const selectedCrust = crusts.find(crust => crust.id === customPizza.crust);
      const selectedSauce = sauces.find(sauce => sauce.id === customPizza.sauce);
      const selectedCheese = cheeses.find(cheese => cheese.id === customPizza.cheese);
      
      const selectedToppings = customPizza.toppings.map(toppingId => {
        return toppingOptions.find(t => t.id === toppingId).name;
      });
      
      // Create pizza item for cart
      const pizzaItem = {
        id: `custom-${Date.now()}`,
        name: 'Custom Pizza',
        description: `${selectedSize.name}, ${selectedCrust.name} crust, ${selectedSauce.name} sauce, ${selectedCheese.name} cheese${selectedToppings.length > 0 ? ' with ' + selectedToppings.join(', ') : ''}`,
        price: calculatePrice(),
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
      };
      
      // Get existing cart or initialize empty array
      let existingCart = [];
      try {
        const savedCart = localStorage.getItem('cart');
        existingCart = savedCart ? JSON.parse(savedCart) : [];
        // Validate that the cart is an array
        if (!Array.isArray(existingCart)) {
          console.error('Cart is not an array:', existingCart);
          existingCart = [];
        }
      } catch (cartError) {
        console.error('Error parsing cart from localStorage:', cartError);
        existingCart = [];
      }
      
      // Add new item to cart
      const updatedCart = [...existingCart, pizzaItem];
      
      // Save to localStorage
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      
      console.log('Added to cart:', pizzaItem);
      console.log('Updated cart:', updatedCart);
      
      setNotification({
        show: true,
        message: 'Custom pizza added to cart!',
        type: 'success'
      });
      
      setTimeout(() => {
        setNotification({ show: false });
        navigate('/cart');
      }, 1500);
    } catch (error) {
      console.error("Error adding pizza to cart:", error);
      setNotification({
        show: true,
        message: 'Error adding pizza to cart. Please try again.',
        type: 'danger'
      });
      setTimeout(() => setNotification({ show: false }), 3000);
    }
  };
  
  return (
    <Container className="py-5">
      <h1 className="mb-4">Build Your Own Pizza</h1>
      
      {notification.show && (
        <Alert variant={notification.type} onClose={() => setNotification({show: false})} dismissible>
          {notification.message}
        </Alert>
      )}
      
      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Header>Customize Your Pizza</Card.Header>
            <Card.Body>
              <Form>
                {/* Size Selection */}
                <h5 className="mt-3">1. Choose Your Size</h5>
                <Row className="mb-4">
                  {sizes.map(size => (
                    <Col sm={6} md={3} key={size.id}>
                      <div className="border rounded p-3 h-100">
                        <Form.Check
                          type="radio"
                          id={`size-${size.id}`}
                          name="pizzaSize"
                          label={size.name}
                          value={size.id}
                          checked={customPizza.size === size.id}
                          onChange={handleSizeChange}
                          className="mb-2"
                        />
                        <small className="text-muted d-block">${size.price.toFixed(2)}</small>
                      </div>
                    </Col>
                  ))}
                </Row>

                {/* Crust Selection */}
                <h5 className="mt-3">2. Choose Your Crust</h5>
                <Row className="mb-4">
                  {crusts.map(crust => (
                    <Col sm={6} md={3} key={crust.id}>
                      <div className="border rounded p-3 h-100">
                        <Form.Check
                          type="radio"
                          id={`crust-${crust.id}`}
                          name="pizzaCrust"
                          label={crust.name}
                          value={crust.id}
                          checked={customPizza.crust === crust.id}
                          onChange={handleCrustChange}
                          className="mb-2"
                        />
                        {crust.price > 0 ? (
                          <small className="text-muted d-block">+${crust.price.toFixed(2)}</small>
                        ) : (
                          <small className="text-muted d-block">Included</small>
                        )}
                      </div>
                    </Col>
                  ))}
                </Row>

                {/* Sauce Selection */}
                <h5 className="mt-3">3. Choose Your Sauce</h5>
                <Row className="mb-4">
                  {sauces.map(sauce => (
                    <Col sm={6} md={3} key={sauce.id}>
                      <div className="border rounded p-3 h-100">
                        <Form.Check
                          type="radio"
                          id={`sauce-${sauce.id}`}
                          name="pizzaSauce"
                          label={sauce.name}
                          value={sauce.id}
                          checked={customPizza.sauce === sauce.id}
                          onChange={handleSauceChange}
                          className="mb-2"
                        />
                        {sauce.price > 0 ? (
                          <small className="text-muted d-block">+${sauce.price.toFixed(2)}</small>
                        ) : (
                          <small className="text-muted d-block">Included</small>
                        )}
                      </div>
                    </Col>
                  ))}
                </Row>

                {/* Cheese Selection */}
                <h5 className="mt-3">4. Choose Your Cheese</h5>
                <Row className="mb-4">
                  {cheeses.map(cheese => (
                    <Col sm={6} md={3} key={cheese.id}>
                      <div className="border rounded p-3 h-100">
                        <Form.Check
                          type="radio"
                          id={`cheese-${cheese.id}`}
                          name="pizzaCheese"
                          label={cheese.name}
                          value={cheese.id}
                          checked={customPizza.cheese === cheese.id}
                          onChange={handleCheeseChange}
                          className="mb-2"
                        />
                        {cheese.price > 0 ? (
                          <small className="text-muted d-block">+${cheese.price.toFixed(2)}</small>
                        ) : (
                          <small className="text-muted d-block">Included</small>
                        )}
                      </div>
                    </Col>
                  ))}
                </Row>

                {/* Toppings Selection */}
                <h5 className="mt-3">5. Choose Your Toppings (up to 5)</h5>
                <small className="text-muted d-block mb-3">Selected: {customPizza.toppings.length}/5</small>
                <Row className="mb-4">
                  {toppingOptions.map(topping => (
                    <Col sm={6} md={3} key={topping.id}>
                      <div className="border rounded p-3 h-100">
                        <Form.Check
                          type="checkbox"
                          id={`topping-${topping.id}`}
                          label={topping.name}
                          value={topping.id}
                          checked={customPizza.toppings.includes(topping.id)}
                          onChange={handleToppingChange}
                          className="mb-2"
                        />
                        <small className="text-muted d-block">+${topping.price.toFixed(2)}</small>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="sticky-top" style={{ top: '20px' }}>
            <Card.Header>Your Custom Pizza</Card.Header>
            <Card.Body>
              <h5>Pizza Summary</h5>
              <ul className="list-unstyled">
                <li><strong>Size:</strong> {sizes.find(size => size.id === customPizza.size).name}</li>
                <li><strong>Crust:</strong> {crusts.find(crust => crust.id === customPizza.crust).name}</li>
                <li><strong>Sauce:</strong> {sauces.find(sauce => sauce.id === customPizza.sauce).name}</li>
                <li><strong>Cheese:</strong> {cheeses.find(cheese => cheese.id === customPizza.cheese).name}</li>
                <li>
                  <strong>Toppings:</strong>
                  {customPizza.toppings.length === 0 ? (
                    <em> None selected</em>
                  ) : (
                    <ul>
                      {customPizza.toppings.map(toppingId => (
                        <li key={toppingId}>
                          {toppingOptions.find(t => t.id === toppingId).name}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              </ul>
              
              <div className="d-flex justify-content-between border-top pt-3 mt-3">
                <h5>Total Price:</h5>
                <h5>${calculatePrice().toFixed(2)}</h5>
              </div>
              
              <Button 
                variant="primary" 
                size="lg" 
                className="w-100 mt-3"
                onClick={addToCart}
              >
                Add to Cart
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PizzaBuilder;