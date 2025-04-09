import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import AuthService from '../services/AuthService';
import '../styles/ResetPassword.css';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [tokenValid, setTokenValid] = useState(true);
  
  // Extract token from URL when component mounts
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const resetToken = params.get('token');
    
    if (!resetToken) {
      setTokenValid(false);
      setError('Invalid or missing reset token');
      return;
    }
    
    setToken(resetToken);
    
    // Verify token validity
    const verifyToken = async () => {
      try {
        await AuthService.verifyResetToken(resetToken);
      } catch (err) {
        setTokenValid(false);
        setError('This password reset link is invalid or has expired');
      }
    };
    
    verifyToken();
  }, [location]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      await AuthService.resetPassword(token, formData.password);
      setSuccess('Password has been reset successfully');
      
      // Redirect to login page after success
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container className="reset-password-container">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="reset-password-card">
            <Card.Body>
              <div className="text-center mb-4">
                <h2>Reset Your Password</h2>
                <p className="text-muted">Please enter your new password</p>
              </div>
              
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              
              {tokenValid ? (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>New Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter new password"
                      disabled={loading || success}
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-4">
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm new password"
                      disabled={loading || success}
                      required
                    />
                  </Form.Group>
                  
                  <div className="d-grid">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={loading || success}
                    >
                      {loading ? (
                        <>
                          <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                          <span className="ms-2">Resetting...</span>
                        </>
                      ) : (
                        'Reset Password'
                      )}
                    </Button>
                  </div>
                </Form>
              ) : (
                <div className="text-center py-3">
                  <Button 
                    as={Link} 
                    to="/forgot-password" 
                    variant="primary"
                  >
                    Request New Reset Link
                  </Button>
                </div>
              )}
              
              <div className="text-center mt-4">
                <p>Remember your password? <Link to="/login">Login</Link></p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ResetPassword;