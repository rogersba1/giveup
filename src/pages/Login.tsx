import { Container, Typography, Button, Paper, Box } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

function Login() {
  const { signInWithGoogle, currentUser } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect if user is already logged in
    if (currentUser) {
      navigate('/items');
    }
  }, [currentUser, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // Navigation will happen automatically due to the useEffect
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Welcome to GiveUp
          </Typography>
          
          <Typography variant="body1" align="center" paragraph>
            A community for sharing children's items with others
          </Typography>
          
          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignIn}
            sx={{ mt: 2 }}
          >
            Sign in with Google
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login;