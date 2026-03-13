import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Badge,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import { 
  Home as HomeIcon, 
  ExitToApp as LogoutIcon,
  Add as AddIcon,
  ViewList as ViewListIcon,
  Message as MessageIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { db } from '../firebase/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!currentUser) {
      setUnreadCount(0);
      return;
    }

    const unreadQuery = query(
      collection(db, 'messages'),
      where('receiverId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(unreadQuery, (snapshot) => {
      const messages = snapshot.docs.map(doc => doc.data());
      const count = messages.filter(msg => !msg.read).length;
      setUnreadCount(count);
    }, (error) => {
      console.error("Error fetching unread count:", error);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const getUnreadCount = () => unreadCount;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Helper function to check if a path is active
  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  // Helper function to get button styles based on active state
  const getNavButtonStyles = (path) => ({
    color: 'white',
    fontWeight: 600,
    textTransform: 'none',
    px: 2,
    py: 1,
    borderRadius: 2,
    whiteSpace: 'nowrap',
    minWidth: 'auto',
    position: 'relative',
    transition: 'all 0.3s ease',
    background: isActivePath(path) ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
    boxShadow: isActivePath(path) ? '0 2px 8px rgba(0, 0, 0, 0.2)' : 'none',
    transform: isActivePath(path) ? 'translateY(-1px)' : 'none',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 4,
      left: '15%',
      width: isActivePath(path) ? '70%' : '0%',
      height: '2px',
      background: 'white',
      borderRadius: '2px',
      transition: 'all 0.3s ease',
      opacity: isActivePath(path) ? 1 : 0,
      boxShadow: isActivePath(path) ? '0 0 10px rgba(255, 255, 255, 0.8)' : 'none',
    },
    '&:hover': {
      background: isActivePath(path) ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.15)',
      transform: 'translateY(-1px)',
      '&::after': {
        width: isActivePath(path) ? '90%' : '60%',
        boxShadow: '0 0 15px rgba(255, 255, 255, 0.8)',
      }
    },
  });

  const drawerContent = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', p: 2 }}>
      <Typography variant="h6" sx={{ my: 2, fontWeight: 'bold', color: '#1a202c', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
        <HomeIcon sx={{ color: '#667eea' }} />
        TrueHomes
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/">
            <ListItemIcon><HomeIcon sx={{ color: '#667eea' }} /></ListItemIcon>
            <ListItemText primary="Dashboard" sx={{ color: '#1a202c' }} />
          </ListItemButton>
        </ListItem>
        {currentUser ? (
          <>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/add-property">
                <ListItemIcon><AddIcon sx={{ color: '#667eea' }} /></ListItemIcon>
                <ListItemText primary="List Property" sx={{ color: '#1a202c' }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/my-properties">
                <ListItemIcon><ViewListIcon sx={{ color: '#667eea' }} /></ListItemIcon>
                <ListItemText primary="Portfolio" sx={{ color: '#1a202c' }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/messages">
                <ListItemIcon>
                  <Badge badgeContent={getUnreadCount()} color="error">
                    <MessageIcon sx={{ color: '#667eea' }} />
                  </Badge>
                </ListItemIcon>
                <ListItemText primary="Messages" sx={{ color: '#1a202c' }} />
              </ListItemButton>
            </ListItem>
            <Divider sx={{ my: 2 }} />
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon><LogoutIcon sx={{ color: '#ef4444' }} /></ListItemIcon>
                <ListItemText primary="Sign Out" sx={{ color: '#ef4444' }} />
              </ListItemButton>
            </ListItem>
          </>
        ) : (
          <>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/login">
                <ListItemText primary="Sign In" sx={{ color: '#1a202c', textAlign: 'center' }} />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton component={Link} to="/signup" sx={{ mt: 1, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: 2 }}>
                <ListItemText primary="Get Started" sx={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }} />
              </ListItemButton>
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.25)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        zIndex: 1100,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1.5, minHeight: '72px' }}>
          <Typography
            variant="h5"
            component={Link}
            to="/"
            sx={{
              fontWeight: 900,
              color: 'white',
              fontSize: { xs: '1.5rem', md: '1.8rem' },
              letterSpacing: '-0.02em',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.02)',
                opacity: 0.9,
              }
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2,
                background: 'rgba(255, 255, 255, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.35)',
                  transform: 'rotate(-5deg) scale(1.05)',
                }
              }}
            >
              <HomeIcon sx={{ fontSize: 20, color: 'white' }} />
            </Box>
            TrueHomes
          </Typography>

          <Box sx={{ flexGrow: 1 }} />
          
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
            <Button
              component={Link}
              to="/"
              sx={getNavButtonStyles('/')}
            >
              Dashboard
            </Button>
            
            {currentUser ? (
              <>
                <Button
                  component={Link}
                  to="/add-property"
                  startIcon={<AddIcon sx={{ fontSize: '1rem' }} />}
                  sx={getNavButtonStyles('/add-property')}
                >
                  List Property
                </Button>
                <Button
                  component={Link}
                  to="/my-properties"
                  startIcon={<ViewListIcon sx={{ fontSize: '1rem' }} />}
                  sx={getNavButtonStyles('/my-properties')}
                >
                  Portfolio
                </Button>
                <Button
                  component={Link}
                  to="/messages"
                  startIcon={
                    <Badge badgeContent={getUnreadCount()} color="error">
                      <MessageIcon sx={{ fontSize: '1rem' }} />
                    </Badge>
                  }
                  sx={getNavButtonStyles('/messages')}
                >
                  Messages
                </Button>
                <Box
                  sx={{
                    px: 2.5,
                    py: 1,
                    borderRadius: 2,
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    ml: 1,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.25)',
                    }
                  }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {currentUser.email}
                  </Typography>
                </Box>
                <Button
                  onClick={handleLogout}
                  variant="outlined"
                  startIcon={<LogoutIcon sx={{ fontSize: '1rem' }} />}
                  sx={{
                    color: 'white',
                    border: '2px solid rgba(255, 255, 255, 0.4)',
                    background: 'rgba(255, 255, 255, 0.15)',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    textTransform: 'none',
                    whiteSpace: 'nowrap',
                    px: 2.5,
                    py: 1,
                    borderRadius: 2,
                    ml: 1,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.25)',
                      borderColor: 'rgba(255, 255, 255, 0.6)',
                      borderWidth: '2px',
                      transform: 'translateY(-1px)',
                    },
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button 
                  component={Link} 
                  to="/login"
                  sx={getNavButtonStyles('/login')}
                >
                  Sign In
                </Button>
                <Button
                  component={Link}
                  to="/signup"
                  variant="outlined"
                  sx={{
                    color: 'white',
                    border: '2px solid rgba(255, 255, 255, 0.4)',
                    background: isActivePath('/signup') ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.15)',
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    textTransform: 'none',
                    whiteSpace: 'nowrap',
                    px: 2.5,
                    py: 1,
                    borderRadius: 2,
                    ml: 1,
                    position: 'relative',
                    transition: 'all 0.3s ease',
                    boxShadow: isActivePath('/signup') ? '0 2px 8px rgba(0, 0, 0, 0.2)' : 'none',
                    transform: isActivePath('/signup') ? 'translateY(-1px)' : 'none',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 4,
                      left: '15%',
                      width: isActivePath('/signup') ? '70%' : '0%',
                      height: '2px',
                      background: 'white',
                      borderRadius: '2px',
                      transition: 'all 0.3s ease',
                      opacity: isActivePath('/signup') ? 1 : 0,
                      boxShadow: isActivePath('/signup') ? '0 0 10px rgba(255, 255, 255, 0.8)' : 'none',
                    },
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.25)',
                      borderColor: 'rgba(255, 255, 255, 0.6)',
                      borderWidth: '2px',
                      transform: 'translateY(-1px)',
                      '&::after': {
                        width: isActivePath('/signup') ? '90%' : '60%',
                        boxShadow: '0 0 15px rgba(255, 255, 255, 0.8)',
                      }
                    },
                  }}
                >
                  Get Started
                </Button>
              </>
            )}
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ display: { md: 'none' }, color: 'white' }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280, background: 'white' },
        }}
      >
        {drawerContent}
      </Drawer>
    </AppBar>
  );
}

export default Navbar;
