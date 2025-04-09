import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/axios';
import axios from 'axios';

function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    otp: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingOTP, setIsSendingOTP] = useState(false);
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [otpDisplayText, setOtpDisplayText] = useState(''); // Remove in production
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

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const validateForm = () => {
    let valid = true;
    let newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
      valid = false;
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
      valid = false;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      valid = false;
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      valid = false;
    }
    
    if (!formData.otp) {
      newErrors.otp = 'Please enter the OTP sent to your email';
      valid = false;
    } else if (formData.otp.length !== 6) {
      newErrors.otp = 'OTP must be 6 digits';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };

  const handleSendOTP = async () => {
    if (!formData.email) {
      setErrors({ ...errors, email: 'Email is required' });
      return;
    }

    if (!validateEmail(formData.email)) {
      setErrors({ ...errors, email: 'Please enter a valid email' });
      return;
    }

    setIsSendingOTP(true);
    try {
      // Use direct axios call with full URL for debugging
      const response = await axios.post('http://localhost:3001/api/auth/sendotp', { 
        email: formData.email 
      });
      
      console.log('Raw OTP response:', response);
      
      if (response.data && response.data.success) {
        setIsOTPSent(true);
        // Display OTP in development mode
        if (response.data.otp) {
          console.log(`OTP code: ${response.data.otp}`);
          setOtpDisplayText(`OTP code: ${response.data.otp}`);
        }
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      setErrors({
        ...errors,
        email: error.response?.data?.message || 'Failed to send OTP'
      });
    } finally {
      setIsSendingOTP(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      console.log('Submitting registration with data:', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        contactNumber: formData.phone,
        otp: formData.otp
      });
      
      const response = await axios.post('http://localhost:3001/api/auth/signup', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        contactNumber: formData.phone,
        otp: formData.otp // Ensure OTP is included
      });
      
      console.log('Registration response:', response.data);
      
      if (response.data.success) {
        setRegistrationSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      console.error('Registration error details:', error);
      // Display the server's error message if available
      setErrors({
        ...errors,
        submit: error.response?.data?.message || 'Registration failed. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid py-3" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow border-0 rounded-3 overflow-hidden">
            {/* Card Header */}
            <div className="card-header text-center p-3" style={{ 
              background: 'linear-gradient(135deg, #FF5F6D 0%, #FFC371 100%)',
              borderBottom: '3px solid #FF5F6D'
            }}>
              <div className="mb-2">
                <img 
                  src="https://img.icons8.com/color/96/000000/pizza.png" 
                  alt="Pizza Logo" 
                  style={{ height: '60px', width: 'auto' }}
                />
              </div>
              <h3 className="text-white mb-1">Create Account</h3>
              <p className="text-white small mb-0">Join our pizza paradise!</p>
            </div>
            
            {/* Card Body */}
            <div className="card-body p-3">
              {registrationSuccess && (
                <div className="alert alert-success" role="alert">
                  Registration successful! Redirecting to login...
                </div>
              )}
              
              {errors.submit && (
                <div className="alert alert-danger" role="alert">
                  {errors.submit}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                {/* First Name Field */}
                <div className="mb-3">
                  <label htmlFor="firstName" className="form-label small fw-bold">First Name</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-user"></i>
                    </span>
                    <input
                      type="text"
                      className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                      id="firstName"
                      name="firstName"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                    {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                  </div>
                </div>
                
                {/* Last Name Field */}
                <div className="mb-3">
                  <label htmlFor="lastName" className="form-label small fw-bold">Last Name</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-user"></i>
                    </span>
                    <input
                      type="text"
                      className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                      id="lastName"
                      name="lastName"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                    {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                  </div>
                </div>
                
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
                      disabled={isOTPSent}
                    />
                    {!isOTPSent && (
                      <button 
                        type="button" 
                        className="btn btn-outline-primary" 
                        onClick={handleSendOTP}
                        disabled={isSendingOTP}
                      >
                        {isSendingOTP ? 'Sending...' : 'Get OTP'}
                      </button>
                    )}
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                </div>

                {/* OTP Field - Only shown after OTP is sent */}
                {isOTPSent && (
                  <div className="mb-3">
                    <label htmlFor="otp" className="form-label small fw-bold">OTP Verification</label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <i className="fas fa-key"></i>
                      </span>
                      <input
                        type="text"
                        className={`form-control ${errors.otp ? 'is-invalid' : ''}`}
                        id="otp"
                        name="otp"
                        placeholder="Enter 6-digit OTP"
                        value={formData.otp}
                        onChange={handleChange}
                      />
                      {errors.otp && <div className="invalid-feedback">{errors.otp}</div>}
                    </div>
                    <div className="form-text small">Enter the 6-digit code sent to your email</div>
                  </div>
                )}
                
                {/* Phone Field */}
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label small fw-bold">Phone Number (Optional)</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-phone"></i>
                    </span>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      name="phone"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                
                {/* Password Field */}
                <div className="mb-3">
                  <label htmlFor="password" className="form-label small fw-bold">Password</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-lock"></i>
                    </span>
                    <input
                      type="password"
                      className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      id="password"
                      name="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                  </div>
                  <div className="form-text small">Password must be at least 6 characters</div>
                </div>
                
                {/* Confirm Password Field */}
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label small fw-bold">Confirm Password</label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-lock"></i>
                    </span>
                    <input
                      type="password"
                      className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    {errors.confirmPassword && <div className="invalid-feedback">{errors.confirmPassword}</div>}
                  </div>
                </div>
                
                {/* Terms and Conditions Checkbox */}
                <div className="form-check mb-3">
                  <input className="form-check-input" type="checkbox" id="agreeTerms" required />
                  <label className="form-check-label small" htmlFor="agreeTerms">
                    I agree to the <a href="#" className="text-decoration-none" style={{ color: '#FF5F6D' }}>Terms of Service</a> and <a href="#" className="text-decoration-none" style={{ color: '#FF5F6D' }}>Privacy Policy</a>
                  </label>
                </div>
                
                {/* Submit Button - Only enabled after OTP is sent */}
                <div className="d-grid mb-3">
                  <button
                    type="submit"
                    className="btn py-2"
                    disabled={isSubmitting || !isOTPSent}
                    style={{
                      background: 'linear-gradient(135deg, #FF5F6D 0%, #FFC371 100%)',
                      color: 'white',
                      fontWeight: 'bold',
                      borderRadius: '50px'
                    }}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating Account...
                      </>
                    ) : 'Create Account'}
                  </button>
                </div>
                
                {/* Login Link */}
                <div className="text-center">
                  <p className="mb-0 small">
                    Already have an account? <Link to="/login" className="text-decoration-none fw-bold" style={{ color: '#FF5F6D' }}>Sign In</Link>
                  </p>
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

export default Register;