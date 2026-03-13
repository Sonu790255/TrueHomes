import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip,
  Dialog,
  DialogContent,
  Button,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Bed as BedIcon,
  Bathtub as BathIcon,
  SquareFoot as AreaIcon,
  Edit as EditIcon,
  Star as StarIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { formatPrice } from '../utils/formatters';

function PropertyCard({ property, showEditButton = false }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  
  if (!property) {
    return null;
  }

  const handleCardClick = (e) => {
    e.preventDefault();
    if (!currentUser) {
      setLoginDialogOpen(true);
    } else {
      navigate(`/property/${property.id}`);
    }
  };


  const calculateAverageRating = () => {
    if (!property.ratings || property.ratings.length === 0) return 0;
    const sum = property.ratings.reduce((acc, r) => acc + r.rating, 0);
    return (sum / property.ratings.length).toFixed(1);
  };

  // Check if current user owns this property
  const isOwner = currentUser && property.sellerId === currentUser.uid;

  return (
    <>
    <Card
      onClick={handleCardClick}
      className="property-card"
      elevation={0}
      sx={{
        textDecoration: 'none',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderRadius: 4,
        background: 'white',
        border: '1px solid #e2e8f0',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        '&:hover': {
          textDecoration: 'none',
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
          border: '1px solid #cbd5e0',
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={property.images && property.images.length > 0 ? property.images[0] : '/api/placeholder/400/200'}
          alt={property.title || 'Property image'}
          sx={{
            objectFit: 'cover',
            backgroundColor: 'grey.200',
          }}
          onError={(e) => {
            e.target.src = '/api/placeholder/400/200';
          }}
        />
        <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 2 }}>
          <Chip
            label={property.type === 'sale' ? 'For Sale' : property.type === 'rent' ? 'For Rent' : 'Property'}
            size="small"
            sx={{
              fontWeight: 'bold',
              color: 'white',
              background: property.type === 'sale' 
                ? 'rgba(74, 222, 128, 0.9)' 
                : 'rgba(59, 130, 246, 0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            }}
          />
        </Box>
        {/* Edit Button for Property Owner */}
        {(showEditButton || isOwner) && (
          <Box sx={{ position: 'absolute', top: 12, left: 12, zIndex: 2 }}>
            <Tooltip title="Edit Property">
              <IconButton
                component={Link}
                to={`/edit-property/${property.id}`}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 1)',
                    transform: 'scale(1.05)',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
                  },
                  width: 40,
                  height: 40,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <EditIcon sx={{ fontSize: 20, color: 'primary.main' }} />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: '#1a202c',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {property.title || 'Untitled Property'}
        </Typography>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            color: '#4ade80',
            mb: 1,
          }}
        >
          {formatPrice(property.price)}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
          <StarIcon sx={{ color: '#fbbf24', fontSize: 18 }} />
          <Typography variant="body2" sx={{ color: '#1a202c', fontWeight: 600 }}>
            {calculateAverageRating()}
          </Typography>
          <Typography variant="caption" sx={{ color: '#718096' }}>
            ({property.ratings?.length || 0})
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: '#4a5568' }}>
          <LocationIcon sx={{ fontSize: 18, mr: 1 }} />
          <Typography variant="body2">
            {property.location || 'Location not specified'}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', color: '#718096' }}>
            <BedIcon sx={{ fontSize: 16, mr: 0.5 }} />
            <Typography variant="caption">
              {property.bedrooms || 0} Beds
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', color: '#718096' }}>
            <BathIcon sx={{ fontSize: 16, mr: 0.5 }} />
            <Typography variant="caption">
              {property.bathrooms || 0} Baths
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', color: '#718096' }}>
            <AreaIcon sx={{ fontSize: 16, mr: 0.5 }} />
            <Typography variant="caption">
              {property.area || 0} sq ft
            </Typography>
          </Box>
        </Box>

        {!currentUser && (
          <Box
            sx={{
              mt: 2,
              pt: 2,
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1,
            }}
          >
            <Typography variant="caption" sx={{ color: '#60a5fa', fontWeight: 600 }}>
              Login to view full details
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>

    {/* Login Dialog */}
    <Dialog
      open={loginDialogOpen}
      onClose={() => setLoginDialogOpen(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: 'white',
        }
      }}
    >
      <DialogContent sx={{ p: 5, textAlign: 'center' }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
            boxShadow: '0 8px 25px rgba(96, 165, 250, 0.3)',
          }}
        >
          <LockIcon sx={{ fontSize: 40, color: 'white' }} />
        </Box>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: '#1a202c',
            mb: 2,
          }}
        >
          Login Required
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: '#4a5568',
            mb: 4,
            lineHeight: 1.6,
          }}
        >
          Please login to view full property details, contact information, and more features.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => {
              setLoginDialogOpen(false);
              navigate('/login');
            }}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 3,
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
              boxShadow: '0 4px 15px rgba(96, 165, 250, 0.4)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(96, 165, 250, 0.6)',
              },
            }}
          >
            Login
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => {
              setLoginDialogOpen(false);
              navigate('/signup');
            }}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 3,
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              borderColor: '#60a5fa',
              color: '#60a5fa',
              borderWidth: '2px',
              transition: 'all 0.3s ease',
              '&:hover': {
                borderWidth: '2px',
                borderColor: '#3b82f6',
                background: 'rgba(96, 165, 250, 0.1)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            Sign Up
          </Button>
        </Box>
        <Button
          onClick={() => setLoginDialogOpen(false)}
          sx={{
            mt: 3,
            color: '#718096',
            textTransform: 'none',
            '&:hover': {
              background: 'transparent',
              color: '#4a5568',
            }
          }}
        >
          Maybe Later
        </Button>
      </DialogContent>
    </Dialog>
  </>
  );
}

export default PropertyCard;
