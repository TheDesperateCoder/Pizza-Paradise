// Menu.js

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, Form, Modal, InputGroup, Nav } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaShoppingCart, FaPizzaSlice, FaSearch, FaFilter, FaStar } from 'react-icons/fa';
import '../styles/Menu.css';

const API_URL = 'http://localhost:3001/api';

const Menu = () => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [customizations, setCustomizations] = useState({
    size: 'medium',
    crust: 'regular',
    extraCheese: false,
    toppings: []
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    vegetarian: false,
    glutenFree: false,
    spicy: false,
    priceRange: [0, 50]
  });

  // Available toppings
  const availableToppings = [
    { id: 1, name: 'Pepperoni', price: 1.50 },
    { id: 2, name: 'Mushrooms', price: 1.00 },
    { id: 3, name: 'Onions', price: 0.75 },
    { id: 4, name: 'Sausage', price: 1.50 },
    { id: 5, name: 'Bell Peppers', price: 1.00 },
    { id: 6, name: 'Olives', price: 1.00 },
    { id: 7, name: 'Bacon', price: 1.75 },
    { id: 8, name: 'Extra Cheese', price: 1.50 }
  ];

  // Price modifiers
  const sizeModifiers = {
    small: -2,
    medium: 0,
    large: 3,
    'extra-large': 5
  };

  const crustModifiers = {
    thin: -1,
    regular: 0,
    thick: 1.50,
    stuffed: 3
  };

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        // In a real app, you would fetch from your API
        // const response = await axios.get(`${API_URL}/menu`);
        // setMenuItems(response.data);
        
        // Using sample data with enhanced menu options
        const sampleData = [
          {
            _id: 1,
            name: 'Margherita Pizza',
            description: 'Classic pizza with tomato sauce, fresh mozzarella, basil leaves, and a drizzle of olive oil',
            price: 14.99,
            image: 'https://images.unsplash.com/photo-1604917877934-07d8d2a5f886?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            category: 'pizza',
            isVegetarian: true,
            isCustomizable: true,
            rating: 4.7,
            reviews: 128
          },
          {
            _id: 2,
            name: 'Pepperoni Pizza',
            description: 'Traditional favorite with spicy pepperoni slices, mozzarella cheese, and our signature tomato sauce',
            price: 16.99,
            image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            category: 'pizza',
            isVegetarian: false,
            isCustomizable: true,
            isPopular: true,
            isFeatured: true,
            rating: 4.9,
            reviews: 256
          },
          {
            _id: 3,
            name: 'Vegetable Supreme',
            description: 'Loaded with bell peppers, red onions, mushrooms, black olives, tomatoes, and corn on a bed of cheese',
            price: 15.99,
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            category: 'pizza',
            isVegetarian: true,
            isGlutenFree: true,
            isCustomizable: true,
            rating: 4.5,
            reviews: 89
          },
          {
            _id: 4,
            name: 'Buffalo Wings',
            description: '10 pieces of crispy chicken wings tossed in spicy buffalo sauce, served with blue cheese dip',
            price: 12.99,
            image: 'https://images.unsplash.com/photo-1608039783021-cdf9635013a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            category: 'sides',
            isVegetarian: false,
            isSpicy: true,
            isCustomizable: false,
            rating: 4.6,
            reviews: 112
          },
          {
            _id: 5,
            name: 'Garlic Bread',
            description: 'Freshly baked bread brushed with garlic butter and topped with herbs and parmesan',
            price: 5.99,
            image: 'https://images.unsplash.com/photo-1573140401552-3fab0b24306f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            category: 'sides',
            isVegetarian: true,
            isCustomizable: false,
            rating: 4.3,
            reviews: 76
          },
          {
            _id: 6,
            name: 'Caesar Salad',
            description: 'Fresh romaine lettuce, crunchy croutons, parmesan cheese, and our creamy Caesar dressing',
            price: 8.99,
            image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            category: 'sides',
            isVegetarian: true,
            isCustomizable: false,
            rating: 4.4,
            reviews: 58
          },
          {
            _id: 7,
            name: 'Chocolate Lava Cake',
            description: 'Warm chocolate cake with a gooey molten center, served with vanilla ice cream',
            price: 7.99,
            image: 'https://images.unsplash.com/photo-1602960702059-4c9a208a989b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            category: 'desserts',
            isVegetarian: true,
            isCustomizable: false,
            rating: 4.8,
            reviews: 143
          },
          {
            _id: 8,
            name: 'Cheesecake',
            description: 'Creamy New York style cheesecake with a graham cracker crust and berry compote',
            price: 6.99,
            image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            category: 'desserts',
            isVegetarian: true,
            isCustomizable: false,
            rating: 4.7,
            reviews: 98
          },
          {
            _id: 9,
            name: 'Tiramisu',
            description: 'Classic Italian dessert with layers of coffee-soaked ladyfingers and mascarpone cream',
            price: 8.49,
            image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea2fda1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            category: 'desserts',
            isVegetarian: true,
            isCustomizable: false,
            rating: 4.9,
            reviews: 112
          },
          {
            _id: 10,
            name: 'Soda (2L)',
            description: 'Choice of Coke, Diet Coke, Sprite, or Fanta',
            price: 3.99,
            image: 'https://images.unsplash.com/photo-1543253687-c931c8932977?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            category: 'drinks',
            isVegetarian: true,
            isCustomizable: false,
            rating: 4.2,
            reviews: 47
          },
          {
            _id: 11,
            name: 'BBQ Chicken Pizza',
            description: 'Grilled chicken, red onions, and cilantro on a BBQ sauce base with mozzarella cheese',
            price: 17.99,
            image: 'https://images.unsplash.com/photo-1584365685547-9a5fb6f3a70c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            category: 'pizza',
            isVegetarian: false,
            isCustomizable: true,
            isPopular: true,
            rating: 4.8,
            reviews: 176
          },
          {
            _id: 12,
            name: 'Hawaiian Pizza',
            description: 'Sweet pineapple chunks, ham, and mozzarella cheese on a tomato base',
            price: 16.49,
            image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            category: 'pizza',
            isVegetarian: false,
            isCustomizable: true,
            rating: 4.3,
            reviews: 108
          },
          {
            _id: 13,
            name: 'Mozzarella Sticks',
            description: '8 crispy breaded mozzarella sticks served with marinara sauce',
            price: 7.49,
            image: 'https://images.unsplash.com/photo-1548340748-6d2b7d7da280?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            category: 'sides',
            isVegetarian: true,
            isCustomizable: false,
            rating: 4.5,
            reviews: 63
          },
          {
            _id: 14,
            name: 'Craft Beer',
            description: 'Selection of local craft beers (please check with server for current options)',
            price: 6.99,
            image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            category: 'drinks',
            isVegetarian: true,
            isCustomizable: false,
            rating: 4.6,
            reviews: 82
          },
          {
            _id: 15,
            name: 'Meat Lovers Pizza',
            description: 'Pepperoni, Italian sausage, ham, bacon, and ground beef on our signature sauce',
            price: 18.99,
            image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            category: 'pizza',
            isVegetarian: false,
            isCustomizable: true,
            isPopular: true,
            rating: 4.9,
            reviews: 215
          },
          {
            _id: 16,
            name: 'Greek Salad',
            description: 'Crisp lettuce, cucumber, tomatoes, red onions, olives, and feta cheese with olive oil dressing',
            price: 9.49,
            image: 'https://images.unsplash.com/photo-1608032364895-84377c50027f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            category: 'sides',
            isVegetarian: true,
            isGlutenFree: true,
            isCustomizable: false,
            rating: 4.7,
            reviews: 91
          }
        ];
        
        setMenuItems(sampleData);
        
        // Extract unique categories
        const uniqueCategories = ['all', ...new Set(sampleData.map(item => item.category))];
        setCategories(uniqueCategories);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching menu items:', err);
        setError('Failed to load menu items. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchMenuItems();
  }, []);

  // Filter items based on current filters and search term
  const getFilteredItems = () => {
    let filtered = menuItems;
    
    // Apply category filter
    if (activeCategory !== 'all') {
      filtered = filtered.filter(item => item.category === activeCategory);
    }
    
    // Apply search filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(search) || 
        item.description.toLowerCase().includes(search)
      );
    }
    
    // Apply additional filters
    if (filters.vegetarian) {
      filtered = filtered.filter(item => item.isVegetarian);
    }
    
    if (filters.glutenFree) {
      filtered = filtered.filter(item => item.isGlutenFree);
    }
    
    if (filters.spicy) {
      filtered = filtered.filter(item => item.isSpicy);
    }
    
    // Apply price filter
    filtered = filtered.filter(item => 
      item.price >= filters.priceRange[0] && 
      item.price <= filters.priceRange[1]
    );
    
    return filtered;
  };

  const filteredItems = getFilteredItems();

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
  };

  const handleCustomizeClick = (item) => {
    setSelectedItem(item);
    setCustomizations({
      size: 'medium',
      crust: 'regular',
      extraCheese: false,
      toppings: []
    });
    setQuantity(1);
    setShowCustomizeModal(true);
  };

  const handleToppingToggle = (toppingId) => {
    setCustomizations(prev => {
      const toppings = [...prev.toppings];
      
      if (toppings.includes(toppingId)) {
        // Remove topping
        return {
          ...prev,
          toppings: toppings.filter(id => id !== toppingId)
        };
      } else {
        // Add topping
        return {
          ...prev,
          toppings: [...toppings, toppingId]
        };
      }
    });
  };

  const calculateItemPrice = (item) => {
    if (!item) return 0;
    
    let price = item.price;
    
    // Add size modifier
    price += sizeModifiers[customizations.size] || 0;
    
    // Add crust modifier
    price += crustModifiers[customizations.crust] || 0;
    
    // Add extra cheese
    if (customizations.extraCheese) {
      price += 1.5;
    }
    
    // Add toppings
    customizations.toppings.forEach(toppingId => {
      const topping = availableToppings.find(t => t.id === toppingId);
      if (topping) {
        price += topping.price;
      }
    });
    
    return price * quantity;
  };

  const handleAddToCart = (item, customized = false) => {
    // Get existing cart or initialize new one
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (customized && selectedItem) {
      // Add customized item
      const customizedItem = {
        id: `${selectedItem._id}-custom-${Date.now()}`, // Unique ID for the customized item
        name: selectedItem.name,
        basePrice: selectedItem.price,
        size: customizations.size,
        crust: customizations.crust,
        extraCheese: customizations.extraCheese,
        toppings: customizations.toppings.map(id => {
          const topping = availableToppings.find(t => t.id === id);
          return {
            id: topping.id,
            name: topping.name,
            price: topping.price
          };
        }),
        price: calculateItemPrice(selectedItem),
        quantity: quantity,
        image: selectedItem.image,
        isCustomized: true,
        category: selectedItem.category
      };
      
      existingCart.push(customizedItem);
      localStorage.setItem('cart', JSON.stringify(existingCart));
      setShowCustomizeModal(false);
      
      // Show success message
      alert('Customized item added to cart!');
    } else {
      // Add simple item
      const cartItem = {
        id: item._id,
        name: item.name,
        price: item.price,
        quantity: 1,
        image: item.image,
        category: item.category,
        isCustomized: false
      };
      
      // Check if item already exists in cart
      const existingItemIndex = existingCart.findIndex(cartItem => cartItem.id === item._id);
      
      if (existingItemIndex !== -1) {
        // Update quantity of existing item
        existingCart[existingItemIndex].quantity += 1;
      } else {
        // Add new item to cart
        existingCart.push(cartItem);
      }
      
      localStorage.setItem('cart', JSON.stringify(existingCart));
      
      // Show success message
      alert('Item added to cart!');
    }
  };

  const viewItemDetails = (item) => {
    navigate(`/menu/${item.category}/${item._id}`);
  };

  const featuredItems = menuItems.filter(item => item.isFeatured);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p>Loading menu items...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <div className="menu-page">
      {/* Enhanced Menu Hero Section */}
      <div className="menu-hero text-center">
        <Container>
          <h1 className="display-4 fw-bold mb-3">Our Delicious Menu</h1>
          <p className="lead mb-4">Handcrafted pizzas and more, made with fresh ingredients daily</p>
          <div className="search-container mx-auto mb-3" style={{ maxWidth: '600px' }}>
            <InputGroup>
              <Form.Control
                placeholder="Search for items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="py-2"
              />
              <Button variant="primary">
                <FaSearch />
              </Button>
              <Button 
                variant="outline-secondary"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter />
              </Button>
            </InputGroup>
          </div>
        </Container>
      </div>

      <Container>
        {/* Filter Options */}
        {showFilters && (
          <Card className="mb-4 filter-card">
            <Card.Body>
              <h5 className="mb-3">Filter Options</h5>
              <Row>
                <Col md={4}>
                  <Form.Check
                    type="checkbox"
                    id="filter-vegetarian"
                    label="Vegetarian"
                    checked={filters.vegetarian}
                    onChange={() => setFilters({...filters, vegetarian: !filters.vegetarian})}
                    className="mb-2"
                  />
                  <Form.Check
                    type="checkbox"
                    id="filter-gluten-free"
                    label="Gluten Free"
                    checked={filters.glutenFree}
                    onChange={() => setFilters({...filters, glutenFree: !filters.glutenFree})}
                    className="mb-2"
                  />
                  <Form.Check
                    type="checkbox"
                    id="filter-spicy"
                    label="Spicy"
                    checked={filters.spicy}
                    onChange={() => setFilters({...filters, spicy: !filters.spicy})}
                    className="mb-2"
                  />
                </Col>
                <Col md={8}>
                  <label>Price Range: ${filters.priceRange[0]} - ${filters.priceRange[1]}</label>
                  <div className="d-flex">
                    <Form.Control
                      type="range"
                      min="0"
                      max="50"
                      step="1"
                      value={filters.priceRange[0]}
                      onChange={(e) => setFilters({
                        ...filters, 
                        priceRange: [parseInt(e.target.value), filters.priceRange[1]]
                      })}
                      className="me-2"
                    />
                    <Form.Control
                      type="range"
                      min="0"
                      max="50"
                      step="1"
                      value={filters.priceRange[1]}
                      onChange={(e) => setFilters({
                        ...filters,
                        priceRange: [filters.priceRange[0], parseInt(e.target.value)]
                      })}
                    />
                  </div>
                </Col>
              </Row>
              <div className="mt-3 text-end">
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  onClick={() => setFilters({
                    vegetarian: false,
                    glutenFree: false,
                    spicy: false,
                    priceRange: [0, 50]
                  })}
                  className="me-2"
                >
                  Reset Filters
                </Button>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => setShowFilters(false)}
                >
                  Apply
                </Button>
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Featured Items Carousel (if any featured items exist) */}
        {featuredItems.length > 0 && (
          <div className="mb-5">
            <h2 className="mb-3">Featured Items</h2>
            <Row className="featured-row">
              {featuredItems.map(item => (
                <Col key={`featured-${item._id}`} md={6} lg={4} className="mb-4">
                  <Card className="h-100 shadow featured-card">
                    <div className="position-relative">
                      <Card.Img 
                        variant="top" 
                        src={item.image} 
                        alt={item.name}
                        style={{ height: '250px', objectFit: 'cover' }}
                        onClick={() => viewItemDetails(item)}
                        className="cursor-pointer"
                      />
                      <Badge 
                        bg="danger" 
                        className="position-absolute top-0 end-0 m-2 px-3 py-2"
                      >
                        Featured
                      </Badge>
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="cursor-pointer h4" onClick={() => viewItemDetails(item)}>
                        {item.name}
                      </Card.Title>
                      <div className="mb-2 text-warning d-flex align-items-center">
                        <FaStar /> <span className="ms-1">{item.rating}</span>
                        <span className="ms-2 text-muted">({item.reviews} reviews)</span>
                      </div>
                      <Card.Text>{item.description}</Card.Text>
                      <div className="mt-auto">
                        <p className="h5 mb-3">${item.price.toFixed(2)}</p>
                        <div className="d-flex">
                          <Button 
                            variant="primary"
                            className="flex-grow-1 me-2"
                            onClick={() => handleAddToCart(item)}
                          >
                            <FaShoppingCart className="me-1" /> Add to Cart
                          </Button>
                          
                          {item.isCustomizable && (
                            <Button 
                              variant="outline-secondary"
                              onClick={() => handleCustomizeClick(item)}
                            >
                              <FaPizzaSlice className="me-1" /> Customize
                            </Button>
                          )}
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}

        {/* Category Navigation - Updated as fixed tabs */}
        <Nav variant="tabs" className="mb-4 category-tabs">
          {categories.map((category) => (
            <Nav.Item key={category}>
              <Nav.Link 
                active={activeCategory === category}
                onClick={() => handleCategoryChange(category)}
                className="text-capitalize"
              >
                {category}
              </Nav.Link>
            </Nav.Item>
          ))}
        </Nav>
        
        {/* Menu Items - with updated cards */}
        <Row>
          {filteredItems.length === 0 ? (
            <Col>
              <Alert variant="info">No items found matching your criteria.</Alert>
            </Col>
          ) : (
            filteredItems.map((item) => (
              <Col key={item._id} md={6} lg={4} className="mb-4">
                <MenuItem item={item} />
              </Col>
            ))
          )}
        </Row>

        {/* Bottom banner */}
        <div className="promo-banner my-5 p-4 text-center rounded">
          <h3>Want to save on your favorite orders?</h3>
          <p className="mb-3">Check out our special deals and promotions!</p>
          <Button as={Link} to="/deals" variant="outline-light" size="lg">
            View Deals
          </Button>
        </div>
      </Container>
      
      {/* Customize Modal */}
      <Modal 
        show={showCustomizeModal} 
        onHide={() => setShowCustomizeModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Customize Your {selectedItem?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedItem && (
            <>
              <Row className="mb-4">
                <Col md={4}>
                  <img 
                    src={selectedItem.image} 
                    alt={selectedItem.name} 
                    className="img-fluid rounded"
                  />
                </Col>
                <Col md={8}>
                  <h5>{selectedItem.name}</h5>
                  <p>{selectedItem.description}</p>
                  <div className="d-flex align-items-center">
                    <h5 className="mb-0 me-3">
                      ${calculateItemPrice(selectedItem).toFixed(2)}
                    </h5>
                    <div className="d-flex align-items-center">
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        -
                      </Button>
                      <Form.Control
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (value > 0 && value <= 10) {
                            setQuantity(value);
                          }
                        }}
                        className="mx-2 text-center"
                        style={{ width: '60px' }}
                        min="1"
                        max="10"
                      />
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => setQuantity(Math.min(10, quantity + 1))}
                        disabled={quantity >= 10}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </Col>
              </Row>
              
              <h5>Choose Size</h5>
              <Form.Group className="mb-3">
                <div className="d-flex flex-wrap">
                  {['small', 'medium', 'large', 'extra-large'].map((size) => (
                    <Form.Check
                      key={size}
                      type="radio"
                      id={`size-${size}`}
                      label={`${size.charAt(0).toUpperCase() + size.slice(1)} ${sizeModifiers[size] > 0 ? `(+$${sizeModifiers[size].toFixed(2)})` : sizeModifiers[size] < 0 ? `(-$${Math.abs(sizeModifiers[size]).toFixed(2)})` : ''}`}
                      name="size"
                      checked={customizations.size === size}
                      onChange={() => setCustomizations({...customizations, size})}
                      className="me-3 mb-2"
                    />
                  ))}
                </div>
              </Form.Group>
              
              <h5>Choose Crust</h5>
              <Form.Group className="mb-3">
                <div className="d-flex flex-wrap">
                  {['thin', 'regular', 'thick', 'stuffed'].map((crust) => (
                    <Form.Check
                      key={crust}
                      type="radio"
                      id={`crust-${crust}`}
                      label={`${crust.charAt(0).toUpperCase() + crust.slice(1)} ${crustModifiers[crust] > 0 ? `(+$${crustModifiers[crust].toFixed(2)})` : crustModifiers[crust] < 0 ? `(-$${Math.abs(crustModifiers[crust]).toFixed(2)})` : ''}`}
                      name="crust"
                      checked={customizations.crust === crust}
                      onChange={() => setCustomizations({...customizations, crust})}
                      className="me-3 mb-2"
                    />
                  ))}
                </div>
              </Form.Group>
              
              <h5>Extra Cheese</h5>
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  id="extra-cheese"
                  label="Add extra cheese (+$1.50)"
                  checked={customizations.extraCheese}
                  onChange={() => setCustomizations({
                    ...customizations, 
                    extraCheese: !customizations.extraCheese
                  })}
                />
              </Form.Group>
              
              <h5>Additional Toppings</h5>
              <Form.Group className="mb-3">
                <Row>
                  {availableToppings.map((topping) => (
                    <Col md={6} key={topping.id}>
                      <Form.Check
                        type="checkbox"
                        id={`topping-${topping.id}`}
                        label={`${topping.name} (+$${topping.price.toFixed(2)})`}
                        checked={customizations.toppings.includes(topping.id)}
                        onChange={() => handleToppingToggle(topping.id)}
                        className="mb-2"
                      />
                    </Col>
                  ))}
                </Row>
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <div className="w-100 d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              Total: ${calculateItemPrice(selectedItem).toFixed(2)}
            </h5>
            <div>
              <Button 
                variant="secondary" 
                onClick={() => setShowCustomizeModal(false)}
                className="me-2"
              >
                Cancel
              </Button>
              <Button 
                variant="primary"
                onClick={() => handleAddToCart(null, true)}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

const MenuItem = ({ item }) => {
  const navigate = useNavigate();

  const handleItemClick = () => {
    // Ensure we're using item._id for consistency with the sample data
    navigate(`/menu/${item.category}/${item._id}`);
  };

  const addToCart = (e) => {
    e.stopPropagation(); // Prevent navigation to detail page
    
    const cartItem = {
      id: item._id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      category: item.category
    };
    
    // Get existing cart from localStorage
    const existingCart = localStorage.getItem('cart');
    let cart = existingCart ? JSON.parse(existingCart) : [];
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(i => i.id === cartItem.id);
    
    if (existingItemIndex !== -1) {
      // Update quantity of existing item
      cart[existingItemIndex].quantity += 1;
    } else {
      // Add new item to cart
      cart.push(cartItem);
    }
    
    // Save updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Show notification
    alert(`${item.name} added to cart!`);
  };

  return (
    <Card className="h-100 menu-item-card" onClick={handleItemClick}>
      <Card.Img 
        variant="top" 
        src={item.image} 
        alt={item.name} 
        className="menu-item-image"
      />
      <Card.Body>
        <Card.Title>{item.name}</Card.Title>
        <Card.Text className="text-muted small">{item.description}</Card.Text>
        <div className="d-flex justify-content-between align-items-center">
          <span className="fw-bold">${item.price.toFixed(2)}</span>
          <div>
            {item.category === 'pizza' ? (
              <Button 
                as={Link} 
                to="/pizza-builder"
                variant="primary" 
                size="sm"
                onClick={(e) => e.stopPropagation()}
              >
                Customize
              </Button>
            ) : (
              <Button 
                variant="primary" 
                size="sm" 
                onClick={addToCart}
              >
                Add to Cart
              </Button>
            )}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Menu;