import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/axios';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        const response = await API.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });
        
        console.log('Login successful:', response.data);
        
        // Store user data and token in localStorage
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
        
        // Redirect based on user role
        if (response.data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
        
      } catch (error) {
        console.error('Login error details:', error);
        setErrors({
          submit: error.response?.data?.message || 'Invalid email or password'
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="container-fluid py-5" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <div className="row justify-content-center">
        <div className="col-md-5 col-lg-4">
          <div className="card shadow border-0 rounded-3 overflow-hidden">
            {/* Card Header */}
            <div className="card-header text-center p-4" style={{ 
              background: 'linear-gradient(135deg, #FF5F6D 0%, #FFC371 100%)',
              borderBottom: '3px solid #FF5F6D'
            }}>
              <div className="mb-3">
                <img 
                  src="https://img.icons8.com/color/96/000000/pizza.png" 
                  alt="Pizza Logo" 
                  style={{ height: '70px', width: 'auto' }}
                />
              </div>
              <h3 className="text-white mb-1">Welcome Back!</h3>
              <p className="text-white small mb-0">Sign in to your pizza paradise</p>
            </div>
            
            {/* Card Body */}
            <div className="card-body p-4">
              {errors.submit && (
                <div className="alert alert-danger" role="alert">
                  {errors.submit}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                {/* Email Field */}
                <div className="mb-3">
                  <label htmlFor="email" className="form-label small fw-bold">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-envelope"></i>
                    </span>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                </div>
                
                {/* Password Field */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <label htmlFor="password" className="form-label small fw-bold">Password</label>
                    <Link to="/forgot-password" className="text-decoration-none small" style={{ color: '#FF5F6D' }}>Forgot password?</Link>
                  </div>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-lock"></i>
                    </span>
                    <input
                      type="password"
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                  </div>
                </div>
                
                {/* Remember Me Checkbox */}
                <div className="form-check mb-4">
                  <input className="form-check-input" type="checkbox" id="rememberMe" />
                  <label className="form-check-label small" htmlFor="rememberMe">
                    Remember me
                  </label>
                </div>
                
                {/* Submit Button */}
                <div className="d-grid mb-4">
                  <button
                    type="submit"
                    className="btn py-2"
                    disabled={isSubmitting}
                    style={{
                      background: 'linear-gradient(135deg, #FF5F6D 0%, #FFC371 100%)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50px',
                      fontWeight: 'bold',
                      letterSpacing: '1px'
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing in...
                      </>
                    ) : 'Sign In'}
                  </button>
                </div>

                <div className="text-center">
                  <p className="mb-2 small">Don't have an account? 
                    <Link to="/register" style={{ color: '#FF5F6D', marginLeft: '5px', textDecoration: 'none', fontWeight: 'bold' }}>
                      Sign up
                    </Link>
                  </p>
                </div>

                <div className="d-grid gap-2 mt-2">
                  <Link 
                    to="/register" 
                    className="btn btn-outline-secondary btn-sm" 
                    style={{
                      borderRadius: '50px',
                      padding: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}
                  >
                    Create New Account
                  </Link>
                </div>
              </form>
            </div>
            
            {/* Card Footer */}
            <div className="card-footer bg-light py-2 text-center">
              <p className="mb-0 small text-muted">
                &copy; {new Date().getFullYear()} Pizza Paradise
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;