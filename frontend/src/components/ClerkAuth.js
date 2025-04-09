import React from 'react';
import { SignIn, SignUp, useUser } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';

export function ClerkSignIn() {
  return (
    <div className="login-container d-flex vh-100">
      {/* Left side - Form section */}
      <div className="col-12 col-md-6 p-0 d-flex align-items-center justify-content-center">
        <div className="sign-in-container p-4 p-md-5" style={{ maxWidth: '480px', width: '100%' }}>
          <div className="text-center mb-4">
            <h1 className="display-6 fw-bold mb-2">Welcome Back</h1>
            <p className="text-muted">Sign in to continue to your account</p>
          </div>
          
          <SignIn 
            routing="path" 
            path="/login"
            redirectUrl="/dashboard"
            appearance={{
              elements: {
                formButtonPrimary: 'btn btn-lg w-100 py-2 mb-3 text-white fw-medium',
                formButtonPrimary__backgroundColor: '#e53935',
                formButtonPrimary__hover__backgroundColor: '#c62828',
                formFieldInput: 'form-control py-3 px-4 rounded-3 border mb-3',
                formFieldLabel: 'form-label fw-medium my-2',
                socialButtonsBlockButton: 'border rounded-3 mb-3 py-2 fw-medium d-flex justify-content-center align-items-center position-relative shadow-sm',
                socialButtonsBlockButtonText: 'ms-2',
                dividerLine: 'bg-secondary-subtle',
                dividerText: 'bg-white text-muted px-3',
                footerActionText: 'text-muted',
                footerActionLink: 'text-danger fw-medium text-decoration-none',
                card: 'p-0 border-0 shadow-none bg-transparent',
                header: 'd-none',
                footer: 'mt-4 text-center'
              },
              layout: {
                socialButtonsPlacement: 'top',
                socialButtonsVariant: 'blockButton',
                showOptionalFields: true,
                logoPlacement: 'inside',
                logoImageUrl: '/logo192.png',
              }
            }}
          />
          
          <div className="mt-4 text-center">
            <p className="mb-0">Need help? <a href="#" className="text-decoration-none fw-medium text-danger">Contact Support</a></p>
          </div>
        </div>
      </div>
      
      {/* Right side - Image section */}
      <div className="col-md-6 d-none d-md-block p-0" style={{ position: 'relative' }}>
        <div className="bg-image h-100 w-100" style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80)', 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}>
          <div style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }}></div>
          <div className="position-absolute top-50 start-50 translate-middle text-center text-white p-4" style={{ 
            maxWidth: '80%', 
            zIndex: 1 
          }}>
            <h2 className="display-5 fw-bold mb-3">Pizza Delights</h2>
            <p className="lead mb-4">Order your favorite pizzas with just a few clicks. Fresh, hot, and delivered straight to your door.</p>
            <div className="d-flex justify-content-center">
              <div className="badge bg-danger px-3 py-2 me-2">Best Quality</div>
              <div className="badge bg-danger px-3 py-2 me-2">Fast Delivery</div>
              <div className="badge bg-danger px-3 py-2">Tasty Options</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ClerkSignUp() {
  return (
    <div className="login-container d-flex vh-100">
      {/* Left side - Form section */}
      <div className="col-12 col-md-6 p-0 d-flex align-items-center justify-content-center">
        <div className="sign-up-container p-4 p-md-5" style={{ maxWidth: '480px', width: '100%' }}>
          <div className="text-center mb-4">
            <h1 className="display-6 fw-bold mb-2">Create Account</h1>
            <p className="text-muted">Join our pizza lovers community today</p>
          </div>
          
          <SignUp 
            routing="path" 
            path="/register"
            redirectUrl="/dashboard"
            appearance={{
              elements: {
                formButtonPrimary: 'btn btn-lg w-100 py-2 mb-3 text-white fw-medium',
                formButtonPrimary__backgroundColor: '#e53935',
                formButtonPrimary__hover__backgroundColor: '#c62828',
                formFieldInput: 'form-control py-3 px-4 rounded-3 border mb-3',
                formFieldLabel: 'form-label fw-medium my-2',
                socialButtonsBlockButton: 'border rounded-3 mb-3 py-2 fw-medium d-flex justify-content-center align-items-center position-relative shadow-sm',
                socialButtonsBlockButtonText: 'ms-2',
                dividerLine: 'bg-secondary-subtle',
                dividerText: 'bg-white text-muted px-3',
                footerActionText: 'text-muted',
                footerActionLink: 'text-danger fw-medium text-decoration-none',
                card: 'p-0 border-0 shadow-none bg-transparent',
                header: 'd-none',
                footer: 'mt-4 text-center'
              },
              layout: {
                socialButtonsPlacement: 'top',
                socialButtonsVariant: 'blockButton',
                showOptionalFields: true,
                logoPlacement: 'inside',
                logoImageUrl: '/logo192.png',
              }
            }}
          />
          
          <div className="mt-4 text-center">
            <p className="mb-0">Need help? <a href="#" className="text-decoration-none fw-medium text-danger">Contact Support</a></p>
          </div>
        </div>
      </div>
      
      {/* Right side - Image section */}
      <div className="col-md-6 d-none d-md-block p-0" style={{ position: 'relative' }}>
        <div className="bg-image h-100 w-100" style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80)', 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative'
        }}>
          <div style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }}></div>
          <div className="position-absolute top-50 start-50 translate-middle text-center text-white p-4" style={{ 
            maxWidth: '80%', 
            zIndex: 1 
          }}>
            <h2 className="display-5 fw-bold mb-3">Join Our Pizza Family</h2>
            <p className="lead mb-4">Sign up today and get exclusive discounts on your favorite pizzas.</p>
            <div className="d-flex justify-content-center">
              <div className="badge bg-danger px-3 py-2 me-2">Easy Ordering</div>
              <div className="badge bg-danger px-3 py-2 me-2">Rewards Program</div>
              <div className="badge bg-danger px-3 py-2">Special Offers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProtectedRoute({ children }) {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <Navigate to="/login" />;
  }

  return children;
}