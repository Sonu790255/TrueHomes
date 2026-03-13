import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import {
  Home as HomeIcon,
  AttachMoney as MoneyIcon,
  LocationOn as LocationIcon,
  Description as DescriptionIcon,
  Image as ImageIcon,
  Bed as BedIcon,
  Bathtub as BathIcon,
  SquareFoot as AreaIcon,
  Add as AddIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { db } from '../firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';

function AddProperty() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    type: 'sale',
    bedrooms: '',
    bathrooms: '',
    area: '',
    sellerName: '',
    contact: '',
    mobile: '',
    images: [{ file: null, preview: '' }]
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
  };

  const handleFileUpload = (index, event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size should be less than 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        handleImageChange(index, { file: file, preview: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, { file: null, preview: '' }]
    }));
  };

  const removeImageField = (index) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        images: newImages
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('You must be logged in to add a property.');
      return;
    }

    try {
      setError('');
      setSuccess('');
      setLoading(true);

      // Filter out empty images
      const validImages = formData.images.filter(img => img.file !== null);

      if (validImages.length === 0) {
        throw new Error('Please upload at least one property image.');
      }

      const imageUrls = [];

      // Upload images to Cloudinary
      for (const image of validImages) {
        const formData = new FormData();
        formData.append('file', image.file);
        formData.append('upload_preset', 'property_images'); // Cloudinary upload preset

        const response = await fetch('https://api.cloudinary.com/v1_1/dnrjfft7o/image/upload', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          throw new Error('Failed to upload an image to Cloudinary');
        }

        const data = await response.json();
        // Use the secure URL provided by Cloudinary
        imageUrls.push(data.secure_url);
      }

      const propertyData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        location: formData.location,
        type: formData.type,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        area: parseInt(formData.area),
        sellerName: formData.sellerName,
        contact: formData.contact || currentUser.email,
        mobile: formData.mobile,
        images: imageUrls,
        sellerId: currentUser.uid,
        sellerEmail: currentUser.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Add to Firestore
      const docRef = await addDoc(collection(db, "properties"), propertyData);
      
      setSuccess('Property added successfully!');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        price: '',
        location: '',
        type: 'sale',
        bedrooms: '',
        bathrooms: '',
        area: '',
        sellerName: '',
        contact: '',
        mobile: '',
        images: [{ file: null, preview: '' }]
      });

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/my-properties');
      }, 2000);

    } catch (err) {
      console.error(err);
      setError('Failed to add property: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 3,
      backgroundColor: '#f8fafc',
      transition: 'all 0.3s ease',
      '& fieldset': {
        borderColor: '#e2e8f0',
        borderWidth: '2px',
      },
      '&:hover fieldset': {
        borderColor: '#cbd5e0',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#60a5fa',
        borderWidth: '2px',
      },
      '&.Mui-focused': {
        backgroundColor: 'white',
        boxShadow: '0 0 0 3px rgba(96, 165, 250, 0.1)',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#4a5568',
      fontWeight: 600,
      '&.Mui-focused': {
        color: '#60a5fa',
      },
    },
    '& .MuiInputBase-input': {
      color: '#1a202c',
      fontWeight: 500,
    },
  };

  const selectStyles = {
    ...textFieldStyles,
    '& .MuiSelect-select': {
      color: '#1a202c',
      fontWeight: 500,
    },
    '& .MuiSelect-icon': {
      color: '#4a5568',
    },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#f7fafc',
        paddingTop: '72px',
        paddingBottom: '40px',
      }}
    >
      <Container maxWidth="md">
        <Paper 
          elevation={3}
          sx={{ 
            p: { xs: 2.5, md: 4 }, 
            borderRadius: 4,
            background: 'white',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            maxWidth: '800px',
            mx: 'auto',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
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
              <HomeIcon sx={{ fontSize: 40, color: 'white' }} />
            </Box>
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                color: '#1a202c',
                mb: 1,
                fontSize: { xs: '1.75rem', md: '3rem' }
              }}
            >
              Add New Property
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#4a5568',
                fontSize: '1.1rem',
                maxWidth: '500px',
                mx: 'auto',
                lineHeight: 1.6,
              }}
            >
              Fill in the details below to list your property and reach potential buyers or renters
            </Typography>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 3,
                '& .MuiAlert-icon': {
                  color: '#ef4444'
                }
              }}
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert 
              severity="success" 
              sx={{ 
                mb: 3,
                borderRadius: 3,
                '& .MuiAlert-icon': {
                  color: '#10b981'
                }
              }}
            >
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Box sx={{ mb: 4 }}>
                  <Typography 
                    variant="h5" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 'bold', 
                      mb: 3,
                      color: '#1a202c',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <HomeIcon sx={{ fontSize: 20, color: 'white' }} />
                    </Box>
                    Basic Information
                  </Typography>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Property Title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      required
                      placeholder="e.g., Beautiful 3BR House in Downtown"
                      sx={textFieldStyles}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <HomeIcon sx={{ color: '#4a5568' }} />
                            </InputAdornment>
                          ),
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      required
                      placeholder="Enter price in INR"
                      sx={textFieldStyles}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <Typography sx={{ color: '#4a5568', fontWeight: 600 }}>₹</Typography>
                            </InputAdornment>
                          ),
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth sx={selectStyles}>
                      <InputLabel sx={{ color: '#4a5568', fontWeight: 600 }}>
                        Type
                      </InputLabel>
                      <Select
                        value={formData.type}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        label="Type"
                        MenuProps={{
                          PaperProps: {
                            sx: {
                              background: 'white',
                              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                              border: '1px solid #e2e8f0',
                              borderRadius: 2,
                              mt: 1,
                            }
                          }
                        }}
                      >
                        <MenuItem value="sale">For Sale</MenuItem>
                        <MenuItem value="rent">For Rent</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      required
                      placeholder="e.g., New York, NY"
                      sx={textFieldStyles}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationIcon sx={{ color: '#4a5568' }} />
                            </InputAdornment>
                          ),
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      multiline
                      rows={4}
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      required
                      placeholder="Describe your property..."
                      sx={textFieldStyles}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                              <DescriptionIcon sx={{ color: '#4a5568' }} />
                            </InputAdornment>
                          ),
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Property Details */}
              <Grid item xs={12}>
                <Box sx={{ mb: 4 }}>
                  <Typography 
                    variant="h5" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 'bold', 
                      mb: 3,
                      color: '#1a202c',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <BedIcon sx={{ fontSize: 20, color: 'white' }} />
                    </Box>
                    Property Details
                  </Typography>
                </Box>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Bedrooms"
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                      required
                      sx={textFieldStyles}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <BedIcon sx={{ color: '#4a5568' }} />
                            </InputAdornment>
                          ),
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Bathrooms"
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                      required
                      sx={textFieldStyles}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <BathIcon sx={{ color: '#4a5568' }} />
                            </InputAdornment>
                          ),
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      fullWidth
                      label="Area (sq ft)"
                      type="number"
                      value={formData.area}
                      onChange={(e) => handleInputChange('area', e.target.value)}
                      required
                      sx={textFieldStyles}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <AreaIcon sx={{ color: '#4a5568' }} />
                            </InputAdornment>
                          ),
                        }
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Contact Email"
                      type="email"
                      value={formData.contact}
                      onChange={(e) => handleInputChange('contact', e.target.value)}
                      placeholder={currentUser?.email || 'Enter contact email'}
                      sx={textFieldStyles}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Mobile Number"
                      type="tel"
                      value={formData.mobile}
                      onChange={(e) => handleInputChange('mobile', e.target.value)}
                      placeholder="+91 98765 43210"
                      sx={textFieldStyles}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Seller Name"
                      value={formData.sellerName}
                      onChange={(e) => handleInputChange('sellerName', e.target.value)}
                      required
                      placeholder="Enter your full name"
                      sx={textFieldStyles}
                      slotProps={{
                        input: {
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon sx={{ color: '#4a5568' }} />
                            </InputAdornment>
                          ),
                        }
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Images */}
              <Grid item xs={12}>
                <Box sx={{ mb: 4 }}>
                  <Typography 
                    variant="h5" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 'bold', 
                      mb: 3,
                      color: '#1a202c',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '10px',
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ImageIcon sx={{ fontSize: 20, color: 'white' }} />
                    </Box>
                    Property Images
                  </Typography>
                </Box>
                
                {formData.images.map((image, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 2, border: '2px dashed #e2e8f0', borderRadius: 3, p: 2, backgroundColor: '#f8fafc' }}>
                      {image.preview ? (
                        <Box sx={{ position: 'relative', width: 80, height: 80 }}>
                          <img src={image.preview} alt={`Preview ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                        </Box>
                      ) : (
                        <Box sx={{ width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e2e8f0', borderRadius: '8px' }}>
                          <ImageIcon sx={{ color: '#a0aec0', fontSize: 40 }} />
                        </Box>
                      )}
                      <Box>
                        <Button
                          variant="outlined"
                          component="label"
                          sx={{ textTransform: 'none', borderRadius: 2 }}
                        >
                          {image.file || image.preview ? 'Change Image' : 'Upload Image'}
                          <input
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={(e) => handleFileUpload(index, e)}
                          />
                        </Button>
                        {!image.preview && (
                          <Typography variant="caption" display="block" sx={{ mt: 1, color: '#718096' }}>
                            JPG, PNG, GIF up to 5MB
                          </Typography>
                        )}
                      </Box>
                    </Box>
                    {formData.images.length > 1 && (
                      <Button
                        onClick={() => removeImageField(index)}
                        sx={{ 
                          ml: 2, 
                          minWidth: 'auto',
                          color: '#ef4444',
                          borderColor: '#ef4444',
                          height: 'fit-content',
                          '&:hover': {
                            background: 'rgba(239, 68, 68, 0.1)',
                            borderColor: '#dc2626',
                          }
                        }}
                        variant="outlined"
                      >
                        <RemoveIcon />
                      </Button>
                    )}
                  </Box>
                ))}
                
                <Button
                  onClick={addImageField}
                  startIcon={<AddIcon />}
                  sx={{
                    color: '#60a5fa',
                    fontWeight: 600,
                    textTransform: 'none',
                    background: 'rgba(96, 165, 250, 0.1)',
                    border: '2px solid rgba(96, 165, 250, 0.2)',
                    borderRadius: 3,
                    px: 3,
                    py: 1.5,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(96, 165, 250, 0.15)',
                      borderColor: 'rgba(96, 165, 250, 0.3)',
                      transform: 'translateY(-1px)',
                    }
                  }}
                >
                  Add Another Image
                </Button>
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    py: 2.5,
                    mt: 4,
                    borderRadius: 3,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    textTransform: 'none',
                    background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
                    boxShadow: '0 8px 25px rgba(96, 165, 250, 0.3)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 35px rgba(96, 165, 250, 0.4)',
                    },
                    '&:disabled': {
                      background: '#cbd5e0',
                      color: '#a0aec0',
                      boxShadow: 'none',
                    },
                  }}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                      Adding Property...
                    </>
                  ) : (
                    'Add Property'
                  )}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default AddProperty;