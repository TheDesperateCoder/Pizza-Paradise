import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card, Badge, Alert, Spinner, Form } from 'react-bootstrap';
import { FaShoppingCart, FaPizzaSlice, FaArrowLeft, FaStar } from 'react-icons/fa';
import '../styles/ProductDetail.css';

const ProductDetail = () => {
  const { category, id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [relatedItems, setRelatedItems] = useState([]);

  useEffect(() => {
    // In a real app, you would fetch from your API
    // This is using the same sample data as in Menu.js
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // Sample data with enhanced menu options - using the same data structure as Menu.js
        const sampleData = [
          {
            _id: "1",
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
            _id: "2",
            name: 'Pepperoni Pizza',
            description: 'Traditional favorite with spicy pepperoni slices, mozzarella cheese, and our signature tomato sauce',
            price: 16.99,
            image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80',
            category: 'pizza',
            isVegetarian: false,
            isCustomizable: true,
            isPopular: true,
            isFeatured: true,
            rating: 4.9,
            reviews: 256
          },
          {
            _id: "3", 
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
            _id: "4",
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
            _id: "5",
            name: 'Garlic Bread',
            description: 'Freshly baked bread brushed with garlic butter and topped with herbs and parmesan',
            price: 5.99,
            image: 'https://images.unsplash.com/photo-1650436765329-78ae9a1c96bc?ixid=M3wxMjA3fDB8MXxhbGx8fHx8fHx8fHwxNzAxNzI0NjY2fA&ixlib=rb-4.0.3&utm_source=unsplash_source&utm_medium=referral&utm_campaign=api-credit',
            category: 'sides',
            isVegetarian: true,
            isCustomizable: false,
            rating: 4.3,
            reviews: 76
          },
          {
            _id: "6",
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
            _id: "7",
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
            _id: "8",
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
            _id: "9",
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
            _id: "10",
            name: 'Soda (2L)',
            description: 'Choice of Coke, Diet Coke, Sprite, or Fanta',
            price: 3.99,
            image: 'https://images.unsplash.com/photo-1543253687-c931c8932977?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
            category: 'drinks',
            isVegetarian: true,
            isCustomizable: false,
            rating: 4.2,
            reviews: 47
          }
        ];
        
        // Use string comparison since params might be strings
        const foundProduct = sampleData.find(item => item._id.toString() === id.toString() && item.category === category);
        
        if (foundProduct) {
          setProduct(foundProduct);
          
          // Find related items (same category, excluding current product)
          const related = sampleData.filter(item => 
            item.category === category && 
            item._id.toString() !== id.toString()
          ).slice(0, 3); // Get up to 3 related items
          
          setRelatedItems(related);
        } else {
          setError('Product not found.');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [category, id]);

  const handleAddToCart = () => {
    if (!product) return;

    // Get existing cart or initialize new one
    const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Add simple item
    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image,
      category: product.category,
      isCustomized: false
    };
    
    // Check if item already exists in cart
    const existingItemIndex = existingCart.findIndex(item => item.id === product.id);
    
    if (existingItemIndex !== -1) {
      // Update quantity of existing item
      existingCart[existingItemIndex].quantity += quantity;
    } else {
      // Add new item to cart
      existingCart.push(cartItem);
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart));
    
    // Show success message
    alert(`${quantity} ${product.name} added to cart!`);
  };

  const goBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
        <p>Loading product details...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
        <Button variant="outline-primary" onClick={goBack}>
          <FaArrowLeft /> Back to Menu
        </Button>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container className="py-5">
        <Alert variant="warning">Product not found.</Alert>
        <Button variant="outline-primary" onClick={() => navigate('/menu')}>
          <FaArrowLeft /> Back to Menu
        </Button>
      </Container>
    );
  }

  return (
    <div className="product-detail-page py-5">
      <Container>
        <Button 
          variant="outline-secondary" 
          onClick={goBack} 
          className="mb-4"
        >
          <FaArrowLeft /> Back
        </Button>
        
        <Row>
          <Col md={6} className="mb-4">
            <img 
              src={product.image} 
              alt={product.name} 
              className="img-fluid product-detail-image rounded"
            />
          </Col>
          <Col md={6}>
            <div>
              <h1 className="product-title">{product.name}</h1>
              
              {product.isVegetarian && (
                <Badge bg="success" className="me-2 mb-3">Vegetarian</Badge>
              )}
              {product.isGlutenFree && (
                <Badge bg="info" className="me-2 mb-3">Gluten Free</Badge>
              )}
              {product.isPopular && (
                <Badge bg="danger" className="me-2 mb-3">Popular</Badge>
              )}
              
              <div className="mb-3 d-flex align-items-center">
                <div className="text-warning me-2">
                  <FaStar /> <span>{product.rating}</span>
                </div>
                <span className="text-muted">({product.reviews} reviews)</span>
              </div>
              
              <p className="product-price h3 mb-3">${product.price.toFixed(2)}</p>
              
              <p className="product-description mb-4">{product.description}</p>
              
              <div className="mb-4">
                <Form.Group className="mb-3">
                  <Form.Label>Quantity</Form.Label>
                  <div className="d-flex" style={{ maxWidth: '150px' }}>
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </Button>
                    <Form.Control
                      type="number"
                      value={quantity}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (value > 0) {
                          setQuantity(value);
                        }
                      }}
                      className="mx-2 text-center"
                    />
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </Form.Group>
              </div>
              
              <div className="d-grid gap-2 d-md-flex mb-4">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={handleAddToCart}
                  className="px-4"
                >
                  <FaShoppingCart className="me-2" /> Add to Cart
                </Button>
                
                {product.isCustomizable && (
                  <Button 
                    variant="outline-secondary"
                    size="lg"
                    as={Link}
                    to="/pizza-builder"
                    className="px-4"
                  >
                    <FaPizzaSlice className="me-2" /> Customize
                  </Button>
                )}
              </div>
              
              <div className="mt-4">
                <h5>Details</h5>
                <ul className="list-unstyled">
                  <li>Category: <span className="text-capitalize">{product.category}</span></li>
                  {product.ingredients && (
                    <li>Ingredients: {product.ingredients.join(', ')}</li>
                  )}
                </ul>
              </div>
            </div>
          </Col>
        </Row>
        
        {/* Related Products */}
        {relatedItems.length > 0 && (
          <div className="related-products mt-5">
            <h3 className="mb-4">You might also like</h3>
            <Row>
              {relatedItems.map((item) => (
                <Col md={4} key={item.id}>
                  <Card className="h-100">
                    <Link to={`/menu/${item.category}/${item.id}`} className="text-decoration-none">
                      <Card.Img 
                        variant="top" 
                        src={item.image} 
                        alt={item.name}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    </Link>
                    <Card.Body>
                      <Link to={`/menu/${item.category}/${item.id}`} className="text-decoration-none text-dark">
                        <Card.Title>{item.name}</Card.Title>
                      </Link>
                      <Card.Text>${item.price.toFixed(2)}</Card.Text>
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => {
                          // Add to cart logic
                          const cartItem = {
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            quantity: 1,
                            image: item.image,
                            category: item.category
                          };
                          
                          const existingCart = JSON.parse(localStorage.getItem('cart')) || [];
                          const existingItemIndex = existingCart.findIndex(i => i.id === item.id);
                          
                          if (existingItemIndex !== -1) {
                            existingCart[existingItemIndex].quantity += 1;
                          } else {
                            existingCart.push(cartItem);
                          }
                          
                          localStorage.setItem('cart', JSON.stringify(existingCart));
                          alert(`${item.name} added to cart!`);
                        }}
                      >
                        Add to Cart
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}
      </Container>
    </div>
  );
};

export default ProductDetail;