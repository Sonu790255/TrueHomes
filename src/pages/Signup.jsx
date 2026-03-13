import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Divider,
  IconButton,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Google as GoogleIcon,
  LockOutlined as ConfirmLockIcon,
} from '@mui/icons-material';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (password.length < 6) {
      return setError('Password must be at least 6 characters long');
    }

    try {
      setError('');
      setLoading(true);
      await signup(email, password);
      navigate('/');
    } catch (error) {
      setError('Failed to create account. Please try again.');
    }
    
    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    try {
      setError('');
      setGoogleLoading(true);
      await loginWithGoogle();
      navigate('/');
    } catch (error) {
      setError('Failed to sign up with Google.');
    }
    
    setGoogleLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        paddingTop: '72px',
        paddingBottom: '40px',
      }}
    >
      <Container maxWidth="sm">
        {/* Welcome Section */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 900,
              color: 'white',
              mb: 2,
              mt:2,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              letterSpacing: '-0.02em',
              textShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
            }}
          >
            Join TrueHomes
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.95)', 
              mb: 4,
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
            }}
          >
            Create your account to start your real estate journey
          </Typography>
        </Box>

        {/* Signup Form */}
        <Paper
          elevation={3}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            background: 'white',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            maxWidth: '450px',
            width: '100%',
          }}
        >
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 3,
              }}
            >
              {error}
            </Alert>
          )}

          {/* Google Sign Up Button */}
          <Button
            fullWidth
            variant="outlined"
            onClick={handleGoogleSignup}
            disabled={googleLoading || loading}
            startIcon={googleLoading ? <CircularProgress size={20} /> : <GoogleIcon />}
            sx={{
              py: 2,
              mb: 3,
              borderRadius: 3,
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
              color: 'white',
              border: 'none',
              boxShadow: '0 4px 15px rgba(96, 165, 250, 0.4)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:hover': {
                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(96, 165, 250, 0.6)',
              },
              '&:disabled': {
                background: '#cbd5e0',
                color: '#a0aec0',
              },
            }}
          >
            {googleLoading ? 'Creating account...' : 'Continue with Google'}
          </Button>

          <Divider 
            sx={{ 
              mb: 3,
            }}
          >
            or create account with email
          </Divider>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  '& fieldset': {
                    borderColor: '#e2e8f0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#cbd5e0',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#60a5fa',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#4a5568',
                },
                '& .MuiInputBase-input': {
                  color: '#1a202c',
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: '#4a5568' }} />
                    </InputAdornment>
                  ),
                }
              }}
            />

            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  '& fieldset': {
                    borderColor: '#e2e8f0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#cbd5e0',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#60a5fa',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#4a5568',
                },
                '& .MuiInputBase-input': {
                  color: '#1a202c',
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: '#4a5568' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: '#4a5568' }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }
              }}
            />

            <TextField
              fullWidth
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              sx={{
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  '& fieldset': {
                    borderColor: '#e2e8f0',
                  },
                  '&:hover fieldset': {
                    borderColor: '#cbd5e0',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#60a5fa',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: '#4a5568',
                },
                '& .MuiInputBase-input': {
                  color: '#1a202c',
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <ConfirmLockIcon sx={{ color: '#4a5568' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                        sx={{ color: '#4a5568' }}
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || googleLoading}
              sx={{
                py: 2,
                mb: 3,
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
                '&:disabled': {
                  background: '#cbd5e0',
                  color: '#a0aec0',
                },
              }}
            >
              {loading ? (
                <>
                  <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#4a5568',
              }}
            >
              Already have an account?{' '}
              <Link 
                to="/login" 
                style={{ 
                  color: '#60a5fa',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                Sign in here
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Signup;