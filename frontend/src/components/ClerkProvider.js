import React from 'react';
import { ClerkProvider as BaseClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

const ClerkProvider = ({ children }) => {
  if (!clerkPubKey) {
    console.error("Missing Clerk publishable key. Please set REACT_APP_CLERK_PUBLISHABLE_KEY in your .env file");
    return (
      <div className="alert alert-danger">
        Authentication configuration error. Please check the console for details.
      </div>
    );
  }

  return (
    <BaseClerkProvider publishableKey={clerkPubKey}>
      {children}
    </BaseClerkProvider>
  );
};

// Component to use for protected routes
export const ProtectedRoute = ({ children }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

export default ClerkProvider;