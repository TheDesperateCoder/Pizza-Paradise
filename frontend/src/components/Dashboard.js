import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function Dashboard() {
  const { user } = useUser();
  const [popularItems, setPopularItems] = useState([
    { 
      id: 1, 
      name: 'Margherita Pizza', 
      description: 'Classic cheese pizza with tomato sauce', 
      imageUrl: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    { 
      id: 2, 
      name: 'Pepperoni Pizza', 
      description: 'Tomato sauce, mozzarella, and pepperoni', 
      imageUrl: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    },
    { 
      id: 3, 
      name: 'Vegetarian Pizza', 
      description: 'Loaded with fresh vegetables and cheese', 
      imageUrl: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
    }
  ]);
  
  return (
    <div className="container-fluid py-3" style={{ maxWidth: '75%', margin: '0 auto' }}>
      <header className="text-center mb-3">
        <h2 className="fw-bold" style={{ color: '#ff5e62' }}>
          Welcome{user?.name ? `, ${user.name}` : ''}!
        </h2>
        <p className="text-muted small">What would you like to order today?</p>
      </header>

      <section className="row mb-3">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body p-3">
              <h3 className="mb-3 fs-5 fw-bold">Quick Actions</h3>
              <div className="row g-2">
                <div className="col-md-4">
                  <Link to="/pizza-builder" className="text-decoration-none">
                    <div className="card h-100 bg-light border-0 shadow-sm text-center p-2 hover-card">
                      <div className="card-body">
                        <i className="fas fa-pizza-slice fa-2x mb-2" style={{ color: '#ff5e62' }}></i>
                        <h4 className="card-title fs-6">Build Your Pizza</h4>
                        <p className="card-text text-muted small">Create your perfect pizza with custom toppings.</p>
                      </div>
                    </div>
                  </Link>
                </div>
                
                <div className="col-md-4">
                  <Link to="/order-history" className="text-decoration-none">
                    <div className="card h-100 bg-light border-0 shadow-sm text-center p-2 hover-card">
                      <div className="card-body">
                        <i className="fas fa-history fa-2x mb-2" style={{ color: '#ff5e62' }}></i>
                        <h4 className="card-title fs-6">Order History</h4>
                        <p className="card-text text-muted small">View your past orders and reorder favorites.</p>
                      </div>
                    </div>
                  </Link>
                </div>
                
                <div className="col-md-4">
                  <Link to="/profile" className="text-decoration-none">
                    <div className="card h-100 bg-light border-0 shadow-sm text-center p-2 hover-card">
                      <div className="card-body">
                        <i className="fas fa-user fa-2x mb-2" style={{ color: '#ff5e62' }}></i>
                        <h4 className="card-title fs-6">My Profile</h4>
                        <p className="card-text text-muted small">Update your delivery address and preferences.</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="row mb-3">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body p-3">
              <h3 className="mb-3 fs-5 fw-bold">Popular Pizzas</h3>
              <div className="row g-2">
                {popularItems.map(item => (
                  <div key={item.id} className="col-md-4">
                    <div className="card h-100 border-0 shadow-sm overflow-hidden">
                      {item.imageUrl && (
                        <img 
                          src={item.imageUrl} 
                          alt={item.name} 
                          className="card-img-top" 
                          style={{ height: '150px', objectFit: 'cover' }}
                        />
                      )}
                      <div className="card-body p-2">
                        <h4 className="card-title fs-6">{item.name}</h4>
                        <p className="card-text text-muted small">{item.description}</p>
                        <Link to="/pizza-builder" className="btn btn-sm btn-primary" style={{ backgroundColor: '#ff5e62', borderColor: '#ff5e62' }}>
                          Order Now
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .hover-card {
          transition: all 0.3s ease;
        }
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </div>
  );
}

export default Dashboard;