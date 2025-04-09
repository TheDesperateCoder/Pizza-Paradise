import React, { useState, useEffect } from 'react';
import axios from 'axios';

function UserProfile() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    address: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [savedDetails, setSavedDetails] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        // For demo purposes, load empty form
        setUser({
          name: '',
          email: '',
          address: '',
          phone: ''
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to load user profile.');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email
    if (!user.email || !validateEmail(user.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    
    try {
      setError('');
      setSuccess('');
      
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      console.log('Updating profile with email:', user.email);
      console.log('With data:', user);
      
      const response = await axios.post(`${API_URL}/api/user/update-profile-by-email`, user, {
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Profile update response:', response.data);
      setSuccess('Profile updated successfully!');
      setSavedDetails(response.data.user);
      setShowDetails(true);
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.message === 'Network Error') {
        setError('Network error: Please make sure the backend server is running and accessible.');
      } else {
        setError(`Failed to update profile: ${error.message}`);
      }
      setShowDetails(false);
    }
  };
  
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  if (loading) return (
    <div className="container mt-5">
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
        <h3 className="mt-3">Loading profile...</h3>
      </div>
    </div>
  );

  return (
    <div className="container-fluid my-3 px-3">
      <div className="row">
        <div className="col-md-10 offset-md-1">
          <div className="card shadow-lg border-0 rounded-3">
            <div className="card-header py-3" style={{ 
              background: 'linear-gradient(to right, #ff9966, #ff5e62)', 
              color: 'white',
              borderRadius: '0.5rem 0.5rem 0 0'
            }}>
              <h2 className="text-center mb-0 fw-bold fs-4">User Profile</h2>
            </div>
            <div className="card-body p-3">
              {error && <div className="alert alert-danger shadow-sm fs-6 p-2 mb-3">{error}</div>}
              {success && <div className="alert alert-success shadow-sm fs-6 p-2 mb-3">{success}</div>}
              
              {showDetails && savedDetails ? (
                <div className="saved-details mb-3">
                  <h3 className="text-center mb-3 fw-bold text-primary fs-5">Profile Details</h3>
                  <div className="card shadow-sm border-0 bg-light">
                    <div className="card-body p-3">
                      <div className="row">
                        <div className="col-lg-10 offset-lg-1">
                          {savedDetails.name && (
                            <div className="mb-3 profile-item p-2">
                              <div className="d-flex align-items-center">
                                <span className="profile-icon me-3 bg-primary text-white" style={{ width: "40px", height: "40px", fontSize: "1.2rem" }}>
                                  <i className="bi bi-person-fill"></i>
                                </span>
                                <div>
                                  <h6 className="text-muted mb-1 fs-6">Name</h6>
                                  <p className="fs-5 mb-0">{savedDetails.name}</p>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <div className="mb-3 profile-item p-2">
                            <div className="d-flex align-items-center">
                              <span className="profile-icon me-3 bg-primary text-white" style={{ width: "40px", height: "40px", fontSize: "1.2rem" }}>
                                <i className="bi bi-envelope-fill"></i>
                              </span>
                              <div>
                                <h6 className="text-muted mb-1 fs-6">Email</h6>
                                <p className="fs-5 mb-0">{savedDetails.email}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mb-3 profile-item p-2">
                            <div className="d-flex align-items-center">
                              <span className="profile-icon me-3 bg-primary text-white" style={{ width: "40px", height: "40px", fontSize: "1.2rem" }}>
                                <i className="bi bi-geo-alt-fill"></i>
                              </span>
                              <div>
                                <h6 className="text-muted mb-1 fs-6">Address</h6>
                                <p className="fs-5 mb-0">{savedDetails.address || 'Not provided'}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mb-3 profile-item p-2">
                            <div className="d-flex align-items-center">
                              <span className="profile-icon me-3 bg-primary text-white" style={{ width: "40px", height: "40px", fontSize: "1.2rem" }}>
                                <i className="bi bi-telephone-fill"></i>
                              </span>
                              <div>
                                <h6 className="text-muted mb-1 fs-6">Phone</h6>
                                <p className="fs-5 mb-0">{savedDetails.phone || 'Not provided'}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="d-flex justify-content-center mt-3">
                        <button 
                          className="btn btn-primary btn-sm px-4 py-2 rounded-pill shadow-sm fs-6" 
                          onClick={() => setShowDetails(false)}
                          style={{ minWidth: "150px" }}
                        >
                          <i className="bi bi-pencil-fill me-2"></i>
                          Edit Profile
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="form-container py-2">
                  <div className="row">
                    <div className="col-lg-10 offset-lg-1">
                      <p className="text-center text-muted mb-3 fs-6">Fill in your details below to save or update your profile information.</p>
                      
                      <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                          <label htmlFor="name" className="form-label fw-semibold fs-6 mb-1">Name</label>
                          <div className="input-group">
                            <span className="input-group-text bg-primary text-white" style={{ width: "40px" }}>
                              <i className="bi bi-person-fill fs-5"></i>
                            </span>
                            <input
                              type="text"
                              className="form-control py-2 fs-6"
                              id="name"
                              name="name"
                              placeholder="Enter your full name"
                              value={user.name || ''}
                              onChange={handleChange}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label fw-semibold fs-6 mb-1">
                            Email <span className="text-danger">*</span>
                          </label>
                          <div className="input-group">
                            <span className="input-group-text bg-primary text-white" style={{ width: "40px" }}>
                              <i className="bi bi-envelope-fill fs-5"></i>
                            </span>
                            <input
                              type="email"
                              className="form-control py-2 fs-6"
                              id="email"
                              name="email"
                              placeholder="your.email@example.com"
                              value={user.email || ''}
                              onChange={handleChange}
                              required
                            />
                          </div>
                          <small className="form-text text-muted fs-6 mt-1">We'll use this email to identify your profile</small>
                        </div>
                        
                        <div className="mb-3">
                          <label htmlFor="address" className="form-label fw-semibold fs-6 mb-1">Address</label>
                          <div className="input-group">
                            <span className="input-group-text bg-primary text-white" style={{ width: "40px" }}>
                              <i className="bi bi-geo-alt-fill fs-5"></i>
                            </span>
                            <textarea
                              className="form-control py-2 fs-6"
                              id="address"
                              name="address"
                              placeholder="Enter your delivery address"
                              value={user.address || ''}
                              onChange={handleChange}
                              rows="3"
                              style={{ minHeight: "100px" }}
                            />
                          </div>
                        </div>
                        
                        <div className="mb-3">
                          <label htmlFor="phone" className="form-label fw-semibold fs-6 mb-1">Phone</label>
                          <div className="input-group">
                            <span className="input-group-text bg-primary text-white" style={{ width: "40px" }}>
                              <i className="bi bi-telephone-fill fs-5"></i>
                            </span>
                            <input
                              type="text"
                              className="form-control py-2 fs-6"
                              id="phone"
                              name="phone"
                              placeholder="Enter your contact number"
                              value={user.phone || ''}
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        
                        <div className="d-grid mt-4">
                          <button 
                            type="submit" 
                            className="btn btn-primary py-2 rounded-pill shadow-sm fs-5"
                          >
                            <i className="bi bi-check2-circle me-2"></i>
                            Save Changes
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;