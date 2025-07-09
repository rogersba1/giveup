import { Box, Container, Typography, Link, Divider, Stack } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[100],
      }}
    >
      <Divider sx={{ mb: 3 }} />
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'center', md: 'flex-start' }}
          spacing={2}
        >
          <Box>
            <Typography variant="h6" color="text.primary" gutterBottom>
              GiveUp
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sharing children's items and reducing waste
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle1" color="text.primary" gutterBottom>
              Navigation
            </Typography>
            <Link component={RouterLink} to="/" color="inherit" sx={{ display: 'block', mb: 0.5 }}>
              Home
            </Link>
            <Link component={RouterLink} to="/items" color="inherit" sx={{ display: 'block', mb: 0.5 }}>
              Browse Items
            </Link>
            <Link component={RouterLink} to="/add-item" color="inherit" sx={{ display: 'block' }}>
              Add Item
            </Link>
          </Box>

          <Box>
            <Typography variant="subtitle1" color="text.primary" gutterBottom>
              Categories
            </Typography>
            <Link component={RouterLink} to="/items?category=clothing" color="inherit" sx={{ display: 'block', mb: 0.5 }}>
              Clothing
            </Link>
            <Link component={RouterLink} to="/items?category=toy" color="inherit" sx={{ display: 'block', mb: 0.5 }}>
              Toys
            </Link>
            <Link component={RouterLink} to="/items?category=accessory" color="inherit" sx={{ display: 'block' }}>
              Accessories
            </Link>
          </Box>

          <Box>
            <Typography variant="subtitle1" color="text.primary" gutterBottom>
              About
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              GiveUp is a platform for parents to share children's items they no longer need.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} GiveUp
            </Typography>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

export default Footer;