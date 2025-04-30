
import { Navigate } from 'react-router-dom';

const Index = () => {
  // Verificar autenticação
  const user = localStorage.getItem('flowmind-user');
  
  // Redirecionar com base na autenticação
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Se autenticado, redireciona para o dashboard
  return <Navigate to="/dashboard" replace />;
};

export default Index;
