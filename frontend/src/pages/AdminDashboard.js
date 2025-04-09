import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Nav, Card, Table, Badge, Button, Modal, Form } from 'react-bootstrap';
import { FaPizzaSlice, FaClipboardList, FaUsers, FaWarehouse, FaCog, FaSignOutAlt } from 'react-icons/fa';
import AuthService from '../services/AuthService';
import '../styles/AdminDashboard.css';

// Admin dashboard sub-components
const Overview = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalUsers: 0,
    revenue: 0
  });

  useEffect(() => {
    // Sample data - would be replaced with API calls
    setStats({
      totalOrders: 156,
      pendingOrders: 12,
      totalUsers: 85,
      revenue: 4328.75
    });
  }, []);

  return (
    <div className="overview-container">
      <h2 className="section-title">Dashboard Overview</h2>
      
      <Row className="stats-cards">
        <Col md={3} sm={6} className="mb-4">
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-icon orders-icon">
                <FaClipboardList />
              </div>
              <div className="stat-details">
                <h3>{stats.totalOrders}</h3>
                <p>Total Orders</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} sm={6} className="mb-4">
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-icon pending-icon">
                <FaPizzaSlice />
              </div>
              <div className="stat-details">
                <h3>{stats.pendingOrders}</h3>
                <p>Pending Orders</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} sm={6} className="mb-4">
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-icon users-icon">
                <FaUsers />
              </div>
              <div className="stat-details">
                <h3>{stats.totalUsers}</h3>
                <p>Registered Users</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3} sm={6} className="mb-4">
          <Card className="stat-card">
            <Card.Body>
              <div className="stat-icon revenue-icon">
                <span>$</span>
              </div>
              <div className="stat-details">
                <h3>${stats.revenue.toFixed(2)}</h3>
                <p>Total Revenue</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col lg={8} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">Recent Orders</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>#ORD123</td>
                    <td>John Doe</td>
                    <td>10 Jul 2023, 14:30</td>
                    <td>$35.75</td>
                    <td><Badge bg="warning">Preparing</Badge></td>
                    <td>
                      <Button size="sm" variant="outline-primary">View</Button>
                    </td>
                  </tr>
                  <tr>
                    <td>#ORD122</td>
                    <td>Alice Smith</td>
                    <td>10 Jul 2023, 13:15</td>
                    <td>$24.50</td>
                    <td><Badge bg="info">Order Received</Badge></td>
                    <td>
                      <Button size="sm" variant="outline-primary">View</Button>
                    </td>
                  </tr>
                  <tr>
                    <td>#ORD121</td>
                    <td>Bob Johnson</td>
                    <td>10 Jul 2023, 12:45</td>
                    <td>$42.25</td>
                    <td><Badge bg="success">Delivered</Badge></td>
                    <td>
                      <Button size="sm" variant="outline-primary">View</Button>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
            <Card.Footer>
              <Link to="/admin/orders">View All Orders</Link>
            </Card.Footer>
          </Card>
        </Col>
        
        <Col lg={4} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">Popular Items</h5>
            </Card.Header>
            <Card.Body>
              <ul className="popular-items">
                <li>
                  <div className="item-name">Margherita Pizza</div>
                  <div className="item-count">36 orders</div>
                </li>
                <li>
                  <div className="item-name">Pepperoni Pizza</div>
                  <div className="item-count">29 orders</div>
                </li>
                <li>
                  <div className="item-name">BBQ Chicken Pizza</div>
                  <div className="item-count">24 orders</div>
                </li>
                <li>
                  <div className="item-name">Veggie Delight</div>
                  <div className="item-count">18 orders</div>
                </li>
                <li>
                  <div className="item-name">Cheese Garlic Bread</div>
                  <div className="item-count">15 orders</div>
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Sample data - would be replaced with API calls
    const dummyOrders = [
      { id: 'ORD123', customer: 'John Doe', date: '2023-07-10T14:30:00', total: 35.75, status: 'Preparing' },
      { id: 'ORD122', customer: 'Alice Smith', date: '2023-07-10T13:15:00', total: 24.50, status: 'Order Received' },
      { id: 'ORD121', customer: 'Bob Johnson', date: '2023-07-10T12:45:00', total: 42.25, status: 'Delivered' },
      { id: 'ORD120', customer: 'Emma Wilson', date: '2023-07-10T11:20:00', total: 29.99, status: 'Out for Delivery' },
      { id: 'ORD119', customer: 'Michael Brown', date: '2023-07-09T19:45:00', total: 18.50, status: 'Delivered' }
    ];
    
    setOrders(dummyOrders);
    setLoading(false);
  }, []);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Order Received': return <Badge bg="info">Order Received</Badge>;
      case 'Preparing': return <Badge bg="warning">Preparing</Badge>;
      case 'Out for Delivery': return <Badge bg="primary">Out for Delivery</Badge>;
      case 'Delivered': return <Badge bg="success">Delivered</Badge>;
      case 'Cancelled': return <Badge bg="danger">Cancelled</Badge>;
      default: return <Badge bg="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
  };

  return (
    <div className="orders-container">
      <h2 className="section-title">Order Management</h2>
      
      <Card>
        <Card.Body>
          <div className="d-flex justify-content-between mb-4">
            <Form.Control 
              type="text" 
              placeholder="Search orders..." 
              style={{ maxWidth: '250px' }} 
            />
            <div>
              <Button variant="outline-secondary" className="me-2">Filter</Button>
              <Button variant="outline-secondary">Export</Button>
            </div>
          </div>

          {loading ? (
            <p>Loading orders...</p>
          ) : (
            <Table responsive striped>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date & Time</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{formatDate(order.date)}</td>
                    <td>${order.total.toFixed(2)}</td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td>
                      <Button size="sm" variant="outline-primary" className="me-2">View</Button>
                      <Button size="sm" variant="outline-secondary">Update</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

const Users = () => {
  return (
    <div className="users-container">
      <h2 className="section-title">User Management</h2>
      <Card>
        <Card.Body>
          <p>User management functionality goes here</p>
        </Card.Body>
      </Card>
    </div>
  );
};

const Inventory = () => {
  return (
    <div className="inventory-container">
      <h2 className="section-title">Inventory Management</h2>
      <Card>
        <Card.Body>
          <p>Inventory management functionality goes here</p>
        </Card.Body>
      </Card>
    </div>
  );
};

const Settings = () => {
  return (
    <div className="settings-container">
      <h2 className="section-title">Admin Settings</h2>
      <Card>
        <Card.Body>
          <p>Settings functionality goes here</p>
        </Card.Body>
      </Card>
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  
  useEffect(() => {
    // Check if user is admin
    const currentAdmin = AuthService.getCurrentAdmin();
    if (!currentAdmin || !currentAdmin.role || currentAdmin.role !== 'admin') {
      navigate('/login');
    }
  }, [navigate]);
  
  const handleLogout = () => {
    AuthService.logout();
    setShowLogoutModal(false);
    navigate('/login');
  };

  return (
    <div className="admin-dashboard">
      <Container fluid>
        <Row>
          {/* Sidebar */}
          <Col md={3} lg={2} className="admin-sidebar">
            <div className="sidebar-header">
              <h3>Pizza Admin</h3>
            </div>
            <Nav className="flex-column sidebar-nav">
              <Nav.Link 
                as={Link} 
                to="/admin" 
                className={location.pathname === '/admin' ? 'active' : ''}
              >
                <FaPizzaSlice className="nav-icon" /> Dashboard
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/admin/orders" 
                className={location.pathname === '/admin/orders' ? 'active' : ''}
              >
                <FaClipboardList className="nav-icon" /> Orders
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/admin/users" 
                className={location.pathname === '/admin/users' ? 'active' : ''}
              >
                <FaUsers className="nav-icon" /> Users
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/admin/inventory" 
                className={location.pathname === '/admin/inventory' ? 'active' : ''}
              >
                <FaWarehouse className="nav-icon" /> Inventory
              </Nav.Link>
              <Nav.Link 
                as={Link} 
                to="/admin/settings" 
                className={location.pathname === '/admin/settings' ? 'active' : ''}
              >
                <FaCog className="nav-icon" /> Settings
              </Nav.Link>
              <Nav.Link 
                onClick={() => setShowLogoutModal(true)}
                className="logout-link"
              >
                <FaSignOutAlt className="nav-icon" /> Logout
              </Nav.Link>
            </Nav>
          </Col>
          
          {/* Main content */}
          <Col md={9} lg={10} className="admin-content">
            <div className="content-wrapper">
              <Routes>
                <Route path="/" element={<Overview />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/users" element={<Users />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </div>
          </Col>
        </Row>
      </Container>
      
      {/* Logout Modal */}
      <Modal show={showLogoutModal} onHide={() => setShowLogoutModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to logout from the admin dashboard?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLogoutModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;