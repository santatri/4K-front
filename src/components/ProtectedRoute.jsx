import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

const ProtectedRoute = ({ element }) => {
  const { user } = useAuth();

  // 🔥 Vérifier si l'utilisateur est stocké avant d'autoriser l'accès
  return user ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;



