import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, CircularProgress } from '@mui/material';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * A wrapper component that protects routes requiring authentication
 * Redirects to login page if user is not authenticated
 */
function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !currentUser) {
      // User is not authenticated, redirect to login
      navigate('/login');
    }
  }, [currentUser, loading, navigate]);

  if (loading) {
    // Show loading spinner while auth state is being determined
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // If not loading and we have a user, render the protected content
  return currentUser ? <>{children}</> : null;
}

export default ProtectedRoute;