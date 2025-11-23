import { Navigate } from 'react-router-dom';
import React from "react";

export const RedirectHandler: React.FC = () => {
  return <Navigate to="/auth" replace />;
};

export default RedirectHandler;