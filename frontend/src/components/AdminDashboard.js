import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';

function AdminDashboard() {
  const { user } = useUser();
  const [inventoryData, setInventoryData] = useState({
    bases: [],
    sauces: [],
    cheeses: [],
    veggies: []
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');

  const stockThresholds = {
    bases: 20,
    sauces: 15,
    cheeses: 15,
    veggies: 10
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const mockInventory = {
          bases: [
            { id: 1, name: 'Thin Crust', quantity: 45, threshold: 20 },
            { id: 2, name: 'Thick Crust', quantity: 30, threshold: 20 },
            { id: 3, name: 'Cheese Burst', quantity: 25, threshold: 20 },
            { id: 4, name: 'Whole Wheat', quantity: 15, threshold: 20 },
            { id: 5, name: 'Gluten Free', quantity: 10, threshold: 20 }
          ],
          sauces: [
            { id: 1, name: 'Tomato', quantity: 40, threshold: 15 },
            { id: 2, name: 'Pesto', quantity: 20, threshold: 15 },
            { id: 3, name: 'BBQ', quantity: 25, threshold: 15 },
            { id: 4, name: 'Alfredo', quantity: 15, threshold: 15 },
            { id: 5, name: 'Buffalo', quantity: 10, threshold: 15 }
          ],
          cheeses: [
            { id: 1, name: 'Mozzarella', quantity: 50, threshold: 15 },
            { id: 2, name: 'Cheddar', quantity: 35, threshold: 15 },
            { id: 3, name: 'Parmesan', quantity: 20, threshold: 15 },
            { id: 4, name: 'Feta', quantity: 15, threshold: 15 },
            { id: 5, name: 'Gouda', quantity: 10, threshold: 15 }
          ],
          veggies: [
            { id: 1, name: 'Mushrooms', quantity: 30, threshold: 10 },
            { id: 2, name: 'Bell Peppers', quantity: 25, threshold: 10 },
            { id: 3, name: 'Onions', quantity: 20, threshold: 10 },
            { id: 4, name: 'Olives', quantity: 15, threshold: 10 },
            { id: 5, name: 'Tomatoes', quantity: 8, threshold: 10 },
            { id: 6, name: 'Spinach', quantity: 5, threshold: 10 }
          ]
        };

        const mockOrders = [
          { id: 'ORD-001', customer: 'John Doe', items: 'Custom Pizza (Thin Crust)', total: '$15.99', status: 'Delivered', date: '2023-07-15' },
          { id: 'ORD-002', customer: 'Jane Smith', items: 'Custom Pizza (Cheese Burst)', total: '$18.99', status: 'In Kitchen', date: '2023-07-15' },
          { id: 'ORD-003', customer: 'Mike Johnson', items: 'Custom Pizza (Whole Wheat)', total: '$16.99', status: 'Order Received', date: '2023-07-15' },
          { id: 'ORD-004', customer: 'Sarah Williams', items: 'Custom Pizza (Thick Crust)', total: '$17.99', status: 'Sent to Delivery', date: '2023-07-14' },
          { id: 'ORD-005', customer: 'Robert Brown', items: 'Custom Pizza (Gluten Free)', total: '$19.99', status: 'Delivered', date: '2023-07-14' }
        ];

        setInventoryData(mockInventory);
        setRecentOrders(mockOrders);

        const lowStock = [];
        Object.entries(mockInventory).forEach(([category, items]) => {
          items.forEach(item => {
            if (item.quantity <= item.threshold) {
              lowStock.push({
                ...item,
                category: category
              });
            }
          });
        });

        setLowStockItems(lowStock);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const updateInventoryItem = async (category, itemId, newQuantity) => {
    try {
      setInventoryData(prevData => {
        const updatedItems = prevData[category].map(item => 
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        );

        return {
          ...prevData,
          [category]: updatedItems
        };
      });

      setLowStockItems(prevItems => {
        const updatedItems = [...prevItems];

        const itemIndex = updatedItems.findIndex(item => item.id === itemId && item.category === category);

        if (itemIndex !== -1) {
          const threshold = stockThresholds[category];
          if (newQuantity > threshold) {
            updatedItems.splice(itemIndex, 1);
          } else {
            updatedItems[itemIndex].quantity = newQuantity;
          }
        } else {
          const threshold = stockThresholds[category];
          if (newQuantity <= threshold) {
            const newItem = inventoryData[category].find(item => item.id === itemId);
            if (newItem) {
              updatedItems.push({
                ...newItem,
                quantity: newQuantity,
                category
              });
            }
          }
        }

        return updatedItems;
      });

    } catch (error) {
      console.error('Error updating inventory:', error);
      alert('Failed to update inventory');
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setRecentOrders(prevOrders => {
        return prevOrders.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        );
      });

    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading admin dashboard...</p>
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
    <div className="container-fluid py-4">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="h3 mb-0" style={{ color: '#ff5e62' }}>Admin Dashboard</h1>
            <div className="d-flex">
              <span className="badge bg-success me-2 p-2">Admin</span>
              <div className="dropdown">
                <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" id="adminMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                  {user?.name || 'Admin'}
                </button>
                <ul className="dropdown-menu" aria-labelledby="adminMenuButton">
                  <li><Link className="dropdown-item" to="/admin/settings">Settings</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><Link className="dropdown-item" to="/login">Logout</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-12">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`} 
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'inventory' ? 'active' : ''}`} 
                onClick={() => setActiveTab('inventory')}
              >
                Inventory
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`} 
                onClick={() => setActiveTab('orders')}
              >
                Orders
              </button>
            </li>
          </ul>
        </div>
      </div>

      {activeTab === 'overview' && (
        <>
          <div className="row mb-4">
            <div className="col-md-3 mb-4 mb-md-0">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">Total Orders</h5>
                  <p className="display-4">85</p>
                  <p className="text-success">
                    <i className="fas fa-arrow-up me-1"></i>
                    12% this week
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4 mb-md-0">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">Revenue</h5>
                  <p className="display-4">$1,254</p>
                  <p className="text-success">
                    <i className="fas fa-arrow-up me-1"></i>
                    8% this week
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-4 mb-md-0">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">Average Order</h5>
                  <p className="display-4">$18.45</p>
                  <p className="text-success">
                    <i className="fas fa-arrow-up me-1"></i>
                    3% this week
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">Low Stock Items</h5>
                  <p className="display-4">{lowStockItems.length}</p>
                  {lowStockItems.length > 0 ? (
                    <p className="text-danger">
                      <i className="fas fa-exclamation-triangle me-1"></i>
                      Needs attention
                    </p>
                  ) : (
                    <p className="text-success">
                      <i className="fas fa-check-circle me-1"></i>
                      Stock levels good
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {lowStockItems.length > 0 && (
            <div className="row mb-4">
              <div className="col-12">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-danger text-white">
                    <h5 className="mb-0">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      Low Stock Alert
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Item</th>
                            <th>Category</th>
                            <th>Current Stock</th>
                            <th>Threshold</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {lowStockItems.map(item => (
                            <tr key={`${item.category}-${item.id}`}>
                              <td>{item.name}</td>
                              <td>
                                <span className="text-capitalize">{item.category}</span>
                              </td>
                              <td>
                                <span className="text-danger fw-bold">{item.quantity}</span>
                              </td>
                              <td>{item.threshold}</td>
                              <td>
                                <div className="input-group input-group-sm">
                                  <input 
                                    type="number" 
                                    className="form-control" 
                                    defaultValue={item.quantity}
                                    min="0"
                                    onChange={(e) => {
                                      const newQuantity = parseInt(e.target.value);
                                      if (!isNaN(newQuantity) && newQuantity >= 0) {
                                        updateInventoryItem(item.category, item.id, newQuantity);
                                      }
                                    }}
                                  />
                                  <button 
                                    className="btn btn-outline-success" 
                                    type="button"
                                    onClick={() => {
                                      const newQuantity = item.quantity + 10;
                                      updateInventoryItem(item.category, item.id, newQuantity);
                                    }}
                                  >
                                    Restock
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="row">
            <div className="col-12">
              <div className="card border-0 shadow-sm">
                <div className="card-header d-flex justify-content-between align-items-center bg-light">
                  <h5 className="mb-0">Recent Orders</h5>
                  <button 
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setActiveTab('orders')}
                  >
                    View All
                  </button>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Items</th>
                          <th>Total</th>
                          <th>Status</th>
                          <th>Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.slice(0, 5).map(order => (
                          <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.customer}</td>
                            <td>{order.items}</td>
                            <td>{order.total}</td>
                            <td>
                              <span className={`badge ${
                                order.status === 'Order Received' ? 'bg-info' :
                                order.status === 'In Kitchen' ? 'bg-warning' :
                                order.status === 'Sent to Delivery' ? 'bg-primary' :
                                'bg-success'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td>{order.date}</td>
                            <td>
                              <div className="dropdown">
                                <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                  Update
                                </button>
                                <ul className="dropdown-menu">
                                  <li><button className="dropdown-item" onClick={() => updateOrderStatus(order.id, 'Order Received')}>Order Received</button></li>
                                  <li><button className="dropdown-item" onClick={() => updateOrderStatus(order.id, 'In Kitchen')}>In Kitchen</button></li>
                                  <li><button className="dropdown-item" onClick={() => updateOrderStatus(order.id, 'Sent to Delivery')}>Sent to Delivery</button></li>
                                  <li><button className="dropdown-item" onClick={() => updateOrderStatus(order.id, 'Delivered')}>Delivered</button></li>
                                </ul>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'inventory' && (
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-light">
                <h5 className="mb-0">Inventory Management</h5>
              </div>
              <div className="card-body">
                <ul className="nav nav-pills mb-3" id="pills-tab" role="tablist">
                  <li className="nav-item" role="presentation">
                    <button className="nav-link active" id="pills-base-tab" data-bs-toggle="pill" data-bs-target="#pills-base" type="button" role="tab">
                      Pizza Bases
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="nav-link" id="pills-sauce-tab" data-bs-toggle="pill" data-bs-target="#pills-sauce" type="button" role="tab">
                      Sauces
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="nav-link" id="pills-cheese-tab" data-bs-toggle="pill" data-bs-target="#pills-cheese" type="button" role="tab">
                      Cheeses
                    </button>
                  </li>
                  <li className="nav-item" role="presentation">
                    <button className="nav-link" id="pills-veggie-tab" data-bs-toggle="pill" data-bs-target="#pills-veggie" type="button" role="tab">
                      Veggies
                    </button>
                  </li>
                </ul>
                
                <div className="tab-content p-2 bg-white rounded" id="pills-tabContent">
                  <div className="tab-pane fade show active" id="pills-base" role="tabpanel">
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Current Stock</th>
                            <th>Threshold</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {inventoryData.bases.map(base => (
                            <tr key={base.id}>
                              <td>{base.id}</td>
                              <td>{base.name}</td>
                              <td>{base.quantity}</td>
                              <td>{base.threshold}</td>
                              <td>
                                {base.quantity <= base.threshold ? (
                                  <span className="badge bg-danger">Low Stock</span>
                                ) : (
                                  <span className="badge bg-success">In Stock</span>
                                )}
                              </td>
                              <td>
                                <div className="input-group input-group-sm">
                                  <input 
                                    type="number" 
                                    className="form-control" 
                                    defaultValue={base.quantity}
                                    min="0"
                                    onChange={(e) => {
                                      const newQuantity = parseInt(e.target.value);
                                      if (!isNaN(newQuantity) && newQuantity >= 0) {
                                        updateInventoryItem('bases', base.id, newQuantity);
                                      }
                                    }}
                                  />
                                  <button 
                                    className="btn btn-outline-success" 
                                    type="button"
                                    onClick={() => {
                                      updateInventoryItem('bases', base.id, base.quantity + 10);
                                    }}
                                  >
                                    Add 10
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="tab-pane fade" id="pills-sauce" role="tabpanel">
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Current Stock</th>
                            <th>Threshold</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {inventoryData.sauces.map(sauce => (
                            <tr key={sauce.id}>
                              <td>{sauce.id}</td>
                              <td>{sauce.name}</td>
                              <td>{sauce.quantity}</td>
                              <td>{sauce.threshold}</td>
                              <td>
                                {sauce.quantity <= sauce.threshold ? (
                                  <span className="badge bg-danger">Low Stock</span>
                                ) : (
                                  <span className="badge bg-success">In Stock</span>
                                )}
                              </td>
                              <td>
                                <div className="input-group input-group-sm">
                                  <input 
                                    type="number" 
                                    className="form-control" 
                                    defaultValue={sauce.quantity}
                                    min="0"
                                    onChange={(e) => {
                                      const newQuantity = parseInt(e.target.value);
                                      if (!isNaN(newQuantity) && newQuantity >= 0) {
                                        updateInventoryItem('sauces', sauce.id, newQuantity);
                                      }
                                    }}
                                  />
                                  <button 
                                    className="btn btn-outline-success" 
                                    type="button"
                                    onClick={() => {
                                      updateInventoryItem('sauces', sauce.id, sauce.quantity + 10);
                                    }}
                                  >
                                    Add 10
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="tab-pane fade" id="pills-cheese" role="tabpanel">
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Current Stock</th>
                            <th>Threshold</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {inventoryData.cheeses.map(cheese => (
                            <tr key={cheese.id}>
                              <td>{cheese.id}</td>
                              <td>{cheese.name}</td>
                              <td>{cheese.quantity}</td>
                              <td>{cheese.threshold}</td>
                              <td>
                                {cheese.quantity <= cheese.threshold ? (
                                  <span className="badge bg-danger">Low Stock</span>
                                ) : (
                                  <span className="badge bg-success">In Stock</span>
                                )}
                              </td>
                              <td>
                                <div className="input-group input-group-sm">
                                  <input 
                                    type="number" 
                                    className="form-control" 
                                    defaultValue={cheese.quantity}
                                    min="0"
                                    onChange={(e) => {
                                      const newQuantity = parseInt(e.target.value);
                                      if (!isNaN(newQuantity) && newQuantity >= 0) {
                                        updateInventoryItem('cheeses', cheese.id, newQuantity);
                                      }
                                    }}
                                  />
                                  <button 
                                    className="btn btn-outline-success" 
                                    type="button"
                                    onClick={() => {
                                      updateInventoryItem('cheeses', cheese.id, cheese.quantity + 10);
                                    }}
                                  >
                                    Add 10
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="tab-pane fade" id="pills-veggie" role="tabpanel">
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Current Stock</th>
                            <th>Threshold</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {inventoryData.veggies.map(veggie => (
                            <tr key={veggie.id}>
                              <td>{veggie.id}</td>
                              <td>{veggie.name}</td>
                              <td>{veggie.quantity}</td>
                              <td>{veggie.threshold}</td>
                              <td>
                                {veggie.quantity <= veggie.threshold ? (
                                  <span className="badge bg-danger">Low Stock</span>
                                ) : (
                                  <span className="badge bg-success">In Stock</span>
                                )}
                              </td>
                              <td>
                                <div className="input-group input-group-sm">
                                  <input 
                                    type="number" 
                                    className="form-control" 
                                    defaultValue={veggie.quantity}
                                    min="0"
                                    onChange={(e) => {
                                      const newQuantity = parseInt(e.target.value);
                                      if (!isNaN(newQuantity) && newQuantity >= 0) {
                                        updateInventoryItem('veggies', veggie.id, newQuantity);
                                      }
                                    }}
                                  />
                                  <button 
                                    className="btn btn-outline-success" 
                                    type="button"
                                    onClick={() => {
                                      updateInventoryItem('veggies', veggie.id, veggie.quantity + 10);
                                    }}
                                  >
                                    Add 10
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-light">
                <h5 className="mb-0">All Orders</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.map(order => (
                        <tr key={order.id}>
                          <td>{order.id}</td>
                          <td>{order.customer}</td>
                          <td>{order.items}</td>
                          <td>{order.total}</td>
                          <td>
                            <span className={`badge ${
                              order.status === 'Order Received' ? 'bg-info' :
                              order.status === 'In Kitchen' ? 'bg-warning' :
                              order.status === 'Sent to Delivery' ? 'bg-primary' :
                              'bg-success'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td>{order.date}</td>
                          <td>
                            <div className="dropdown">
                              <button className="btn btn-sm btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Update
                              </button>
                              <ul className="dropdown-menu">
                                <li><button className="dropdown-item" onClick={() => updateOrderStatus(order.id, 'Order Received')}>Order Received</button></li>
                                <li><button className="dropdown-item" onClick={() => updateOrderStatus(order.id, 'In Kitchen')}>In Kitchen</button></li>
                                <li><button className="dropdown-item" onClick={() => updateOrderStatus(order.id, 'Sent to Delivery')}>Sent to Delivery</button></li>
                                <li><button className="dropdown-item" onClick={() => updateOrderStatus(order.id, 'Delivered')}>Delivered</button></li>
                              </ul>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;