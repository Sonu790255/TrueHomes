import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PropertyCard from '../components/PropertyCard';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  CircularProgress,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Home as HomeIcon,
  TrendingUp as TrendingUpIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import { db } from '../firebase/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { formatPrice } from '../utils/formatters';

function MyProperties() {
  const { currentUser } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      fetchMyProperties();
    }
  }, [currentUser]);

  const fetchMyProperties = async () => {
    try {
      const q = query(
        collection(db, 'properties'),
        where('sellerId', '==', currentUser.uid)
      );
      
      const querySnapshot = await getDocs(q);
      const userProperties = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort by creation date (newest first)
      userProperties.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setProperties(userProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const totalValue = properties.reduce((sum, property) => sum + property.price, 0);
  const averagePrice = properties.length > 0 ? totalValue / properties.length : 0;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#f7fafc',
        paddingTop: '72px',
        paddingBottom: '40px',
      }}
    >
      <Container maxWidth="lg" sx={{ width: '100%', maxWidth: '1200px', mx: 'auto', px: { xs: 2.5, md: 0 } }}>
        {/* Header Section */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 900,
              color: '#1a202c',
              mb: 2,
              mt:2,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              letterSpacing: '-0.02em',
            }}
          >
            My Properties
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#4a5568', 
              mb: 4,
            }}
          >
            Manage your property portfolio
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <CircularProgress size={60} sx={{ mb: 3, color: '#3182ce' }} />
            <Typography 
              variant="h5" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                color: '#1a202c',
              }}
            >
              Loading Your Properties
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#4a5568',
              }}
            >
              Please wait while we fetch your listings...
            </Typography>
          </Box>
        ) : (
          <>
            {/* Statistics Cards */}
            <Grid container spacing={4} sx={{ mb: 6 }}>
              <Grid item xs={12} md={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    borderRadius: 4,
                    background: 'white',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                    }
                  }}
                >
                  <HomeIcon sx={{ fontSize: 48, color: '#4ade80', mb: 2 }} />
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      color: '#1a202c', 
                      fontWeight: 700, 
                      mb: 1,
                    }}
                  >
                    {properties.length}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#4a5568',
                    }}
                  >
                    Total Properties
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    borderRadius: 4,
                    background: 'white',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                    }
                  }}
                >
                  <TrendingUpIcon sx={{ fontSize: 48, color: '#3b82f6', mb: 2 }} />
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      color: '#1a202c', 
                      fontWeight: 700, 
                      mb: 1,
                    }}
                  >
                    {formatPrice(totalValue)}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#4a5568',
                    }}
                  >
                    Total Value
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} md={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    borderRadius: 4,
                    background: 'white',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                    border: '1px solid #e2e8f0',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 30px rgba(0, 0, 0, 0.12)',
                    }
                  }}
                >
                  <VisibilityIcon sx={{ fontSize: 48, color: '#8b5cf6', mb: 2 }} />
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      color: '#1a202c', 
                      fontWeight: 700, 
                      mb: 1,
                    }}
                  >
                    {formatPrice(averagePrice)}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: '#4a5568',
                    }}
                  >
                    Average Price
                  </Typography>
                </Paper>
              </Grid>
            </Grid>

            {/* Add Property Button */}
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Button
                component={Link}
                to="/add-property"
                variant="contained"
                size="large"
                startIcon={<AddIcon />}
                sx={{
                  py: 2,
                  px: 4,
                  borderRadius: 3,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
                  color: 'white',
                  boxShadow: '0 4px 15px rgba(96, 165, 250, 0.4)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(96, 165, 250, 0.6)',
                  },
                }}
              >
                Add New Property
              </Button>
            </Box>

            {/* Properties Grid */}
            {properties.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 10 }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  <HomeIcon sx={{ fontSize: 40, color: '#4a5568' }} />
                </Box>
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 'bold',
                    color: '#1a202c',
                  }}
                >
                  No Properties Yet
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    mb: 4,
                    color: '#4a5568',
                  }}
                >
                  Start building your portfolio by adding your first property!
                </Typography>
                <Button
                  component={Link}
                  to="/add-property"
                  variant="contained"
                  size="large"
                  startIcon={<AddIcon />}
                  sx={{
                    py: 2,
                    px: 4,
                    borderRadius: 3,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
                    color: 'white',
                    boxShadow: '0 4px 15px rgba(96, 165, 250, 0.4)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(96, 165, 250, 0.6)',
                    },
                  }}
                >
                  Add Your First Property
                </Button>
              </Box>
            ) : (
              <Box>
                <Typography 
                  variant="h4" 
                  component="h2" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 700,
                    color: '#1a202c',
                    letterSpacing: '-0.01em',
                    mb: 4,
                    textAlign: 'center',
                  }}
                >
                  Your Properties ({properties.length})
                </Typography>
                
                <Grid container spacing={4}>
                  {properties.map((property) => (
                    <Grid item xs={12} sm={6} md={4} key={property.id}>
                      <PropertyCard property={property} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}

export default MyProperties;