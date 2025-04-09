import React from 'react';
import { ClerkProvider as BaseClerkProvider } from '@clerk/clerk-react';

const CLERK_PUBLISHABLE_KEY = "pk_test_Z29vZC1yZWluZGVlci0zOC5jbGVyay5hY2NvdW50cy5kZXYk";

const ClerkProvider = ({ children }) => {
  return (
    <BaseClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      {children}
    </BaseClerkProvider>
  );
};

export default ClerkProvider;