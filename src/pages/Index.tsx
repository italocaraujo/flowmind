
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';

const Index = () => {
  // Redirecionar para o dashboard quando autenticado
  const user = localStorage.getItem('flowmind-user');
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <Dashboard />;
};

export default Index;
