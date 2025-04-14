"use client"
// components/ServerComponentWrapper.tsx

import { ReactNode } from 'react';

interface ServerComponentWrapperProps {
  children: ReactNode;
}

// This is a simple client component that just renders whatever is passed to it
const ServerComponentWrapper = ({ children }: ServerComponentWrapperProps) => {
  return <>{children}</>;
};

export default ServerComponentWrapper;