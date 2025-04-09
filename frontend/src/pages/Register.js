import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Alert, InputGroup } from 'react-bootstrap';
import axios from 'axios';
import '../styles/Register.css';
import API_BASE_URL from '../config/api';

const API_URL = `${API_BASE_URL}/api`;

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    contactNumber: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpError, setOtpError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear errors when user types
    if (error) setError('');
    if (otpError) setOtpError('');
  };
  
  const validateForm = () => {
    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    // Password strength validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    return true;
  };
  
  const handleSendOTP = async (e) => {
    e.preventDefault();
    
    if (!formData.email) {
      setOtpError('Please enter your email address');
      return;
    }
    
    setOtpLoading(true);
    setOtpError('');
    
    try {
      const response = await axios.post(`${API_URL}/auth/sendotp`, { email: formData.email });
      
      if (response.data && response.data.success) {
        setOtpSent(true);
        console.log(response.data); // Log OTP in development mode
        alert('OTP sent successfully! Check your email.');
      }
    } catch (error) {
      console.error('OTP request error:', error);
      if (error.response) {
        setOtpError(error.response.data?.message || 'Failed to send OTP. Please try again.');
      } else if (error.request) {
        setOtpError('Server not responding. Please try again later.');
      } else {
        setOtpError('An error occurred. Please try again.');
      }
    } finally {
      setOtpLoading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (!otpSent) {
      setError('Please verify your email with OTP first');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        contactNumber: formData.contactNumber,
        otp: formData.otp
      });
      
      if (response.data && response.data.success) {
        alert('Registration successful! Please login.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response) {
        setError(error.response.data?.message || 'Registration failed. Please try again.');
      } else if (error.request) {
        setError('Server not responding. Please try again later.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container className="register-container">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="register-card">
            <Card.Body>
              <h2 className="text-center mb-4">Create Your Account</h2>
              
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>First Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Last Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={otpSent}
                    />
                    <Button 
                      variant="outline-secondary" 
                      onClick={handleSendOTP}
                      disabled={otpLoading || otpSent}
                    >
                      {otpLoading ? 'Sending...' : otpSent ? 'OTP Sent' : 'Get OTP'}
                    </Button>
                  </InputGroup>
                  {otpError && <Form.Text className="text-danger">{otpError}</Form.Text>}
                </Form.Group>
                
                {otpSent && (
                  <Form.Group className="mb-3">
                    <Form.Label>Enter OTP</Form.Label>
                    <Form.Control
                      type="text"
                      name="otp"
                      value={formData.otp}
                      onChange={handleChange}
                      placeholder="Enter the 6-digit code sent to your email"
                      required
                    />
                    <Form.Text className="text-muted">
                      Enter the verification code sent to your email
                    </Form.Text>
                  </Form.Group>
                )}
                
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                  />
                  <Form.Text className="text-muted">
                    Optional, for order notifications
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                
                <Button 
                  type="submit" 
                  variant="primary"
                  className="w-100 mb-3"
                  disabled={loading || !otpSent}
                >
                  {loading ? 'Creating Account...' : 'Register'}
                </Button>
                
                <div className="text-center mt-3">
                  <p>Already have an account? <Link to="/login">Login</Link></p>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;