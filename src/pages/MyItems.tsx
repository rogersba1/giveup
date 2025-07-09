import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActionArea,
  Button,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Item } from '../types/Item';

function MyItems() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [markAsGivenDialogOpen, setMarkAsGivenDialogOpen] = useState(false);

  // Fetch user's items
  useEffect(() => {
    const fetchUserItems = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        
        const q = query(
          collection(db, 'items'),
          where('userId', '==', currentUser.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const itemsList: Item[] = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          itemsList.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt.toDate(),
            updatedAt: data.updatedAt.toDate()
          } as Item);
        });
        
        // Sort by created date (newest first)
        itemsList.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        
        setItems(itemsList);
        setError(null);
      } catch (err) {
        console.error('Error fetching user items:', err);
        setError('Failed to load your items. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserItems();
  }, [currentUser]);

  // Handle item click
  const handleItemClick = (itemId: string) => {
    navigate(`/item/${itemId}`);
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (item: Item, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent item click from firing
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  // Close delete confirmation dialog
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
    setSelectedItem(null);
  };

  // Delete an item
  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    
    try {
      await deleteDoc(doc(db, 'items', selectedItem.id));
      setItems(prev => prev.filter(item => item.id !== selectedItem.id));
      setDeleteDialogOpen(false);
      setSelectedItem(null);
    } catch (err) {
      console.error('Error deleting item:', err);
      setError('Failed to delete item. Please try again.');
    }
  };

  // Open mark as given confirmation dialog
  const handleMarkAsGivenClick = (item: Item, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent item click from firing
    setSelectedItem(item);
    setMarkAsGivenDialogOpen(true);
  };

  // Close mark as given confirmation dialog
  const handleMarkAsGivenDialogClose = () => {
    setMarkAsGivenDialogOpen(false);
    setSelectedItem(null);
  };

  // Mark an item as given (not available anymore)
  const handleMarkAsGivenConfirm = async () => {
    if (!selectedItem) return;
    
    try {
      const itemRef = doc(db, 'items', selectedItem.id);
      await updateDoc(itemRef, {
        isAvailable: false
      });
      
      // Update local state
      setItems(prev => prev.map(item => 
        item.id === selectedItem.id 
          ? { ...item, isAvailable: false } 
          : item
      ));
      
      setMarkAsGivenDialogOpen(false);
      setSelectedItem(null);
    } catch (err) {
      console.error('Error updating item:', err);
      setError('Failed to update item. Please try again.');
    }
  };

  // Navigate to edit item page
  const handleEditClick = (itemId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent item click from firing
    navigate(`/edit-item/${itemId}`);
  };

  // Render a help message if no items
  if (!loading && items.length === 0) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          My Items
        </Typography>
        
        <Box sx={{ textAlign: 'center', my: 6 }}>
          <Typography variant="h6" paragraph>
            You haven't posted any items yet.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/add-item')}
          >
            Add Your First Item
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          My Items
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/add-item')}
        >
          Add New Item
        </Button>
      </Box>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {items.map((item) => (
            <Grid item key={item.id} xs={12} sm={6} md={4}>
              <Card 
                sx={{ 
                  position: 'relative',
                  opacity: item.isAvailable ? 1 : 0.7 
                }}
              >
                <CardActionArea onClick={() => handleItemClick(item.id)}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={item.imageUrls[0] || 'https://via.placeholder.com/180x180?text=No+Image'}
                    alt={item.title}
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h6" component="div" noWrap>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" 
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        mb: 2
                      }}
                    >
                      {item.description}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                      <Chip 
                        label={item.category} 
                        size="small"
                        color="primary"
                        variant="outlined" 
                      />
                      <Chip 
                        label={item.isAvailable ? 'Available' : 'Given Away'} 
                        size="small"
                        color={item.isAvailable ? 'success' : 'default'}
                      />
                    </Box>
                    
                    <Typography variant="caption" display="block" color="text.secondary">
                      Posted: {item.createdAt.toLocaleDateString()}
                    </Typography>
                  </CardContent>
                </CardActionArea>
                
                {/* Action buttons */}
                <Box sx={{ 
                  position: 'absolute', 
                  top: 5, 
                  right: 5, 
                  bgcolor: 'rgba(255,255,255,0.7)',
                  borderRadius: 1,
                  p: 0.5
                }}>
                  <IconButton 
                    size="small" 
                    color="primary"
                    onClick={(e) => handleEditClick(item.id, e)}
                    title="Edit item"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    size="small" 
                    color="error"
                    onClick={(e) => handleDeleteClick(item, e)}
                    title="Delete item"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                  {item.isAvailable && (
                    <IconButton 
                      size="small" 
                      color="success"
                      onClick={(e) => handleMarkAsGivenClick(item, e)}
                      title="Mark as given away"
                    >
                      <CheckCircleIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
      >
        <DialogTitle>Delete Item?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete "{selectedItem?.title}"? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Mark as given confirmation dialog */}
      <Dialog
        open={markAsGivenDialogOpen}
        onClose={handleMarkAsGivenDialogClose}
      >
        <DialogTitle>Mark as Given Away?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Has "{selectedItem?.title}" been given away? It will no longer appear in the available items list.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleMarkAsGivenDialogClose}>Cancel</Button>
          <Button onClick={handleMarkAsGivenConfirm} color="success" variant="contained">
            Yes, Mark as Given
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default MyItems;