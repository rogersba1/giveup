import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  Chip, 
  Button, 
  Divider,
  CircularProgress,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmailIcon from '@mui/icons-material/Email';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import ToysIcon from '@mui/icons-material/Toys';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Item } from '../types/Item';

function ItemDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [ownerEmail, setOwnerEmail] = useState<string | null>(null);
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');

  // Fetch item details
  useEffect(() => {
    const fetchItem = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const itemDoc = await getDoc(doc(db, 'items', id));
        
        if (!itemDoc.exists()) {
          setError('Item not found');
          setLoading(false);
          return;
        }
        
        const itemData = itemDoc.data();
        setItem({
          id: itemDoc.id,
          ...itemData,
          createdAt: itemData.createdAt.toDate(),
          updatedAt: itemData.updatedAt.toDate()
        } as Item);
        
        // Fetch owner's email
        const ownerDoc = await getDoc(doc(db, 'users', itemData.userId));
        if (ownerDoc.exists()) {
          setOwnerEmail(ownerDoc.data().email);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching item:', err);
        setError('Failed to load item details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchItem();
  }, [id]);
  
  useEffect(() => {
    // Set the first image as selected by default
    if (item && item.imageUrls.length > 0) {
      setSelectedImage(item.imageUrls[0]);
    }
  }, [item]);

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleRequestItem = () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    
    setRequestDialogOpen(true);
  };

  const handleCloseRequestDialog = () => {
    setRequestDialogOpen(false);
  };

  const handleSendRequest = async () => {
    // In a real app, you would save this request to Firestore
    // and potentially send an email or notification to the owner
    setRequestDialogOpen(false);
    
    // For now, just open an email client with a pre-filled message
    if (ownerEmail) {
      const subject = `GiveUp Request: ${item?.title}`;
      const body = `Hi there,

I'm interested in your item "${item?.title}" on GiveUp.

${requestMessage}

Thanks,
${userProfile?.displayName}`;

      window.location.href = `mailto:${ownerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'clothing':
        return <CheckroomIcon />;
      case 'toy':
        return <ToysIcon />;
      case 'accessory':
        return <ChildCareIcon />;
      default:
        return null;
    }
  };

  const formatAgeGroup = (ageGroup: string) => {
    switch (ageGroup) {
      case 'baby':
        return 'Baby (0-12 months)';
      case 'toddler':
        return 'Toddler (1-3 years)';
      case 'preschooler':
        return 'Preschooler (3-5 years)';
      case 'child':
        return 'Child (6+ years)';
      default:
        return ageGroup;
    }
  };

  const formatCondition = (state: string) => {
    switch (state) {
      case 'new':
        return 'New (with tags)';
      case 'like-new':
        return 'Like New';
      case 'used':
        return 'Used';
      default:
        return state;
    }
  };

  const getStateColor = (state: string) => {
    switch (state) {
      case 'new':
        return 'success';
      case 'like-new':
        return 'info';
      case 'used':
        return 'default';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !item) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">
          {error || 'Item not found'}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  const isOwner = currentUser && currentUser.uid === item.userId;

  return (
    <Container sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back to Items
      </Button>
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container spacing={4}>
          {/* Images Section */}
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2, height: 400, overflow: 'hidden', borderRadius: 1 }}>
              <img
                src={selectedImage || item.imageUrls[0]}
                alt={item.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  backgroundColor: '#f5f5f5'
                }}
              />
            </Box>
            
            {item.imageUrls.length > 1 && (
              <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
                {item.imageUrls.map((imgUrl, index) => (
                  <Box
                    key={index}
                    onClick={() => handleImageSelect(imgUrl)}
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 1,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border: imgUrl === selectedImage ? '2px solid #1976d2' : '1px solid #ddd',
                    }}
                  >
                    <img
                      src={imgUrl}
                      alt={`${item.title} - Image ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Grid>
          
          {/* Info Section */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h1" gutterBottom>
              {item.title}
            </Typography>
            
            {!item.isAvailable && (
              <Chip 
                label="No Longer Available" 
                color="error" 
                sx={{ mb: 2 }} 
              />
            )}
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
              <Chip 
                icon={getCategoryIcon(item.category)}
                label={item.category} 
                color="primary" 
              />
              <Chip 
                label={formatAgeGroup(item.ageGroup)} 
                color="secondary" 
              />
              <Chip 
                label={item.gender} 
                variant="outlined" 
              />
              {item.size && (
                <Chip 
                  label={`Size: ${item.size}`} 
                  variant="outlined" 
                />
              )}
              <Chip 
                label={formatCondition(item.state)} 
                color={getStateColor(item.state)}
              />
            </Box>
            
            <Typography variant="body1" paragraph sx={{ mt: 2 }}>
              {item.description}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Listed on {item.createdAt.toLocaleDateString()}
            </Typography>
            
            {item.isAvailable && !isOwner ? (
              <Button
                variant="contained"
                color="primary"
                size="large"
                startIcon={<EmailIcon />}
                onClick={handleRequestItem}
                fullWidth
                sx={{ mt: 2 }}
              >
                Request This Item
              </Button>
            ) : isOwner ? (
              <Alert severity="info" sx={{ mt: 2 }}>
                This is your item. You can manage it from the "My Items" page.
              </Alert>
            ) : (
              <Alert severity="warning" sx={{ mt: 2 }}>
                This item is no longer available.
              </Alert>
            )}
          </Grid>
        </Grid>
      </Paper>
      
      {/* Request Dialog */}
      <Dialog open={requestDialogOpen} onClose={handleCloseRequestDialog}>
        <DialogTitle>Request "{item.title}"</DialogTitle>
        <DialogContent>
          <DialogContentText paragraph>
            Let the owner know why you're interested in this item and how you'd like to arrange the pickup.
          </DialogContentText>
          <TextField
            autoFocus
            label="Message to Owner"
            fullWidth
            variant="outlined"
            multiline
            rows={4}
            value={requestMessage}
            onChange={(e) => setRequestMessage(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRequestDialog}>Cancel</Button>
          <Button onClick={handleSendRequest} variant="contained" color="primary">
            Send Request
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ItemDetail;