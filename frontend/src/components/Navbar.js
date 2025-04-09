import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import '../components/Navbar.css'; // Using the existing Navbar.css file

function Navbar() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <>
      <button className="toggle-button" onClick={toggleSidebar}>
        <i className={isOpen ? "fas fa-times" : "fas fa-bars"}></i>
        {!isOpen && " Menu"}
      </button>
      
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <h3 className="text-center mb-4">Pizza Delivery</h3>
        <ul>
          <li>
            <Link to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
          </li>
          {user && (
            <>
              <li>
                <Link to="/pizza-builder" onClick={() => setIsOpen(false)}>Build Pizza</Link>
              </li>
              <li>
                <Link to="/order-history" onClick={() => setIsOpen(false)}>Order History</Link>
              </li>
              <li>
                <Link to="/profile" onClick={() => setIsOpen(false)}>
                  <i className="fas fa-user me-2"></i>User Profile
                </Link>
              </li>
              <li>
                <a href="#" onClick={(e) => {
                  e.preventDefault();
                  handleSignOut();
                  setIsOpen(false);
                }}>Sign Out</a>
              </li>
            </>
          )}
          {!user && (
            <li>
              <Link to="/login" onClick={() => setIsOpen(false)}>Sign In</Link>
            </li>
          )}
        </ul>
      </div>
    </>
  );
}

export default Navbar;