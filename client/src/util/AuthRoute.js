import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/auth';
import { useContext } from 'react';

function AuthRoute({ element }) {
  const { user } = useContext(AuthContext);

  if (user) {
    return <Navigate to="/" replace />;
  }

  return element;
}

export default AuthRoute;
