import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';
import theme from './theme';
import { Box } from '@mui/material';

// Components
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Items from './pages/ItemsPage';
import ItemDetail from './pages/ItemDetail';
import AddItem from './pages/AddItem';
import Profile from './pages/Profile';
import MyItems from './pages/MyItems';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalize CSS */}
      <AuthProvider>
        <Router>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            minHeight: '100vh' 
          }}>
            <Navigation />
            <Box sx={{ flexGrow: 1 }}>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/items" element={<Items />} />
                <Route path="/item/:id" element={<ItemDetail />} />
                
                {/* Protected routes - require authentication */}
                <Route 
                  path="/add-item" 
                  element={
                    <ProtectedRoute>
                      <AddItem />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/my-items" 
                  element={
                    <ProtectedRoute>
                      <MyItems />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Fallback - redirect to home */}
                <Route path="*" element={<Home />} />
              </Routes>
            </Box>
            <Footer />
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
