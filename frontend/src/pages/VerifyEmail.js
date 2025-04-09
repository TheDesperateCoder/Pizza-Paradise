import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import AuthService from '../services/AuthService';
import '../styles/VerifyEmail.css';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    
    if (!token) {
      setVerifying(false);
      setError('Invalid verification link. No verification token found.');
      return;
    }
    
    const verifyEmailToken = async () => {
      try {
        await AuthService.verifyEmail(token);
        setVerified(true);
        setVerifying(false);
      } catch (err) {
        setVerifying(false);
        setError(err.response?.data?.message || 'Email verification failed. The link may have expired.');
      }
    };
    
    verifyEmailToken();
  }, [location]);
  
  // Redirect to login after successful verification
  useEffect(() => {
    let redirectTimer;
    
    if (verified) {
      redirectTimer = setTimeout(() => {
        navigate('/login');
      }, 5000);
    }
    
    return () => {
      if (redirectTimer) clearTimeout(redirectTimer);
    };
  }, [verified, navigate]);
  
  return (
    <Container className="verify-email-container">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card className="verify-email-card">
            <Card.Body className="text-center">
              <h2 className="mb-4">Email Verification</h2>
              
              {verifying && (
                <div className="verification-pending">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-3">Verifying your email address...</p>
                </div>
              )}
              
              {verified && (
                <div className="verification-success">
                  <div className="success-icon">✓</div>
                  <h4>Email Verified Successfully!</h4>
                  <p>Thank you for verifying your email address. You now have full access to our services.</p>
                  <Alert variant="info">
                    You will be redirected to the login page in 5 seconds...
                  </Alert>
                  <Button as={Link} to="/login" variant="primary" className="mt-3">
                    Go to Login
                  </Button>
                </div>
              )}
              
              {error && !verifying && (
                <div className="verification-error">
                  <div className="error-icon">!</div>
                  <h4>Verification Failed</h4>
                  <p className="text-danger">{error}</p>
                  <div className="mt-4">
                    <Button as={Link} to="/login" variant="primary" className="me-3">
                      Go to Login
                    </Button>
                    <Button as={Link} to="/" variant="outline-primary">
                      Go to Home
                    </Button>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default VerifyEmail;