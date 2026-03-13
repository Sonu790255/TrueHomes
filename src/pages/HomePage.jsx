import { useState, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard';
import PropertyFilters from '../components/PropertyFilters';
import { initializeSampleData } from '../utils/sampleData';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import {
  Home as HomeIcon,
  LocationOn as LocationIcon,
  VerifiedUser as VerifiedIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import { db } from '../firebase/firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

function HomePage() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    type: '',
    maxPrice: '',
    bedrooms: ''
  });

  useEffect(() => {
    // Initialize sample data on first load
    initializeSampleData();
    fetchProperties();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [properties, filters]);

  const fetchProperties = async () => {
    try {
      const q = query(
        collection(db, 'properties'),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const propertiesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setProperties(propertiesData);
      setFilteredProperties(propertiesData);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
      setFilteredProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...properties];

    if (filters.location) {
      filtered = filtered.filter(property =>
        property.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.type) {
      filtered = filtered.filter(property => property.type === filters.type);
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(property => property.price <= parseFloat(filters.maxPrice));
    }

    if (filters.bedrooms) {
      filtered = filtered.filter(property => property.bedrooms >= parseInt(filters.bedrooms));
    }

    setFilteredProperties(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setFilters({ location: '', type: '', maxPrice: '', bedrooms: '' });
  };

  return (
    <>
      {/* Hero Section - Full Screen */}
      <Box
        sx={{
          minHeight: { xs: 'auto', md: '100vh' },
          py: { xs: 10, md: 0 },
          position: 'relative',
          background: `
            linear-gradient(135deg, rgba(96, 165, 250, 0.73) 0%, rgba(167, 139, 250, 0.77) 100%),
            url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1973&q=80')
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: { xs: 'scroll', md: 'fixed' },
          display: 'flex',
          alignItems: 'center',
          paddingTop: '72px',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h1"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: 'white',
                mb: 2,
                fontSize: { xs: '2.75rem', md: '4rem' },
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                textShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              }}
            >
              Find Your Perfect
              <Box 
                component="span" 
                sx={{ 
                  display: 'block', 
                  color: '#ffd700',
                  textShadow: '0 4px 12px rgba(0, 0, 0, 0.4), 0 0 30px rgba(255, 215, 0, 0.5)',
                }}
              >
                Dream Home
              </Box>
            </Typography>
            
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.95)',
                mb: { xs: 4, md: 6 },
                maxWidth: '650px',
                mx: 'auto',
                px: 2,
                fontWeight: 400,
                fontSize: { xs: '1rem', md: '1.25rem' },
                lineHeight: 1.6,
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
              }}
            >
              Discover exceptional properties in prime locations with our comprehensive real estate platform
            </Typography>

            <Grid container spacing={2} justifyContent="center" sx={{ maxWidth: '900px', mx: 'auto', px: { xs: 2, md: 0 } }}>
              <Grid item xs={12} sm={4}>
                <Card 
                  sx={{ 
                    backgroundColor: 'white', 
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)'
                    }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <HomeIcon sx={{ fontSize: 48, color: '#1167d1ff', mb: 1.5 }} />
                    <Typography variant="h4" sx={{ color: '#1a202c', fontWeight: 700, mb: 0.5 }}>
                      {properties.length}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#4a5568' }}>
                      Properties Listed
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card 
                  sx={{ 
                    backgroundColor: 'white', 
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)'
                    }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <LocationIcon sx={{ fontSize: 48, color: '#6b42e4ff', mb: 1.5 }} />
                    <Typography variant="h4" sx={{ color: '#1a202c', fontWeight: 700, mb: 0.5 }}>
                      {new Set(properties.map(p => p.location.split(',')[1]?.trim() || p.location)).size}+
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#4a5568' }}>
                      Locations Available
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Card 
                  sx={{ 
                    backgroundColor: 'white', 
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(0, 0, 0, 0.15)'
                    }
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <VerifiedIcon sx={{ fontSize: 48, color: '#09b66eff', mb: 1.5 }} />
                    <Typography variant="h4" sx={{ color: '#1a202c', fontWeight: 700, mb: 0.5 }}>
                      100%
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#4a5568' }}>
                      Verified Listings
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Content Section - Separate from Hero */}
      <Box
        sx={{
          background: '#f7fafc',
          position: 'relative',
          minHeight: '100vh',
          px: { xs: 2, md: 0 }
        }}
      >
        <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
          {/* Search Section */}
          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 3, md: 5 }, 
              mb: 6, 
              borderRadius: 4,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              border: '2px solid #e2e8f0',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: 'linear-gradient(90deg, #60a5fa 0%, #a78bfa 50%, #60a5fa 100%)',
              }
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 5 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  boxShadow: '0 8px 24px rgba(96, 165, 250, 0.4)',
                }}
              >
                <SearchIcon sx={{ fontSize: 32, color: 'white' }} />
              </Box>
              <Typography 
                variant="h4" 
                component="h2" 
                gutterBottom 
                sx={{ 
                  fontWeight: 800,
                  color: '#1a202c',
                  letterSpacing: '-0.02em',
                  mb: 1.5,
                }}
              >
                {properties.length === 0 ? 'Ready to Get Started?' : 'Search Your Dream Property'}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  fontSize: '1.1rem',
                  color: '#4a5568',
                  maxWidth: '600px',
                  mx: 'auto',
                  lineHeight: 1.6,
                }}
              >
                {properties.length === 0 
                  ? 'Add your first property to start building your real estate portfolio'
                  : 'Use our smart filters to find properties that perfectly match your requirements'}
              </Typography>
            </Box>
            <PropertyFilters filters={filters} onFilterChange={handleFilterChange} />
          </Paper>

          {/* Results Section */}
          {loading ? (
            <Box sx={{ textAlign: 'center', py: 10 }}>
              <CircularProgress size={60} sx={{ mb: 3, color: '#667eea' }} />
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold',
                  color: '#1a202c',
                }}
              >
                Loading Properties
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#4a5568',
                }}
              >
                Please wait while we fetch the latest listings...
              </Typography>
            </Box>
          ) : filteredProperties.length === 0 ? (
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
                {properties.length === 0 ? (
                  <HomeIcon sx={{ fontSize: 40, color: '#4a5568' }} />
                ) : (
                  <SearchIcon sx={{ fontSize: 40, color: '#4a5568' }} />
                )}
              </Box>
              <Typography 
                variant="h5" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold',
                  color: '#1a202c',
                }}
              >
                {properties.length === 0 ? 'Welcome to TrueHomes!' : 'No Matching Properties'}
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  mb: 4,
                  color: '#4a5568',
                }}
              >
                {properties.length === 0 
                  ? 'Start building your property portfolio by listing your first property!'
                  : 'Try adjusting your search criteria to find more properties.'}
              </Typography>
              {properties.length > 0 && (
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<RefreshIcon />}
                  onClick={clearFilters}
                  sx={{ 
                    px: 4, 
                    py: 1.5,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
                    color: 'white',
                    boxShadow: '0 4px 15px rgba(96, 165, 250, 0.4)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.6)',
                    },
                  }}
                >
                  Clear All Filters
                </Button>
              )}
            </Box>
          ) : (
            <>
              {/* Results Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                  <Typography 
                    variant="h4" 
                    component="h2" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 700,
                      color: '#1a202c',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    Available Properties
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      fontSize: '1.05rem',
                      color: '#4a5568',
                    }}
                  >
                    Showing {filteredProperties.length} of {properties.length} properties
                  </Typography>
                </Box>
                <Box
                  sx={{
                    px: 3,
                    py: 1.5,
                    borderRadius: 3,
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                  }}
                >
                  <VerifiedIcon sx={{ color: '#4ade80', fontSize: '1.2rem' }} />
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#1a202c',
                      fontWeight: 600,
                    }}
                  >
                    Recently Updated
                  </Typography>
                </Box>
              </Box>

              {/* Properties Grid */}
              <Grid container spacing={4} sx={{ mb: 6 }}>
                {filteredProperties.map((property) => (
                  <Grid item xs={12} sm={6} lg={4} key={property.id}>
                    <PropertyCard property={property} />
                  </Grid>
                ))}
              </Grid>

              {/* Load More Section */}
              {filteredProperties.length >= 9 && (
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 3,
                      py: 1.5,
                      borderRadius: 3,
                      background: 'white',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
                    }}
                  >
                    <VerifiedIcon sx={{ color: '#4ade80', fontSize: '1.2rem' }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#1a202c',
                        fontWeight: 600,
                      }}
                    >
                      All properties loaded
                    </Typography>
                  </Box>
                </Box>
              )}
            </>
          )}
        </Container>

        {/* Features Section */}
        <Container maxWidth="lg" sx={{ py: 10 }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              variant="h3" 
              component="h2" 
              gutterBottom 
              sx={{ 
                fontWeight: 700,
                color: '#1a202c',
                letterSpacing: '-0.02em',
              }}
            >
              Why Choose TrueHomes?
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                maxWidth: '700px', 
                mx: 'auto',
                fontWeight: 400,
                lineHeight: 1.6,
                color: '#4a5568',
              }}
            >
              We provide the best platform for buying and selling properties with advanced features and trusted service
            </Typography>
          </Box>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box
                sx={{ 
                  textAlign: 'center', 
                  p: 4, 
                  height: '100%',
                  borderRadius: 4,
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                  }
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(37, 99, 235, 0.9) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)',
                  }}
                >
                  <SearchIcon sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 700, 
                    mb: 2,
                    color: '#1a202c',
                  }}
                >
                  Smart Search
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    lineHeight: 1.7,
                    color: '#4a5568',
                  }}
                >
                  Advanced filtering system to find exactly what you're looking for
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box
                sx={{ 
                  textAlign: 'center', 
                  p: 4, 
                  height: '100%',
                  borderRadius: 4,
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                  }
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.8) 0%, rgba(5, 150, 105, 0.9) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
                  }}
                >
                  <VerifiedIcon sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 700, 
                    mb: 2,
                    color: '#1a202c',
                  }}
                >
                  Verified Listings
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    lineHeight: 1.7,
                    color: '#4a5568',
                  }}
                >
                  All properties are verified for authenticity and accuracy
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Box
                sx={{ 
                  textAlign: 'center', 
                  p: 4, 
                  height: '100%',
                  borderRadius: 4,
                  background: 'white',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                  }
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.8) 0%, rgba(124, 58, 237, 0.9) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 3,
                    boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)',
                  }}
                >
                  <SpeedIcon sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography 
                  variant="h5" 
                  gutterBottom 
                  sx={{ 
                    fontWeight: 700, 
                    mb: 2,
                    color: '#1a202c',
                  }}
                >
                  Fast & Secure
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{ 
                    lineHeight: 1.7,
                    color: '#4a5568',
                  }}
                >
                  Lightning-fast search with secure user authentication
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}

export default HomePage;