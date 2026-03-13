import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  Card,
  CardContent,
} from '@mui/material';
import {
  Edit as EditIcon,
  AttachMoney as MoneyIcon,
  LocationOn as LocationIcon,
  Description as DescriptionIcon,
  Image as ImageIcon,
  Bed as BedIcon,
  Bathtub as BathIcon,
  SquareFoot as AreaIcon,
  Cancel as CancelIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { db } from '../firebase/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

function EditProperty() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [property, setProperty] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    type: 'sale',
    bedrooms: '',
    bathrooms: '',
    area: '',
    contact: '',
    images: [{ file: null, preview: '', existingUrl: '' }]
  });

  useEffect(() => {
    fetchProperty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, currentUser]);

  const fetchProperty = async () => {
    try {
      const docRef = doc(db, 'properties', id);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        setError('Property not found.');
        setLoading(false);
        return;
      }

      const foundProperty = { id: docSnap.id, ...docSnap.data() };

      // Check if user owns this property
      if (foundProperty.sellerId !== currentUser?.uid) {
        setError('You are not authorized to edit this property.');
        setLoading(false);
        return;
      }

      setProperty(foundProperty);
      
      // Map existing image URLs to the new images state structure
      const initialImages = foundProperty.images?.length > 0
        ? foundProperty.images.map(url => ({ file: null, preview: url, existingUrl: url }))
        : [{ file: null, preview: '', existingUrl: '' }];

      setFormData({
        title: foundProperty.title || '',
        description: foundProperty.description || '',
        price: foundProperty.price?.toString() || '',
        location: foundProperty.location || '',
        type: foundProperty.type || 'sale',
        bedrooms: foundProperty.bedrooms?.toString() || '',
        bathrooms: foundProperty.bathrooms?.toString() || '',
        area: foundProperty.area?.toString() || '',
        contact: foundProperty.contact || '',
        images: initialImages
      });
    } catch (error) {
      console.error('Error fetching property:', error);
      setError('Failed to load property data.');
    } finally {
      setLoading(false);
    }
  };

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
        handleImageChange(index, { file: file, preview: reader.result, existingUrl: '' });
      };
      reader.readAsDataURL(file);
    }
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, { file: null, preview: '', existingUrl: '' }]
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
    
    try {
      setError('');
      setSuccess('');
      setSaving(true);

      // Filter out empty images
      const validImages = formData.images.filter(img => img.file !== null || img.existingUrl !== '');
      
      if (validImages.length === 0) {
        throw new Error('Please have at least one property image.');
      }

      const imageUrls = [];

      // Upload new images and reuse existing URLs
      for (const image of validImages) {
        if (image.existingUrl) {
          imageUrls.push(image.existingUrl);
        } else if (image.file) {
          const uploadData = new FormData();
          uploadData.append('file', image.file);
          uploadData.append('upload_preset', 'property_images');

          const response = await fetch('https://api.cloudinary.com/v1_1/dnrjfft7o/image/upload', {
            method: 'POST',
            body: uploadData
          });

          if (!response.ok) {
            throw new Error('Failed to upload an image to Cloudinary');
          }

          const data = await response.json();
          imageUrls.push(data.secure_url);
        }
      }

      const updatedData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        location: formData.location,
        type: formData.type,
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        area: parseInt(formData.area),
        contact: formData.contact || currentUser.email,
        images: imageUrls,
        updatedAt: new Date().toISOString()
      };

      // Update Firestore document
      const docRef = doc(db, 'properties', id);
      await updateDoc(docRef, updatedData);
      
      setSuccess('Property updated successfully!');
      setTimeout(() => {
        navigate(`/property/${id}`);
      }, 2000);

    } catch (err) {
      console.error('Error updating property:', err);
      setError('Failed to update property: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate(`/property/${id}`);
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        paddingTop: '72px',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ mb: 3 }} />
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
            Loading Property
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please wait while we fetch the property details...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error && !property) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        paddingTop: '72px',
        paddingBottom: '40px',
      }}>
        <Container maxWidth="md">
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
            <Button
              variant="contained"
              onClick={() => navigate('/my-properties')}
            >
              Back to My Properties
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      paddingTop: '72px',
      paddingBottom: '40px',
    }}>
      <Container maxWidth="md" sx={{ px: { xs: 2.5, md: 0 } }}>
        <Paper elevation={3} sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 3 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <EditIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
            <Typography 
              variant="h3" 
              component="h1" 
              gutterBottom 
              sx={{ 
                fontWeight: 'bold',
                fontSize: { xs: '1.75rem', md: '3rem' }
              }}
            >
              Edit Property
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Update your property details below
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {/* Basic Information */}
              <Grid item xs={12}>
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                      Basic Information
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label="Property Title"
                          value={formData.title}
                          onChange={(e) => handleInputChange('title', e.target.value)}
                          required
                          placeholder="e.g., Beautiful 3BR House in Downtown"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <EditIcon color="action" />
                              </InputAdornment>
                            ),
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
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <MoneyIcon color="action" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <FormControl fullWidth required>
                          <InputLabel>Property Type</InputLabel>
                          <Select
                            value={formData.type}
                            onChange={(e) => handleInputChange('type', e.target.value)}
                            label="Property Type"
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
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <LocationIcon color="action" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Property Details */}
              <Grid item xs={12}>
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                      Property Details
                    </Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={4}>
                        <TextField
                          fullWidth
                          label="Bedrooms"
                          type="number"
                          value={formData.bedrooms}
                          onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                          required
                          inputProps={{ min: 0 }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <BedIcon color="action" />
                              </InputAdornment>
                            ),
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
                          inputProps={{ min: 0 }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <BathIcon color="action" />
                              </InputAdornment>
                            ),
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
                          inputProps={{ min: 0 }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <AreaIcon color="action" />
                              </InputAdornment>
                            ),
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
                          placeholder="Describe your property in detail..."
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                                <DescriptionIcon color="action" />
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>

              {/* Images */}
              <Grid item xs={12}>
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                      Property Images
                    </Typography>
                    
                    {formData.images.map((image, index) => (
                      <Box key={index} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 2, border: '1px dashed #ccc', borderRadius: 2, p: 2 }}>
                          {image.preview ? (
                            <Box sx={{ width: 80, height: 80, flexShrink: 0 }}>
                              <img src={image.preview} alt={`Preview ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }} />
                            </Box>
                          ) : (
                            <Box sx={{ width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', borderRadius: '4px', flexShrink: 0 }}>
                              <ImageIcon sx={{ color: '#bdbdbd', fontSize: 32 }} />
                            </Box>
                          )}
                          <Box>
                            <Button
                              variant="outlined"
                              component="label"
                              sx={{ textTransform: 'none' }}
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
                                Up to 5MB
                              </Typography>
                            )}
                          </Box>
                        </Box>
                        {formData.images.length > 1 && (
                          <Button
                            variant="outlined"
                            color="error"
                            onClick={() => removeImageField(index)}
                            sx={{ minWidth: 'auto', px: 2, height: 'fit-content' }}
                          >
                            ×
                          </Button>
                        )}
                      </Box>
                    ))}
                    
                    <Button
                      variant="outlined"
                      onClick={addImageField}
                      sx={{ mt: 1 }}
                    >
                      Add Another Image
                    </Button>
                  </CardContent>
                </Card>
              </Grid>

              {/* Contact Information */}
              <Grid item xs={12}>
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
                      Contact Information
                    </Typography>
                    
                    <TextField
                      fullWidth
                      label="Contact Email"
                      type="email"
                      value={formData.contact}
                      onChange={(e) => handleInputChange('contact', e.target.value)}
                      placeholder={currentUser?.email || 'your@email.com'}
                      helperText="Leave empty to use your account email"
                    />
                  </CardContent>
                </Card>
              </Grid>

              {/* Action Buttons */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<CancelIcon />}
                    onClick={handleCancel}
                    sx={{ px: 4, py: 1.5 }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={saving}
                    startIcon={saving ? <CircularProgress size={20} /> : <SaveIcon />}
                    sx={{ px: 4, py: 1.5 }}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default EditProperty;