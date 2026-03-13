import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  Chip,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  LocationOn as LocationIcon,
  Bed as BedIcon,
  Bathtub as BathIcon,
  SquareFoot as AreaIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Message as MessageIcon,
  Comment as CommentIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Lock as LockIcon,
} from '@mui/icons-material';
import { db } from '../firebase/firebase';
import { doc, getDoc, updateDoc, deleteDoc, collection, addDoc } from 'firebase/firestore';
import { formatPrice } from '../utils/formatters';

function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messageSent, setMessageSent] = useState(false);
  const [comment, setComment] = useState('');
  const [commentSubmitted, setCommentSubmitted] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [loginDialogOpen, setLoginDialogOpen] = useState(false);
  const [loginDialogMessage, setLoginDialogMessage] = useState('');
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (id) {
      fetchProperty();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, currentUser]);

  const fetchProperty = async () => {
    try {
      const docRef = doc(db, 'properties', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const foundProperty = { id: docSnap.id, ...docSnap.data() };
        setProperty(foundProperty);

        if (currentUser && foundProperty.ratings) {
          const existingRating = foundProperty.ratings.find(r => r.userId === currentUser.uid);
          if (existingRating) {
            setUserRating(existingRating.rating);
          }
        }
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Error fetching property:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const calculateAverageRating = () => {
    if (!property || !property.ratings || property.ratings.length === 0) return 0;
    const sum = property.ratings.reduce((acc, r) => acc + r.rating, 0);
    return (sum / property.ratings.length).toFixed(1);
  };

  const handleRating = async (rating) => {
    if (!currentUser) {
      setLoginDialogMessage('Please login to rate this property and share your experience with others.');
      setLoginDialogOpen(true);
      return;
    }

    if (isOwner) {
      setErrorMessage('You cannot rate your own property');
      setErrorDialogOpen(true);
      return;
    }

    try {
      const docRef = doc(db, 'properties', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const propertyData = docSnap.data();
        let ratings = propertyData.ratings || [];

        const existingRatingIndex = ratings.findIndex(
          r => r.userId === currentUser.uid
        );

        if (existingRatingIndex !== -1) {
          ratings[existingRatingIndex].rating = rating;
        } else {
          ratings.push({
            userId: currentUser.uid,
            userEmail: currentUser.email,
            rating: rating,
            timestamp: new Date().toISOString()
          });
        }

        await updateDoc(docRef, { ratings });
        setProperty(prev => ({ ...prev, ratings }));
        setUserRating(rating);
        setRatingSubmitted(true);
        
        setTimeout(() => {
          setRatingSubmitted(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error adding rating:', error);
      setErrorMessage('Failed to add rating. Please try again.');
      setErrorDialogOpen(true);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'properties', id));
      navigate('/my-properties');
    } catch (error) {
      console.error('Error deleting property:', error);
      setErrorMessage('Failed to delete property. Please try again.');
      setErrorDialogOpen(true);
    }
    setDeleteDialogOpen(false);
  };

  const handleSendMessage = async () => {
    if (!currentUser) {
      setLoginDialogMessage('Please login to send messages to property sellers.');
      setLoginDialogOpen(true);
      return;
    }

    if (!message.trim()) {
      return;
    }

    try {
      const newMessage = {
        propertyId: property.id,
        propertyTitle: property.title,
        propertyImage: property.images && property.images.length > 0 ? property.images[0] : null,
        senderId: currentUser.uid,
        senderEmail: currentUser.email,
        receiverId: property.sellerId,
        receiverEmail: property.sellerEmail,
        message: message.trim(),
        timestamp: new Date().toISOString(),
        read: false
      };
      
      await addDoc(collection(db, 'messages'), newMessage);
      
      setMessageSent(true);
      setTimeout(() => {
        setMessageDialogOpen(false);
        setMessage('');
        setMessageSent(false);
        navigate('/messages');
      }, 1500);
    } catch (error) {
      console.error('Error sending message:', error);
      setErrorMessage('Failed to send message. Please try again.');
      setErrorDialogOpen(true);
    }
  };

  const handleAddComment = async () => {
    if (!currentUser) {
      setLoginDialogMessage('Please login to add comments and share your thoughts about this property.');
      setLoginDialogOpen(true);
      return;
    }

    if (!comment.trim()) {
      return;
    }

    try {
      const docRef = doc(db, 'properties', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const propertyData = docSnap.data();
        let comments = propertyData.comments || [];

        const newComment = {
          id: Date.now().toString(),
          userId: currentUser.uid,
          userEmail: currentUser.email,
          comment: comment,
          timestamp: new Date().toISOString()
        };

        comments.unshift(newComment);
        await updateDoc(docRef, { comments });
        
        setProperty(prev => ({ ...prev, comments }));
        setComment('');
        setCommentSubmitted(true);
        
        setTimeout(() => {
          setCommentSubmitted(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      setErrorMessage('Failed to add comment. Please try again.');
      setErrorDialogOpen(true);
    }
  };


  const nextImage = () => {
    setCurrentImageIndex(prev => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        paddingTop: '72px',
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ mb: 2, color: '#3182ce' }} />
          <Typography variant="h6" sx={{ color: '#1a202c' }}>
            Loading property details...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (!property) {
    return null;
  }

  const isOwner = currentUser && currentUser.uid === property.sellerId;

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      paddingTop: '72px',
      paddingBottom: '40px',
    }}>
      <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3 }}
          color="primary"
        >
          Back to listings
        </Button>

        <Paper 
          elevation={0} 
          sx={{ 
            overflow: 'hidden', 
            borderRadius: 4,
            background: 'white',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          }}
        >
          {/* Image Gallery */}
          <Box sx={{ position: 'relative' }}>
            {property.images && property.images.length > 0 ? (
              <>
                <Box
                  component="img"
                  src={property.images[currentImageIndex]}
                  alt={property.title}
                  sx={{
                    width: '100%',
                    height: { xs: 300, md: 450 },
                    objectFit: 'cover',
                    backgroundColor: 'grey.200',
                  }}
                />
                {property.images.length > 1 && (
                  <>
                    <IconButton
                      onClick={prevImage}
                      sx={{
                        position: 'absolute',
                        left: 16,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        },
                      }}
                    >
                      <ChevronLeftIcon />
                    </IconButton>
                    <IconButton
                      onClick={nextImage}
                      sx={{
                        position: 'absolute',
                        right: 16,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        },
                      }}
                    >
                      <ChevronRightIcon />
                    </IconButton>
                    <Box
                      sx={{
                        position: 'absolute',
                        bottom: 16,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        display: 'flex',
                        gap: 1,
                      }}
                    >
                      {property.images.map((_, index) => (
                        <Box
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: index === currentImageIndex ? 'primary.main' : 'rgba(255, 255, 255, 0.5)',
                            cursor: 'pointer',
                          }}
                        />
                      ))}
                    </Box>
                  </>
                )}
                {property.images.length > 1 && (
                  <Box sx={{ p: 2, display: 'flex', gap: 1, overflowX: 'auto' }}>
                    {property.images.map((image, index) => (
                      <Box
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        sx={{
                          flexShrink: 0,
                          width: 80,
                          height: 80,
                          borderRadius: 1,
                          overflow: 'hidden',
                          border: 2,
                          borderColor: index === currentImageIndex ? 'primary.main' : 'grey.300',
                          cursor: 'pointer',
                        }}
                      >
                        <Box
                          component="img"
                          src={image}
                          alt={`${property.title} ${index + 1}`}
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                )}
              </>
            ) : (
              <Box
                sx={{
                  height: { xs: 300, md: 450 },
                  backgroundColor: 'grey.200',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'grey.400',
                }}
              >
                <Typography variant="h6">No Image Available</Typography>
              </Box>
            )}
          </Box>

          {/* Property Details */}
          <Box sx={{ p: { xs: 2.5, md: 4 } }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between', 
              alignItems: { xs: 'flex-start', md: 'flex-start' }, 
              gap: 2,
              mb: 3 
            }}>
              <Box>
                <Typography variant="h3" component="h1" gutterBottom sx={{ 
                  fontWeight: 'bold',
                  color: '#1a202c',
                  fontSize: { xs: '1.75rem', md: '3rem' }
                }}>
                  {property.title}
                </Typography>
                <Typography variant="h4" sx={{ 
                  color: '#4ade80', 
                  fontWeight: 'bold', 
                  mb: 2,
                  fontSize: { xs: '1.5rem', md: '2.125rem' }
                }}>
                  {formatPrice(property.price)}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Box
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => handleRating(star)}
                      sx={{ cursor: 'pointer' }}
                    >
                      {star <= (hoverRating || userRating) ? (
                        <StarIcon sx={{ color: '#fbbf24', fontSize: 28 }} />
                      ) : (
                        <StarBorderIcon sx={{ color: '#d1d5db', fontSize: 28 }} />
                      )}
                    </Box>
                  ))}
                  <Typography variant="body1" sx={{ ml: 1, color: '#4a5568', fontWeight: 600 }}>
                    {calculateAverageRating()} ({property.ratings?.length || 0} {property.ratings?.length === 1 ? 'rating' : 'ratings'})
                  </Typography>
                </Box>
                {ratingSubmitted && (
                  <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                    Rating submitted successfully!
                  </Alert>
                )}
                {!currentUser && (
                  <Typography variant="caption" sx={{ color: '#718096', display: 'block', mb: 2 }}>
                    <Button 
                      component={Link} 
                      to="/login" 
                      size="small"
                      sx={{ textTransform: 'none', p: 0, minWidth: 'auto' }}
                    >
                      Login
                    </Button> to rate this property
                  </Typography>
                )}
                {isOwner && (
                  <Typography variant="caption" sx={{ color: '#718096', display: 'block', mb: 2 }}>
                    You cannot rate your own property
                  </Typography>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', color: '#4a5568', mb: 2 }}>
                  <LocationIcon sx={{ mr: 1 }} />
                  <Typography variant="body1">
                    {property.location}
                  </Typography>
                </Box>
              </Box>
              <Chip
                label={property.type === 'sale' ? 'For Sale' : 'For Rent'}
                color={property.type === 'sale' ? 'success' : 'primary'}
                sx={{ fontWeight: 'bold' }}
              />
            </Box>

            {isOwner && (
              <Box sx={{ 
                mb: 3, 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2 
              }}>
                <Button
                  variant="contained"
                  fullWidth={true}
                  startIcon={<EditIcon />}
                  onClick={() => navigate(`/edit-property/${id}`)}
                >
                  Edit Property
                </Button>
                <Button
                  variant="outlined"
                  fullWidth={true}
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  Delete Property
                </Button>
              </Box>
            )}

            {!isOwner && currentUser && (
              <Box sx={{ mb: 3 }}>
                <Button
                  variant="contained"
                  fullWidth={true}
                  startIcon={<MessageIcon />}
                  onClick={() => setMessageDialogOpen(true)}
                  sx={{
                    background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                    }
                  }}
                >
                  Send Message to Seller
                </Button>
              </Box>
            )}

            <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4 }}>
              <Grid item xs={6} sm={3}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <BedIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {property.bedrooms}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Bedrooms
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <BathIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {property.bathrooms}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Bathrooms
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <AreaIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    {property.area}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Sq Ft
                  </Typography>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
                    {property.type === 'sale' ? 'Sale' : 'Rent'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Type
                  </Typography>
                </Card>
              </Grid>
            </Grid>

            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" gutterBottom sx={{ 
                fontWeight: 'bold',
                color: '#1a202c',
              }}>
                Description
              </Typography>
              <Typography variant="body1" sx={{ 
                lineHeight: 1.8, 
                whiteSpace: 'pre-wrap',
                color: '#4a5568',
              }}>
                {property.description}
              </Typography>
            </Box>

            {/* Comments Section */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" gutterBottom sx={{ 
                fontWeight: 'bold',
                color: '#1a202c',
                mb: 3,
              }}>
                Comments ({property.comments?.length || 0})
              </Typography>

              {/* Add Comment */}
              {currentUser && (
                <Box sx={{ mb: 4 }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Add a comment about this property..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        backgroundColor: '#f8fafc',
                      }
                    }}
                  />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {commentSubmitted && (
                      <Alert severity="success" sx={{ flex: 1, mr: 2 }}>
                        Comment added successfully!
                      </Alert>
                    )}
                    <Button
                      variant="contained"
                      onClick={handleAddComment}
                      disabled={!comment.trim()}
                      sx={{
                        borderRadius: 3,
                        textTransform: 'none',
                        px: 4,
                        background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                        },
                        '&:disabled': {
                          background: '#cbd5e0',
                        }
                      }}
                    >
                      Post Comment
                    </Button>
                  </Box>
                </Box>
              )}

              {!currentUser && (
                <Alert severity="info" sx={{ mb: 4, borderRadius: 3 }}>
                  Please <Button component={Link} to="/login" sx={{ textTransform: 'none' }}>login</Button> to add comments.
                </Alert>
              )}

              {/* Display Comments */}
              {property.comments && property.comments.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {property.comments.map((commentItem) => (
                    <Card key={commentItem.id} sx={{ p: 3, backgroundColor: '#f8fafc', borderRadius: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="body2" sx={{ color: '#60a5fa', fontWeight: 600 }}>
                          {commentItem.userEmail}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#718096' }}>
                          {new Date(commentItem.timestamp).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Typography>
                      </Box>
                      <Typography variant="body1" sx={{ color: '#1a202c', lineHeight: 1.6 }}>
                        {commentItem.comment}
                      </Typography>
                    </Card>
                  ))}
                </Box>
              ) : (
                <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: 3 }}>
                  <Typography variant="body1" sx={{ color: '#718096' }}>
                    No comments yet. Be the first to comment!
                  </Typography>
                </Paper>
              )}
            </Box>

            {/* Seller Information */}
            <Box sx={{ borderTop: 1, borderColor: '#e2e8f0', pt: 4 }}>
              <Typography variant="h4" gutterBottom sx={{ 
                fontWeight: 'bold',
                color: '#1a202c',
              }}>
                Seller Information
              </Typography>
              {currentUser ? (
                <Card sx={{ p: 3, backgroundColor: 'grey.50' }}>
                  {property.sellerName && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2,
                        }}
                      >
                        <Typography sx={{ color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}>
                          {property.sellerName.charAt(0).toUpperCase()}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" sx={{ color: '#718096', fontSize: '0.875rem' }}>
                          Seller
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1a202c' }}>
                          {property.sellerName}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EmailIcon sx={{ mr: 2, color: 'primary.main' }} />
                    <Typography variant="body1">
                      <strong>Email:</strong> {property.contact || property.sellerEmail}
                    </Typography>
                  </Box>
                  {property.mobile && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <PhoneIcon sx={{ mr: 2, color: 'primary.main' }} />
                      <Typography variant="body1">
                        <strong>Mobile:</strong> {property.mobile}
                      </Typography>
                    </Box>
                  )}
                </Card>
              ) : (
                <Card sx={{ p: 4, backgroundColor: '#f8fafc', textAlign: 'center', border: '2px dashed #e2e8f0' }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 2,
                    }}
                  >
                    <EmailIcon sx={{ fontSize: 30, color: 'white' }} />
                  </Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#1a202c' }}>
                    Contact Details Hidden
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#718096', mb: 3 }}>
                    Please login to view seller contact information
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button
                      component={Link}
                      to="/login"
                      variant="contained"
                      sx={{
                        background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                        }
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      component={Link}
                      to="/signup"
                      variant="outlined"
                    >
                      Sign Up
                    </Button>
                  </Box>
                </Card>
              )}
            </Box>
          </Box>
        </Paper>
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Property</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this property? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Message Dialog */}
      <Dialog 
        open={messageDialogOpen} 
        onClose={() => setMessageDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Send Message to Seller</DialogTitle>
        <DialogContent>
          {messageSent ? (
            <Alert severity="success" sx={{ mt: 2 }}>
              Message sent successfully! The seller will receive your message.
            </Alert>
          ) : (
            <>
              <Typography variant="body2" sx={{ mb: 2, mt: 1 }}>
                Send a message to the seller about <strong>{property?.title}</strong>
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Your Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi, I'm interested in this property..."
                sx={{ mt: 1 }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMessageDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleSendMessage} 
            variant="contained"
            disabled={!message.trim() || messageSent}
          >
            Send Message
          </Button>
        </DialogActions>
      </Dialog>

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
            {loginDialogMessage}
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

      {/* Error Dialog */}
      <Dialog
        open={errorDialogOpen}
        onClose={() => setErrorDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: 'white',
          }
        }}
      >
        <DialogContent sx={{ p: 4, textAlign: 'center' }}>
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 2,
            }}
          >
            <Typography sx={{ fontSize: '2rem' }}>⚠️</Typography>
          </Box>
          <Typography
            variant="h6"
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: '#1a202c',
              mb: 1,
            }}
          >
            Oops!
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: '#4a5568',
              mb: 3,
            }}
          >
            {errorMessage}
          </Typography>
          <Button
            variant="contained"
            onClick={() => setErrorDialogOpen(false)}
            sx={{
              px: 4,
              py: 1,
              borderRadius: 3,
              textTransform: 'none',
              background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              },
            }}
          >
            OK
          </Button>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default PropertyDetails;
