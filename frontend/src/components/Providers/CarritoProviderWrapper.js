"use client";

import React from 'react';
import { CarritoProvider } from '../../actions/carritoActions';

const CarritoProviderWrapper = ({ children }) => {
  return (
    <CarritoProvider>
      {children}
    </CarritoProvider>
  );
};

export default CarritoProviderWrapper; 