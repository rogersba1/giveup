import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActionArea,
  Box,
  Chip,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  CircularProgress
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { collection, query, getDocs, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { Item, Category, AgeGroup, Gender } from '../types/Item';

function Items() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [ageGroupFilter, setAgeGroupFilter] = useState<string>('');
  const [genderFilter, setGenderFilter] = useState<string>('');
  
  const navigate = useNavigate();
  const location = useLocation();

  // Get query parameters from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category) {
      setCategoryFilter(category);
    }
  }, [location.search]);

  // Fetch items from Firestore
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      try {
        let itemsQuery = query(
          collection(db, 'items'),
          where('isAvailable', '==', true),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(itemsQuery);
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
        
        setItems(itemsList);
        setError(null);
      } catch (err) {
        console.error('Error fetching items:', err);
        setError('Failed to load items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchItems();
  }, []);

  // Handle filter changes
  const handleCategoryChange = (event: SelectChangeEvent) => {
    setCategoryFilter(event.target.value);
  };
  
  const handleAgeGroupChange = (event: SelectChangeEvent) => {
    setAgeGroupFilter(event.target.value);
  };
  
  const handleGenderChange = (event: SelectChangeEvent) => {
    setGenderFilter(event.target.value);
  };

  // Filter items based on selected filters
  const filteredItems = items.filter(item => {
    const matchesCategory = categoryFilter ? item.category === categoryFilter : true;
    const matchesAgeGroup = ageGroupFilter ? item.ageGroup === ageGroupFilter : true;
    const matchesGender = genderFilter ? item.gender === genderFilter : true;
    const matchesSearch = searchTerm ? 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) : 
      true;
      
    return matchesCategory && matchesAgeGroup && matchesGender && matchesSearch;
  });

  const handleItemClick = (itemId: string) => {
    navigate(`/item/${itemId}`);
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

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Available Items
      </Typography>
      
      {/* Filters */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Search"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={categoryFilter}
                label="Category"
                onChange={handleCategoryChange}
              >
                <MenuItem value="">All Categories</MenuItem>
                <MenuItem value="clothing">Clothing</MenuItem>
                <MenuItem value="toy">Toys</MenuItem>
                <MenuItem value="accessory">Accessories</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Age Group</InputLabel>
              <Select
                value={ageGroupFilter}
                label="Age Group"
                onChange={handleAgeGroupChange}
              >
                <MenuItem value="">All Ages</MenuItem>
                <MenuItem value="baby">Baby</MenuItem>
                <MenuItem value="toddler">Toddler</MenuItem>
                <MenuItem value="preschooler">Preschooler</MenuItem>
                <MenuItem value="child">Child</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                value={genderFilter}
                label="Gender"
                onChange={handleGenderChange}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="boy">Boy</MenuItem>
                <MenuItem value="girl">Girl</MenuItem>
                <MenuItem value="neutral">Neutral</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      
      {/* Items Grid */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center">
          {error}
        </Typography>
      ) : filteredItems.length === 0 ? (
        <Typography align="center" sx={{ my: 4 }}>
          No items found. Try adjusting your filters.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredItems.map((item) => (
            <Grid item key={item.id} xs={12} sm={6} md={4}>
              <Card>
                <CardActionArea onClick={() => handleItemClick(item.id)}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={item.imageUrls[0] || 'https://via.placeholder.com/200x200?text=No+Image'}
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
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      <Chip 
                        label={item.category} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                      <Chip 
                        label={item.ageGroup} 
                        size="small" 
                        color="secondary" 
                        variant="outlined"
                      />
                      {item.size && (
                        <Chip 
                          label={`Size: ${item.size}`} 
                          size="small" 
                          variant="outlined"
                        />
                      )}
                      <Chip 
                        label={item.state} 
                        size="small" 
                        color={getStateColor(item.state)}
                        variant="outlined"
                      />
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default Items;