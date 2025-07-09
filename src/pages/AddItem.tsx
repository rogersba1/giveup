import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  Grid, 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Select, 
  FormHelperText,
  Paper,
  CircularProgress,
  Alert,
  AlertTitle,
  Snackbar 
} from '@mui/material';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '../firebase/config';
import { ItemFormData, Category, AgeGroup, Gender, ItemState } from '../types/Item';

function AddItem() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<ItemFormData>({
    title: '',
    description: '',
    category: 'clothing',
    ageGroup: 'baby',
    gender: 'neutral',
    size: '',
    state: 'used',
    images: []
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Handle form field changes
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string) => (event: any) => {
    setFormData(prev => ({ ...prev, [name]: event.target.value }));
  };

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const newFiles = Array.from(e.target.files);
    const totalImages = imageFiles.length + newFiles.length;
    
    if (totalImages > 5) {
      setError('You can upload a maximum of 5 images');
      return;
    }
    
    setImageFiles(prev => [...prev, ...newFiles]);
    
    // Create image previews
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
    
    setError(null);
  };

  // Remove selected image
  const removeImage = (index: number) => {
    const updatedFiles = [...imageFiles];
    const updatedPreviews = [...imagePreviews];
    
    // Revoke object URL to prevent memory leaks
    URL.revokeObjectURL(updatedPreviews[index]);
    
    updatedFiles.splice(index, 1);
    updatedPreviews.splice(index, 1);
    
    setImageFiles(updatedFiles);
    setImagePreviews(updatedPreviews);
  };

  // Upload images to Firebase Storage
  const uploadImages = async (): Promise<string[]> => {
    if (imageFiles.length === 0) return [];
    
    const uploadPromises = imageFiles.map(async (file) => {
      const storageRef = ref(storage, `items/${currentUser?.uid}/${Date.now()}_${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      return getDownloadURL(snapshot.ref);
    });
    
    return Promise.all(uploadPromises);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('You must be logged in to add an item');
      return;
    }
    
    if (imageFiles.length === 0) {
      setError('Please add at least one image');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Upload images to Firebase Storage
      const imageUrls = await uploadImages();
      
      // Add item to Firestore
      await addDoc(collection(db, 'items'), {
        userId: currentUser.uid,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        ageGroup: formData.ageGroup,
        gender: formData.gender,
        size: formData.size || null,
        state: formData.state,
        imageUrls,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isAvailable: true
      });
      
      setSuccess(true);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'clothing',
        ageGroup: 'baby',
        gender: 'neutral',
        size: '',
        state: 'used',
        images: []
      });
      
      // Clear images
      imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
      setImageFiles([]);
      setImagePreviews([]);
      
      // Redirect to items page after 2 seconds
      setTimeout(() => {
        navigate('/items');
      }, 2000);
      
    } catch (err) {
      console.error('Error adding item:', err);
      setError('Failed to add item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSuccess = () => {
    setSuccess(false);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add Item
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <AlertTitle>Error</AlertTitle>
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
            Item added successfully! Redirecting...
          </Alert>
        </Snackbar>
        
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                name="title"
                label="Title"
                fullWidth
                required
                value={formData.title}
                onChange={handleTextChange}
                inputProps={{ maxLength: 100 }}
                helperText={`${formData.title.length}/100 characters`}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                fullWidth
                required
                multiline
                rows={4}
                value={formData.description}
                onChange={handleTextChange}
                inputProps={{ maxLength: 500 }}
                helperText={`${formData.description.length}/500 characters`}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={handleSelectChange('category')}
                >
                  <MenuItem value="clothing">Clothing</MenuItem>
                  <MenuItem value="toy">Toy</MenuItem>
                  <MenuItem value="accessory">Accessory</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Age Group</InputLabel>
                <Select
                  value={formData.ageGroup}
                  label="Age Group"
                  onChange={handleSelectChange('ageGroup')}
                >
                  <MenuItem value="baby">Baby (0-12 months)</MenuItem>
                  <MenuItem value="toddler">Toddler (1-3 years)</MenuItem>
                  <MenuItem value="preschooler">Preschooler (3-5 years)</MenuItem>
                  <MenuItem value="child">Child (6+ years)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Gender</InputLabel>
                <Select
                  value={formData.gender}
                  label="Gender"
                  onChange={handleSelectChange('gender')}
                >
                  <MenuItem value="boy">Boy</MenuItem>
                  <MenuItem value="girl">Girl</MenuItem>
                  <MenuItem value="neutral">Neutral</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                name="size"
                label="Size (optional)"
                fullWidth
                value={formData.size}
                onChange={handleTextChange}
                helperText="E.g., 3-6 months, 2T, 5, Small, etc."
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Condition</InputLabel>
                <Select
                  value={formData.state}
                  label="Condition"
                  onChange={handleSelectChange('state')}
                >
                  <MenuItem value="new">New (with tags)</MenuItem>
                  <MenuItem value="like-new">Like New</MenuItem>
                  <MenuItem value="used">Used</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Images (up to 5)
                </Typography>
                <input
                  accept="image/*"
                  type="file"
                  multiple
                  id="image-upload"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
                <label htmlFor="image-upload">
                  <Button 
                    variant="outlined" 
                    component="span"
                    disabled={imageFiles.length >= 5}
                  >
                    Upload Images
                  </Button>
                </label>
                <FormHelperText>Add at least one image of your item</FormHelperText>
              </Box>
              
              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  {imagePreviews.map((preview, index) => (
                    <Grid item key={index} xs={6} sm={4} md={3}>
                      <Box 
                        sx={{ 
                          position: 'relative',
                          height: 100,
                          border: '1px solid #ddd',
                          borderRadius: 1,
                          overflow: 'hidden'
                        }}
                      >
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          style={{ 
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        <Button
                          size="small"
                          color="error"
                          variant="contained"
                          onClick={() => removeImage(index)}
                          sx={{ 
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            minWidth: 'auto',
                            width: 24,
                            height: 24,
                            p: 0
                          }}
                        >
                          ×
                        </Button>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Grid>
            
            <Grid item xs={12}>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Add Item'}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}

export default AddItem;