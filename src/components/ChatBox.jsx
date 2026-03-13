import { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  IconButton, 
  Paper, 
  Avatar,
  CircularProgress,
  useTheme,
  Tooltip
} from '@mui/material';
import {
  Send as SendIcon,
  Done as SentIcon,
  DoneAll as ReadIcon,
  Home as PropertyIcon
} from '@mui/icons-material';
import { db } from '../firebase/firebase';
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc
} from 'firebase/firestore';

function ChatBox({ currentUser, otherUser, propertyId, propertyTitle }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef();
  const theme = useTheme();

  useEffect(() => {
    if (!currentUser || !otherUser || !propertyId) return;

    // Query messages for this specific conversation
    // We filter for messages between these two users regarding this property
    const q = query(
      collection(db, 'messages'),
      where('propertyId', '==', propertyId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(msg =>
          (msg.senderId === currentUser.uid && msg.receiverId === otherUser.uid) ||
          (msg.senderId === otherUser.uid && msg.receiverId === currentUser.uid)
        )
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      setMessages(msgs);
      setLoading(false);

      // Mark messages received from the other user as read
      msgs.forEach(msg => {
        if (msg.receiverId === currentUser.uid && !msg.read) {
          const msgRef = doc(db, 'messages', msg.id);
          updateDoc(msgRef, { read: true }).catch(err => console.error("Error marking as read:", err));
        }
      });
    }, (error) => {
      console.error("Chat listener error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser, otherUser, propertyId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const newMessage = {
        senderId: currentUser.uid,
        senderEmail: currentUser.email,
        receiverId: otherUser.uid,
        receiverEmail: otherUser.email,
        propertyId,
        propertyTitle,
        message: message.trim(),
        timestamp: new Date().toISOString(),
        read: false
      };

      await addDoc(collection(db, 'messages'), newMessage);
      setMessage('');
    } catch (error) {
      console.error("Error sending chat message:", error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      bgcolor: '#f8fafc',
      position: 'relative'
    }}>
      {/* Property Context Bar (Mini-Header inside Chat) */}
      <Box sx={{
        p: 1.5,
        px: 3,
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        zIndex: 1
      }}>
        <Avatar variant="rounded" sx={{ bgcolor: '#eff6ff', color: '#3b82f6', width: 40, height: 40 }}>
          <PropertyIcon />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#1e293b', lineHeight: 1.2 }}>
            {propertyTitle}
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b' }}>
            Direct message regarding this listing
          </Typography>
        </Box>
      </Box>

      {/* Messages Area */}
      <Box
        ref={scrollRef}
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          '&::-webkit-scrollbar': { width: '6px' },
          '&::-webkit-scrollbar-thumb': { bgcolor: '#cbd5e1', borderRadius: '10px' }
        }}
      >
        {messages.map((msg, index) => {
          const isMe = msg.senderId === currentUser.uid;
          const showDate = index === 0 ||
            new Date(msg.timestamp).toDateString() !== new Date(messages[index-1].timestamp).toDateString();

          return (
            <Box key={msg.id}>
              {showDate && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                  <Typography sx={{
                    bgcolor: '#e2e8f0',
                    color: '#475569',
                    px: 2,
                    py: 0.5,
                    borderRadius: 4,
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase'
                  }}>
                    {new Date(msg.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </Typography>
                </Box>
              )}
              <Box sx={{
                display: 'flex',
                justifyContent: isMe ? 'flex-end' : 'flex-start',
                width: '100%',
                mb: 0.5
              }}>
                <Box sx={{ maxWidth: '80%' }}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 1.5,
                      px: 2.5,
                      borderRadius: isMe ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                      background: isMe ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'white',
                      color: isMe ? 'white' : '#1e293b',
                      boxShadow: isMe ? '0 4px 15px rgba(102, 126, 234, 0.25)' : '0 2px 10px rgba(0,0,0,0.05)',
                      position: 'relative',
                      border: isMe ? 'none' : '1px solid #f1f5f9'
                    }}
                  >
                    <Typography variant="body1" sx={{ fontSize: '0.95rem', lineHeight: 1.5 }}>
                      {msg.message}
                    </Typography>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: 0.5,
                      mt: 0.5,
                      opacity: 0.8
                    }}>
                      <Typography variant="caption" sx={{ fontSize: '0.65rem', fontWeight: 500 }}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                      </Typography>
                      {isMe && (
                        msg.read ? <ReadIcon sx={{ fontSize: 14 }} /> : <SentIcon sx={{ fontSize: 14 }} />
                      )}
                    </Box>
                  </Paper>
                </Box>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Input Area */}
      <Box
        component="form"
        onSubmit={handleSend}
        sx={{
          p: 2.5,
          bgcolor: 'white',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          gap: 1.5,
          alignItems: 'center'
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={4}
          size="small"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 6,
              bgcolor: '#f1f5f9',
              fontSize: '0.9rem',
              '&.Mui-focused fieldset': { borderColor: '#667eea' }
            }
          }}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend(e);
            }
          }}
        />
        <Tooltip title="Send Message">
          <IconButton
            type="submit"
            disabled={!message.trim()}
            sx={{
              width: 48,
              height: 48,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              '&:hover': { background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)' },
              '&.Mui-disabled': { bgcolor: '#e2e8f0', color: '#94a3b8', background: 'none' }
            }}
          >
            <SendIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

export default ChatBox;
