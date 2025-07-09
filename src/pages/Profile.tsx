import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  Avatar, 
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

function Profile() {
  const { currentUser, userProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    displayName: userProfile?.displayName || '',
    phoneNumber: userProfile?.phoneNumber || '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('You must be logged in to update your profile');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Update user profile in Firestore
      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        displayName: formData.displayName,
        phoneNumber: formData.phoneNumber
      });
      
      setSuccess(true);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccess = () => {
    setSuccess(false);
  };

  if (!currentUser || !userProfile) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          You must be logged in to view your profile
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
          <Avatar
            src={userProfile.photoURL || undefined}
            alt={userProfile.displayName}
            sx={{ width: 100, height: 100, mb: 2 }}
          />
          <Typography variant="h4" component="h1" gutterBottom>
            Your Profile
          </Typography>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Snackbar
          open={success}
          autoHideDuration={6000}
          onClose={handleCloseSuccess}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity="success" onClose={handleCloseSuccess}>
            Profile updated successfully!
          </Alert>
        </Snackbar>
        
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                name="displayName"
                label="Display Name"
                fullWidth
                required
                value={formData.displayName}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="email"
                label="Email Address"
                fullWidth
                value={userProfile.email}
                disabled
                helperText="Email cannot be changed (provided by Google)"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="phoneNumber"
                label="Phone Number"
                fullWidth
                value={formData.phoneNumber}
                onChange={handleChange}
                helperText="This will be shared with users who request your items"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : 'Update Profile'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

export default Profile;