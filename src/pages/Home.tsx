import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia 
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import ToysIcon from '@mui/icons-material/Toys';

function Home() {
  return (
    <Container>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          py: 8,
          px: 4,
          my: 4,
          borderRadius: 2,
          textAlign: 'center'
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Give and Receive Children's Items
        </Typography>
        <Typography variant="h5" component="p" paragraph>
          Connect with other parents to exchange clothing, toys, and accessories
        </Typography>
        <Button 
          variant="contained" 
          color="secondary" 
          size="large" 
          component={RouterLink} 
          to="/items"
          sx={{ mt: 2 }}
        >
          Browse Items
        </Button>
      </Box>

      {/* How It Works Section */}
      <Box sx={{ my: 6 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          How It Works
        </Typography>
        
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary">1</Typography>
                <Typography variant="h6" gutterBottom>Sign Up</Typography>
                <Typography variant="body1">
                  Create an account using your Google account to start sharing and receiving items.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary">2</Typography>
                <Typography variant="h6" gutterBottom>Post Items</Typography>
                <Typography variant="body1">
                  Add items you'd like to give away with photos and descriptions.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h3" color="primary">3</Typography>
                <Typography variant="h6" gutterBottom>Connect & Exchange</Typography>
                <Typography variant="body1">
                  Arrange the exchange through email or text with the item owner.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Categories Section */}
      <Box sx={{ my: 6 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Categories
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={4}>
            <Card 
              component={RouterLink} 
              to="/items?category=clothing"
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                textDecoration: 'none',
                transition: '0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
                <CheckroomIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h5" gutterBottom>Clothing</Typography>
                <Typography variant="body2" color="text.secondary">
                  Browse clothing items for babies, toddlers, and children of all ages.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card 
              component={RouterLink} 
              to="/items?category=toy"
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                textDecoration: 'none',
                transition: '0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
                <ToysIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h5" gutterBottom>Toys</Typography>
                <Typography variant="body2" color="text.secondary">
                  Find toys for all developmental stages that will bring joy to your children.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card 
              component={RouterLink} 
              to="/items?category=accessory"
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                textDecoration: 'none',
                transition: '0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: 6
                }
              }}
            >
              <CardContent sx={{ textAlign: 'center', flexGrow: 1 }}>
                <ChildCareIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h5" gutterBottom>Accessories</Typography>
                <Typography variant="body2" color="text.secondary">
                  Discover accessories like bibs, blankets, hats, and other essentials.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* CTA Section */}
      <Box 
        sx={{ 
          my: 8, 
          py: 6, 
          px: 4, 
          textAlign: 'center',
          bgcolor: 'secondary.light',
          borderRadius: 2
        }}
      >
        <Typography variant="h4" gutterBottom>
          Ready to start sharing?
        </Typography>
        <Typography variant="body1" paragraph>
          Join our community today and help reduce waste while supporting other families.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          size="large" 
          component={RouterLink}
          to="/login"
          sx={{ mt: 2 }}
        >
          Sign Up Now
        </Button>
      </Box>
    </Container>
  );
}

export default Home;