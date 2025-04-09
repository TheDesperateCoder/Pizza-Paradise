import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Tab, Nav, Table, Badge, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user is authenticated
    const user = AuthService.getCurrentUser();
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Fetch user data
    setProfile({
      firstName: user.firstName || user.user?.firstName || '',
      lastName: user.lastName || user.user?.lastName || '',
      email: user.email || user.user?.email || '',
      phone: user.contactNumber || user.user?.contactNumber || '',
      address: user.address || ''
    });
    
    // Mock orders data (replace with API call in production)
    const mockOrders = [
      {
        id: 'ORD-1234',
        date: '2023-06-15',
        total: 24.99,
        status: 'Delivered',
        items: [
          { name: 'Pepperoni Pizza', quantity: 1, price: 14.99 },
          { name: 'Garlic Bread', quantity: 1, price: 5.99 },
          { name: 'Coke', quantity: 2, price: 1.99 }
        ]
      },
      {
        id: 'ORD-5678',
        date: '2023-06-10',
        total: 32.50,
        status: 'Delivered',
        items: [
          { name: 'Hawaiian Pizza', quantity: 1, price: 16.99 },
          { name: 'Cheese Pizza', quantity: 1, price: 12.99 },
          { name: 'Ranch Dip', quantity: 1, price: 0.99 }
        ]
      },
      {
        id: 'ORD-9012',
        date: '2023-06-05',
        total: 19.99,
        status: 'Delivered',
        items: [
          { name: 'Veggie Supreme Pizza', quantity: 1, price: 15.99 },
          { name: 'Breadsticks', quantity: 1, price: 3.99 }
        ]
      }
    ];
    
    setOrders(mockOrders);
    setLoading(false);
  }, [navigate]);
  
  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };
  
  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border" role="status"></div></div>;
  }
  
  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1>My Account</h1>
        </Col>
        <Col className="text-end">
          <Button variant="outline-danger" onClick={handleLogout}>
            Logout
          </Button>
        </Col>
      </Row>
      
      {error && <Alert variant="danger">{error}</Alert>}
      
      <Row>
        <Col md={3}>
          <Card className="mb-4">
            <Card.Body>
              <div className="text-center mb-3">
                <div 
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto mb-3"
                  style={{ width: '80px', height: '80px', fontSize: '2rem' }}
                >
                  {profile.firstName && profile.lastName ? `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}` : 'U'}
                </div>
                <h5>{profile.firstName} {profile.lastName}</h5>
                <p className="text-muted mb-0">{profile.email}</p>
              </div>
            </Card.Body>
          </Card>
          
          <Card>
            <Card.Body className="p-0">
              <Nav variant="pills" className="flex-column" activeKey={activeTab}>
                <Nav.Item>
                  <Nav.Link eventKey="orders" onClick={() => setActiveTab('orders')}>
                    My Orders
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="profile" onClick={() => setActiveTab('profile')}>
                    Profile
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="addresses" onClick={() => setActiveTab('addresses')}>
                    Addresses
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="payments" onClick={() => setActiveTab('payments')}>
                    Payment Methods
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="favorites" onClick={() => setActiveTab('favorites')}>
                    Favorites
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={9}>
          <Card>
            <Card.Body>
              <Tab.Content>
                {/* Orders Tab */}
                <Tab.Pane active={activeTab === 'orders'}>
                  <h4 className="mb-4">Order History</h4>
                  {orders.length === 0 ? (
                    <p>You haven't placed any orders yet.</p>
                  ) : (
                    <>
                      {orders.map(order => (
                        <Card key={order.id} className="mb-3">
                          <Card.Header className="d-flex justify-content-between align-items-center">
                            <div>
                              <strong>Order #{order.id}</strong>
                              <span className="text-muted ms-3">{order.date}</span>
                            </div>
                            <Badge bg={
                              order.status === 'Delivered' ? 'success' : 
                              order.status === 'Processing' ? 'warning' : 
                              order.status === 'Cancelled' ? 'danger' : 'primary'
                            }>
                              {order.status}
                            </Badge>
                          </Card.Header>
                          <Card.Body>
                            <Table responsive borderless className="mb-0">
                              <thead className="border-bottom">
                                <tr>
                                  <th>Item</th>
                                  <th>Qty</th>
                                  <th className="text-end">Price</th>
                                </tr>
                              </thead>
                              <tbody>
                                {order.items.map((item, i) => (
                                  <tr key={i}>
                                    <td>{item.name}</td>
                                    <td>{item.quantity}</td>
                                    <td className="text-end">${item.price.toFixed(2)}</td>
                                  </tr>
                                ))}
                                <tr className="border-top">
                                  <td colSpan="2" className="text-end"><strong>Total:</strong></td>
                                  <td className="text-end"><strong>${order.total.toFixed(2)}</strong></td>
                                </tr>
                              </tbody>
                            </Table>
                          </Card.Body>
                          <Card.Footer className="bg-white">
                            <Button variant="outline-secondary" size="sm">
                              Reorder
                            </Button>
                          </Card.Footer>
                        </Card>
                      ))}
                    </>
                  )}
                </Tab.Pane>
                
                {/* Profile Tab */}
                <Tab.Pane active={activeTab === 'profile'}>
                  <h4 className="mb-4">Personal Information</h4>
                  <form>
                    <Row className="mb-3">
                      <Col md={6}>
                        <div className="form-group">
                          <label className="form-label">First Name</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={profile.firstName} 
                            readOnly 
                          />
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="form-group">
                          <label className="form-label">Last Name</label>
                          <input 
                            type="text" 
                            className="form-control" 
                            value={profile.lastName} 
                            readOnly
                          />
                        </div>
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col md={6}>
                        <div className="form-group">
                          <label className="form-label">Email</label>
                          <input 
                            type="email" 
                            className="form-control" 
                            value={profile.email} 
                            readOnly 
                          />
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="form-group">
                          <label className="form-label">Phone</label>
                          <input 
                            type="tel" 
                            className="form-control" 
                            value={profile.phone} 
                            readOnly 
                          />
                        </div>
                      </Col>
                    </Row>
                    <Button variant="primary">Edit Profile</Button>
                  </form>
                </Tab.Pane>
                
                {/* Addresses Tab */}
                <Tab.Pane active={activeTab === 'addresses'}>
                  <h4 className="mb-4">Saved Addresses</h4>
                  <Card className="mb-3">
                    <Card.Body>
                      <div className="d-flex justify-content-between mb-2">
                        <h6 className="fw-bold mb-0">Home</h6>
                        <div>
                          <Badge bg="success" className="me-2">Default</Badge>
                        </div>
                      </div>
                      <p className="mb-0">123 Pizza St, Cheeseville, NY 10001</p>
                      <p className="text-muted mb-0">Phone: (555) 123-4567</p>
                      <div className="mt-3">
                        <Button variant="outline-primary" size="sm" className="me-2">Edit</Button>
                        <Button variant="outline-danger" size="sm">Delete</Button>
                      </div>
                    </Card.Body>
                  </Card>
                  <Button variant="primary">Add New Address</Button>
                </Tab.Pane>
                
                {/* Payment Methods Tab */}
                <Tab.Pane active={activeTab === 'payments'}>
                  <h4 className="mb-4">Payment Methods</h4>
                  <Card className="mb-3">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center">
                          <div className="me-3">
                            <i className="far fa-credit-card fa-2x"></i>
                          </div>
                          <div>
                            <h6 className="fw-bold mb-0">Visa ending in 4567</h6>
                            <p className="text-muted mb-0">Expires 12/2025</p>
                          </div>
                        </div>
                        <div>
                          <Badge bg="success" className="me-2">Default</Badge>
                        </div>
                      </div>
                      <div className="mt-3">
                        <Button variant="outline-danger" size="sm">Remove</Button>
                      </div>
                    </Card.Body>
                  </Card>
                  <Button variant="primary">Add New Payment Method</Button>
                </Tab.Pane>
                
                {/* Favorites Tab */}
                <Tab.Pane active={activeTab === 'favorites'}>
                  <h4 className="mb-4">Favorite Items</h4>
                  <Alert variant="info">
                    You don't have any favorite items yet.
                  </Alert>
                  <Button variant="primary">Browse Menu</Button>
                </Tab.Pane>
              </Tab.Content>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;