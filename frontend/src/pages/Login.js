import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Log form submission for debugging
      console.log('Login form submitted with email:', email);
      
      // Use the AuthContext login function
      const user = await login(email, password);
      
      console.log('Login successful:', user);
      navigate('/'); // Redirect to home page after successful login
    } catch (err) {
      console.error('Login error details:', err);
      
      // Display appropriate error message based on response
      if (err.response) {
        console.log('Server responded with error:', err.response.status, err.response.data);
        
        // Display the error message from the server
        setError(err.response.data.message || 'Login failed. Please check your credentials.');
      } else if (err.request) {
        // The request was made but no response was received
        setError('Server not responding. Please try again later.');
      } else {
        // Something happened in setting up the request
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} sm={10} md={8} lg={6}>
            <Card className="login-card">
              <Card.Body>
                <h2 className="text-center mb-4">Login</h2>
                
                {error && <Alert variant="danger">{error}</Alert>}
                
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      required 
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                      type="password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      required 
                    />
                    <div className="text-end mt-1">
                      <Link to="/forgot-password" className="small">Forgot Password?</Link>
                    </div>
                  </Form.Group>
                  
                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="w-100 mb-3" 
                    disabled={loading}
                  >
                    {loading ? 'Logging in...' : 'Login'}
                  </Button>
                </Form>
                
                <div className="register-container">
                  <p className="mb-0">
                    Don't have an account? <Link to="/register" className="register-link">Register</Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;