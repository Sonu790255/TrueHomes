import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  CircularProgress,
  Avatar,
  IconButton,
} from '@mui/material';
import {
  Message as MessageIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import ChatBox from '../components/ChatBox';
import { db } from '../firebase/firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
} from 'firebase/firestore';

function Messages() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    // Listen for all messages where the user is either sender or receiver
    const q1 = query(
      collection(db, 'messages'),
      where('receiverId', '==', currentUser.uid)
    );
    const q2 = query(
      collection(db, 'messages'),
      where('senderId', '==', currentUser.uid)
    );

    const processMessages = (allMsgs) => {
      // Group messages by (OtherUser + PropertyId)
      const groups = {};
      allMsgs.forEach(msg => {
        const otherUserId = msg.senderId === currentUser.uid ? msg.receiverId : msg.senderId;
        const key = `${otherUserId}_${msg.propertyId}`;
        
        if (!groups[key] || new Date(msg.timestamp) > new Date(groups[key].lastMessage.timestamp)) {
          groups[key] = {
            id: key,
            propertyId: msg.propertyId,
            propertyTitle: msg.propertyTitle,
            propertyImage: msg.propertyImage || null,
            otherUserId: otherUserId,
            otherUserEmail: msg.senderId === currentUser.uid ? msg.receiverEmail : msg.senderEmail,
            lastMessage: msg,
            unreadCount: (msg.receiverId === currentUser.uid && !msg.read) ? 1 : 0
          };
        } else if (msg.receiverId === currentUser.uid && !msg.read) {
          groups[key].unreadCount++;
        }
      });

      const sortedConversations = Object.values(groups).sort(
        (a, b) => new Date(b.lastMessage.timestamp) - new Date(a.lastMessage.timestamp)
      );
      setConversations(sortedConversations);
      setLoading(false);
    };

    let msgs1 = [];
    let msgs2 = [];

    const unsub1 = onSnapshot(q1, (snap) => {
      msgs1 = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      processMessages([...msgs1, ...msgs2]);
    });

    const unsub2 = onSnapshot(q2, (snap) => {
      msgs2 = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      processMessages([...msgs1, ...msgs2]);
    });

    return () => {
      unsub1();
      unsub2();
    };
  }, [currentUser]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <Box
      sx={{
        height: '100vh',
        background: '#f1f5f9',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden', pt: '72px' }}>
        {/* Sidebar */}
        <Box 
          sx={{ 
            width: { xs: selectedChat ? 0 : '100%', md: 350 },
            display: { xs: selectedChat ? 'none' : 'block', md: 'block' },
            bgcolor: 'white',
            borderRight: '1px solid #e2e8f0',
            overflowY: 'auto'
          }}
        >
          <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0' }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b' }}>Messages</Typography>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
          ) : conversations.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <MessageIcon sx={{ fontSize: 48, color: '#cbd5e1', mb: 2 }} />
              <Typography color="text.secondary">No conversations yet</Typography>
            </Box>
          ) : (
            conversations.map((conv) => (
              <Box
                key={conv.id}
                onClick={() => setSelectedChat(conv)}
                sx={{
                  p: 2,
                  display: 'flex',
                  gap: 2,
                  cursor: 'pointer',
                  borderBottom: '1px solid #f1f5f9',
                  bgcolor: selectedChat?.id === conv.id ? '#f8fafc' : 'transparent',
                  '&:hover': { bgcolor: '#f8fafc' },
                  position: 'relative'
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <Avatar sx={{ bgcolor: '#667eea', width: 48, height: 48, border: '2px solid white', boxShadow: '0 2px 10px rgba(102, 126, 234, 0.2)' }}>
                    {conv.otherUserEmail[0].toUpperCase()}
                  </Avatar>
                  {conv.propertyImage && (
                    <Avatar 
                      src={conv.propertyImage} 
                      sx={{ 
                        width: 24, 
                        height: 24, 
                        position: 'absolute', 
                        bottom: -4, 
                        right: -4, 
                        border: '2px solid white',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                      }} 
                    />
                  )}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="subtitle1" fontWeight={700} noWrap sx={{ color: '#334155' }}>
                      {conv.otherUserEmail.split('@')[0]}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(conv.lastMessage.timestamp)}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="primary" fontWeight={700} noWrap sx={{ fontSize: '0.7rem', mb: 0.2, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {conv.propertyTitle}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap sx={{ opacity: conv.unreadCount > 0 ? 1 : 0.7, fontWeight: conv.unreadCount > 0 ? 700 : 400 }}>
                    {conv.lastMessage.message}
                  </Typography>
                </Box>
                {conv.unreadCount > 0 && (
                  <Box sx={{ 
                    position: 'absolute', 
                    right: 8, 
                    bottom: 8, 
                    bgcolor: '#ef4444', 
                    color: 'white',
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}>
                    {conv.unreadCount}
                  </Box>
                )}
              </Box>
            ))
          )}
        </Box>

        {/* Main Chat Area */}
        <Box 
          sx={{ 
            flex: 1, 
            display: { xs: selectedChat ? 'flex' : 'none', md: 'flex' }, 
            flexDirection: 'column',
            bgcolor: 'white' 
          }}
        >
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton sx={{ display: { md: 'none' } }} onClick={() => setSelectedChat(null)}>
                  <HomeIcon /> 
                </IconButton>
                <Avatar sx={{ bgcolor: '#667eea' }}>{selectedChat.otherUserEmail[0].toUpperCase()}</Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight={700}>{selectedChat.otherUserEmail}</Typography>
                  <Typography variant="caption" color="primary" sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }} onClick={() => navigate(`/property/${selectedChat.propertyId}`)}>
                    {selectedChat.propertyTitle}
                  </Typography>
                </Box>
              </Box>
              
              {/* ChatBox Component */}
              <Box sx={{ flex: 1, overflow: 'hidden' }}>
                <ChatBox 
                  currentUser={currentUser} 
                  otherUser={{ uid: selectedChat.otherUserId, email: selectedChat.otherUserEmail }}
                  propertyId={selectedChat.propertyId}
                  propertyTitle={selectedChat.propertyTitle}
                />
              </Box>
            </>
          ) : (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100%', 
              background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
              textAlign: 'center',
              p: 4
            }}>
              <Box sx={{ 
                width: 120, 
                height: 120, 
                borderRadius: '50%', 
                bgcolor: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                mb: 4
              }}>
                <MessageIcon sx={{ fontSize: 64, color: '#667eea', opacity: 0.8 }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>Your Messages</Typography>
              <Typography variant="body1" sx={{ color: '#64748b', maxWidth: 300 }}>
                Select a conversation from the sidebar to view details and reply
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default Messages;
