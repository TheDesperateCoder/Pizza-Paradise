import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function UserDashboard() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Profile state with form validation
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  
  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // For demo purposes, create mock data
        // In production, you would fetch from your API
        
        setTimeout(() => {
          // Mock user data
          if (user) {
            setProfile({
              name: user.name || 'John Doe',
              email: user.email || 'john.doe@example.com',
              phone: user.phone || '+91 9876543210',
              address: user.address || '123 Pizza Street, Foodville'
            });
          }
          
          // Mock orders data
          const mockOrders = [
            {
              id: 'ORD-5489',
              date: '2023-07-14T15:32:01Z',
              items: [
                {
                  name: 'Custom Pizza',
                  base: 'Thin Crust',
                  sauce: 'Tomato',
                  cheese: 'Mozzarella',
                  veggies: ['Mushrooms', 'Bell Peppers', 'Onions'],
                  quantity: 1,
                  price: 13.49
                }
              ],
              total: 13.49,
              status: 'Delivered',
              paymentMethod: 'Credit Card'
            },
            {
              id: 'ORD-5423',
              date: '2023-07-10T18:45:22Z',
              items: [
                {
                  name: 'Custom Pizza',
                  base: 'Cheese Burst',
                  sauce: 'BBQ',
                  cheese: 'Cheddar',
                  veggies: ['Olives', 'Tomatoes'],
                  quantity: 1,
                  price: 14.99
                }
              ],
              total: 14.99,
              status: 'Delivered',
              paymentMethod: 'Credit Card'
            },
            {
              id: 'ORD-5390',
              date: '2023-07-05T12:33:45Z',
              items: [
                {
                  name: 'Custom Pizza',
                  base: 'Whole Wheat',
                  sauce: 'Pesto',
                  cheese: 'Feta',
                  veggies: ['Spinach', 'Tomatoes', 'Olives'],
                  quantity: 1,
                  price: 15.49
                }
              ],
              total: 15.49,
              status: 'Delivered',
              paymentMethod: 'Credit Card'
            }
          ];
          
          setOrders(mockOrders);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load your data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user]);
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile({
      ...profile,
      [name]: value
    });
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!profile.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!profile.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(profile.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!profile.phone.trim()) {
      errors.phone = 'Phone number is required';
    }
    
    if (!profile.address.trim()) {
      errors.address = 'Address is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      // In production, send update request to API
      console.log('Updating profile:', profile);
      
      // Simulate API call
      setTimeout(() => {
        setIsEditing(false);
        setUpdateSuccess(true);
        
        // Hide success message after 3 seconds
        setTimeout(() => setUpdateSuccess(false), 3000);
      }, 1000);
    }
  };
  
  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading your dashboard...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="h3 mb-0">My Dashboard</h1>
            <div className="d-flex align-items-center">
              <div className="avatar bg-primary rounded-circle text-white me-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                {profile.name.charAt(0)}
              </div>
              <span>{profile.name}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-12 col-md-3 mb-4 mb-md-0">
          <div className="card border-0 shadow-sm">
            <div className="list-group list-group-flush">
              <button 
                className={`list-group-item list-group-item-action ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <i className="fas fa-shopping-bag me-2"></i> My Orders
              </button>
              <button 
                className={`list-group-item list-group-item-action ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <i className="fas fa-user me-2"></i> Profile
              </button>
              <button 
                className={`list-group-item list-group-item-action ${activeTab === 'notifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('notifications')}
              >
                <i className="fas fa-bell me-2"></i> Notifications
              </button>
              <Link to="/logout" className="list-group-item list-group-item-action text-danger">
                <i className="fas fa-sign-out-alt me-2"></i> Logout
              </Link>
            </div>
          </div>
          
          <div className="card border-0 shadow-sm mt-4 bg-light">
            <div className="card-body">
              <h5 className="card-title">Pizza Points</h5>
              <p className="display-4 fw-bold text-primary">150</p>
              <p className="text-muted">You're 50 points away from a free pizza!</p>
              <div className="progress" style={{ height: '8px' }}>
                <div className="progress-bar" role="progressbar" style={{ width: "75%" }} aria-valuenow="75" aria-valuemin="0" aria-valuemax="100"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-12 col-md-9">
          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white">
                <h5 className="mb-0">My Orders</h5>
              </div>
              <div className="card-body">
                {orders.length > 0 ? (
                  <>
                    {orders.map((order) => (
                      <div key={order.id} className="card mb-3 border-0 shadow-sm">
                        <div className="card-header bg-light">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h6 className="mb-0">Order #{order.id}</h6>
                              <small className="text-muted">
                                {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString()}
                              </small>
                            </div>
                            <span className="badge bg-success">{order.status}</span>
                          </div>
                        </div>
                        <div className="card-body">
                          {order.items.map((item, index) => (
                            <div key={index} className="mb-2">
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <h6 className="mb-1">{item.name}</h6>
                                  <p className="mb-0 text-muted small">{item.base} base, {item.sauce} sauce, {item.cheese} cheese</p>
                                  <p className="mb-0 text-muted small">
                                    Toppings: {item.veggies.join(', ')}
                                  </p>
                                </div>
                                <div className="text-end">
                                  <p className="mb-0">${item.price.toFixed(2)}</p>
                                  <p className="mb-0 text-muted small">Qty: {item.quantity}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="card-footer bg-white">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <button className="btn btn-sm btn-outline-primary me-2">Track Order</button>
                              <button className="btn btn-sm btn-outline-secondary">Reorder</button>
                            </div>
                            <div className="text-end">
                              <p className="mb-0 fw-bold">Total: ${order.total.toFixed(2)}</p>
                              <small className="text-muted">{order.paymentMethod}</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="text-center py-5">
                    <i className="fas fa-pizza-slice fa-3x mb-3 text-muted"></i>
                    <h5>No orders yet</h5>
                    <p className="text-muted">Time to order your first custom pizza!</p>
                    <Link to="/pizza-builder" className="btn btn-primary">
                      Build Your Pizza
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">My Profile</h5>
                  {!isEditing && (
                    <button 
                      className="btn btn-sm btn-outline-primary" 
                      onClick={() => setIsEditing(true)}
                    >
                      <i className="fas fa-edit me-1"></i> Edit
                    </button>
                  )}
                </div>
              </div>
              <div className="card-body">
                {updateSuccess && (
                  <div className="alert alert-success" role="alert">
                    Profile updated successfully!
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input 
                      type="text" 
                      className={`form-control ${formErrors.name ? 'is-invalid' : ''}`}
                      id="name"
                      name="name"
                      value={profile.name}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                    />
                    {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input 
                      type="email" 
                      className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      value={profile.email}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                    />
                    {formErrors.email && <div className="invalid-feedback">{formErrors.email}</div>}
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Phone</label>
                    <input 
                      type="text" 
                      className={`form-control ${formErrors.phone ? 'is-invalid' : ''}`}
                      id="phone"
                      name="phone"
                      value={profile.phone}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                    />
                    {formErrors.phone && <div className="invalid-feedback">{formErrors.phone}</div>}
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="address" className="form-label">Default Delivery Address</label>
                    <textarea 
                      className={`form-control ${formErrors.address ? 'is-invalid' : ''}`}
                      id="address"
                      name="address"
                      rows="3"
                      value={profile.address}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                    ></textarea>
                    {formErrors.address && <div className="invalid-feedback">{formErrors.address}</div>}
                  </div>
                  
                  {isEditing && (
                    <div className="d-flex justify-content-end">
                      <button 
                        type="button" 
                        className="btn btn-outline-secondary me-2"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        Save Changes
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          )}
          
          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white">
                <h5 className="mb-0">Notifications</h5>
              </div>
              <div className="card-body">
                <div className="list-group">
                  <div className="list-group-item border-0 d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">Order Status Updates</h6>
                      <p className="text-muted mb-0 small">Receive notifications when your order status changes</p>
                    </div>
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" id="orderUpdates" defaultChecked />
                    </div>
                  </div>
                  
                  <div className="list-group-item border-0 d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">Special Offers</h6>
                      <p className="text-muted mb-0 small">Receive notifications about deals and promotions</p>
                    </div>
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" id="specialOffers" defaultChecked />
                    </div>
                  </div>
                  
                  <div className="list-group-item border-0 d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">New Pizzas & Menu Items</h6>
                      <p className="text-muted mb-0 small">Be the first to know about new menu items</p>
                    </div>
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" id="newItems" />
                    </div>
                  </div>
                  
                  <div className="list-group-item border-0 d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">Email Notifications</h6>
                      <p className="text-muted mb-0 small">Receive notifications via email</p>
                    </div>
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" id="emailNotifications" defaultChecked />
                    </div>
                  </div>
                  
                  <div className="list-group-item border-0 d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">SMS Notifications</h6>
                      <p className="text-muted mb-0 small">Receive notifications via SMS</p>
                    </div>
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" id="smsNotifications" defaultChecked />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;